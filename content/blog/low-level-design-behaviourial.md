---
title: "Low Level Design - Behavioral  design pattern"
date: "2026-10-19"
description: "Low Level Design Deep dive and learing"
tags: ["lld", "java", "design-pattern", "Behavioral"]
---

## Food Delivery Order Lifecycle

| Phase | Patterns | Project |
|---|---|---|
| 2 – Behavior | Strategy, Observer, Command, Template Method | **Food Delivery Order Lifecycle** |

---

## Core Entities

| Entity | Relationship |
|---|---|
| `Order` | BELONGS TO `Customer` |
| `Order` | HAS MANY `OrderItem` |
| `OrderItem` | REFERENCES `MenuItem` |
| `MenuItem` | BELONGS TO `Restaurant` |
| `Restaurant` | HAS MANY `MenuItem` |
| `DeliveryTask` | BELONGS TO `DeliveryAgent` |
| `Payment` | BELONGS TO `Order` |

---

## Strategy Pattern

### Problem it solves
Pricing in food delivery isn't static. Without Strategy, `OrderService` ends up with:

```java
if (isSurge) {
    total = total * 1.5;
} else if (isLoyaltyCustomer) {
    total = total * 0.9;
} else {
    // regular
}
```

Adding a new pricing model = opening `OrderService` and touching working code.

### Solution
Define a `PricingStrategy` interface. Each algorithm is its own class. `OrderService` holds a reference and delegates — never knows which algorithm runs.

```java
public interface PricingStrategy {
    double calculateTotal(Order order);
}
```

```java
public class SurgePricing implements PricingStrategy {
    private static final double SURGE_MULTIPLIER = 1.5;
    private static final double DELIVERY_FEE = 60.0;

    @Override
    public double calculateTotal(Order order) {
        double itemTotal = order.getItems().stream()
                .mapToDouble(item -> item.getMenuItem().getPrice() * item.getQuantity())
                .sum();
        return (itemTotal * SURGE_MULTIPLIER) + DELIVERY_FEE;
    }
}
```

### Swapping strategy at runtime

```java
// 6pm — normal hours
orderService.setPricingStrategy(new RegularPricing());

// 8pm — raining, surge kicks in
orderService.setPricingStrategy(new SurgePricing());

// Loyalty customer
if (customer.isLoyalty()) {
    orderService.setPricingStrategy(new LoyaltyPricing());
}
```

The decision of *which algorithm* is completely separated from *execution of that algorithm*. `OrderService` just calls `pricingStrategy.calculateTotal(order)` and gets a number back.

| Strategy | Formula |
|---|---|
| Regular | `items + ₹30` |
| Surge | `items × 1.5 + ₹60` |
| Loyalty | `items − 10% + ₹0` |

---

## Observer Pattern

### Problem it solves
When order status changes, multiple parties need to react:

- `PLACED` → Customer (confirmation)
- `CONFIRMED` → Customer + Restaurant (start preparing)
- `PREPARING` → DeliveryAgent (head to restaurant)
- `OUT_FOR_DELIVERY` → Customer (on the way)
- `DELIVERED` → Customer + trigger payment settlement

Hardcoding this in `OrderService` means adding a new observer (e.g., Analytics) = touching existing working code.

### Solution
`OrderObserver` interface. `OrderService` is the **subject** — it manages a list of observers and notifies all of them on every status change.

```java
public interface OrderObserver {
    void onStatusChange(Order order, OrderStatus newStatus);
}
```

```java
// OrderService — subject
private final List<OrderObserver> observers = new ArrayList<>();

public void addObserver(OrderObserver observer) {
    observers.add(observer);
}

private void notifyObservers(Order order, OrderStatus newStatus) {
    for (OrderObserver observer : observers) {
        observer.onStatusChange(order, newStatus);
    }
}
```

### Why every status change goes through `updateStatus`

```java
public void updateStatus(Order order, OrderStatus newStatus) {
    order.setStatus(newStatus);
    order.setUpdatedAt(LocalDateTime.now());
    notifyObservers(order, newStatus);   // always fires
}
```

If callers called `order.setStatus()` directly — status changes silently, observers never fire, customer never gets notified. `updateStatus` is the **single controlled entry point** — status change and notification are always atomic, never one without the other.

> `ArrayList` for the observer list — dynamic, add/remove at runtime.
> Thread-safe variant: `CopyOnWriteArrayList` if observers are registered/removed across threads.

---

## Command Pattern

### Problem it solves

Without Command, `placeOrder`, `cancelOrder`, `refund` are methods in `OrderService`. A method call is **fire-and-forget**:
- Can't queue it for later
- Can't retry on failure without re-implementing retry logic in every caller
- Can't undo — no record that it happened

### Solution
Wrap each action as an object implementing `OrderCommand`. The action becomes a first-class object you can store, pass around, queue, and reverse.

```java
public interface OrderCommand {
    void execute();
    void undo();
}
```

```java
public class CancelOrderCommand implements OrderCommand {
    private final Order order;
    private final OrderService orderService;
    private OrderStatus previousStatus;   // snapshot for undo

    @Override
    public void execute() {
        previousStatus = order.getStatus();   // take snapshot BEFORE acting
        orderService.updateStatus(order, OrderStatus.CANCELLED);
    }

    @Override
    public void undo() {
        orderService.updateStatus(order, previousStatus);  // restore snapshot
    }
}
```

### Why `previousStatus` must be stored before executing

If you don't snapshot before executing, by the time `undo()` is called the status is already `CANCELLED`. The original state is gone — there is nothing to restore to. Same principle as git — a commit stores state before changes so you can revert.

### CommandHistory — undo stack

```java
public class CommandHistory {
    private final Deque<OrderCommand> history = new ArrayDeque<>();

    public void executeCommand(OrderCommand command) {
        command.execute();
        history.push(command);   // push onto stack after execution
    }

    public void undoLast() {
        if (!history.isEmpty()) {
            history.pop().undo();  // last executed = first to undo
        }
    }
}
```

`Deque` used as a stack — `push` to top, `pop` from top. Last in, first out.

---

## Template Method Pattern

### Problem it solves
Every order follows the same pipeline regardless of payment method:

1. Validate order
2. Process payment ← **varies** (COD, UPI, card)
3. Notify restaurant
4. Assign delivery agent

Without Template Method, `OrderService` has nested if-else for payment type inside the pipeline. Adding a new payment method = open the method, add a branch, risk breaking existing flows.

### Solution
Abstract base class holds the **skeleton** as a `final` method. Subclasses override only the variable step.

```java
public abstract class OrderProcessor {

    // final — subclasses CANNOT override the skeleton
    public final void processOrder(Order order) {
        validateOrder(order);      // fixed
        processPayment(order);     // variable — subclass fills this
        notifyRestaurant(order);   // fixed
        assignDeliveryAgent(order); // fixed
    }

    protected abstract void processPayment(Order order);

    private void validateOrder(Order order) { ... }
    private void notifyRestaurant(Order order) { ... }
    private void assignDeliveryAgent(Order order) { ... }
}
```

```java
public class CodOrderProcessor extends OrderProcessor {
    @Override
    protected void processPayment(Order order) {
        System.out.println("[COD] Collect on delivery: ₹" + order.getTotalAmount());
    }
}

public class OnlineOrderProcessor extends OrderProcessor {
    @Override
    protected void processPayment(Order order) {
        System.out.println("[ONLINE] Charging ₹" + order.getTotalAmount() + " via gateway");
    }
}
```

### Why `processOrder` is `final`

Without `final`, a subclass could override `processOrder` and skip validation or restaurant notification entirely — breaking the contract. `final` guarantees the skeleton always runs. Subclasses control *how* payment works. They never control *what steps run*.

---

## Strategy vs Template Method — Key Distinction

Both solve "algorithm varies by context." The difference:

| | Strategy | Template Method |
|---|---|---|
| Mechanism | Composition — inject a different object | Inheritance — extend a base class |
| Use when | Entire algorithm varies | Skeleton is fixed, specific steps vary |
| Multiple variable steps | Awkward — multiple injected strategies | Natural — override multiple abstract methods |

> **Rule of thumb:** If only one step varies, Strategy is cleaner. Template Method earns its place when multiple steps vary across subclasses and those steps are tightly related.

---

## Full Pattern Summary

| Pattern | Class | What it did |
|---|---|---|
| Strategy | `RegularPricing`, `SurgePricing`, `LoyaltyPricing` | Swappable pricing algorithm at runtime |
| Observer | `CustomerNotificationObserver`, `RestaurantObserver`, `DeliveryAgentObserver` | Automatic multi-party notification on status change |
| Command | `PlaceOrderCommand`, `CancelOrderCommand`, `CommandHistory` | Actions as objects — undoable, queueable |
| Template Method | `CodOrderProcessor`, `OnlineOrderProcessor` | Fixed pipeline, variable payment step |


[source](https://github.com/nishanthr878/LLD_Implementation)