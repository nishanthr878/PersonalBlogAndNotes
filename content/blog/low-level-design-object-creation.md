---
title: "Low Level Design - Object creation design pattern"
date: "2026-08-14"
description: "Low Level Design Deep dive and learing"
tags: ["lld", "java", "design-pattern", "object creation"]
---

So in this we will deep dive into Low level design

| Phase               | Patterns                                             | Project                                                  |
| ------------------- | ---------------------------------------------------- | -------------------------------------------------------- |
| 1 – Object creation | Factory Method, Abstract Factory, Builder, Singleton | **Notification System** (email/SMS/push, multi-provider) |
| 2 – Behavior        | Strategy, Observer, Command, Template Method         | Food Delivery Order Lifecycle                            |
| 3 – Structure       | Decorator, Adapter, Facade, Proxy                    | Payment Gateway Wrapper                                  |
| 4 – Integration     | Chain of Responsibility, State                       | **Support Ticket / Vending Machine**                     |

---------------------------------------------------------------------------------

In this below content we will learn about Object creation design pattern.

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

----

### Factor Method

- If we have to write implementation for `EmailNotifier`, `SmsNotifier`, `PushNotifier`
- Without Factory method, how would the caller decide which one to use

```java
public void sendNotification(Notification notification) {
    if (notification.getChannel().equals("EMAIL")) {
        EmailNotifier notifier = new EmailNotifier();
        notifier.send(notification);
    } else if (notification.getChannel().equals("SMS")) {
        SmsNotifier notifier = new SmsNotifier();
        notifier.send(notification);
    } else if (notification.getChannel().equals("PUSH")) {
        PushNotifier notifier = new PushNotifier();
        notifier.send(notification);
    }
}
```

By implementing above we will run into below problems
- **Open/Closed Violation** - Let's say we want to implement `whatsapp notification` , we have to open the above method and add another `else if conditon`
- **Duplicate implementation** - Let's say we have to send notification `order successful`, `payment successful` so we will duplicating above code in both notification separately.

**Factory Method solves this by**
> Define an interface for creating an object, but let sub classes decide which class to instantiate.

***move the `new` keyword and the if-else into one place, behind an interface.***

```java
package com.lld.notification.notifier;

import com.lld.notification.model.Notification;

public interface Notifier {
    void send(Notification notification);
}
```

```java
package com.lld.notification.notifier;

import com.lld.notification.model.Notification;

public class EmailNotifier implements Notifier {
    @Override
    public void send(Notification notification) {
        System.out.println("[EMAIL] To: " + notification.getTo()
            + " | Subject: " + notification.getSubject()
            + " | Body: " + notification.getBody());
    }
}
```
```java
public class SmsNotifier implements Notifier {
    @Override
    public void send(Notification notification) {
        System.out.println("[SMS] To: " + notification.getTo()
            + " | Body: " + notification.getBody());
    }
}
```
```java
public class PushNotifier implements Notifier {
    @Override
    public void send(Notification notification) {
        System.out.println("[PUSH] To: " + notification.getTo()
            + " | Body: " + notification.getBody());
    }
}
```

```java
package com.lld.notification.factory;

import com.lld.notification.notifier.*;

public class NotifierFactory {

    // Static factory method — caller passes channel, gets back correct Notifier
    public static Notifier getNotifier(String channel) {
        return switch (channel.toUpperCase()) {
            case "EMAIL" -> new EmailNotifier();
            case "SMS"   -> new SmsNotifier();
            case "PUSH"  -> new PushNotifier();
            default -> throw new IllegalArgumentException(
                "Unknown channel: " + channel
            );
        };
    }
} 
```
```java
public void sendNotification(Notification notification) {
    Notifier notifier = NotifierFactory.getNotifier(notification.getChannel());
    notifier.send(notification);
}
```

- for the above approach lets's a system sending 10k+ notification/second, we will be creating a 10k+ object and we will run memory issue to resolve that we have to check if the object is already present, if so we will share the share object if not we will create a new object.

```java
package com.lld.notification.factory;

import com.lld.notification.notifier.EmailNotifier;
import com.lld.notification.notifier.Notifier;
import com.lld.notification.notifier.PushNotifier;
import com.lld.notification.notifier.SmsNotifer;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


public class NotifierFactory {
    private static final Map<String, Notifier> notifierMap = new ConcurrentHashMap<>();
    
    public static Notifier getNotifier(String channel) {
        return notifierMap.computeIfAbsent(channel.toUpperCase(), NotifierFactory::createNotifier);
    }

    private static Notifier createNotifier(String key) {
        return switch (key) {
            case "EMAIL" -> new EmailNotifier();
            case "SMS"   -> new SmsNotifer();
            case "PUSH"  -> new PushNotifier();
            default -> throw new IllegalArgumentException("Unknown channel: " + key);
        };
    }
}

```

- In the above code we are using `ConcurrentHashMap` instead of `HashMap` because if we are running this in spring or spring boot application, we will be having multiple threads which will be creating objects so if two thread want to use a same object we will not be able to do it so we will be using `ConcurrentHashMap` to get thread-safe reads and writes without explicitly looking.

> Any time we have a `static` mutable collection in a multi-threaded environment, 
> `ConcurrentHashMap` over `HashMap`.

> How do we differentiate when to use constructor and when to use Factory
> Use constructor when the caller should know and control exactly what it's creating. Use Factory method when the caller shouldn't care which concrete class it gets - it just needs something that fulfills the contract.

----

## Abstract Factory

- Let's say we have to change the client through which we are sending the notification for example we were using AWS to email notification, if in case we want to change the provider we would need to create a new `AwsEmailNotifier` object or modify the `EmailNotifier` to avoid this we have `Abstract factory`

- Instead of one factory that creates individual notifiers, you have family of factories.
```bash
NotifierFactory (interface)
├── AwsNotifierFactory    → creates AwsEmailNotifier, AwsSmsNotifier, AwsPushNotifier
└── TwilioNotifierFactory → creates TwilioEmailNotifier, TwilioSmsNotifier, TwilioPushNotifier
```

- Building Provider-specific notifier implementation
```java
package com.lld.notification.notifier;

import com.lld.notification.model.Notification;

public class AwsEmailNotifier implements Notifier {
    @Override
    public void send(Notification notification) {
        System.out.println("[AWS SES] Sending email to: " + notification.getTo());
    }
}
```
```java
package com.lld.notification.notifier;

import com.lld.notification.model.Notification;

public class AwsSmsNotifier implements Notifier {
    @Override
    public void send(Notification notification) {
        System.out.println("[AWS SNS] Sending SMS to: " + notification.getTo());
    }
}
```
```java
package com.lld.notification.notifier;

import com.lld.notification.model.Notification;

public class AwsPushNotifier implements Notifier{
    @Override
    public void send(Notification notification) {
        System.out.println("[AWS Pinpoint] Sending push to: " + notification.getTo());
    }
}
```

```java
package com.lld.notification.notifier;

import com.lld.notification.model.Notification;

public class TwilioEmailNotifier implements Notifier{
    @Override
    public void send(Notification notification) {
        System.out.println("[Twilio SendGrid] Sending email to: " + notification.getTo());
    }
}
```
```java
package com.lld.notification.notifier;

import com.lld.notification.model.Notification;

public class TwilioSmsNotifier implements Notifier{
    @Override
    public void send(Notification notification) {
        System.out.println("[Twilio SMS] Sending SMS to: " + notification.getTo());
    }
}
```
```java
package com.lld.notification.notifier;

import com.lld.notification.model.Notification;

public class TwilioPushNotifier implements Notifier{
    @Override
    public void send(Notification notification) {
        System.out.println("[Twilio Push] Sending push to: " + notification.getTo());
    }
}
```
- Abstract Factory Interface
```java
package com.lld.notification.factory;


import com.lld.notification.notifier.Notifier;

public interface NotifierFactory {
   Notifier createEmailNotifier();
   Notifier createSmsNotifier();
   Notifier createPushNotifier();
}
```
```java
package com.lld.notification.factory;

import com.lld.notification.notifier.AwsEmailNotifier;
import com.lld.notification.notifier.AwsPushNotifier;
import com.lld.notification.notifier.AwsSmsNotifier;
import com.lld.notification.notifier.Notifier;

public class AwsNotifierFactory implements NotifierFactory {
    @Override
    public Notifier createEmailNotifier() {
        return new AwsEmailNotifier();
    }

    @Override
    public Notifier createSmsNotifier() {
        return new AwsSmsNotifier();
    }

    @Override
    public Notifier createPushNotifier() {
        return new AwsPushNotifier();
    }
}
```
```java
package com.lld.notification.factory;

import com.lld.notification.notifier.Notifier;
import com.lld.notification.notifier.TwilioEmailNotifier;
import com.lld.notification.notifier.TwilioPushNotifier;
import com.lld.notification.notifier.TwilioSmsNotifier;

public class TwilioNotifierFactory implements NotifierFactory{
    @Override
    public Notifier createEmailNotifier() {
        return new TwilioEmailNotifier();
    }

    @Override
    public Notifier createSmsNotifier() {
        return new TwilioSmsNotifier();
    }

    @Override
    public Notifier createPushNotifier() {
        return new TwilioPushNotifier();
    }
}
```
- service
```java
package com.lld.notification.service;

import com.lld.notification.factory.NotifierFactory;
import com.lld.notification.model.Notification;
import com.lld.notification.notifier.Notifier;

public class NotificationService {
    private final NotifierFactory factory;

    public NotificationService(NotifierFactory factory) {
        this.factory = factory;
    }

    public void send(Notification notification) {
        Notifier notifier = switch (notification.getChannel().toUpperCase()) {
            case "EMAIL" -> factory.createEmailNotifier();
            case "SMS"   -> factory.createSmsNotifier();
            case "PUSH"  -> factory.createPushNotifier();
            default -> throw new IllegalArgumentException("Unknown channel");
        };
        notifier.send(notification);
    }
}
```
- Switching provider is now one line at startup:
```java
// Use AWS
NotificationService service = new NotificationService(new AwsNotifierFactory());

// Switch to Twilio — nothing else changes
NotificationService service = new NotificationService(new TwilioNotifierFactory());
```

The difference between Factory and Abstract factory is
- **Factory method** - creates one type of thing, the caller decides which variant (ex `EMAIL` -> `EmailNotifier`)
- **Abstract Factory** - creates a family of related that are designed to work together (`AwsFactory` -> `AwsEmail` + `AwsSMS` + `AwsPush)
> **Factory Method:** "Give me the right notifier for this channel."  
> **Abstract Factory:** "Give me a full set of notifiers that all belong to the same provider."


----

### Singleton

- `NotificationFactory` has a `Static` map. That's already behaving singleton-like-one shared instance of the map across all calls.
- but the difference with `static` and singleton is `static` is just data but Singleton is class so we can do below things using singleton
	- *Implement interfaces* 
	- Be injected as a dependency
	- Be lazily initialized
	- Hold state and behavior together

with pure static fields:
```java
// can't do this — can't pass a "static config" as a dependency
public NotificationService(NotificationConfig config) { ... }

// can't do this — can't mock static fields in unit tests
NotificationConfig.apiKey = "fake-key"; // dirty, global state
```
with singleton:
```java
// clean dependency injection
public NotificationService(NotificationConfig config) {
    this.config = config;
}

// mockable in tests
NotificationConfig mockConfig = mock(NotificationConfig.class);
```

Singleton implementation
```java
package com.lld.notification.config;

public class NotificationConfig {
    
    // volatile - eunsures visibility across threads
    private static volatile NotificationConfig instance;
    
    private String awsRegion;
    private String twilioAccountSid;
    private String defaultChannel;
    private int maxRetryCount;
    
    // private constructor - no one can cal new NotificationConfig()
    private NotificationConfig() {
        this.awsRegion = "ap-south-1";
        this.twilioAccountSid = "AC-DUMMY-SID";
        this.defaultChannel = "EMAIL";
        this.maxRetryCount = 3;
    }
    
    public static NotificationConfig getInstance() {
        if (instance == null) {
            synchronized (NotificationConfig.class) {
                if (instance == null) {
                    instance = new NotificationConfig();
                }
            }
        }
        return instance;
    }
    
    public String getAwsRegion() {
        return awsRegion;
    }
    public String getTwilioAccountSid() {
        return twilioAccountSid;
    }
    public String getDefaultChannel() {
        return defaultChannel;
    }
    public int getMaxRetryCount() {
        return maxRetryCount;
    }
}
```

> Why `volatile`?
> Without it, due to CPU instruction reordering, another thread could see `instance` as non-null before the constructor has finished running - and get a half-initialized object. `volatile` prevents that by ensuring writes are visible to all thread immediately 


> ***Double-checked locking***
> Why check `instance == null` twice?
> - First check (outside `sychronized`) - avoids locking on every call once initialized. Lock acquisition is expensive at scale
> - Second check (inside `synchronized`) - two threads could both pass the first check simultaneously. The inner check ensures only one of them actually creates the instance.

Wiring them all to-gether
```java
package com.lld.notification;

import com.lld.notification.config.NotificationConfig;
import com.lld.notification.factory.AwsNotifierFactory;
import com.lld.notification.factory.NotifierFactory;
import com.lld.notification.factory.TwilioNotifierFactory;
import com.lld.notification.model.Notification;
import com.lld.notification.service.NotificationService;

public class Main {
    public static void main(String[] args) {

        // Singleton config
        NotificationConfig config = NotificationConfig.getInstance();
        System.out.println("Config loaded. Region: " + config.getAwsRegion());

        // Build notifications using Builder
        Notification emailNotif = new Notification.Builder(
                "user@example.com", "Your order has been placed", "EMAIL")
                .subject("Order Confirmation")
                .priority(1)
                .retryCount(config.getMaxRetryCount())
                .build();

        Notification smsNotif = new Notification.Builder(
                "+919876543210", "Your OTP is 4521", "SMS")
                .priority(1)
                .build();

        // Use AWS factory
        System.out.println("\n--- AWS Provider ---");
        NotifierFactory awsFactory = new AwsNotifierFactory();
        NotificationService awsService = new NotificationService(awsFactory);
        awsService.send(emailNotif);
        awsService.send(smsNotif);

        // Switch to Twilio — zero other changes
        System.out.println("\n--- Twilio Provider ---");
        NotifierFactory twilioFactory = new TwilioNotifierFactory();
        NotificationService twilioService = new NotificationService(twilioFactory);
        twilioService.send(emailNotif);
        twilioService.send(smsNotif);
    }
}
```
```bash
Config loaded. Region ap-south-1

--- AWS Provider ----
[AWS SES] Sending email to: user@example.com
[AWS SNS] Sending SMS to: +919876543210

--- Twilio Provider ----
[Twilio SendGrid] Sending email to: user@example.com
[Twilio SMS] Sending SMS to: +919876543210
```

| Pattern          | Where                                         | What it solved                                              |
| ---------------- | --------------------------------------------- | ----------------------------------------------------------- |
| Builder          | `Notification`                                | Constructed complex object without telescoping constructors |
| Factory Method   | `NotifierFactory`                             | Centralized notifier creation, eliminated scattered if-else |
| Abstract Factory | `AwsNotifierFactory`, `TwilioNotifierFactory` | Swapped provider families without touching existing code    |
| Singleton        | `NotificationConfig`                          | One shared config instance, thread-safe, injectable         |
