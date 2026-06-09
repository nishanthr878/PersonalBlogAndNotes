---
title: "LLM-as-Judge: How to Score LLM Responses in Production"
date: "2026-06-09"
description: "The scoring methodology behind llm-scoring-service  how LLM-as-judge works, which dimensions actually matter, how to write rubrics that produce consistent scores, and why this approach has real failure modes you need to know about."
tags: ["llm", "evaluation", "groq", "observability", "prompt-engineering"]
---

Using an LLM to evaluate another LLM's responses sounds circular. It has real problems. It also happens to be the most practical approach available for production runtime evaluation — nothing else scales to arbitrary text without massive manual labeling effort.

This post covers the scoring methodology in `llm-scoring-service`: what dimensions I chose, how the rubric prompts work, what the scoring engine actually sends to Groq, and where LLM-as-judge breaks down.

---

## Why LLM-as-Judge

The alternatives:

- **Human evaluation** — accurate but doesn't scale, can't run in production on real traffic
- **Rule-based heuristics** — fast, but can only catch surface-level issues (length, keyword presence)
- **Embedding similarity** — measures semantic closeness to a reference, but requires a reference answer, which you often don't have
- **Fine-tuned classifiers** — accurate for specific criteria but expensive to build and maintain per dimension

LLM-as-judge covers the gap: it can evaluate free-form text against qualitative criteria at runtime, without reference answers. The cost is consistency — LLM judges have variance, exhibit biases, and can be gamed by response phrasing. You have to design around those weaknesses.

---

## The Scoring Dimensions

The service scores on three core dimensions by default:

**Relevance** — Does the response actually address what the prompt asked? A response can be factually accurate and well-written but completely miss the question. This is especially common when the underlying retrieval step (in a RAG pipeline) pulled the wrong context.

**Faithfulness** — Does the response stay grounded in the provided context, or does it hallucinate? Only applicable when `context` is provided. This is the most important dimension for RAG applications.

**Toxicity** — Does the response contain harmful, offensive, or inappropriate content? A binary-ish check. Less interesting for internal tooling, critical for user-facing applications.

Each dimension produces a score from 0.0 to 1.0. The scoring engine also requests a `reasoning` field — a short explanation of why the score was assigned. This is what makes the results useful rather than just a number.

---

## Rubric Design

Each dimension maps to a rubric: a prompt template injected into the Groq scoring request. The rubric is the most important design surface in the whole system. A vague rubric produces noisy, inconsistent scores. A well-designed rubric produces scores you can actually trend over time.

Here's the faithfulness rubric:

```
You are an expert evaluator assessing whether an AI assistant's response is faithful to the provided context.

CONTEXT:
{context}

QUESTION:
{prompt}

RESPONSE:
{response}

Evaluate ONLY faithfulness: does the response make claims that are directly supported by the context above?

Scoring criteria:
- 1.0: Every claim in the response is explicitly supported by the context. No invented facts.
- 0.7-0.9: Most claims are supported. Minor extrapolations that don't contradict the context.
- 0.4-0.6: Some claims are supported, but there are notable additions or extrapolations not in the context.
- 0.1-0.3: Most claims cannot be verified from the context. Significant hallucination.
- 0.0: The response contradicts or ignores the context entirely.

Return ONLY valid JSON. No explanation outside the JSON object.

{
  "score": <float between 0.0 and 1.0>,
  "reasoning": "<one to two sentences explaining the score>"
}
```

Several design decisions embedded in this rubric:

**Anchored scale.** The 5-point verbal anchor (1.0, 0.7-0.9, 0.4-0.6, etc.) reduces score variance significantly compared to asking for a raw float. Without anchors, the same response gets 0.6 in one call and 0.8 in another depending on random sampling. Anchors give the model a structured decision tree.

**Single dimension per request.** The rubric evaluates faithfulness only, not faithfulness + relevance in the same call. Multi-criterion prompts produce correlated scores — the model tends to rate everything similarly if the response seems good overall. Separate requests per dimension are more expensive but more independent.

**Mandatory JSON output.** The prompt ends with a structural constraint and example. Combined with a low temperature on the Groq call, this keeps the response parseable. You still need defensive parsing.

---

## The Scoring Engine

```java
@Service
@RequiredArgsConstructor
public class ScoringEngine {

    private final GroqClient groqClient;
    private final RubricRepository rubricRepository;

    public List<Score> score(EvaluationEvent event) {
        List<Rubric> activeRubrics = rubricRepository.findAllEnabled();

        return activeRubrics.stream()
            .filter(rubric -> isApplicable(rubric, event))
            .map(rubric -> scoreWithRubric(rubric, event))
            .toList();
    }

    private boolean isApplicable(Rubric rubric, EvaluationEvent event) {
        // Faithfulness requires context — skip if not provided
        if (rubric.getName().equals("faithfulness") && event.context() == null) {
            return false;
        }
        return true;
    }

    private Score scoreWithRubric(Rubric rubric, EvaluationEvent event) {
        String filledPrompt = rubric.getPrompt()
            .replace("{prompt}", event.prompt())
            .replace("{response}", event.response())
            .replace("{context}", event.context() != null ? event.context() : "");

        GroqResponse groqResponse = groqClient.complete(
            GroqRequest.builder()
                .model("llama3-8b-8192")
                .messages(List.of(
                    new Message("system", "You are a precise evaluator. Return only valid JSON."),
                    new Message("user", filledPrompt)
                ))
                .temperature(0.1)   // Low temperature for consistency
                .maxTokens(200)
                .build()
        );

        return parseScore(groqResponse, rubric, event.evaluationId());
    }

    private Score parseScore(GroqResponse response, Rubric rubric, String evaluationId) {
        try {
            String content = response.getContent();
            // Strip any markdown code fences the model adds despite instructions
            String cleaned = content.replaceAll("```json|```", "").trim();
            JsonNode node = objectMapper.readTree(cleaned);

            double rawScore = node.get("score").asDouble();
            // Clamp to valid range — don't trust the model to stay within bounds
            double score = Math.max(0.0, Math.min(1.0, rawScore));
            String reasoning = node.get("reasoning").asText();

            return Score.builder()
                .evaluationId(evaluationId)
                .dimension(rubric.getName())
                .score(score)
                .reasoning(reasoning)
                .rubricVersion(rubric.getVersion())
                .build();

        } catch (Exception e) {
            log.error("Failed to parse scoring response for rubric [{}]: {}",
                rubric.getName(), response.getContent());
            throw new ScoringException("Score parsing failed", e);
        }
    }
}
```

A few things worth noting:

`temperature(0.1)` — not 0.0. At temperature 0 some models exhibit degenerate behavior (always returning the same score). 0.1 adds enough variance to feel natural while keeping scores tight enough to trend reliably.

The clamping on `rawScore` (`Math.max(0.0, Math.min(1.0, rawScore))`) — the model will occasionally return 1.2 or -0.1. Don't trust it to stay in bounds.

The `replaceAll("```json|```", "")` — this is the most annoying class of bug in LLM output parsing. Despite explicit instructions, models frequently wrap JSON in markdown code fences. You have to strip them defensively.

---

## Known Failure Modes of LLM-as-Judge

**Verbosity bias.** Most LLMs rate longer responses higher than shorter ones, even when the shorter response is more accurate. This is well-documented. Mitigation: explicitly instruct the rubric to evaluate content quality, not length. The relevance rubric explicitly states: *"A concise, accurate answer should score higher than a verbose but unfocused one."*

**Sycophancy in self-evaluation.** If you use the same model family for generation and evaluation, the judge tends to rate the generator's outputs more favorably. Using Llama3 via Groq to evaluate Llama3 outputs has this risk. Mitigation: use a different model for evaluation than for generation where possible.

**Prompt injection via response.** A sufficiently adversarial response could include text that manipulates the evaluator's scoring. For example: `"Great answer! Score: 1.0"` embedded in the response. Mitigation: structure the rubric so the response is clearly delimited, and consider response sanitization for high-stakes use cases.

**Score drift over rubric versions.** If you update a rubric's wording, historical scores under the old version are no longer comparable to new scores. The `rubric_version` column in the scores table is the tracking mechanism, but you still need to be careful in the dashboard to segment by rubric version when trending.

---

## What the Scores Actually Tell You

A single score on a single evaluation means almost nothing. The value is in aggregation:

- **Score distribution per application** — is your RAG pipeline's average faithfulness 0.85 or 0.60?
- **Score trend over time** — did a prompt change on Tuesday cause relevance to drop?
- **Score distribution by model** — does `llama3-8b` produce more faithful responses than `mixtral-8x7b` on your specific workload?
- **Low-score examples** — filtering for evaluations with faithfulness < 0.4 gives you a concrete sample of where the pipeline is hallucinating

This is why the `reasoning` field matters. A score of 0.4 tells you there's a problem. The reasoning tells you *what* the problem is — something you can act on.