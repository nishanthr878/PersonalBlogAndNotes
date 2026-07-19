---
title: "Banking Streams"
date: "2026-07-19"
description: "A Kafka deep dive Project"
tags: ["java", "spring-boot", "observability", "kafka", "postgresql"]
stack: ["Java 17", "Spring Boot 3.5", "PostgreSQL", "Kafka"]
repoUrl: "https://github.com/nishanthr878/bankstream"
featured: true
---

## Overview

A real-time banking event processing system built to learn and implement Kafka concepts from basics to production-grade patterns.




## Architecture

```
transaction-service (port 8090)
  → REST API accepts transaction requests
  → Writes transaction + outbox entry in single DB transaction
  → OutboxPoller publishes to Kafka every 1s with retry (Avro, via Schema Registry)
  → AccountSeeder publishes seed accounts to account.created on startup

Schema Registry (port 8081)
  → Stores Avro schemas for transaction.initiated, account.created, fraud.alert
  → Enforces BACKWARD compatibility on every schema change

Kafka (2-broker cluster)
  kafka1 → controller + broker
  kafka2 → broker only
  Topics: transaction.initiated, account.created, transaction.completed,
          transaction.failed, fraud.alert, transaction.dlq

notification-service (port 8091)
  → Consumes transaction.initiated (typed Avro, specific.avro.reader=true)
  → Manual offset commit (at-least-once)
  → Idempotency guard via processed_events table
  → Retry with exponential backoff (1s, 2s, 4s)
  → Routes to transaction.dlq after 3 failed attempts

fraud-detection-service (port 8092)
  → Kafka Streams topology (spring-kafka @EnableKafkaStreams)
  → Joins transaction.initiated with account.created (GlobalKTable) for tier enrichment
  → HIGH_VALUE: single transaction exceeds tier threshold
  → VELOCITY: 3+ transactions for one account in a 5-min sliding window
  → RAPID_LARGE: total spend for one account exceeds ₹1,00,000 in a 1hr tumbling window
  → Exactly-once processing (EXACTLY_ONCE_V2), state in RocksDB + Kafka changelog topics
  → Produces fraud.alert
```

## Blog / reference
[Kafka Deep Dive](https://portfolio.nishanthraj.in/blog/Kafka-deep-dive)