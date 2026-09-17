---
title: "Building a Conversational AI Agent Platform From Scratch: What I Actually Learned"
date: "2026-06-17"
description: "A detailed walkthrough- the real architecture decisions, the bugs that taught me something, and the mistakes I'd tell you to avoid."
tags: ["llm", "java", "groq", "observability", "prompt-engineering", "lgtm", "spring-ai", "deepgram", "twillio", "voice-ai"]
---

[Github](https://github.com/nishanthr878/ChatVoice)  [Demo](https://chatvoice.nishanthraj.in/)


## Why I built this

I wanted to understand how production conversational AI agent platforms actually work under the hood - not by reading a blog post about them, but by building one myself, badly at first, then correctly. The result is ChatVoice: a chat and voice ordering assistant that can look up orders, process returns, handle mid-conversation topic changes, and resolve things like "what about the other one?" - backed by Kafka, Postgres, a real distributed tracing/logging stack, and deployed to a real server with a real phone number attached to it.

>This post is not a victory lap. About a third of it is about things I got wrong and had to fix, because that's where the actual learning happened.

---

## Part 1: The core idea - don't let the LLM run the show

The single most important decision in this whole project, made early and validated repeatedly, was this:

**The LLM handles language. Code handles everything with real consequences.**

That sounds obvious once you say it, but it's easy to violate by accident. Here's the trap: it's very tempting to build an "agent" where you give an LLM a set of tools (`lookup_order`, `process_return`, `escalate_to_human`) and just let it decide, turn by turn, which one to call next based on the conversation. This is genuinely how a lot of AI agent frameworks work, and it's a reasonable design - for the right kind of problem.

But think about what that means concretely: an LLM is a statistical model. It's very good, but it is not deterministic, and it can be talked into things by clever phrasing. If the rule "a return over $10 needs human approval" lives inside the LLM's reasoning rather than in code, then that rule is only a *strong suggestion* - a sufficiently unusual conversation could talk the model out of it. That's not a hypothetical; it's the exact failure mode you'd worry about in a system that touches money.

So instead, I built an explicit, coded state machine - I called the core piece `GraphExecutor`. Every conversation has a `current_node` (think: "which step of the process are we on"), and the *code* decides what the legal next steps are. The LLM's job, at each step, is narrow: extract an order number from this sentence, classify this message's intent, decide if a $59.99 return needs a human. **The LLM never chooses what happens next. It only ever answers a specific, bounded question, and code acts on the answer.**

Here's the shape of that boundary, stripped down to the essentials. A `NodeHandler` is just a function from "conversation, turn, user input" to "response text" - it's allowed to call the LLM internally, but it has no power to decide what node runs next:

```java
public interface NodeHandler {
    String handle(String conversationId, String turnId, String input);
}
```

And here's the part that actually enforces the boundary - a deterministic, non-negotiable rule, written in plain Java, with zero LLM involvement:

```java
private String handleCheckThreshold(String conversationId, String turnId, String input) {
    double price = getMatchedItemPrice(conversationId);

    // This decision is NEVER made by a model. No prompt, no LLM call.
    // A $59.99 return cannot be talked into auto-approval by clever phrasing,
    // because there's no phrasing involved at all - just a number comparison.
    if (price <= RETURN_APPROVAL_THRESHOLD) {
        conversationRepository.updateCurrentNode(conversationId, "auto_process");
    } else {
        conversationRepository.updateCurrentNode(conversationId, "escalate_to_agent");
    }

    return "..."; // response text
}
```

That's the whole principle, in code: the LLM gets called elsewhere in this same flow (to extract the item description, to phrase the final response naturally) - but the one line that actually decides "does this get auto-approved" never touches a model.

Later in the project, I actually went and compared this design against a real production agent platform's published code (a company that builds exactly this kind of system commercially). It turned out their design is *looser* than mine - their LLM does get to choose which tool to call next, just constrained by declared prerequisites (you can't call "process the return" until "check eligibility" has run). Mine doesn't even give it that choice. That was a genuinely useful thing to learn: I'd built something *more* conservative than the real commercial product, not a rough copy of it - and I could explain exactly why that tradeoff was the right one for a system where a wrong tool call has real consequences, versus their looser design being right for a platform that has to handle an open-ended variety of customer-defined workflows.

---

## Part 2: The architecture that grew out of that principle

Here's roughly how the system is shaped, and why each piece exists.

**Kafka, keyed by conversation ID.** Every user message gets published to a Kafka topic, partitioned by conversation ID. This guarantees that all the messages for one conversation are processed *in order*, by one consumer, even if you have many partitions and many consumers overall. Why does this matter? Because conversation state is inherently sequential - if message 2 and message 3 for the same user got processed out of order or concurrently, you'd get corrupted state. Kafka's partition-ordering guarantee is doing real, load-bearing work here, not just being "the trendy message queue."

```java
// Publishing a turn - the key IS the conversation ID.
// This is what guarantees strict per-conversation ordering.
kafkaTemplate.send("conversation-events", conversationId, payloadJson);
```

**A bounded, multi-hop dispatch loop.** Early on, `GraphExecutor` only ever did one thing per incoming message: look at the current node, run its handler, stop. This seemed fine until I actually tested it: if a user said "check order 1001, what's in it" - giving both the order number *and* the follow-up question in one message - the old system would extract the order number, then just... wait for the *next* message to actually look anything up, discarding the fact that the user had already asked their real question. That's a genuinely bad user experience, and it's a great example of a bug you only find by actually using the thing, not by reading the code.

The fix: `GraphExecutor.step()` became a small loop (capped at a few hops, so a bug can't spin forever) that keeps advancing through nodes *within one incoming message* as long as each step makes real progress, and only stops when a node genuinely needs to ask the user something, or the whole flow finishes:

```java
public String step(String conversationId, String input) {
    turnRepository.insertTurn(conversationId, newTurnId(), "user", input);

    String response = null;
    for (int hop = 0; hop < MAX_HOPS_PER_TURN; hop++) {
        String currentNode = conversationRepository.getCurrentNode(conversationId);
        Flow flow = flowsByType.get(conversationRepository.getFlowType(conversationId));

        response = dispatch(flow, conversationId, input);

        String nodeAfter = conversationRepository.getCurrentNode(conversationId);
        if (nodeAfter.equals(currentNode)) {
            // The handler didn't move us forward - it's genuinely waiting
            // on the user for something. Stop here, don't loop forever.
            break;
        }
        // Otherwise: the node changed, meaning real progress happened.
        // Loop again immediately, without waiting for another message.
    }

    turnRepository.insertTurn(conversationId, newTurnId(), "agent", response);
    return response;
}
```

The `nodeAfter.equals(currentNode)` check is doing all the work here - it's a simple, cheap way to ask "did anything actually happen," without needing the handler to explicitly signal it.

**Deterministic "flows," LLM-narrow nodes.** Each business capability - checking an order, processing a return - is a `Flow`: a named set of nodes, each with a handler. A node's handler might call the LLM (to extract information, or to phrase a response naturally), but the *decision* of which node comes next is always plain Java code, based on what data is actually present. This is the slot-filling pattern: extract everything extractable from a message in one LLM call, check what's still missing, ask only for that:

```java
private String handleCollectDetails(String conversationId, String turnId, String input) {
    String prompt = """
        Extract the order number mentioned in this message, if present.
        Respond with ONLY the order number, or NONE if not mentioned.

        Message: %s""".formatted(input);

    String extracted = llmClient.complete(prompt);

    if (!extracted.equals("NONE")) {
        saveOrderId(conversationId, extracted);
    }

    if (getOrderId(conversationId).isEmpty()) {
        // Still missing what we need - ask, and stay on this same node.
        return phraseNaturally("Ask the user for their order number, briefly.");
    }

    // Got everything - code decides to move forward, not the model.
    conversationRepository.updateCurrentNode(conversationId, "lookup_order");
    return phraseNaturally("Let the user know you're looking up their order now.");
}
```

Early versions of this asked for one piece of information per turn even if the user had already given two - genuinely annoying, and a second real lesson in "test it like a real user, not like a happy-path script."

---

## Part 3: The mistake that mattered most - and the fix that actually taught me something

For a long time, `current_node` (e.g., `collect_order_id`, `respond_with_details`) was implicitly doing **two different jobs at once**: tracking *which step of the process we're executing*, and standing in for *what the conversation is actually about*. That worked fine for simple, linear conversations. It broke badly the moment conversations got realistic:

- A user asks about order 1001, then says "actually, can you also check 1004?" - the system would sometimes just... forget 1001 existed, or worse, confidently state a made-up rule like "I can only help with one order at a time" (which was never true - it was hallucinating a limitation because nothing in its prompt told it what to do when asked about something outside its current context).
- A user says "what about the other one?" - a completely normal thing for a human to say, and the system had no way to even represent the concept of "the other one," because it only ever tracked one node name, not a set of things the conversation had actually discussed.

Every time I found one of these bugs, my first instinct was to patch it with one more special-case check - "is this a different order? add a detector for that." After doing this two or three times, I got real, direct pushback (paraphrasing): *you're not fixing bugs, you're bolting duct tape onto a state machine, and the duct tape is slowly becoming a second, informal state machine of its own.* That was the right diagnosis - if you keep needing a new special case for every new user behavior you discover, the problem usually isn't that you haven't found enough special cases yet - it's that your underlying model of the problem is missing a concept.

The concept that was missing: **conversational state** (what is this conversation about, right now - which entities has it mentioned, which one is currently the focus) is a genuinely different thing from **execution state** (which step of a business process is currently running), and I'd been cramming both into one field.

The fix was a real, separate `ConversationState` - tracking things like "which order is currently in focus" and "what orders has this conversation mentioned so far" - living *alongside* the execution graph, not instead of it:

```java
public record EntityReference(String entityType, String entityId) {}

public record ConversationState(
    String conversationId,
    String activeIntent,
    Optional<EntityReference> activeFocus,   // e.g. ORDER:1001 - what "it" refers to
    int version                              // for safe concurrent updates
) {}
```

State changes as one atomic patch per turn, not several independent writes - so a single user message that both switches focus *and* supplies new facts gets applied as one consistent change:

```java
public record ConversationStateUpdate(
    Optional<String> activeIntent,
    Optional<EntityReference> activeFocus,
    List<EntityReference> newEntities
) {}
```

This is a standard concept in dialogue systems research, it turns out - it's called "dialogue state tracking," and it's been studied for years. I hadn't known the term going in; I'd rediscovered the need for it the hard way, by hitting the actual bugs its absence causes.

**One subtlety worth calling out, because it's the kind of thing that separates "I added a feature" from "I actually understood the invariant":** when a conversation switches focus - say, from discussing a return on order 1001 to order 1004 - you have to decide what happens to the facts collected so far ("the shoes," "wrong size"). Do they carry over to the new order? They shouldn't - silently attaching "wrong size" to an order the user never said that about is exactly the kind of confidently-wrong behavior you're trying to prevent. But the fix isn't "blindly clear everything and make the user repeat themselves" either, because a real message like "actually, return the jacket from order 1004 instead" contains *both* the switch *and* new information in the same sentence - and a naive "clear then stop" implementation would lose the word "jacket."

The correct design: detect the switch, invalidate the old order's dependent facts, and *then* still collect whatever new facts the same message supplied against the new focus - all from one combined extraction call, so it's one atomic decision instead of two racing ones:

```java
private String handleCollectDetails(String conversationId, String turnId, String input) {
    ConversationState state = conversationStateRepository.getOrCreate(conversationId);

    String prompt = """
        Current order being discussed: %s
        Message: "%s"

        Extract, in exactly this format, four lines:
        ORDER_ID: <order number mentioned, or SAME if continuing the current order, or NONE>
        ITEM: <item mentioned, or NONE>
        REASON: <return reason mentioned, or NONE>
        IS_SWITCH: <YES if this asks about a DIFFERENT order, otherwise NO>
        """.formatted(currentOrderIdOrNone(state), input);

    Extraction result = parseExtraction(llmClient.complete(prompt));

    if (result.isSwitch() && result.hasNewOrderId()) {
        EntityReference newOrder = new EntityReference("ORDER", result.orderId());

        conversationStateRepository.applyUpdate(conversationId,
            new ConversationStateUpdate(
                Optional.of("PROCESS_RETURN"),
                Optional.of(newOrder),
                List.of(newOrder)),
            state.version());

        // Invalidate the OLD order's facts - they were never established
        // for the new one.
        slotRepository.saveSlot(conversationId, "matched_item_description", "");
        slotRepository.saveSlot(conversationId, "return_reason", "");
    }

    // Still runs even after a switch - so "the jacket" from
    // "return the jacket from order 1004 instead" isn't lost.
    if (result.hasItem()) {
        slotRepository.saveSlot(conversationId, "matched_item_description", result.item());
    }
    if (result.hasReason()) {
        slotRepository.saveSlot(conversationId, "return_reason", result.reason());
    }

    // ... proceed to next node once everything needed is present
}
```

Getting this exactly right, and having a test that specifically proves it (not just a happy-path test), was one of the more satisfying pieces of engineering in this whole project:

```java
@Test
void switchingOrderWithNewItemInSameMessage_invalidatesOldSlotsButKeepsNewItem() {
    // Arrange: conversation is mid-return on order 1001, item and reason already set
    seedFocus(conversationId, "1001");
    slotRepository.saveSlot(conversationId, "matched_item_description", "Blue T-Shirt");
    slotRepository.saveSlot(conversationId, "return_reason", "wrong size");

    QueuedLlmClient llmClient = new QueuedLlmClient(
        "ORDER_ID: 1004\nITEM: jacket\nREASON: NONE\nIS_SWITCH: YES",
        "Sure, let's look at that order instead."
    );

    flow.handlerFor("collect_order_id")
        .handle(conversationId, "t2", "actually, return the jacket from order 1004 instead");

    // The new focus is correct...
    assertEquals(Optional.of(entityRef("1004")), currentFocus(conversationId));
    // ...the NEW item survived...
    assertEquals("jacket", slotRepository.getSlot(conversationId, "matched_item_description").get());
    // ...but the OLD reason did NOT carry over to the new order.
    assertTrue(slotRepository.getSlot(conversationId, "return_reason").get().isEmpty());
}
```

---

## Part 4: Guarding against a model that sounds confident but is wrong

LLMs will state things with total confidence even when they're fabricating them. I hit this directly, more than once. Two examples worth understanding precisely, because they're two different flavors of the same underlying problem.

**Fabricating a fact it was never given.** A helper method that turns a database result into a natural sentence was given an instruction like "let the user know you're looking up their order." With nothing else to go on, the model would sometimes invent plausible-sounding specifics - a fake order number that was never real:

```java
// BEFORE - leaves room for the model to invent something
phraseNaturally("Let the user know you're looking up their order now, briefly.");
// -> "I have your order #12345, looking it up now!"  <- fabricated number, never given

// AFTER - explicitly closes the gap
phraseNaturally("Let the user know you're looking up their order now, briefly. " +
                 "Do not state any specific numbers.");
// -> "Great, let me pull that up for you!"  <- no invented facts
```

This sounds almost too simple, but it worked, and it taught me something durable: **an LLM prompt that leaves room for the model to "helpfully" fill in a gap will eventually get filled with something wrong.** Close the gap explicitly.

**Fabricating a limitation that doesn't exist.** When asked about an order the system genuinely didn't have data for, instead of saying "I don't have that information," it invented a fake rule - "I can only help with one order at a time." This is worse than the first case, because it's not just wrong, it actively misleads the user about the system's real capabilities:

```java
String prompt = """
    Order %s (status: %s) contains: %s
    The user asked: "%s"

    Answer using only the order information above. If the question is about
    a different order or something this data doesn't cover, say you don't
    have that information and ask for the order number they'd like -
    rather than inventing any limitation.
    """.formatted(orderId, status, itemList, input);
```

**The general lesson:** don't think of prompt-writing as "describe the happy path." Think of it as "describe exactly what to do at every point where the model might otherwise guess," because it will guess, and it will guess confidently.

---

## Part 5: How I actually tested this, and why "it compiled" was never enough

Every flow in this project has automated tests using a small hand-written fake LLM client - one that returns a pre-programmed sequence of responses instead of calling a real model:

```java
class QueuedLlmClient implements LlmClient {
    private final Queue<String> responses = new LinkedList<>();

    QueuedLlmClient(String... responsesInOrder) {
        for (String r : responsesInOrder) responses.add(r);
    }

    @Override
    public String complete(String prompt) {
        return responses.poll(); // returns null, not an exception, if the queue runs dry
    }
}
```

This makes tests fast and deterministic. But it comes with a real, sharp trap, and I hit it repeatedly: **if you queue the wrong number of fake responses, or the wrong exact string, your test either crashes in a confusing way or - worse - silently passes while testing the wrong thing.** `poll()` returning `null` on an empty queue is a deliberate design choice - it means a miscounted queue fails loudly (a `NullPointerException` somewhere downstream) instead of silently returning something that looks plausible.

A typical test, using this fake, looks like:

```java
@Test
void collectDetails_orderIdPresent_transitionsToLookupOrder() {
    QueuedLlmClient llmClient = new QueuedLlmClient(
        "1001",                          // response to the extraction prompt
        "Let me look that up for you."   // response to the phraseNaturally call
    );

    CheckOrderStatusFlow flow = buildFlow(/* ...repositories, llmClient... */);
    String response = flow.handlerFor("collect_order_id")
        .handle(conversationId, "t1", "check order 1001");

    assertEquals("lookup_order", conversationRepository.getCurrentNode(conversationId));
    assertEquals("1001", currentFocus(conversationId));
}
```

More than once, a refactor added one more LLM call to a code path, and every test touching that path needed its queued response count adjusted by exactly one, in exactly the right position. Get it wrong and you get a `NullPointerException` two calls later that looks nothing like the real bug.

The actual discipline that saved me, over and over: **when a fake-LLM-based test fails in a confusing way, don't guess - paste the exact real file, count the calls by hand, and verify against the actual code, not your memory of what you wrote.** I cannot overstate how many bugs in this project were "I described what a file should contain in conversation, but the actual saved file was slightly different" - and the fix was always the same: stop reasoning from memory, go look at the real thing.

Later in the project, I also used real, recorded model outputs - actual text a live model produced during a real conversation - as test fixtures instead of hand-written guesses at plausible responses. This is a real, named pattern (sometimes called "golden transcripts" or the "cassette" pattern), and it's a meaningfully stronger test than a hand-written fake, because it's grounded in something the model actually said, not what I imagined it might say.

---

## Part 6: Observability - the thing I should have built earlier

For most of the project, debugging meant: add a print statement, rebuild, reproduce the bug, read the console, remove the print statement, repeat. This works, but it's slow, and it doesn't scale to "figure out what happened three days ago in a call nobody was watching live."

I eventually built a real, self-hosted observability stack - structured logs shipped to a searchable log aggregator, and distributed tracing showing the actual request path (a Kafka message triggering a chain of LLM calls, a database write, an external HTTP call) with real timing. This is genuinely standard production infrastructure, not something specific to AI systems, and it's worth learning even if you never touch an LLM.

**The real debugging methodology I ended up with, which is more valuable than any single fix:**

1. **Ask the running application what it actually loaded**, don't trust the config file on disk:
   ```bash
   curl http://localhost:8080/actuator/env | grep -i "otlp\|tracing"
   ```
   A config value can be present in a file and still not be what the running process is using - a stale build, wrong file path, wrong profile.
2. **Confirm a dependency actually resolved**, don't just trust that the build succeeded:
   ```bash
   ./gradlew dependencies --configuration runtimeClasspath | grep "spring-boot-starter-opentelemetry"
   ```
   A build can succeed while a dependency you think you added is silently missing, if nothing else strictly needs it to compile.
3. **Check the receiving side's logs before the sending side's.** If service A sends something to service B and nothing happens, and A shows no error, check B's logs for any sign of an attempt at all - a lot of "fire and forget" integrations swallow connection failures silently on the sending side.
4. **Bypass the UI layer and query the backend directly:**
   ```bash
   curl http://localhost:3200/api/search?tags=
   ```
   If a dashboard shows nothing, that's two different possible bugs - "no data arrived" versus "data arrived but the query/display is wrong" - and they need different fixes. A raw API call against the storage layer tells you which one you're dealing with.
5. **Only once 1-4 are confirmed, reconsider your underlying assumption.** Don't jump to "maybe this whole approach is wrong" before you've ruled out the boring, mechanical explanations.

I used this exact sequence to chase down a genuinely nasty bug: a distributed tracing pipeline that was fully configured, with correct dependencies, a running server, and *still* silently sent nothing. It took five separate, precisely diagnosed root causes (a YAML indentation mistake, an old framework-version property name that had silently changed in a newer version, a singular-vs-plural typo in a property name, a missing required module that a newer framework version needed even though the old manual setup still compiled fine, and finally a wrong port/protocol combination) before it actually worked - and the only reason I found all five is that I refused to accept "should work" as evidence and kept asking the running system what it actually knew.

---

## Part 7: Deploying it for real - where the manual seams show

Everything above can be tested locally and feel done. Deployment is where you find out what you actually understood versus what you'd only tested in a forgiving environment. A few real things from putting this on an actual server, alongside an already-running production service:

- **DNS and reverse proxies have real gotchas that don't show up until you hit them.** I initially pointed my domain at the server through a CDN/proxy service, which broke automatic TLS certificate issuance, because the certificate-issuing process needs to talk directly to the origin server, not through a proxy in front of it. The fix was simple once diagnosed (turn the proxy off for that one subdomain) but genuinely confusing until I understood *why* it mattered.
- **A server that already runs something else has real constraints you have to discover, not assume away.** My new stack's default ports collided with an existing service's ports:
  ```bash
  docker ps          # what's already running, and on what ports
  ss -tlnp           # everything actually listening on the host, Docker or not
  ```
  The fix (remap the ports) is trivial; the lesson is to actually check *before* assuming your compose file will just work on a shared machine.
- **Don't publish more than you have to.** My first pass at the deployment config published database and message-queue ports to the public internet, purely because that's what my local dev config did and I copied it forward without thinking:
  ```yaml
  # BEFORE - reachable from the entire internet, no reason for it to be
  postgres:
    ports:
      - "5432:5432"

  # AFTER - only reachable by other containers on the internal Docker network
  postgres:
    # (no ports: block at all)
  ```
  Comparing against the already-running service's correct configuration (which didn't publish those ports) caught it. **The general habit worth building: any time you copy a config from "works on my machine" to "runs on a shared, internet-facing server," go through it line by line and ask whether each exposed port genuinely needs to be public.**
- **Be careful what you paste into a chat, a ticket, or a log aggregator.** A command that prints your *resolved* configuration - with environment variable placeholders substituted for their real values - will print real secrets if you have them set:
  ```bash
  docker compose config   # this prints REAL secret values, not ${VAR} placeholders
  ```
  I learned this by doing it, pasting real API keys into a conversation by accident. The fix (rotate the keys immediately) is easy; the mistake is easy to make exactly once if you're not deliberately thinking about it every time.

None of these are exotic. They're the ordinary, unglamorous things that separate "I got it running on my laptop" from "I understand what it means to operate this."