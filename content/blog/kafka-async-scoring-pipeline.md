---
title: "Building an Async Scoring Pipeline with Kafka and Spring Boot"
date: "2026-06-09"
description: "How the llm-scoring-service uses Kafka to decouple LLM response ingestion from scoring — with actual producer/consumer code, error handling, and the failure modes you have to think through."
tags: ["kafka", "spring-boot", "java", "async", "event-driven"]
---

The core promise of the scoring pipeline: a client submits an LLM evaluation, gets back a 202 immediately, and scoring happens in the background without affecting the caller's latency. Kafka is what makes that guarantee hold under pressure.

This post is about the actual implementation — producer setup, consumer setup, the error handling decisions, and the failure modes I had to reason through.

---

## The Event Contract

Before any code, the event schema. This is the message published to Kafka after the ingest API receives a request:

```java
public record EvaluationEvent(
    String evaluationId,
    String applicationId,
    String prompt,
    String response,
    String context,        // nullable
    String modelId,
    Instant createdAt
) {}
```

I use a Java record intentionally — immutable, no boilerplate. The event is serialized to JSON. I considered Avro for schema evolution guarantees, but for a v1 the operational overhead wasn't worth it. The tradeoff: adding a required field to the event in the future requires coordinating producer and consumer deploys carefully.

---

## Producer: Ingest API → Kafka

The ingest service saves to PostgreSQL first, then publishes the event. Order matters here.

```java
@Service
@RequiredArgsConstructor
public class EvaluationIngestService {

    private final EvaluationRepository evaluationRepository;
    private final KafkaTemplate<String, EvaluationEvent> kafkaTemplate;

    @Transactional
    public EvaluationResponse ingest(EvaluationRequest request) {
        // 1. Persist first — evaluation exists regardless of Kafka state
        Evaluation saved = evaluationRepository.save(
            Evaluation.from(request)
        );

        // 2. Publish event — keyed by applicationId for partition ordering
        EvaluationEvent event = EvaluationEvent.from(saved);
        kafkaTemplate.send("llm-evaluation-events", saved.getApplicationId(), event)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to publish evaluation event [id={}]: {}",
                        saved.getId(), ex.getMessage());
                    // Not rethrowing — DB record exists, scoring will be handled
                    // by the missed-events reconciliation job (see below)
                }
            });

        return new EvaluationResponse(saved.getId(), "PENDING");
    }
}
```

**Why DB first, then Kafka — not the reverse?**

If Kafka publish fails after a successful DB write, the evaluation exists but is unscored. That's recoverable — a reconciliation job can find unscored evaluations and republish. If Kafka publish succeeds but the DB write fails (say you do it the other way), you have an event in Kafka referencing an evaluation that doesn't exist. The consumer will fail and you have no recovery path without event replay logic.

**Partition key = `applicationId`**

All events for the same application go to the same partition. This guarantees ordering within an application's evaluations, which matters for the dashboard's time-series views. The downside: a single application with very high volume becomes a hot partition. For v1 this is acceptable.

---

## Producer Config

```java
@Configuration
public class KafkaProducerConfig {

    @Bean
    public ProducerFactory<String, EvaluationEvent> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);

        // Critical: wait for all in-sync replicas to acknowledge
        config.put(ProducerConfig.ACKS_CONFIG, "all");

        // Retry on transient failures (network blip, leader election)
        config.put(ProducerConfig.RETRIES_CONFIG, 3);
        config.put(ProducerConfig.RETRY_BACKOFF_MS_CONFIG, 1000);

        // Idempotent producer — prevents duplicate messages on retry
        config.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);

        return new DefaultKafkaProducerFactory<>(config);
    }
}
```

`ACKS=all` + `ENABLE_IDEMPOTENCE=true` together ensure: if the producer retries because it didn't receive an ack, Kafka deduplicates the message server-side. Without idempotence, a retry after a network timeout where the message actually did land would produce a duplicate event — and a duplicate scoring run.

---

## Consumer: Kafka → Scoring Engine

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class EvaluationScoringConsumer {

    private final ScoringEngine scoringEngine;
    private final EvaluationRepository evaluationRepository;

    @KafkaListener(
        topics = "llm-evaluation-events",
        groupId = "scoring-consumer-group",
        concurrency = "3"   // 3 consumer threads per instance
    )
    public void consume(
        @Payload EvaluationEvent event,
        Acknowledgment acknowledgment
    ) {
        log.info("Scoring evaluation [id={}] for app [{}]",
            event.evaluationId(), event.applicationId());

        try {
            List<Score> scores = scoringEngine.score(event);
            evaluationRepository.saveScores(event.evaluationId(), scores);
            acknowledgment.acknowledge();  // commit offset only on success

        } catch (ScoringException ex) {
            log.error("Scoring failed for evaluation [id={}]: {}",
                event.evaluationId(), ex.getMessage());
            // Do NOT acknowledge — message goes to retry topic via error handler
            throw ex;
        }
    }
}
```

**Manual acknowledgment is non-negotiable here.**

The default Spring Kafka behavior commits the offset as soon as the message is received, before your processing logic runs. If scoring fails mid-flight, the offset is already committed and the event is lost. With `AckMode.MANUAL`, the offset only advances after `acknowledgment.acknowledge()` is explicitly called — meaning a failed scoring run keeps the message available for retry.

---

## Error Handling: Dead Letter Topic

Not every scoring failure is transient. If the Groq API returns an unrecoverable error or the event is malformed, you don't want infinite retries blocking the partition.

```java
@Bean
public DefaultErrorHandler errorHandler(KafkaTemplate<String, Object> template) {
    DeadLetterPublishingRecoverer recoverer =
        new DeadLetterPublishingRecoverer(template,
            (record, ex) -> new TopicPartition(
                "llm-evaluation-events.DLT",  // dead letter topic
                record.partition()
            )
        );

    // Retry up to 3 times with exponential backoff before sending to DLT
    ExponentialBackOffWithMaxRetries backOff =
        new ExponentialBackOffWithMaxRetries(3);
    backOff.setInitialInterval(1000L);
    backOff.setMultiplier(2.0);
    backOff.setMaxInterval(10000L);

    return new DefaultErrorHandler(recoverer, backOff);
}
```

The DLT (`llm-evaluation-events.DLT`) is monitored separately. Failed events there represent evaluations that exist in PostgreSQL but have no scores — they show up in the dashboard with a `SCORING_FAILED` status. This is intentional: the data is preserved, the failure is visible, and you can replay the DLT once you fix the underlying issue.

---

## The Failure Mode Inventory

Before shipping, I mapped out every failure scenario:

| Failure | What happens | Recovery |
|---|---|---|
| Kafka broker down at ingest time | Publish fails, evaluation saved to DB with `PENDING` status | Reconciliation job republishes unscored evaluations older than N minutes |
| Groq API rate limit | `ScoringException` thrown, message retried 3× then DLT | Manual replay after rate limit window passes |
| Consumer crash mid-scoring | Offset not committed, message redelivered to next consumer | Idempotent score save (upsert by `evaluation_id + dimension`) |
| Malformed event | Deserialization error, straight to DLT (no retries) | Fix producer, replay DLT |
| DB down during score save | Exception thrown, offset not committed, message retried | Message held in Kafka until DB recovers |

The reconciliation job (row 1) is the safety net for Kafka-level publish failures. It runs every 5 minutes and queries:

```sql
SELECT id FROM evaluations
WHERE created_at < now() - interval '10 minutes'
  AND id NOT IN (SELECT evaluation_id FROM scores)
```

Any evaluation that's been pending for more than 10 minutes without scores gets republished. It's a simple but complete guarantee: no evaluation silently stays unscored forever.

---

## What I'd Do Differently

**Outbox pattern instead of DB-first + reconciliation.** The cleaner solution is to write the evaluation and the pending Kafka message to the DB in the same transaction (the outbox table), then have a relay process publish from the outbox. This eliminates the reconciliation job entirely. I skipped it because it adds schema + relay complexity, and for this project the reconciliation job is good enough. But in a high-throughput production system, the outbox pattern is the right call.

**Schema registry.** JSON serialization works but schema drift is a real risk. As the `EvaluationEvent` evolves, there's no enforcement that producers and consumers agree on the shape. Confluent Schema Registry with Avro would solve this at the cost of another dependency.