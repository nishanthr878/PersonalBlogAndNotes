---
title: "Low Level Design"
date: "2026-08-14"
description: "Low Level Design Deep dive and learing"
tags: ["lld", "java", "design-pattern"]
---

So in this we will deep dive into Low level design

| Phase               | Patterns                                             | Project                                                  |
| ------------------- | ---------------------------------------------------- | -------------------------------------------------------- |
| 1 – Object creation | Factory Method, Abstract Factory, Builder, Singleton | **Notification System** (email/SMS/push, multi-provider) |
| 2 – Behavior        | Strategy, Observer, Command, Template Method         | Food Delivery Order Lifecycle                            |
| 3 – Structure       | Decorator, Adapter, Facade, Proxy                    | Payment Gateway Wrapper                                  |
| 4 – Integration     | Chain of Responsibility, State                       | **Support Ticket / Vending Machine**                     |

---------------------------------------------------------------------------------

### Notifiaction service
- Sends notification via Email, SMS and Push
- Supports multiple channel (eg senGrid vs SES for email)
- Simple or Complex (with attachment, templates, metadata)


| Pattern              | Problem it solves                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| **Factory Method**   | Create the right notifier (Email/SMS/Push) without the caller knowing the concrete class        |
| **Abstract Factory** | Swap entire provider families (e.g., AWS suite vs Twilio suite) without changing client code    |
| Builder              | Construct a `Notification` object that has 10+ optional fields without telescoping constructors |
| Singleton            | One shared `NotificationConfig` / provider registry across the app                              |


#### Project structure
 
```bash
notification-service/
├── src/main/java/com/lld/notification/
│   ├── model/
│   │   └── Notification.java          ← Builder pattern
│   ├── notifier/
│   │   ├── Notifier.java              ← interface
│   │   ├── EmailNotifier.java
│   │   ├── SmsNotifier.java
│   │   └── PushNotifier.java
│   ├── factory/
│   │   ├── NotifierFactory.java       ← Factory Method
│   │   ├── AwsNotifierFactory.java    ← Abstract Factory (AWS family)
│   │   └── TwilioNotifierFactory.java ← Abstract Factory (Twilio family)
│   ├── config/
│   │   └── NotificationConfig.java    ← Singleton
│   └── Main.java
```

- If we have to write a constructor for an object that has to, subject, body channel, priority, templateId, attachments, metadata, retryCount, scheduleAt?

- *We will end up with telescoping constructor problem*

```java
public Notification(String to, String body) { ... }
public Notification(String to, String body, String subject) { ... }
public Notification(String to, String body, String subject, String channel) { ... }
public Notification(String to, String body, String subject, String channel, int priority) { ... }
// ... 6 more of these
```

#### Problem with this:
1. Unreadable at call site — new Notification("a@b.com", "Hello", null, "EMAIL", 1, null, null, null, 3, null) — what does that 3 mean?
2. Order-sensitive — swap two String arguments, compiler won't catch it, bug in production
3. Combinatorial explosion — 10 fields means potentially dozens of constructors to cover meaningful combinations
4. Adding a new optional field — you touch every constructor

#### Builder Implementation
```java
package com.lld.notification.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class Notification {

    // All fields private, final — object is immutable once built
    private final String to;
    private final String subject;
    private final String body;
    private final String channel;       // EMAIL, SMS, PUSH
    private final int priority;         // 1=HIGH, 2=MEDIUM, 3=LOW
    private final String templateId;
    private final List<String> attachments;
    private final Map<String, String> metadata;
    private final int retryCount;
    private final LocalDateTime scheduledAt;

    // Private constructor — ONLY Builder can call this
    private Notification(Builder builder) {
        this.to = builder.to;
        this.subject = builder.subject;
        this.body = builder.body;
        this.channel = builder.channel;
        this.priority = builder.priority;
        this.templateId = builder.templateId;
        this.attachments = builder.attachments;
        this.metadata = builder.metadata;
        this.retryCount = builder.retryCount;
        this.scheduledAt = builder.scheduledAt;
    }

    // Getters only — no setters, immutable
    public String getTo() { return to; }
    public String getSubject() { return subject; }
    public String getBody() { return body; }
    public String getChannel() { return channel; }
    public int getPriority() { return priority; }
    public String getTemplateId() { return templateId; }
    public List<String> getAttachments() { return attachments; }
    public Map<String, String> getMetadata() { return metadata; }
    public int getRetryCount() { return retryCount; }
    public LocalDateTime getScheduledAt() { return scheduledAt; }

    @Override
    public String toString() {
        return "Notification{" +
               "to='" + to + '\'' +
               ", channel='" + channel + '\'' +
               ", subject='" + subject + '\'' +
               ", priority=" + priority +
               ", retryCount=" + retryCount +
               '}';
    }

    // ---- Static nested Builder class ----
    public static class Builder {

        // Required fields
        private final String to;
        private final String body;
        private final String channel;

        // Optional fields with defaults
        private String subject = "";
        private int priority = 2;
        private String templateId = null;
        private List<String> attachments = List.of();
        private Map<String, String> metadata = Map.of();
        private int retryCount = 3;
        private LocalDateTime scheduledAt = null;

        // Required fields go in Builder constructor — enforced at compile time
        public Builder(String to, String body, String channel) {
            this.to = to;
            this.body = body;
            this.channel = channel;
        }

        public Builder subject(String subject) {
            this.subject = subject;
            return this;            // returns Builder — enables method chaining
        }

        public Builder priority(int priority) {
            this.priority = priority;
            return this;
        }

        public Builder templateId(String templateId) {
            this.templateId = templateId;
            return this;
        }

        public Builder attachments(List<String> attachments) {
            this.attachments = attachments;
            return this;
        }

        public Builder metadata(Map<String, String> metadata) {
            this.metadata = metadata;
            return this;
        }

        public Builder retryCount(int retryCount) {
            this.retryCount = retryCount;
            return this;
        }

        public Builder scheduledAt(LocalDateTime scheduledAt) {
            this.scheduledAt = scheduledAt;
            return this;
        }

        // Terminal method — calls private Notification constructor
        public Notification build() {
            return new Notification(this);
        }
    }
}
```

- If `to` is a setter on Builder:
```java
Notification n = new Notification.Builder()
        .body("Hello")
        .build(); // compiles fine, but 'to' is null — runtime bug
```

- If `to` is in the Builder constructior:
```java
Notification n = new Notification.Builder("user@example.com", "Hello", "EMAIL")
        .build(); // won't even compile without 'to'
```
> Private constructor protects invariants at runtime. Required fields in Builder constructor protect them at compile time. Together they make invalid Notification objects impossible to construct.

