---
title: "Low Level Design - Integration  design pattern"
date: "2026-10-19"
description: "Low Level Design Deep dive and learing"
tags: ["lld", "java", "design-pattern", "Integration"]
---

## Support Ticket System

| Phase | Patterns | Project |
|---|---|---|
| 4 – Behavior | Chain of Responsibility, State | **Support Ticket System** |

---

## Core Entities

| Entity | Role |
|---|---|
| `Ticket` | The subject — holds state, delegates behavior |
| `TicketPriority` | LOW, MEDIUM, HIGH — drives chain routing |
| `TicketState` (enum) | OPEN, IN_PROGRESS, WAITING_FOR_INPUT, RESOLVED, CLOSED |
| `TicketHandler` | Abstract base for the chain |
| `TicketStateHandler` | Interface for state behavior |

---

## Chain of Responsibility Pattern

### Problem it solves
A ticket comes in. You need to route it to the right handler based on priority. Without the pattern:

```java
if (priority == LOW) {
    bot.handle(ticket);
} else if (priority == MEDIUM) {
    l1Agent.handle(ticket);
} else if (priority == HIGH) {
    l2Specialist.handle(ticket);
}
```

Adding a new priority level or a new handler = open this block and add a branch. The routing logic is coupled to every handler.

### Solution
Each handler decides: "can I handle this? If yes, handle it. If no, pass to next."

```java
public abstract class TicketHandler {
    protected TicketHandler next;

    public TicketHandler setNext(TicketHandler next) {
        this.next = next;
        return next;  // returns next so chain can be built fluently
    }

    public abstract void handle(Ticket ticket);

    protected void passToNext(Ticket ticket) {
        if (next != null) {
            next.handle(ticket);
        } else {
            System.out.println("[CHAIN] No handler could process: " + ticket.getId());
        }
    }
}
```

### Building the chain

```java
BotHandler bot = new BotHandler();
bot.setNext(l1).setNext(l2).setNext(manager);
// entry point is always bot — the chain is transparent to the caller
handlerChain.handle(ticket);
```

`setNext()` returns `next` (not `void`, not `this`) — enables fluent chaining on the next object in the sequence.

### Routing result

```
LOW    → [BOT] handles it directly
MEDIUM → [BOT] escalates → [L1 AGENT] handles it
HIGH   → [BOT] escalates → [L1 AGENT] escalates → [L2 SPECIALIST] handles it
```

### Why not just use if-else?

Adding a new priority (e.g., CRITICAL) with if-else = open the routing block and add a branch. With Chain of Responsibility = add one new handler class, insert it in the chain. The routing block (`handlerChain.handle(ticket)`) never changes.

---

## State Pattern

### Problem it solves
A ticket's valid operations depend on its current state. Without State pattern:

```java
public void resolve() {
    switch (this.state) {
        case OPEN -> System.out.println("Cannot resolve — not assigned");
        case IN_PROGRESS -> { this.state = RESOLVED; }
        case WAITING_FOR_INPUT -> System.out.println("Cannot resolve — waiting for user");
        case RESOLVED -> System.out.println("Already resolved");
        case CLOSED -> System.out.println("Already closed");
    }
}
```

5 states × 4 methods = 20 switch branches in `Ticket`. Add a new state → touch all 4 methods. Add a new method → add another switch with 5 branches.

### Solution
Each state is a class. The ticket holds the current state object and delegates all operations to it.

```java
public interface TicketStateHandler {
    void assign(Ticket ticket);
    void waitForInput(Ticket ticket);
    void resolve(Ticket ticket);
    void close(Ticket ticket);
}
```

`Ticket` delegates:
```java
public void assign()       { stateHandler.assign(this); }
public void resolve()      { stateHandler.resolve(this); }
```

### Keeping enum and handler in sync

`setState()` updates both atomically — they can never diverge:

```java
public void setState(TicketState state) {
    this.state = state;
    this.stateHandler = switch (state) {
        case OPEN              -> new OpenState();
        case IN_PROGRESS       -> new InProgressState();
        case WAITING_FOR_INPUT -> new WaitingForInputState();
        case RESOLVED          -> new ResolvedState();
        case CLOSED            -> new ClosedState();
    };
}
```

### Valid transitions

```
OPEN → IN_PROGRESS          (assign)
IN_PROGRESS → WAITING       (waitForInput)
IN_PROGRESS → RESOLVED      (resolve)
WAITING → IN_PROGRESS       (assign — user responded)
RESOLVED → CLOSED           (close)
```

All other transitions print an error message. No exception needed — the state object handles the invalid call gracefully.

### Illegal transition examples from output

```
[IN_PROGRESS] Already assigned.          ← assign() called on IN_PROGRESS ticket
[CLOSED] Already closed.                 ← close() called on CLOSED ticket
```

The state object absorbs the call. The ticket never enters an invalid state.

---

## Full Pattern Summary

| Pattern | Class | What it did |
|---|---|---|
| Chain of Responsibility | `BotHandler`, `L1AgentHandler`, `L2SpecialistHandler`, `ManagerHandler` | Routed ticket to the right handler based on priority |
| State | `OpenState`, `InProgressState`, `WaitingForInputState`, `ResolvedState`, `ClosedState` | Controlled what operations are valid at each lifecycle stage |

---

## Chain of Responsibility vs State — Key Distinction

Both involve a sequence of decisions. The difference:

| | Chain of Responsibility | State |
|---|---|---|
| Question | "Who handles this?" | "What's valid right now?" |
| Direction | One request, passes until handled | Object changes behavior as it transitions |
| Once handled? | Chain stops | State changes, next call goes to new state |
| Structure | Linked list of handlers | Object holds current state object |

---

## Recurring Theme Across All 4 Phases

Every pattern solved the same root problem: **branching on type/state/priority**.

| Anti-pattern | Replaced by |
|---|---|
| `if channel == EMAIL / SMS / PUSH` | Factory Method |
| `if (isSurge) / if (isLoyalty)` | Strategy |
| `if (priority == LOW / MEDIUM / HIGH)` | Chain of Responsibility |
| `switch (state) { case OPEN / IN_PROGRESS ... }` | State |

The fix is always the same: replace the branch with polymorphism. Each branch becomes a class. Adding a new case = adding a new class, never opening existing code.

[source](https://github.com/nishanthr878/LLD_Implementation)