---
title: "Low Level Design - Structural  design pattern"
date: "2026-10-19"
description: "Low Level Design Deep dive and learing"
tags: ["lld", "java", "design-pattern", "Structural"]
---

## Payment Gateway Wrapper

| Phase | Patterns | Project |
|---|---|---|
| 3 – Structural | Adapter, Decorator, Facade, Proxy | **Payment Gateway Wrapper** |

---

## Core Problem

You need to integrate multiple payment providers (Razorpay, Stripe) — each with their own SDK, their own method names, their own signatures. You also need logging, retry, and auth checks without touching provider code every time something changes.

---

## Adapter Pattern

### Problem it solves
`RazorpayClient` speaks its own language — `initiateTransaction()`, `getTransactionStatus()`, `initiateRefund()`. Your system speaks `charge()`, `fetchStatus()`, `refund()`. They can't talk directly.

Without Adapter, every caller learns Razorpay's API. When you add Stripe, every caller learns Stripe's too. Interface mismatch multiplied across your codebase.

### Solution
Define a unified `PaymentGateway` interface. Each provider gets an adapter that implements it and translates internally.

```java
public interface PaymentGateway {
    String charge(double amount, String currency, String orderId);
    String fetchStatus(String paymentId);
    String refund(String paymentId, double amount);
}
```

```java
public class RazorpayGateway implements PaymentGateway {
    private final RazorpayClient client;

    @Override
    public String charge(double amount, String currency, String orderId) {
        return client.initiateTransaction(amount, currency, orderId);
        //     ↑ our interface         ↑ their SDK method
    }
}
```

### The translation layer

| Our interface | RazorpayClient | StripeClient |
|---|---|---|
| `charge()` | `initiateTransaction()` | `createPaymentIntent()` |
| `fetchStatus()` | `getTransactionStatus()` | `retrievePaymentIntent()` |
| `refund()` | `initiateRefund()` | `createRefund()` |

Adapters own the mismatch. Callers never see provider-specific method names.

### Adapter vs Facade

| | Adapter | Facade |
|---|---|---|
| Problem | Interface mismatch | Too much complexity |
| Creates new interface? | Yes — maps one to another | No — simplifies access |
| Classes involved | Usually one | Many |
| You own the target? | No — it's their SDK | Yes — your own subsystem |

---

## Decorator Pattern

### Problem it solves
You want logging around every payment call. Without Decorator, you add it inside `RazorpayGateway`. Then you want retry — add it too. Then fraud check. Now `StripeGateway` needs the same. Every cross-cutting concern multiplies across every provider.

Adding or changing logging = touching `RazorpayGateway` + `StripeGateway` + any future provider. Violates Open/Closed.

### Solution
Wrap the real gateway. The wrapper adds behavior before/after forwarding the call. The real gateway never changes.

```
PaymentGateway          ← interface
    ├── RazorpayGateway          (real implementation)
    └── PaymentGatewayDecorator  (abstract base — just delegates)
            ├── LoggingDecorator
            └── RetryDecorator
```

`PaymentGatewayDecorator` exists to provide the default passthrough. Concrete decorators only override what they care about — everything else falls through to the wrapped object.

### Stacking

```java
PaymentGateway gateway = new RazorpayGateway(new RazorpayClient());
gateway = new RetryDecorator(gateway);
gateway = new LoggingDecorator(gateway);
```

Order matters. `LoggingDecorator` wraps `RetryDecorator` — so LOG fires first, then RETRY, then the real gateway.

### Execution flow

```
LoggingDecorator.charge()
    → "[LOG] charge() called"
    → super.charge() → wrapped.charge() → RetryDecorator.charge()
        → "[RETRY] attempt 1"
        → super.charge() → wrapped.charge() → RazorpayGateway.charge()
            → RazorpayClient.initiateTransaction()
            ← "rzp_txn_123"
        ← "rzp_txn_123"
    ← "rzp_txn_123"
    → "[LOG] charge() result — rzp_txn_123"
← "rzp_txn_123"
```

### Decorator vs Proxy

Both implement the same interface. Both wrap a real object. Intent is the difference:

| | Decorator | Proxy |
|---|---|---|
| Intent | Add behavior | Control access |
| Real object always runs? | Yes | No — proxy decides |
| Question it asks | "run this, plus do X" | "should this even run?" |

---

## Facade Pattern

### Problem it solves
Every caller who wants to charge a customer must: pick a gateway, instantiate the client, build the adapter, stack the decorators in the right order, then call `charge()`. Five steps repeated everywhere. Change the stack order = touch every caller.

### Solution
One class owns the wiring. Callers call one method.

```java
public class PaymentFacade {
    private final PaymentGateway gateway;

    public PaymentFacade() {
        PaymentGateway base = new RazorpayGateway(new RazorpayClient());
        PaymentGateway withRetry = new RetryDecorator(base);
        this.gateway = new LoggingDecorator(withRetry);
        // all complexity lives here
    }

    public String charge(double amount, String currency, String orderId) {
        return gateway.charge(amount, currency, orderId);
    }
}
```

Caller:
```java
new PaymentFacade().charge(500.0, "INR", "order_123");
```

No knowledge of Razorpay, no knowledge of decorators, no wiring.

> Facade is a **concrete class**, not an interface. There's nothing to implement or swap — it's the one place that knows how to assemble the subsystem.

---

## Proxy Pattern

### Problem it solves
Before any payment call reaches the real gateway, you need to verify the merchant is authorized. Without Proxy, the auth check lives inside the gateway or the controller — neither is its responsibility.

### Solution
Proxy sits in front of the real object. It implements the same interface. The caller doesn't know it's not the real thing.

```java
public class PaymentGatewayProxy implements PaymentGateway {
    private final PaymentGateway real;
    private final String merchantId;

    @Override
    public String charge(double amount, String currency, String orderId) {
        checkAuthorization();                        // gate
        return real.charge(amount, currency, orderId); // forward if allowed
    }

    private void checkAuthorization() {
        if (!AUTHORIZED_MERCHANTS.contains(merchantId)) {
            throw new SecurityException("Unauthorized merchant: " + merchantId);
        }
    }
}
```

Unauthorized merchant → `SecurityException` thrown, `real.charge()` never called.

---

## Full Pattern Summary

| Pattern | Class | What it did |
|---|---|---|
| Adapter | `RazorpayGateway`, `StripeGateway` | Translated provider SDK into unified `PaymentGateway` interface |
| Decorator | `LoggingDecorator`, `RetryDecorator` | Added logging and retry without touching provider code |
| Facade | `PaymentFacade` | Hid all wiring — one call to charge, status, refund |
| Proxy | `PaymentGatewayProxy` | Blocked unauthorized merchants before reaching the gateway |

---

## Key Distinction: All Four Look Similar From Outside

| Pattern | Wraps something? | Implements same interface? | Real object always called? | Purpose |
|---|---|---|---|---|
| Adapter | Yes (their SDK) | No — maps to ours | Yes | Fix mismatch |
| Decorator | Yes (PaymentGateway) | Yes | Yes | Add behavior |
| Facade | Yes (whole subsystem) | No — simpler surface | Yes | Hide complexity |
| Proxy | Yes (PaymentGateway) | Yes | No — decides | Control access |


[source](https://github.com/nishanthr878/LLD_Implementation)