---
title: Spring Start Here Notes (Chapters 1-10)
date: 2026-03-16
description: Textbook-style study notes covering Spring fundamentals through Spring Boot.
tags:
  - spring
  - java
  - spring-boot
  - backend
  - notes
draft: false
---
#java
Perfect. Then here’s what I’ll do:

I’ll turn your _Spring Start Here_ annotations into a **full textbook-style document**, with clear chapters, detailed theory, examples, and summaries — formatted for deep understanding and long-term study.

Here’s the chapter plan I’ll follow (based on your file):

---

### **SPRING START HERE – COMPLETE STUDY NOTES (TEXTBOOK STYLE)**

by Laurentiu Spilca, compiled & expanded by Nishanth R

---

#### **CHAPTER 1: Introduction to Spring Framework**

- What is Spring?
    
- The Problem Spring Solves
    
- Inversion of Control (IoC) Principle
    
- Dependency Injection (DI) Overview
    
- Example: Simple Java App vs Spring IoC-managed App
    

#### **CHAPTER 2: Configuring Spring Applications**

- Application Context & Beans
    
- Using `@Configuration` and `@Bean`
    
- Example: Defining Beans with `@Bean`
    
- Bean Naming and Aliases
    
- Programmatic Bean Registration
    
- Comparison: `@Bean` vs Stereotype Annotations (`@Component`, `@Service`, etc.)
    

#### **CHAPTER 3: Dependency Injection in Detail**

- Constructor Injection
    
- Setter Injection
    
- Field Injection (and why to avoid it)
    
- Using `@Autowired` and `@Qualifier`
    
- Using Interfaces for Abstraction
    
- Example: Wiring Beans with `@Autowired`
    
- Circular Dependencies – Why They Break Apps
    

#### **CHAPTER 4: Bean Scopes and Lifecycle**

- Singleton and Prototype Scopes
    
- Lazy vs Eager Initialization (`@Lazy`)
    
- Thread Safety and Immutability
    
- Web Scopes: Request, Session, Application
    
- Example: Request vs Session Scoped Bean
    
- Common Pitfalls (Race Conditions, Memory Leaks)
    

#### **CHAPTER 5: Aspects and Cross-Cutting Concerns (AOP)**

- What Are Aspects?
    
- Pointcut, Join Point, Advice
    
- Defining Aspects with `@Aspect`
    
- Example: Logging Aspect using `@Around` and `@ToLog`
    
- Advice Types: `@Before`, `@After`, `@AfterReturning`, `@AfterThrowing`
    
- Using `@Order` to Manage Aspect Priority
    
- Real-World Use Cases (Logging, Transactions, Security)
    

#### **CHAPTER 6: Spring MVC and Web Applications**

- Overview of Spring MVC Architecture
    
- DispatcherServlet Flow
    
- Defining Controllers with `@Controller` and `@RequestMapping`
    
- Example: Basic MVC Controller with Thymeleaf
    
- Request Parameters and Path Variables
    
- HTTP Methods in REST (GET, POST, PUT, DELETE, PATCH)
    
- Example: REST Controller using `@RestController`
    
- Returning Data with `ResponseEntity`
    
- Exception Handling with `@ExceptionHandler`
    

#### **CHAPTER 7: Working with REST Clients**

- REST Communication Basics
    
- Using `RestTemplate`, `WebClient`, and `OpenFeign`
    
- Example: Consuming an API using `WebClient`
    
- Handling Headers, Request Bodies, and Responses
    
- Reactive vs Non-Reactive REST Clients
    

#### **CHAPTER 8: Database Access with Spring**

- JDBC, DataSource, and Connection Pools (HikariCP)
    
- Working with `JdbcTemplate`
    
- Example: CRUD Operations using JdbcTemplate
    
- Transactions and `@Transactional` Annotation
    
- RowMapper and Mapping Results
    
- Example: Account Transfer with Transaction Rollback
    

#### **CHAPTER 9: Spring Data**

- Why Use Spring Data?
    
- Repository Interfaces (`CrudRepository`, `JpaRepository`, etc.)
    
- Example: Defining a Repository and Custom Query
    
- Using `@Query` and `@Modifying`
    
- `@Transactional` Behavior in Spring Data
    
- Avoiding Pitfalls with Derived Query Methods
    

#### **CHAPTER 10: Testing in Spring**

- Unit vs Integration Tests
    
- Writing Unit Tests with Mocks
    
- Example: Unit Test for Service with Mockito
    
- Integration Tests using `@SpringBootTest`
    
- Using `@MockBean` and `@ExtendWith(SpringExtension.class)`
    
- Continuous Integration & Automation
    

#### **CHAPTER 11: Spring Boot & Autoconfiguration**

- What is Spring Boot
    
- Dependency Starters
    
- Auto Configuration and `@SpringBootApplication`
    
- Embedded Servlet Containers
    
- Custom Configuration and Profiles
    
- Example: Running Your First Boot App
    

#### **CHAPTER 12: Security & Best Practices**

- Introduction to Spring Security
    
- Managing Sensitive Data (Passwords, Secrets)
    
- Stateless vs Stateful Design
    
- Avoiding Concurrency Issues
    
- Recommendations for Production
    

---

Would you like me to **start generating Chapter 1** (“Introduction to Spring Framework”) now in full textbook detail with code examples and explanations?  
It’ll read like a real book chapter — clean, complete, and example-driven.


Good. Let’s begin with Chapter 1 — and no, this won’t be a “feel-good” overview. You’re getting the full conceptual breakdown with reasoning and code so you actually understand what’s happening under Spring’s hood.

---

## **CHAPTER 1 — INTRODUCTION TO THE SPRING FRAMEWORK**

### 1.1 Why Spring Exists

Early Java applications were a mess of manually created objects. Every class constructed its own dependencies and hard-wired them together, which meant:

- **Zero flexibility:** You had to rewrite code to swap an implementation.
    
- **No testability:** You couldn’t isolate components without rewriting constructors.
    
- **Brittle architecture:** Changing one class broke five others.
    

Spring was designed to fix this by introducing **Inversion of Control (IoC)** — a simple but radical idea: the framework, not your code, controls object creation and wiring.

---

### 1.2 Inversion of Control (IoC)

**Traditional control flow**

```java
public class InvoiceService {
    private final EmailService emailService = new EmailService();

    public void sendInvoice() {
        emailService.send("invoice.pdf");
    }
}
```

Here, `InvoiceService` creates its own `EmailService`. You can’t replace it with a mock or a different implementation.

**IoC flow**

```java
public class InvoiceService {
    private final EmailService emailService;

    public InvoiceService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void sendInvoice() {
        emailService.send("invoice.pdf");
    }
}
```

Now, someone else decides _which_ `EmailService` to use. That “someone else” is Spring’s **IoC container**.

---

### 1.3 The Spring IoC Container

The container is the brain of a Spring application. It:

1. Instantiates objects (called **beans**)
    
2. Resolves dependencies among them
    
3. Manages their lifecycle (creation, initialization, destruction)
    

Think of it as a registry or a map:

```
Bean name  →  Bean instance
```

Whenever your code asks for a dependency, the container supplies it.

---

### 1.4 Dependency Injection (DI)

IoC is the principle; **Dependency Injection** is the concrete mechanism Spring uses to implement it.  
Instead of classes looking up their dependencies, Spring _injects_ them by:

- **Constructor injection** — preferred for mandatory dependencies
    
- **Setter injection** — optional dependencies
    
- **Field injection** — avoid in serious projects (harder to test and mock)
    

**Example**

```java
@Component
public class EmailService {
    public void send(String message) {
        System.out.println("Sending: " + message);
    }
}

@Component
public class InvoiceService {
    private final EmailService emailService;

    @Autowired
    public InvoiceService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void sendInvoice() {
        emailService.send("Invoice sent");
    }
}
```

When the application starts, Spring detects both components, creates them, and injects `EmailService` into `InvoiceService` automatically.

---

### 1.5 How Spring Knows What to Manage

Spring needs configuration telling it _which_ classes to treat as beans.

#### **1.5.1 Annotation-based configuration**

```java
@Configuration
@ComponentScan("com.company.billing")
public class AppConfig {
}
```

- `@Configuration` marks a class that defines bean setup.
    
- `@ComponentScan` tells Spring where to look for `@Component`, `@Service`, `@Repository`, and `@Controller` classes.
    

#### **1.5.2 Java-based bean definition**

```java
@Configuration
public class BeanConfig {

    @Bean
    public EmailService emailService() {
        return new EmailService();
    }

    @Bean
    public InvoiceService invoiceService(EmailService emailService) {
        return new InvoiceService(emailService);
    }
}
```

Each `@Bean` method returns an object to be managed by the IoC container.

---

### 1.6 Creating and Using the Context

```java
public class Main {
    public static void main(String[] args) {
        try (AnnotationConfigApplicationContext context =
                     new AnnotationConfigApplicationContext(BeanConfig.class)) {

            InvoiceService invoiceService = context.getBean(InvoiceService.class);
            invoiceService.sendInvoice();
        }
    }
}
```

`AnnotationConfigApplicationContext` loads the configuration, builds the beans, resolves dependencies, and runs the application.

---

### 1.7 Advantages of IoC and DI

|Problem Without IoC|Solved By Spring|
|---|---|
|Tight coupling between classes|Dependencies are injected via interfaces|
|Hard to test|You can inject mocks or stubs|
|Complex object creation|Centralized in configuration|
|Lifecycle management|Spring handles it automatically|

---

### 1.8 Common Pitfalls

1. **Circular dependencies:**  
    Two beans depend on each other. Spring throws `BeanCurrentlyInCreationException`.  
    Fix it by redesigning or introducing an interface boundary.
    
2. **Using field injection:**  
    Makes testing painful. Constructor injection is always safer.
    
3. **Overusing configuration:**  
    Don’t add every object to the context — only those that need Spring features.
    

---

### 1.9 Mini Project — IoC and DI in Action

**Goal:** Create a small greeting application using Spring’s IoC container.

**Step 1:** Define components

```java
@Component
public class MessageService {
    public String getMessage() {
        return "Hello from Spring!";
    }
}
```

**Step 2:** Inject dependency

```java
@Component
public class GreetingApp {
    private final MessageService messageService;

    @Autowired
    public GreetingApp(MessageService messageService) {
        this.messageService = messageService;
    }

    public void greet() {
        System.out.println(messageService.getMessage());
    }
}
```

**Step 3:** Run the context

```java
@Configuration
@ComponentScan("com.example")
public class AppConfig { }

public class Main {
    public static void main(String[] args) {
        try (AnnotationConfigApplicationContext context =
                     new AnnotationConfigApplicationContext(AppConfig.class)) {

            GreetingApp app = context.getBean(GreetingApp.class);
            app.greet();
        }
    }
}
```

**Output**

```
Hello from Spring!
```

---

### 1.10 Summary

- **IoC**: Framework controls object creation instead of user code.
    
- **DI**: Mechanism by which Spring provides dependencies.
    
- **Bean**: Any object managed by Spring.
    
- **ApplicationContext**: Core container managing all beans.
    
- **`@Configuration` + `@Bean` or `@Component` + `@ComponentScan`**: Two main ways to define beans.
    
- **Use constructor injection** to ensure immutability and testability.
    

---

That’s Chapter 1 done.  
Next up is **Chapter 2 — Configuring Spring Applications**, where we’ll dissect the `@Configuration`, `@Bean`, and `@Component` machinery in depth, explain how naming, aliasing, and bean registration work, and build examples that show how Spring decides what goes into its context.  
Want me to start that next?


Good. Let’s get into the guts of **configuration** — the part everyone glosses over until their app mysteriously can’t find a bean at runtime.

---

## **CHAPTER 2 — CONFIGURING SPRING APPLICATIONS**

### 2.1 What Configuration Really Means

“Configuration” in Spring isn’t about XML anymore. It’s the process of telling the framework **which objects to manage**, **how they relate**, and **what rules apply to their lifecycle**.

Spring needs two types of information:

1. **Where to look for components**
    
2. **What additional beans or settings to create manually**
    

You can provide this via:

- Java configuration (`@Configuration`, `@Bean`)
    
- Annotation scanning (`@ComponentScan`)
    
- Optional extras: XML, YAML, or programmatic registration (for masochists)
    

---

### 2.2 The Application Context

When you start a Spring app, the framework creates an **ApplicationContext**, which acts as a registry of beans.

Think of it like a warehouse: you hand it a configuration blueprint, and it builds and shelves all your objects for later retrieval.

```java
AnnotationConfigApplicationContext context =
        new AnnotationConfigApplicationContext(AppConfig.class);

MyService service = context.getBean(MyService.class);
```

Here, `AppConfig` defines what the warehouse should stock.

---

### 2.3 Defining Configuration Classes

A configuration class tells Spring how to set up the context.

```java
@Configuration
public class AppConfig {
    // beans go here
}
```

- `@Configuration` marks this class as a source of bean definitions.
    
- The framework processes it when building the context.
    

**Important:** A `@Configuration` class is itself a Spring-managed bean.  
You can inject it elsewhere if needed (rarely useful, but possible).

---

### 2.4 Defining Beans with `@Bean`

A `@Bean` method produces an object that Spring adds to its container.

```java
@Configuration
public class BeanConfig {

    @Bean
    public Parrot parrot() {
        Parrot p = new Parrot();
        p.setName("Miki");
        return p;
    }
}
```

When the context initializes, Spring calls this method once, stores the returned instance, and manages it as a bean.

You can retrieve it later:

```java
Parrot parrot = context.getBean(Parrot.class);
System.out.println(parrot.getName());  // Miki
```

---

### 2.5 Bean Naming and Aliases

By default, the bean’s name is the method name (`parrot`).  
But you can specify a custom name:

```java
@Bean("bird")
public Parrot parrot() {
    return new Parrot("Miki");
}
```

Now, `context.getBean("bird", Parrot.class)` works.

Multiple names (aliases) are also allowed:

```java
@Bean({"bird", "featheredFriend"})
public Parrot parrot() { ... }
```

---

### 2.6 Linking Beans Inside Configuration

You can create relationships between beans by **calling methods** or by **using parameters**.

#### **Option 1: Method Call Wiring**

```java
@Bean
public Person person() {
    Person p = new Person();
    p.setParrot(parrot()); // calls the @Bean method
    return p;
}
```

Spring is smart enough to realize you’re referring to the `parrot` bean in the context, not creating a new object.

#### **Option 2: Parameter Injection**

```java
@Bean
public Person person(Parrot parrot) {
    return new Person("John", parrot);
}
```

Spring automatically finds the `Parrot` bean and injects it as the parameter.

This is cleaner, avoids circular calls, and is preferred.

---

### 2.7 Stereotype Annotations: The Cleaner Approach

Annotating every bean with `@Bean` gets tedious.  
For application classes, use **stereotype annotations** — they tell Spring, “Hey, make a bean out of this.”

|Annotation|Purpose|
|---|---|
|`@Component`|Generic Spring-managed component|
|`@Service`|Marks a service layer class|
|`@Repository`|Marks a data access object (DAO)|
|`@Controller`|Marks a web controller|
|`@RestController`|Marks a REST API controller (returns JSON directly)|

Example:

```java
@Component
public class Parrot {
    private String name = "Miki";
}
```

Now you don’t need to write `@Bean` for it — just tell Spring where to look.

---

### 2.8 Component Scanning

Spring doesn’t magically know where your annotated classes live. You must specify the base package(s):

```java
@Configuration
@ComponentScan("com.example.zoo")
public class AppConfig { }
```

When the context loads, Spring scans `com.example.zoo` for `@Component`, `@Service`, etc., and registers those as beans.

You can specify multiple packages:

```java
@ComponentScan({"com.example.zoo", "com.example.staff"})
```

---

### 2.9 The `@Primary` and `@Qualifier` Annotations

If multiple beans share the same type, Spring doesn’t know which one to inject.  
You can guide it:

**Use `@Primary` to mark a default choice:**

```java
@Bean
@Primary
public Parrot parrot1() { return new Parrot("Miki"); }

@Bean
public Parrot parrot2() { return new Parrot("Kiki"); }
```

Spring injects `parrot1` unless told otherwise.

**Use `@Qualifier` to pick a specific one:**

```java
@Bean
public Person person(@Qualifier("parrot2") Parrot parrot) {
    return new Person("John", parrot);
}
```

---

### 2.10 Lifecycle Management with `@PostConstruct` and `@PreDestroy`

Spring can run code at specific moments in a bean’s lifecycle.

```java
@Component
public class Parrot {
    @PostConstruct
    void init() {
        System.out.println("Parrot ready for action!");
    }

    @PreDestroy
    void cleanup() {
        System.out.println("Parrot signing off...");
    }
}
```

When the context starts, `init()` runs.  
When the context closes, `cleanup()` runs.

---

### 2.11 Programmatic Bean Registration

Since Spring 5, you can register beans dynamically:

```java
context.registerBean("customBean", MyClass.class, MyClass::new);
```

You’ll rarely need this, but it’s powerful when you build frameworks or dynamic configurations.

---

### 2.12 Example — Wiring Components Together

Let’s build a tiny app showing both `@Component` and `@Configuration` styles.

**Parrot.java**

```java
@Component
public class Parrot {
    private String name = "Miki";

    public String getName() { return name; }
}
```

**Person.java**

```java
@Component
public class Person {
    private final Parrot parrot;

    @Autowired
    public Person(Parrot parrot) {
        this.parrot = parrot;
    }

    public void introduce() {
        System.out.println("My parrot is " + parrot.getName());
    }
}
```

**AppConfig.java**

```java
@Configuration
@ComponentScan("com.example")
public class AppConfig { }
```

**Main.java**

```java
public class Main {
    public static void main(String[] args) {
        try (AnnotationConfigApplicationContext context =
                     new AnnotationConfigApplicationContext(AppConfig.class)) {
            Person person = context.getBean(Person.class);
            person.introduce();
        }
    }
}
```

**Output**

```
My parrot is Miki
```

---

### 2.13 Key Takeaways

|Concept|Description|
|---|---|
|`@Configuration`|Marks class as a Spring config source|
|`@Bean`|Creates a bean manually|
|`@Component`, `@Service`, etc.|Automatically detected beans|
|`@ComponentScan`|Tells Spring where to look for annotated classes|
|`@Primary`|Marks one bean as default when multiple exist|
|`@Qualifier`|Chooses a specific bean by name|
|`@PostConstruct` / `@PreDestroy`|Hooks for init and destroy logic|

---

### 2.14 Practical Advice

- Use **`@Bean`** for third-party or library objects you can’t annotate.
    
- Use **stereotype annotations** for your own application classes.
    
- Prefer **constructor injection** over field or setter injection.
    
- Keep configuration minimal — avoid “bean soup” (dozens of definitions in one file).
    
- If Spring complains it can’t find a bean, 90% of the time you messed up `@ComponentScan`.
    

---

Next chapter digs into the **engine room of DI itself** — constructor vs setter injection, abstraction-based wiring, circular dependencies, and real-world patterns for structuring services and repositories.

Ready to proceed to **Chapter 3 — Dependency Injection in Detail**?

Alright, Chapter 3 — Dependency Injection in Detail.  
This is where most people _think_ they know what’s going on, but Spring’s actual wiring behavior quietly wrecks their understanding. Let’s fix that properly.

---

## **CHAPTER 3 — DEPENDENCY INJECTION IN DETAIL**

### 3.1 Why Dependency Injection Exists

Dependency Injection (DI) enforces **inversion of control** by removing the “new” keyword from your codebase. You no longer construct dependencies — you declare them, and Spring provides them.

Without DI:

```java
public class OrderService {
    private final EmailService emailService = new EmailService();
}
```

With DI:

```java
public class OrderService {
    private final EmailService emailService;

    @Autowired
    public OrderService(EmailService emailService) {
        this.emailService = emailService;
    }
}
```

Now, Spring’s IoC container decides _what_ EmailService to inject. This makes testing, maintenance, and configuration far easier.

---

### 3.2 Types of Dependency Injection

There are three main styles. You should know them all, but only one deserves regular use.

#### **1. Constructor Injection (preferred)**

Dependencies are passed through the constructor.

```java
@Component
public class UserService {
    private final NotificationService notificationService;

    @Autowired
    public UserService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
}
```

Advantages:

- Makes dependencies explicit
    
- Guarantees immutability (you can’t change injected dependencies later)
    
- Perfect for unit testing
    

---

#### **2. Setter Injection**

Dependencies are passed through setters.

```java
@Component
public class UserService {
    private NotificationService notificationService;

    @Autowired
    public void setNotificationService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
}
```

Use it **only** for optional dependencies that can be omitted.  
Otherwise, it allows partially constructed objects, which is a recipe for runtime errors.

---

#### **3. Field Injection (avoid)**

Directly injects into a class field.

```java
@Component
public class UserService {
    @Autowired
    private NotificationService notificationService;
}
```

Convenient but dirty.  
Why? You can’t inject mocks easily during testing, and it breaks immutability. It’s also invisible to anyone reading your constructor which dependencies this class relies on.

---

### 3.3 How Spring Resolves Dependencies

When Spring starts, it builds a dependency graph:

- It scans for all beans
    
- Finds dependencies for each bean
    
- Matches them by **type**, then **name** (if qualifiers are used)
    

If Spring finds exactly one matching bean, it injects it automatically.  
If there are multiple candidates, you’ll get an exception — unless you specify a qualifier or a primary bean.

---

### 3.4 Example — Automatic Wiring

**NotificationService.java**

```java
@Component
public class NotificationService {
    public void notifyUser(String msg) {
        System.out.println("Sending notification: " + msg);
    }
}
```

**UserService.java**

```java
@Component
public class UserService {
    private final NotificationService notificationService;

    @Autowired
    public UserService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    public void register(String user) {
        System.out.println(user + " registered!");
        notificationService.notifyUser("Welcome " + user);
    }
}
```

**AppConfig.java**

```java
@Configuration
@ComponentScan("com.example")
public class AppConfig { }
```

**Main.java**

```java
public class Main {
    public static void main(String[] args) {
        try (AnnotationConfigApplicationContext context =
                     new AnnotationConfigApplicationContext(AppConfig.class)) {

            UserService userService = context.getBean(UserService.class);
            userService.register("Nishanth");
        }
    }
}
```

**Output**

```
Nishanth registered!
Sending notification: Welcome Nishanth
```

Spring created both beans, noticed that `UserService` depends on `NotificationService`, and injected it automatically.

---

### 3.5 Interface-Based Injection

Interfaces are your escape hatch for flexibility. Inject the interface, not the implementation.

```java
public interface PaymentProcessor {
    void process(double amount);
}

@Component
public class CreditCardProcessor implements PaymentProcessor {
    public void process(double amount) {
        System.out.println("Processing credit card payment of $" + amount);
    }
}
```

Now your service depends only on the interface:

```java
@Component
public class PaymentService {
    private final PaymentProcessor processor;

    @Autowired
    public PaymentService(PaymentProcessor processor) {
        this.processor = processor;
    }

    public void pay(double amount) {
        processor.process(amount);
    }
}
```

You can easily replace `CreditCardProcessor` with another implementation later — or a mock during testing — without touching `PaymentService`.

---

### 3.6 Handling Multiple Beans of the Same Type

If you define multiple beans of the same type, Spring needs a hint.

```java
@Component("creditCardProcessor")
public class CreditCardProcessor implements PaymentProcessor { ... }

@Component("paypalProcessor")
public class PayPalProcessor implements PaymentProcessor { ... }
```

Now in your service:

```java
@Autowired
@Qualifier("paypalProcessor")
private PaymentProcessor processor;
```

If you omit `@Qualifier`, and both beans exist, Spring throws an error:

```
NoUniqueBeanDefinitionException
```

To avoid repeating `@Qualifier`, you can mark one as `@Primary`.

```java
@Component
@Primary
public class CreditCardProcessor implements PaymentProcessor { ... }
```

---

### 3.7 Optional Dependencies

Sometimes you need a dependency only if it’s available. Use `Optional<>` or `@Autowired(required = false)`.

```java
@Autowired(required = false)
private AuditService auditService;
```

Or better:

```java
@Autowired
private Optional<AuditService> auditService;
```

Cleaner, null-safe, and avoids exceptions if the bean isn’t present.

---

### 3.8 Circular Dependencies

A **circular dependency** occurs when two beans depend on each other.

```java
@Component
public class A {
    @Autowired
    private B b;
}

@Component
public class B {
    @Autowired
    private A a;
}
```

When Spring tries to create `A`, it needs `B`, which needs `A` again — deadlock.  
Spring detects it and throws a `BeanCurrentlyInCreationException`.

**Fix it:**

- Rethink design (one should depend on an interface or event listener).
    
- Use `@Lazy` injection for rare cases.
    

```java
@Component
public class B {
    @Autowired
    @Lazy
    private A a;
}
```

Now `A` is created later, breaking the circular loop.

---

### 3.9 Using Profiles to Switch Beans

You can define beans for different environments (dev, test, prod).

```java
@Component
@Profile("dev")
public class LocalDatabase implements Database { ... }

@Component
@Profile("prod")
public class CloudDatabase implements Database { ... }
```

Activate the profile:

```bash
-Dspring.profiles.active=prod
```

Spring loads only the beans matching that profile. Perfect for environment-based wiring.

---

### 3.10 Practical Example — Multiple Payment Strategies

#### **PaymentProcessor.java**

```java
public interface PaymentProcessor {
    void process(double amount);
}
```

#### **CreditCardProcessor.java**

```java
@Component("credit")
public class CreditCardProcessor implements PaymentProcessor {
    public void process(double amount) {
        System.out.println("Paid $" + amount + " via Credit Card");
    }
}
```

#### **UPIProcessor.java**

```java
@Component("upi")
public class UPIProcessor implements PaymentProcessor {
    public void process(double amount) {
        System.out.println("Paid $" + amount + " via UPI");
    }
}
```

#### **PaymentService.java**

```java
@Component
public class PaymentService {
    private final PaymentProcessor processor;

    @Autowired
    public PaymentService(@Qualifier("upi") PaymentProcessor processor) {
        this.processor = processor;
    }

    public void makePayment(double amount) {
        processor.process(amount);
    }
}
```

**Output**

```
Paid $250.0 via UPI
```

---

### 3.11 Testing with Mocked Dependencies

You can inject mocks manually or use Spring Boot’s `@MockBean` in tests.

```java
@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = AppConfig.class)
public class PaymentServiceTest {

    @MockBean
    private PaymentProcessor mockProcessor;

    @Autowired
    private PaymentService paymentService;

    @Test
    void testMakePayment() {
        paymentService.makePayment(100.0);
        verify(mockProcessor).process(100.0);
    }
}
```

Spring replaces the real bean with the mock automatically.

---

### 3.12 Summary

|Type|Description|Recommended Use|
|---|---|---|
|Constructor Injection|Dependencies passed via constructor|Always preferred|
|Setter Injection|Dependencies passed via setter|Optional dependencies|
|Field Injection|Direct field assignment|Avoid|
|`@Qualifier`|Select between multiple beans|When multiple same-type beans exist|
|`@Primary`|Marks default bean|When one bean should be default|
|`@Lazy`|Delays bean creation|Break circular dependencies|
|`@Profile`|Conditional bean creation|Environment-based configs|

---

### 3.13 Core Principles to Remember

1. **Never hide dependencies.** Every dependency must be visible in the constructor.
    
2. **Interfaces over implementations.** This keeps your code flexible and testable.
    
3. **Spring doesn’t inject nulls — you do.** If you see `NullPointerException`, check your context wiring.
    
4. **Circular dependencies mean poor design.** Re-evaluate your architecture.
    
5. **One bean = one responsibility.** Avoid “god beans” that depend on everything.
    

---

Next up: **Chapter 4 — Bean Scopes and Lifecycle.**  
That’s where you’ll learn what “singleton,” “prototype,” “request,” and “session” beans actually do, how Spring keeps them alive or kills them, and how to hook into their lifecycle with precision. Proceed?

Good. Now we get to the part most developers misunderstand until production crashes due to “random” state corruption — **bean scopes and lifecycle**.  
Spring does more under the hood here than you’d expect. Let’s unpack it properly.

---

## **CHAPTER 4 — BEAN SCOPES AND LIFECYCLE**

### 4.1 What a “Bean Scope” Actually Means

Scope defines **how many instances** of a bean Spring creates and **how long** they live.

When you declare a bean, Spring decides:

1. Whether to create it once or multiple times
    
2. Whether to share it across threads, requests, or sessions
    
3. When to destroy it
    

By default, everything in Spring is a **singleton**, but that’s not the whole story.

---

### 4.2 The Six Main Scopes

|Scope|Description|Typical Use|
|---|---|---|
|**singleton**|One instance for the entire Spring container|Stateless service or utility beans|
|**prototype**|New instance every time it’s requested|Stateful objects, short-lived components|
|**request**|One instance per HTTP request|Web layer beans holding request data|
|**session**|One instance per HTTP session|Web beans storing user session info|
|**application**|One instance per ServletContext|Shared data for the whole app|
|**websocket**|One instance per WebSocket session|Real-time communication|

---

### 4.3 Singleton Scope (the Default)

A singleton bean is created **once per container** and shared across all requests and threads.

```java
@Component
public class SingletonBean {
    public SingletonBean() {
        System.out.println("Singleton created!");
    }
}
```

```java
@Configuration
@ComponentScan("com.example")
public class AppConfig { }
```

```java
public class Main {
    public static void main(String[] args) {
        try (var context = new AnnotationConfigApplicationContext(AppConfig.class)) {
            SingletonBean a = context.getBean(SingletonBean.class);
            SingletonBean b = context.getBean(SingletonBean.class);
            System.out.println(a == b); // true
        }
    }
}
```

**Output**

```
Singleton created!
true
```

One instance reused everywhere. Perfect for stateless services.  
Don’t store mutable state here — you’ll create multi-threading nightmares.

---

### 4.4 Prototype Scope

A prototype bean gets created every time you ask for it.

```java
@Component
@Scope("prototype")
public class PrototypeBean {
    public PrototypeBean() {
        System.out.println("Prototype created!");
    }
}
```

```java
PrototypeBean a = context.getBean(PrototypeBean.class);
PrototypeBean b = context.getBean(PrototypeBean.class);
System.out.println(a == b); // false
```

**Output**

```
Prototype created!
Prototype created!
false
```

Spring creates a new instance on each call.  
Useful for objects that maintain state — for example, a temporary calculation or a request-bound context.

**Caution:** Spring does _not_ manage prototype beans after creation. You handle their cleanup.

---

### 4.5 Lazy vs Eager Initialization

By default, singleton beans are created **eagerly** — when the context starts.

To delay creation until the bean is first requested, use `@Lazy`.

```java
@Component
@Lazy
public class ExpensiveService {
    public ExpensiveService() {
        System.out.println("Initialized only when needed");
    }
}
```

This saves startup time but trades it for a slight delay on first use.

---

### 4.6 Lifecycle Overview

A Spring bean goes through these phases:

1. **Instantiation** – Object created
    
2. **Dependency Injection** – Dependencies injected
    
3. **Initialization** – Custom logic runs
    
4. **Usage** – Bean used by application
    
5. **Destruction** – Clean-up before shutdown
    

You can hook into initialization and destruction phases.

---

### 4.7 Using `@PostConstruct` and `@PreDestroy`

Annotate methods to run at key lifecycle moments.

```java
@Component
public class DatabaseConnection {
    @PostConstruct
    void connect() {
        System.out.println("Connecting to database...");
    }

    @PreDestroy
    void disconnect() {
        System.out.println("Closing database connection...");
    }
}
```

**Output**

```
Connecting to database...
Closing database connection...
```

These hooks are called automatically when the context starts and closes.  
Spring handles cleanup for singletons, but not for prototypes — those are your responsibility.

---

### 4.8 Implementing `InitializingBean` and `DisposableBean`

If you prefer interfaces (or you’re writing framework code), implement Spring’s lifecycle interfaces.

```java
@Component
public class FileManager implements InitializingBean, DisposableBean {

    public void afterPropertiesSet() {
        System.out.println("FileManager initialized");
    }

    public void destroy() {
        System.out.println("FileManager destroyed");
    }
}
```

Functionally identical to `@PostConstruct` and `@PreDestroy`, but less elegant.

---

### 4.9 Custom Init and Destroy Methods

You can specify custom lifecycle methods directly in configuration.

```java
@Bean(initMethod = "init", destroyMethod = "cleanup")
public Cache cache() {
    return new Cache();
}
```

Spring calls `cache.init()` after creation and `cache.cleanup()` at shutdown.

This is useful when you can’t modify the source class (e.g., third-party libs).

---

### 4.10 Scopes in Web Applications

If you’re building a web app (Spring MVC or Boot), Spring Web provides extra scopes.

- `request`: one bean per HTTP request
    
- `session`: one bean per user session
    
- `application`: one bean per servlet context
    
- `websocket`: one bean per WebSocket connection
    

Example:

```java
@Component
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestTracker {
    private final String id = UUID.randomUUID().toString();

    public String getId() { return id; }
}
```

Without the `proxyMode`, Spring can’t inject a request-scoped bean into a singleton safely.

---

### 4.11 Scoped Proxies (Why They Exist)

Imagine a singleton bean depends on a request-scoped bean.  
When the singleton is created, the request doesn’t even exist — Spring can’t inject the real instance.

So it injects a **proxy** — a lightweight placeholder that resolves the correct bean dynamically when needed.

```java
@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestUser {
    ...
}
```

This proxy ensures the correct request-scoped object is used per request.  
Without it, Spring would throw `ScopeNotActiveException`.

---

### 4.12 Practical Example — Lifecycle in Action

```java
@Component
public class Worker {

    public Worker() {
        System.out.println("1. Constructor called");
    }

    @PostConstruct
    void init() {
        System.out.println("2. PostConstruct executed");
    }

    @PreDestroy
    void destroy() {
        System.out.println("3. PreDestroy executed");
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        try (var context = new AnnotationConfigApplicationContext(AppConfig.class)) {
            context.getBean(Worker.class);
        }
    }
}
```

**Output**

```
1. Constructor called
2. PostConstruct executed
3. PreDestroy executed
```

Spring instantiates, initializes, and cleans up in perfect order.

---

### 4.13 Scope Interaction Example

```java
@Component
@Scope("singleton")
public class SingletonService {
    private final PrototypeService prototype;

    @Autowired
    public SingletonService(PrototypeService prototype) {
        this.prototype = prototype;
    }

    public void run() {
        System.out.println(prototype.hashCode());
    }
}

@Component
@Scope("prototype")
public class PrototypeService { }
```

**Problem:** The `prototype` bean is injected **once** when `SingletonService` is created.  
Calling `run()` multiple times still uses the same instance.

To get a new one each time, use `ObjectFactory` or `Provider`:

```java
@Component
@Scope("singleton")
public class SingletonService {

    @Autowired
    private ObjectProvider<PrototypeService> provider;

    public void run() {
        System.out.println(provider.getObject().hashCode());
    }
}
```

Now each `run()` call uses a fresh `PrototypeService`.

---

### 4.14 Common Pitfalls

1. **Mixing scopes blindly:** Injecting prototype into singleton without `Provider` or proxy.
    
2. **Holding mutable state in singletons:** Race conditions waiting to happen.
    
3. **Forgetting to close contexts:** `@PreDestroy` never runs.
    
4. **Ignoring lifecycle hooks:** You’ll leave open DB connections or file handles.
    

---

### 4.15 Summary

|Concept|Description|
|---|---|
|**Singleton**|One instance per container|
|**Prototype**|New instance every request|
|**Request/Session/Application/WebSocket**|Web-scoped lifetimes|
|**`@PostConstruct` / `@PreDestroy`**|Lifecycle hooks|
|**`@Lazy`**|Defers bean creation|
|**Scoped Proxy**|Enables safe injection of scoped beans into singletons|
|**ObjectProvider**|Request new instances dynamically|

---

### 4.16 Rules to Live By

- Treat **singleton beans as stateless**.
    
- Avoid **prototype** unless you actually need it.
    
- **Never** assume a bean is recreated automatically.
    
- Use **`@PreDestroy`** religiously for cleanup.
    
- Always close your `ApplicationContext` in non-Spring Boot apps.
    

---

Next up: **Chapter 5 — Aspects and Cross-Cutting Concerns (AOP)** —  
how Spring wraps your code with proxy magic to handle logging, transactions, and security without polluting your business logic. Proceed?

Finally, the good stuff — **AOP**. The black magic that makes you wonder if Spring is secretly rewriting your code behind your back. Spoiler: it is. Let’s strip away the mystery and see what’s actually happening.

---

## **CHAPTER 5 — ASPECTS AND CROSS-CUTTING CONCERNS (AOP)**

### 5.1 The Problem AOP Solves

Every application has **cross-cutting concerns** — features that affect multiple modules but don’t belong to any single one:

- Logging
    
- Security checks
    
- Transactions
    
- Performance metrics
    
- Exception handling
    

Without AOP, your code ends up littered with repetitive junk:

```java
public void createOrder(Order order) {
    System.out.println("Start transaction");
    // business logic
    System.out.println("Commit transaction");
}
```

That’s boilerplate hell. You want to keep business logic clean and still apply shared behavior consistently.

That’s where **Aspect-Oriented Programming (AOP)** comes in.

---

### 5.2 What AOP Actually Does

AOP lets you **separate** those concerns into reusable “aspects.”  
You define _when_ and _where_ extra behavior should run — and Spring applies it automatically.

Spring achieves this through **proxies**.  
When you call a method, the call goes through a dynamically generated proxy class, which runs your aspect logic before, after, or around the actual method.

---

### 5.3 AOP Core Terminology

|Term|Meaning|
|---|---|
|**Aspect**|A class containing cross-cutting behavior|
|**Advice**|The actual code to run at a join point (before, after, around, etc.)|
|**Join Point**|A point in execution (e.g., method call) where advice can run|
|**Pointcut**|A rule defining which join points to target|
|**Weaving**|The process of applying aspects to target classes (Spring does it at runtime via proxies)|

---

### 5.4 Example – Logging Without AOP

Without AOP, you’d manually add logs to every method:

```java
public class AccountService {
    public void transfer() {
        System.out.println("Transfer started");
        // logic
        System.out.println("Transfer completed");
    }
}
```

That’s repetitive and brittle. AOP fixes it in one place.

---

### 5.5 Declaring an Aspect in Spring

To enable AOP, you must tell Spring to process aspects:

```java
@Configuration
@EnableAspectJAutoProxy
@ComponentScan("com.example")
public class AppConfig { }
```

Now define an aspect:

```java
@Aspect
@Component
public class LoggingAspect {

    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore() {
        System.out.println("Method execution started");
    }

    @After("execution(* com.example.service.*.*(..))")
    public void logAfter() {
        System.out.println("Method execution finished");
    }
}
```

This tells Spring:

> “For every method in `com.example.service.*`, run `logBefore()` before execution and `logAfter()` after.”

---

### 5.6 Example – Applying Logging Aspect

```java
package com.example.service;

import org.springframework.stereotype.Service;

@Service
public class AccountService {
    public void transfer() {
        System.out.println("Performing money transfer...");
    }
}
```

**Output:**

```
Method execution started
Performing money transfer...
Method execution finished
```

Spring intercepted the method call using a proxy and injected the aspect behavior automatically.

---

### 5.7 The `@Around` Advice

The most powerful form of advice — it wraps the method completely, giving you control _before_ and _after_ execution, or even the ability to skip it.

```java
@Aspect
@Component
public class PerformanceAspect {

    @Around("execution(* com.example.service.*.*(..))")
    public Object measureExecutionTime(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = pjp.proceed(); // calls the actual method
        long end = System.currentTimeMillis();
        System.out.println(pjp.getSignature() + " took " + (end - start) + " ms");
        return result;
    }
}
```

---

### 5.8 Advice Types Summary

|Annotation|Timing|Example|
|---|---|---|
|`@Before`|Before method executes|Logging, security checks|
|`@After`|After method executes (always)|Cleanup|
|`@AfterReturning`|After method successfully returns|Auditing|
|`@AfterThrowing`|After method throws an exception|Exception logging|
|`@Around`|Wraps the entire call|Profiling, transactions|

---

### 5.9 Using Pointcut Expressions

Pointcut expressions define _which methods_ an aspect applies to.

Syntax:

```
execution(modifiers-pattern? return-type-pattern declaring-type-pattern? method-name-pattern(param-pattern) throws-pattern?)
```

Example:

```java
@Before("execution(* com.example.service.*.*(..))")
```

Breakdown:

- `*` → any return type
    
- `com.example.service.*` → any class in the package
    
- `*.*(..)` → any method with any parameters
    

More examples:

```java
@Before("execution(public * com.example.service.AccountService.transfer(..))")
@Before("within(com.example.service..*)") // any class in package or subpackages
@Before("@annotation(com.example.ToLog)") // custom annotation
```

---

### 5.10 Custom Annotations for AOP

You can define your own annotation and use it as a pointcut marker.

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ToLog { }
```

Then:

```java
@Aspect
@Component
public class AnnotationLogger {
    @Before("@annotation(com.example.ToLog)")
    public void logMethod() {
        System.out.println("Custom log before method annotated with @ToLog");
    }
}
```

```java
@Service
public class ReportService {
    @ToLog
    public void generateReport() {
        System.out.println("Generating report...");
    }
}
```

**Output:**

```
Custom log before method annotated with @ToLog
Generating report...
```

Now you’ve got annotation-driven logging — one of the cleanest ways to apply AOP in real projects.

---

### 5.11 Using `@Order` to Control Aspect Priority

If multiple aspects target the same method, Spring executes them in order of ascending priority.

```java
@Aspect
@Order(1)
@Component
public class SecurityAspect { ... }

@Aspect
@Order(2)
@Component
public class LoggingAspect { ... }
```

Here, security checks run first, then logging.

---

### 5.12 Example – Transaction Aspect

```java
@Aspect
@Component
public class TransactionAspect {

    @Around("execution(* com.example.service.PaymentService.*(..))")
    public Object manageTransaction(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("Opening transaction...");
        try {
            Object result = pjp.proceed();
            System.out.println("Committing transaction...");
            return result;
        } catch (Exception e) {
            System.out.println("Rolling back transaction...");
            throw e;
        }
    }
}
```

You can see why Spring’s `@Transactional` annotation exists — it’s just an aspect implemented like this.

---

### 5.13 Real-World Use Cases

|Concern|AOP Solution|
|---|---|
|Logging|`@Before` / `@After` advice|
|Security|`@Before` checks on roles|
|Transactions|`@Around` advice|
|Performance profiling|`@Around` timing logic|
|Exception handling|`@AfterThrowing` logging|
|Auditing|`@AfterReturning` advice|

---

### 5.14 Limitations of Spring AOP

- Works **only on Spring-managed beans**
    
- Only intercepts **public methods**
    
- Can’t intercept **static**, **private**, or **final** methods
    
- Only uses **proxy-based weaving** (runtime) — no bytecode modification
    

If you need deeper interception (e.g., field-level), you’d use AspectJ with compile-time weaving — heavier, less common.

---

### 5.15 Troubleshooting AOP Issues

1. **Your aspect never runs?**
    
    - Did you add `@EnableAspectJAutoProxy`?
        
    - Is your aspect a Spring bean (`@Component`)?
        
    - Is your target method public?
        
2. **Advice runs multiple times?**
    
    - Check package scanning — you might have loaded the same bean twice.
        
3. **Order of aspects weird?**
    
    - Use `@Order` to control execution precedence.
        
4. **Doesn’t work on `this` calls:**
    
    - Self-invocation bypasses proxy. Extract logic to another bean.
        

---

### 5.16 Example – Combining Multiple Aspects

```java
@Aspect
@Order(1)
@Component
public class SecurityAspect {
    @Before("execution(* com.example.service.*.*(..))")
    public void checkUser() {
        System.out.println("Security check passed");
    }
}

@Aspect
@Order(2)
@Component
public class LoggingAspect {
    @Before("execution(* com.example.service.*.*(..))")
    public void logCall() {
        System.out.println("Logging method call");
    }
}
```

**Output**

```
Security check passed
Logging method call
Performing money transfer...
```

---

### 5.17 Summary

|Concept|Meaning|
|---|---|
|**Aspect**|Class containing cross-cutting logic|
|**Advice**|Code that runs before/after/around methods|
|**Pointcut**|Defines which methods are affected|
|**Join Point**|Execution point (method call)|
|**Weaving**|Applying aspects via proxies|
|**`@EnableAspectJAutoProxy`**|Enables AOP in Spring|
|**`@Order`**|Controls aspect priority|

---

### 5.18 Practical Guidelines

- Use **AOP** for real cross-cutting concerns — not to hide core logic.
    
- Keep aspects **stateless** — they can be shared across threads.
    
- Don’t abuse `@Around` for everything; use it only when you must control execution flow.
    
- Use custom annotations for clarity (`@ToLog`, `@Secure`, etc.).
    
- Remember: AOP is a **proxy trick**, not actual magic.
    

---

Next up: **Chapter 6 — Spring MVC and Web Applications** — where we get into controllers, request handling, REST endpoints, and how Spring’s DispatcherServlet runs the entire web layer.  
Continue?

Alright, time to open the black box that keeps every Java web app alive — **Spring MVC**.  
This is where HTTP requests meet Java objects, and the DispatcherServlet silently runs an entire mini-operating system inside your app.

---

## **CHAPTER 6 — SPRING MVC AND WEB APPLICATIONS**

### 6.1 The Big Picture

Spring MVC (Model-View-Controller) is a web framework built on top of the core Spring container. It’s designed to cleanly separate:

- **Model** → your data and business logic
    
- **View** → what the user sees (HTML, JSON, etc.)
    
- **Controller** → the glue that handles HTTP requests and sends responses
    

At the center of it all sits **DispatcherServlet** — the front controller.  
Every request goes through it, and it decides which controller method should handle that request.

---

### 6.2 The Request Flow

Here’s what happens under the hood for every HTTP request:

```
Browser → DispatcherServlet → HandlerMapping → Controller → ViewResolver → Response
```

Step by step:

1. DispatcherServlet receives the request.
    
2. It looks up the correct controller method (HandlerMapping).
    
3. Executes that method.
    
4. Uses a ViewResolver to determine how to render the response (HTML, JSON, etc.).
    
5. Sends it back to the client.
    

---

### 6.3 Enabling Spring MVC

Spring Boot does this automatically, but if you’re doing it manually:

```java
@Configuration
@EnableWebMvc
@ComponentScan("com.example.web")
public class WebConfig implements WebMvcConfigurer { }
```

And register the `DispatcherServlet` in your initializer:

```java
public class WebAppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
    protected Class<?>[] getRootConfigClasses() { return null; }
    protected Class<?>[] getServletConfigClasses() { return new Class[] { WebConfig.class }; }
    protected String[] getServletMappings() { return new String[] { "/" }; }
}
```

Yes, it looks painful — which is why Spring Boot exists.

---

### 6.4 Creating a Basic Controller

```java
@Controller
public class HelloController {

    @RequestMapping("/hello")
    public String sayHello(Model model) {
        model.addAttribute("message", "Hello from Spring MVC!");
        return "greeting"; // corresponds to greeting.html
    }
}
```

When you hit `http://localhost:8080/hello`, Spring calls `sayHello()`, populates the model, and resolves `greeting.html`.

---

### 6.5 Using `@RestController`

If you’re building APIs, use `@RestController` — it combines `@Controller` and `@ResponseBody`, returning data directly instead of rendering a view.

```java
@RestController
@RequestMapping("/api")
public class GreetingController {

    @GetMapping("/greet")
    public Map<String, String> greet() {
        return Map.of("message", "Hello, REST world!");
    }
}
```

**Output (JSON):**

```json
{"message": "Hello, REST world!"}
```

---

### 6.6 HTTP Method-Specific Annotations

|Annotation|HTTP Method|Example|
|---|---|---|
|`@GetMapping`|GET|`@GetMapping("/users")`|
|`@PostMapping`|POST|`@PostMapping("/users")`|
|`@PutMapping`|PUT|`@PutMapping("/users/{id}")`|
|`@DeleteMapping`|DELETE|`@DeleteMapping("/users/{id}")`|
|`@PatchMapping`|PATCH|`@PatchMapping("/users/{id}")`|

These are specialized forms of `@RequestMapping`.

---

### 6.7 Path Variables and Query Params

```java
@RestController
@RequestMapping("/users")
public class UserController {

    @GetMapping("/{id}")
    public String getUser(@PathVariable int id) {
        return "User ID: " + id;
    }

    @GetMapping
    public String search(@RequestParam String name) {
        return "Searching for: " + name;
    }
}
```

Requests:

```
GET /users/42        → User ID: 42
GET /users?name=John → Searching for: John
```

---

### 6.8 Sending and Receiving JSON

Spring automatically converts JSON to Java objects and vice versa using Jackson.

```java
public class Employee {
    private String name;
    private int age;
    // getters/setters
}
```

```java
@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @PostMapping
    public String addEmployee(@RequestBody Employee emp) {
        return "Added " + emp.getName();
    }
}
```

Request:

```json
{
  "name": "Alice",
  "age": 30
}
```

Response:

```
Added Alice
```

No manual parsing required.

---

### 6.9 Returning `ResponseEntity`

`ResponseEntity` gives you full control over HTTP status and headers.

```java
@GetMapping("/{id}")
public ResponseEntity<Employee> getEmployee(@PathVariable int id) {
    Employee emp = service.find(id);
    if (emp == null)
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    return ResponseEntity.ok(emp);
}
```

---

### 6.10 Exception Handling

Local exception handling inside a controller:

```java
@ExceptionHandler(IllegalArgumentException.class)
public ResponseEntity<String> handleInvalidArg(IllegalArgumentException e) {
    return ResponseEntity.badRequest().body(e.getMessage());
}
```

Global exception handling across controllers:

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAll(Exception ex) {
        return ResponseEntity.status(500).body("Server error: " + ex.getMessage());
    }
}
```

---

### 6.11 Returning Views with Thymeleaf

If you’re rendering HTML instead of JSON:

```java
@Controller
public class PageController {

    @GetMapping("/welcome")
    public String welcome(Model model) {
        model.addAttribute("name", "Nishanth");
        return "welcome"; // Thymeleaf template
    }
}
```

`welcome.html`:

```html
<html>
<body>
  <h1>Welcome, <span th:text="${name}"></span>!</h1>
</body>
</html>
```

---

### 6.12 Model, ModelMap, and ModelAndView

- `Model` → Simplest; used to pass data to the view.
    
- `ModelMap` → Similar, but allows chaining.
    
- `ModelAndView` → Wraps both model and view in one return object.
    

```java
@RequestMapping("/info")
public ModelAndView info() {
    ModelAndView mv = new ModelAndView("info");
    mv.addObject("version", "1.0.0");
    return mv;
}
```

---

### 6.13 File Upload Example

```java
@PostMapping("/upload")
public String upload(@RequestParam("file") MultipartFile file) throws IOException {
    Path path = Paths.get("uploads/" + file.getOriginalFilename());
    Files.write(path, file.getBytes());
    return "Uploaded " + file.getOriginalFilename();
}
```

Enable multipart support:

```java
@Bean
public MultipartResolver multipartResolver() {
    return new StandardServletMultipartResolver();
}
```

---

### 6.14 Content Negotiation

Spring automatically detects content type based on headers.

Example:

```java
@GetMapping(value = "/report", produces = { "application/json", "application/xml" })
public Report getReport() { ... }
```

If the client requests `Accept: application/xml`, Spring serializes as XML.

---

### 6.15 Cross-Origin Requests (CORS)

To allow browser clients from other domains:

```java
@CrossOrigin(origins = "http://localhost:3000")
@GetMapping("/data")
public List<Item> getData() { ... }
```

For global configuration:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("*");
    }
}
```

---

### 6.16 Validation with `@Valid`

```java
public class User {
    @NotBlank private String name;
    @Email private String email;
}
```

```java
@PostMapping("/register")
public ResponseEntity<String> register(@Valid @RequestBody User user, BindingResult result) {
    if (result.hasErrors())
        return ResponseEntity.badRequest().body("Invalid data");
    return ResponseEntity.ok("User registered");
}
```

---

### 6.17 Interceptors and Filters

Interceptors run **before** and **after** controller methods.  
Good for logging, authentication, etc.

```java
public class LoggingInterceptor implements HandlerInterceptor {
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
        System.out.println("Request URI: " + req.getRequestURI());
        return true;
    }
}
```

Register it:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoggingInterceptor());
    }
}
```

---

### 6.18 Typical REST Controller Structure

```java
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @GetMapping
    public List<Employee> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public Employee getOne(@PathVariable int id) { return service.get(id); }

    @PostMapping
    public Employee create(@RequestBody Employee emp) { return service.save(emp); }

    @PutMapping("/{id}")
    public Employee update(@PathVariable int id, @RequestBody Employee emp) { return service.update(id, emp); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) { service.delete(id); }
}
```

This is your standard CRUD API — simple, RESTful, and consistent.

---

### 6.19 Common Pitfalls

1. **Multiple controllers with same path** → ambiguous mapping exception.
    
2. **Using `@RestController` and returning a view name** → returns raw string, not a view.
    
3. **Forgetting `@RequestBody`** → request JSON won’t map to your object.
    
4. **Not closing file streams on upload** → memory leaks.
    
5. **Mixing model attributes and JSON APIs** in one controller — keep them separate.
    

---

### 6.20 Summary

|Concept|Description|
|---|---|
|**DispatcherServlet**|Central request router|
|**Controller / RestController**|Handles HTTP requests|
|**@RequestMapping / @GetMapping / etc.**|Route definitions|
|**Model / ModelAndView**|Data sent to view templates|
|**ResponseEntity**|Fine-grained HTTP control|
|**@ExceptionHandler / @ControllerAdvice**|Error handling|
|**@Valid**|Request validation|
|**Interceptors**|Request pre/post processing|

---

### 6.21 Best Practices

- Keep controllers **thin**; move logic to services.
    
- Use **DTOs** for input/output instead of entities.
    
- Always return proper **HTTP status codes**.
    
- Validate everything that comes from the client.
    
- Use **Spring Boot** unless you enjoy boilerplate pain.
    

---

Next up: **Chapter 7 — Working with REST Clients**,  
where you’ll learn how to call other APIs from within Spring using `RestTemplate`, `WebClient`, and `Feign`. Ready to continue?


Good. Now we flip the table — instead of _receiving_ HTTP requests, you’ll learn how to _send_ them from a Spring app. Welcome to the world of REST clients, where people still manage to misuse `RestTemplate` after a decade of tutorials.

---

## **CHAPTER 7 — WORKING WITH REST CLIENTS**

### 7.1 Why You Need REST Clients

Modern applications don’t live in isolation. They call external services for:

- Payment processing
    
- Authentication
    
- Notifications
    
- Data aggregation
    

So, you need a way to **make HTTP requests**, handle responses, parse JSON, and deal with errors — efficiently and cleanly.

Spring gives you three main options:

1. `RestTemplate` – the old reliable workhorse (synchronous)
    
2. `WebClient` – the reactive, non-blocking option
    
3. `OpenFeign` – declarative REST client with minimal boilerplate
    

---

### 7.2 Using `RestTemplate`

#### **Setup**

You can declare it as a bean so it’s reusable:

```java
@Configuration
public class AppConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

Then inject it:

```java
@Service
public class WeatherService {
    private final RestTemplate restTemplate;

    @Autowired
    public WeatherService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
}
```

---

### 7.3 Basic GET Request

```java
public String getWeather() {
    String url = "https://api.weatherapi.com/v1/current.json?key=123&q=London";
    String response = restTemplate.getForObject(url, String.class);
    return response;
}
```

You get raw JSON as a `String`.

For structured data:

```java
public class Weather {
    private Location location;
    private Current current;
    // getters/setters
}
```

```java
public Weather getWeather() {
    return restTemplate.getForObject(url, Weather.class);
}
```

Spring automatically deserializes JSON to the `Weather` object using Jackson.

---

### 7.4 Sending POST Requests

```java
public Employee createEmployee(Employee emp) {
    String url = "https://example.com/api/employees";
    return restTemplate.postForObject(url, emp, Employee.class);
}
```

Or if you need status + headers:

```java
ResponseEntity<Employee> response = restTemplate.postForEntity(url, emp, Employee.class);
System.out.println(response.getStatusCode());
```

---

### 7.5 PUT and DELETE

```java
restTemplate.put("https://example.com/api/employees/{id}", emp, 42);
restTemplate.delete("https://example.com/api/employees/{id}", 42);
```

You can include path variables and request bodies easily.

---

### 7.6 Using Headers and Entities

To include headers (like Authorization tokens):

```java
HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.APPLICATION_JSON);
headers.set("Authorization", "Bearer xyz123");

HttpEntity<Employee> entity = new HttpEntity<>(emp, headers);

ResponseEntity<Employee> response =
    restTemplate.exchange(url, HttpMethod.POST, entity, Employee.class);
```

This gives you full control over the HTTP request.

---

### 7.7 Handling Errors Gracefully

By default, `RestTemplate` throws `HttpClientErrorException` or `HttpServerErrorException` for 4xx/5xx responses.  
You can handle them with a try-catch:

```java
try {
    restTemplate.getForObject("https://api.badendpoint.com", String.class);
} catch (HttpClientErrorException e) {
    System.out.println("Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
}
```

Or create a custom `ResponseErrorHandler`:

```java
public class CustomErrorHandler implements ResponseErrorHandler {
    public boolean hasError(ClientHttpResponse response) throws IOException {
        return response.getStatusCode().series() == HttpStatus.Series.CLIENT_ERROR ||
               response.getStatusCode().series() == HttpStatus.Series.SERVER_ERROR;
    }
    public void handleError(ClientHttpResponse response) throws IOException {
        System.out.println("Error: " + response.getStatusCode());
    }
}
```

Register it:

```java
restTemplate.setErrorHandler(new CustomErrorHandler());
```

---

### 7.8 Introducing `WebClient`

`WebClient` is the modern, **non-blocking** alternative to `RestTemplate`.  
You can make async or reactive calls easily.

#### **Setup**

```java
@Bean
public WebClient webClient() {
    return WebClient.builder().baseUrl("https://api.example.com").build();
}
```

Inject it:

```java
@Autowired
private WebClient webClient;
```

---

### 7.9 Basic GET with `WebClient`

```java
public Mono<String> getWeather() {
    return webClient.get()
        .uri("/weather?q=London")
        .retrieve()
        .bodyToMono(String.class);
}
```

`.retrieve()` triggers the HTTP call and handles response codes.  
`.bodyToMono()` returns a reactive `Mono` (a single result).

If you want blocking (synchronous) behavior:

```java
String data = webClient.get()
    .uri("/weather?q=London")
    .retrieve()
    .bodyToMono(String.class)
    .block();
```

---

### 7.10 Sending JSON with `WebClient`

```java
public Mono<Employee> createEmployee(Employee emp) {
    return webClient.post()
        .uri("/employees")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(emp)
        .retrieve()
        .bodyToMono(Employee.class);
}
```

You can also chain transformations:

```java
createEmployee(emp)
    .map(Employee::getId)
    .subscribe(System.out::println);
```

---

### 7.11 Handling Errors in `WebClient`

```java
webClient.get()
    .uri("/invalid")
    .retrieve()
    .onStatus(HttpStatus::is4xxClientError, response -> 
        Mono.error(new RuntimeException("Client error")))
    .onStatus(HttpStatus::is5xxServerError, response -> 
        Mono.error(new RuntimeException("Server error")))
    .bodyToMono(String.class);
```

---

### 7.12 Adding Headers and Authentication

```java
webClient.get()
    .uri("/secure")
    .headers(h -> h.setBearerAuth("xyz123"))
    .retrieve()
    .bodyToMono(String.class);
```

Or globally in the builder:

```java
WebClient client = WebClient.builder()
    .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer xyz123")
    .build();
```

---

### 7.13 Parallel API Calls (Reactive Style)

```java
Mono<Employee> e1 = webClient.get().uri("/emp/1").retrieve().bodyToMono(Employee.class);
Mono<Employee> e2 = webClient.get().uri("/emp/2").retrieve().bodyToMono(Employee.class);

Mono.zip(e1, e2).subscribe(tuple -> {
    System.out.println(tuple.getT1().getName() + " & " + tuple.getT2().getName());
});
```

Reactive programming lets you hit multiple endpoints concurrently with minimal overhead.

---

### 7.14 Declarative Clients with OpenFeign

Feign is the lazy developer’s dream — define an interface, and Spring generates the REST client for you.

#### **Setup**

In Spring Boot:

```java
@EnableFeignClients
@SpringBootApplication
public class App { }
```

#### **Define Client**

```java
@FeignClient(name = "weatherClient", url = "https://api.weatherapi.com/v1")
public interface WeatherClient {

    @GetMapping("/current.json")
    WeatherResponse getWeather(@RequestParam("q") String city,
                               @RequestParam("key") String apiKey);
}
```

#### **Use It**

```java
@Service
public class WeatherService {
    private final WeatherClient client;

    public WeatherService(WeatherClient client) {
        this.client = client;
    }

    public void showWeather() {
        WeatherResponse res = client.getWeather("London", "123");
        System.out.println(res.getLocation().getName());
    }
}
```

Spring handles everything — serialization, deserialization, HTTP calls, retries, and logging.

---

### 7.15 Comparing REST Clients

|Feature|RestTemplate|WebClient|Feign|
|---|---|---|---|
|Style|Imperative|Reactive|Declarative|
|Blocking|Yes|No|Yes|
|Ease of use|Simple|Moderate|Very high|
|Recommended for|Simple synchronous calls|Reactive systems|Microservice communication|

---

### 7.16 Example — Combining APIs

Say you need to fetch a user from one API and their orders from another.

Using `WebClient`:

```java
Mono<User> userMono = webClient.get().uri("/users/1").retrieve().bodyToMono(User.class);
Mono<List<Order>> ordersMono = webClient.get().uri("/users/1/orders").retrieve().bodyToFlux(Order.class).collectList();

Mono.zip(userMono, ordersMono).subscribe(tuple -> {
    User user = tuple.getT1();
    List<Order> orders = tuple.getT2();
    System.out.println(user.getName() + " has " + orders.size() + " orders");
});
```

Efficient, non-blocking, and neat.

---

### 7.17 Error Handling Best Practices

1. Always log the full URL and status code on failure.
    
2. Don’t ignore timeouts — set them explicitly.
    
3. Avoid blocking calls inside reactive code (`.block()` is fine only in small scripts).
    
4. Validate responses before deserialization to avoid `NullPointerException`.
    
5. Use circuit breakers (e.g., Resilience4j) for unstable APIs.
    

---

### 7.18 Summary

|Concept|Description|
|---|---|
|**RestTemplate**|Simple, blocking HTTP client|
|**WebClient**|Reactive, non-blocking client|
|**Feign**|Declarative REST client generator|
|**ResponseEntity**|Wrapper for response body, status, and headers|
|**Error handling**|`onStatus` or custom `ResponseErrorHandler`|
|**Headers & Auth**|Easily configured via `HttpHeaders` or `WebClient.builder()`|

---

### 7.19 Recommended Use

- Use **WebClient** for modern async/reactive projects.
    
- Use **Feign** in microservice environments — it integrates perfectly with Spring Cloud.
    
- Keep **RestTemplate** only for legacy or synchronous integrations (it’s in maintenance mode).
    
- Always externalize URLs, keys, and headers — never hardcode them.
    

---

Next up: **Chapter 8 — Database Access with Spring**,  
where we’ll connect to databases, use `JdbcTemplate`, manage transactions, and handle failures the right way (without `SQLException` nightmares).  
Proceed?

Good. Time to connect your shiny Spring app to a database — where 80% of developers promptly lose all discipline and start sprinkling SQL like confetti. Let’s fix that with proper patterns and control.

---

## **CHAPTER 8 — DATABASE ACCESS WITH SPRING**

### 8.1 Why Spring’s Data Layer Exists

Before Spring, talking to a database in Java meant:

- Opening JDBC connections manually
    
- Writing 20 lines just to execute one query
    
- Forgetting to close ResultSets and leaking memory
    

Spring fixes all that with:

- Connection management
    
- Exception translation
    
- Template utilities for CRUD operations
    
- Integration with ORM frameworks (JPA, Hibernate, MyBatis)
    

At the core: **`JdbcTemplate`** and **`DataSource`**.

---

### 8.2 Setting Up a DataSource

Spring needs a **DataSource** — an object that manages database connections.

#### **Example (H2 Database)**

```java
@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource ds = new DriverManagerDataSource();
        ds.setDriverClassName("org.h2.Driver");
        ds.setUrl("jdbc:h2:mem:testdb");
        ds.setUsername("sa");
        ds.setPassword("");
        return ds;
    }
}
```

In real projects, use a **connection pool** like HikariCP (Spring Boot does this automatically).

---

### 8.3 Introducing `JdbcTemplate`

Spring’s `JdbcTemplate` wraps all the tedious JDBC boilerplate.

```java
@Configuration
public class JdbcConfig {

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
```

Then inject and use it:

```java
@Service
public class EmployeeDao {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public EmployeeDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
}
```

---

### 8.4 Performing CRUD Operations

**Create Table**

```java
jdbcTemplate.execute("CREATE TABLE employees (id INT PRIMARY KEY, name VARCHAR(50), dept VARCHAR(50))");
```

**Insert**

```java
String sql = "INSERT INTO employees (id, name, dept) VALUES (?, ?, ?)";
jdbcTemplate.update(sql, 1, "Nishanth", "Engineering");
```

**Update**

```java
jdbcTemplate.update("UPDATE employees SET dept=? WHERE id=?", "IT", 1);
```

**Delete**

```java
jdbcTemplate.update("DELETE FROM employees WHERE id=?", 1);
```

---

### 8.5 Reading Data with RowMapper

To map rows into Java objects, use `RowMapper`.

```java
public class Employee {
    private int id;
    private String name;
    private String dept;
    // getters/setters
}
```

```java
String sql = "SELECT * FROM employees";
List<Employee> list = jdbcTemplate.query(sql, new RowMapper<Employee>() {
    public Employee mapRow(ResultSet rs, int rowNum) throws SQLException {
        Employee e = new Employee();
        e.setId(rs.getInt("id"));
        e.setName(rs.getString("name"));
        e.setDept(rs.getString("dept"));
        return e;
    }
});
```

Lambda version:

```java
List<Employee> list = jdbcTemplate.query(sql, (rs, n) -> 
    new Employee(rs.getInt("id"), rs.getString("name"), rs.getString("dept")));
```

---

### 8.6 Reading a Single Record

```java
String sql = "SELECT * FROM employees WHERE id=?";
Employee emp = jdbcTemplate.queryForObject(sql, new Object[]{1},
        (rs, n) -> new Employee(rs.getInt("id"), rs.getString("name"), rs.getString("dept")));
```

If no record found, `EmptyResultDataAccessException` is thrown.

---

### 8.7 Transaction Management

Without transactions, you’re one crash away from a corrupt database.  
Spring provides the `@Transactional` annotation to manage them automatically.

```java
@Service
public class TransferService {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public TransferService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public void transfer(int from, int to, double amount) {
        jdbcTemplate.update("UPDATE account SET balance=balance-? WHERE id=?", amount, from);
        jdbcTemplate.update("UPDATE account SET balance=balance+? WHERE id=?", amount, to);
    }
}
```

If any exception occurs, the entire transaction rolls back automatically.

---

### 8.8 Transaction Propagation

`@Transactional` can control how nested transactions behave.

|Propagation|Description|
|---|---|
|REQUIRED (default)|Join existing or start new transaction|
|REQUIRES_NEW|Always start a new transaction|
|MANDATORY|Must exist within an existing transaction|
|SUPPORTS|Join if available, else execute non-transactionally|
|NEVER|Throw exception if called inside a transaction|
|NESTED|Run in nested savepoint transaction|

Example:

```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void logTransaction(String msg) { ... }
```

---

### 8.9 Rollback Rules

By default, Spring rolls back on **unchecked (Runtime) exceptions**.  
You can override this behavior:

```java
@Transactional(rollbackFor = Exception.class)
public void process() throws Exception { ... }
```

---

### 8.10 NamedParameterJdbcTemplate

A nicer version of `JdbcTemplate` that uses named parameters instead of `?`.

```java
@Autowired
NamedParameterJdbcTemplate namedJdbc;

String sql = "INSERT INTO employees (id, name, dept) VALUES (:id, :name, :dept)";
Map<String, Object> params = Map.of("id", 2, "name", "Ravi", "dept", "HR");

namedJdbc.update(sql, params);
```

Cleaner, more readable, and easier to maintain.

---

### 8.11 Batch Updates

For large inserts/updates, use batch processing.

```java
jdbcTemplate.batchUpdate(
    "INSERT INTO employees (id, name, dept) VALUES (?, ?, ?)",
    List.of(new Object[]{3, "Alice", "Finance"}, new Object[]{4, "Bob", "Ops"}));
```

Or with prepared statements:

```java
jdbcTemplate.batchUpdate(
    "INSERT INTO employees (id, name, dept) VALUES (?, ?, ?)",
    new BatchPreparedStatementSetter() {
        public void setValues(PreparedStatement ps, int i) throws SQLException {
            ps.setInt(1, i + 5);
            ps.setString(2, "Emp" + i);
            ps.setString(3, "Dept" + i);
        }
        public int getBatchSize() { return 10; }
    });
```

---

### 8.12 Exception Translation

Spring translates ugly `SQLException`s into meaningful runtime exceptions.  
Example:

- `DuplicateKeyException`
    
- `DataIntegrityViolationException`
    
- `EmptyResultDataAccessException`
    

This lets you write clean code without 10 nested try-catch blocks.

---

### 8.13 Integrating with ORM (JPA/Hibernate)

For object-relational mapping, you can use **Spring Data JPA**.

#### **Entity Example**

```java
@Entity
@Table(name = "employees")
public class Employee {
    @Id
    private int id;
    private String name;
    private String dept;
}
```

#### **Repository**

```java
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    List<Employee> findByDept(String dept);
}
```

#### **Service**

```java
@Service
public class EmployeeService {
    private final EmployeeRepository repo;
    public EmployeeService(EmployeeRepository repo) { this.repo = repo; }

    public List<Employee> listAll() { return repo.findAll(); }
}
```

Spring Data JPA auto-generates SQL based on method names — no queries needed.

---

### 8.14 Using `@Query` and `@Modifying`

Custom queries in repositories:

```java
@Query("SELECT e FROM Employee e WHERE e.name = :name")
List<Employee> findByName(@Param("name") String name);
```

For updates/deletes:

```java
@Modifying
@Query("UPDATE Employee e SET e.dept = :dept WHERE e.id = :id")
void updateDept(@Param("id") int id, @Param("dept") String dept);
```

Make sure to combine `@Transactional` for modifications.

---

### 8.15 Example — Employee Management

**Entity**

```java
@Entity
@Table(name = "employees")
public class Employee {
    @Id @GeneratedValue
    private int id;
    private String name;
    private String dept;
}
```

**Repository**

```java
public interface EmployeeRepository extends JpaRepository<Employee, Integer> { }
```

**Controller**

```java
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeRepository repo;
    public EmployeeController(EmployeeRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Employee> getAll() { return repo.findAll(); }

    @PostMapping
    public Employee create(@RequestBody Employee e) { return repo.save(e); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) { repo.deleteById(id); }
}
```

---

### 8.16 Transaction Troubleshooting

|Problem|Cause|Fix|
|---|---|---|
|Changes not persisted|Method not called through proxy|Make sure `@Transactional` method is in a separate bean|
|Transaction never starts|No `@EnableTransactionManagement`|Add in configuration|
|Rollback not happening|Checked exception|Use `rollbackFor = Exception.class`|
|LazyInitializationException|Accessing lazy entity outside transaction|Use `fetch = FetchType.EAGER` or manage session properly|

---

### 8.17 Best Practices

1. **Keep SQL in repositories or DAOs**, not in services.
    
2. **Always use transactions** for multi-step operations.
    
3. Use **connection pools** like HikariCP.
    
4. Avoid **manual commits** — let Spring handle them.
    
5. Use **JPA** for domain modeling; `JdbcTemplate` for raw performance.
    
6. Prefer **NamedParameterJdbcTemplate** for readability.
    

---

### 8.18 Summary

|Concept|Description|
|---|---|
|**DataSource**|Manages DB connections|
|**JdbcTemplate**|Simplifies JDBC operations|
|**RowMapper**|Maps rows to objects|
|**@Transactional**|Manages transactions automatically|
|**NamedParameterJdbcTemplate**|Uses named SQL params|
|**Batch Updates**|Efficient multi-row inserts|
|**Spring Data JPA**|ORM abstraction over Hibernate|
|**Exception Translation**|Converts SQLExceptions to runtime errors|

---

### 8.19 Real Advice

- For quick CRUD → use **Spring Data JPA**.
    
- For performance-critical, custom SQL → use **JdbcTemplate**.
    
- Always test transaction rollbacks; don’t trust “it works in dev.”
    
- Never swallow exceptions from the data layer — log and rethrow.
    
- If you ever find yourself writing raw JDBC, you’ve made a mistake.
    

---

Next up: **Chapter 9 — Spring Data**,  
where we’ll go deeper into repositories, queries, pagination, and how Spring Data actually creates repository implementations at runtime. Proceed?


Perfect. Chapter 9 it is — **Spring Data**, the part of Spring that makes people believe in magic until they realize it’s just smart proxy generation. Let’s kill the mystery and understand what’s actually happening.

---

## **CHAPTER 9 — SPRING DATA (JPA)**

### 9.1 What Spring Data Does

You don’t need to write repetitive CRUD code. Spring Data takes a repository interface like:

```java
public interface EmployeeRepository extends JpaRepository<Employee, Integer> { }
```

…and **auto-generates** all the boilerplate under the hood:

- Create
    
- Read
    
- Update
    
- Delete
    
- Pagination
    
- Sorting
    
- Custom finder queries
    

Spring Data is basically a layer that sits on top of JPA or other data stores (MongoDB, Neo4j, Redis, etc.), giving you one consistent API.

---

### 9.2 Core Interfaces

|Interface|Purpose|
|---|---|
|`CrudRepository<T, ID>`|Basic CRUD methods|
|`PagingAndSortingRepository<T, ID>`|Adds pagination and sorting|
|`JpaRepository<T, ID>`|Adds JPA-specific enhancements like batch flush, deleteInBatch, etc.|

You almost always extend `JpaRepository`.

Example:

```java
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> { }
```

Spring creates the actual implementation at runtime using dynamic proxies.

---

### 9.3 Naming Conventions for Query Methods

Spring Data reads your method names and **builds SQL automatically**.

Examples:

```java
List<Employee> findByDept(String dept);
Employee findByName(String name);
List<Employee> findByDeptAndName(String dept, String name);
List<Employee> findByDeptOrderByNameAsc(String dept);
List<Employee> findTop3ByDept(String dept);
boolean existsByName(String name);
long countByDept(String dept);
```

Spring parses the method name and translates it into a JPA query.  
No need for `@Query` unless you want something custom.

---

### 9.4 Using `@Query` for Custom SQL

When your query is too specific or complex for method names:

```java
@Query("SELECT e FROM Employee e WHERE e.name LIKE %:name%")
List<Employee> searchByName(@Param("name") String name);
```

You can also use **native SQL**:

```java
@Query(value = "SELECT * FROM employees WHERE dept = :dept", nativeQuery = true)
List<Employee> findByDeptNative(@Param("dept") String dept);
```

---

### 9.5 Modifying Queries

For update/delete queries:

```java
@Modifying
@Transactional
@Query("UPDATE Employee e SET e.dept = :dept WHERE e.id = :id")
void updateDept(@Param("id") int id, @Param("dept") String dept);
```

`@Modifying` tells Spring that this query changes data.  
You must also include `@Transactional`.

---

### 9.6 Pagination

Instead of fetching all records, use paging to improve performance.

```java
Page<Employee> findByDept(String dept, Pageable pageable);
```

Usage:

```java
Pageable pageable = PageRequest.of(0, 5, Sort.by("name").ascending());
Page<Employee> page = repo.findByDept("IT", pageable);

System.out.println("Total pages: " + page.getTotalPages());
page.getContent().forEach(System.out::println);
```

---

### 9.7 Sorting

You can sort data dynamically:

```java
List<Employee> list = repo.findAll(Sort.by("dept").descending().and(Sort.by("name")));
```

Or with pagination:

```java
Pageable pageable = PageRequest.of(0, 10, Sort.by("id").descending());
```

---

### 9.8 `Specification` and Dynamic Queries

For flexible queries at runtime, use the **Specification API**.

#### **Entity**

```java
@Entity
public class Employee {
    @Id
    private int id;
    private String name;
    private String dept;
    private int salary;
}
```

#### **Specification Example**

```java
Specification<Employee> highEarners = (root, query, cb) ->
        cb.greaterThan(root.get("salary"), 50000);
```

Usage:

```java
List<Employee> list = repo.findAll(highEarners);
```

You can combine multiple specifications:

```java
Specification<Employee> inIT = (root, query, cb) -> cb.equal(root.get("dept"), "IT");
Specification<Employee> combined = Specification.where(inIT).and(highEarners);
```

---

### 9.9 Auditing Entities

Spring Data can automatically track who created or updated records.

#### **Setup**

Enable auditing:

```java
@Configuration
@EnableJpaAuditing
public class JpaConfig { }
```

#### **Entity**

```java
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Employee {
    @Id
    @GeneratedValue
    private int id;

    private String name;
    private String dept;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

Now Spring populates these fields automatically during persistence.

---

### 9.10 Custom Repository Implementations

If you need methods that require complex logic, you can provide your own implementation.

#### **Step 1: Define Interface**

```java
public interface EmployeeRepositoryCustom {
    List<Employee> findHighSalaryEmployees();
}
```

#### **Step 2: Implement It**

```java
@Repository
public class EmployeeRepositoryImpl implements EmployeeRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Employee> findHighSalaryEmployees() {
        return em.createQuery("FROM Employee e WHERE e.salary > 100000", Employee.class)
                 .getResultList();
    }
}
```

#### **Step 3: Extend Both**

```java
public interface EmployeeRepository extends JpaRepository<Employee, Integer>, EmployeeRepositoryCustom { }
```

---

### 9.11 Transactions in Repositories

All repository methods are transactional by default:

- Read operations → `readOnly = true`
    
- Write operations → full transaction
    

You can override it:

```java
@Transactional(readOnly = false)
void save(Employee emp);
```

---

### 9.12 Repository Lifecycle and Caching

Repositories are **singletons** managed by Spring’s IoC container.  
Combine with caching annotations for efficiency:

```java
@Cacheable("employees")
List<Employee> findByDept(String dept);
```

Add `@EnableCaching` in your config to activate caching.

---

### 9.13 EntityManager Overview

If you need lower-level control than `JpaRepository`, inject `EntityManager` directly.

```java
@PersistenceContext
private EntityManager em;

public List<Employee> findAllEmployees() {
    return em.createQuery("SELECT e FROM Employee e", Employee.class).getResultList();
}
```

This gives you full control but also full responsibility — transactions, flushing, and error handling.

---

### 9.14 Example — Full CRUD with JPA

**Entity**

```java
@Entity
public class Employee {
    @Id
    @GeneratedValue
    private int id;
    private String name;
    private String dept;
}
```

**Repository**

```java
public interface EmployeeRepository extends JpaRepository<Employee, Integer> { }
```

**Service**

```java
@Service
public class EmployeeService {
    private final EmployeeRepository repo;

    public EmployeeService(EmployeeRepository repo) {
        this.repo = repo;
    }

    public List<Employee> getAll() { return repo.findAll(); }
    public Employee create(Employee e) { return repo.save(e); }
    public void delete(int id) { repo.deleteById(id); }
}
```

**Controller**

```java
@RestController
@RequestMapping("/employees")
public class EmployeeController {
    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @GetMapping
    public List<Employee> all() { return service.getAll(); }

    @PostMapping
    public Employee create(@RequestBody Employee e) { return service.create(e); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) { service.delete(id); }
}
```

---

### 9.15 Testing Repositories

Use `@DataJpaTest` for focused JPA testing — loads only repository beans.

```java
@DataJpaTest
class EmployeeRepositoryTest {

    @Autowired
    private EmployeeRepository repo;

    @Test
    void testSaveAndFind() {
        Employee e = new Employee();
        e.setName("Ravi");
        e.setDept("IT");
        repo.save(e);

        assertEquals(1, repo.findByDept("IT").size());
    }
}
```

---

### 9.16 Common Mistakes

|Mistake|Problem|Fix|
|---|---|---|
|Accessing lazy fields outside transaction|`LazyInitializationException`|Use `fetch = FetchType.EAGER` or `@Transactional`|
|Circular dependencies between repositories|Stack overflow|Split into services|
|Overusing native queries|Hard to maintain|Use JPQL or query methods|
|Modifying without `@Transactional`|Changes not persisted|Annotate properly|
|Forgetting `@EnableJpaRepositories`|Repos not scanned|Add config|

---

### 9.17 Best Practices

1. Always separate repository, service, and controller layers.
    
2. Use `JpaRepository` unless you have a solid reason not to.
    
3. Avoid business logic inside repositories.
    
4. Use DTOs for data transfer, not entity exposure.
    
5. Keep query methods short and readable.
    
6. Index frequently queried fields.
    
7. Don’t mix JPA with `JdbcTemplate` in the same class.
    
8. Log queries when debugging, not in production.
    

---

### 9.18 Summary

|Concept|Description|
|---|---|
|**JpaRepository**|Full-featured JPA abstraction|
|**@Query**|Custom JPQL or SQL|
|**@Modifying**|For update/delete operations|
|**Pagination**|`Pageable` + `Page<T>`|
|**Specification**|Build dynamic queries programmatically|
|**Auditing**|Auto-populate created/updated timestamps|
|**EntityManager**|Low-level JPA control|
|**Custom Implementation**|Extend functionality beyond generated methods|

---

Next up: **Chapter 10 — Spring Boot**,  
where we’ll see how Boot automates all of this, eliminates XML completely, and gives you production-ready features out of the box — auto-configuration, embedded servers, profiles, and externalized configuration. Continue?

Fine. Strap in. You’re about to see why **Spring Boot** is what turned Spring from “powerful but painful” into “click-run-and-it-just-works.” Behind the marketing noise, it’s nothing mystical — just a massive pile of sensible defaults and autoconfiguration.

---

## **CHAPTER 10 — SPRING BOOT**

### 10.1 The Problem Boot Solved

Before Spring Boot, developers had to:

- Write XML or Java config for every bean.
    
- Manually configure Tomcat, logging, properties, and DB connections.
    
- Copy boilerplate for every new service.
    

Spring Boot’s purpose was simple: **make Spring usable in real life**.

It provides:

1. **Auto-configuration** — detects what you have and configures it.
    
2. **Starter dependencies** — bundles common dependencies together.
    
3. **Embedded servers** — no WAR files or external Tomcat.
    
4. **Production-ready features** — health checks, metrics, logging, etc.
    

---

### 10.2 Creating a Boot Application

You only need one class:

```java
@SpringBootApplication
public class EmployeeApp {
    public static void main(String[] args) {
        SpringApplication.run(EmployeeApp.class, args);
    }
}
```

That’s it. You now have:

- Auto-configuration loaded
    
- Component scanning active
    
- Embedded Tomcat running on port 8080
    

**`@SpringBootApplication`** is a shortcut for three annotations:

- `@Configuration` — marks this as a config class
    
- `@EnableAutoConfiguration` — activates auto-setup
    
- `@ComponentScan` — scans for beans in the same package or below
    

---

### 10.3 Starter Dependencies

Boot simplifies dependencies using **starters**.

|Starter|What it does|
|---|---|
|`spring-boot-starter-web`|REST APIs, embedded Tomcat|
|`spring-boot-starter-data-jpa`|Hibernate + JPA integration|
|`spring-boot-starter-test`|JUnit + MockMVC|
|`spring-boot-starter-security`|Authentication & authorization|
|`spring-boot-starter-thymeleaf`|Template engine for HTML views|
|`spring-boot-starter-actuator`|Production metrics & monitoring|

Example `pom.xml` (Maven):

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

---

### 10.4 Auto-Configuration in Action

When Boot sees `spring-boot-starter-data-jpa`, it:

- Configures an `EntityManagerFactory`
    
- Registers a transaction manager
    
- Scans for entities and repositories
    
- Uses your `application.properties` to connect to DB
    

All automatically — unless you override something manually.

---

### 10.5 Configuration Files

Boot supports `application.properties` or `application.yml`.

**Example (properties):**

```properties
server.port=8081
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**Example (YAML):**

```yaml
server:
  port: 8081

spring:
  datasource:
    url: jdbc:h2:mem:testdb
    username: sa
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

---

### 10.6 Profiles

Different environments (dev, test, prod) need different configurations.  
Boot uses **profiles** to switch settings easily.

```properties
# application-dev.properties
server.port=8080

# application-prod.properties
server.port=9090
```

Activate with:

```properties
spring.profiles.active=prod
```

Or via command line:

```
java -jar app.jar --spring.profiles.active=dev
```

---

### 10.7 Externalized Configuration

Everything configurable in Boot can come from:

- `.properties` / `.yml` files
    
- Environment variables
    
- Command-line arguments
    
- System properties
    

Priority order: command-line > env vars > app.properties > defaults.  
This makes Boot apps easily deployable in cloud environments.

---

### 10.8 Embedded Servers

Boot runs your app as a **standalone JAR** using an embedded server:

- Tomcat (default)
    
- Jetty
    
- Undertow
    

No need for WAR files or external containers.

Example run:

```
mvn spring-boot:run
```

or

```
java -jar target/employee-app.jar
```

---

### 10.9 REST API Example with Boot

```java
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeRepository repo;

    public EmployeeController(EmployeeRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Employee> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Employee create(@RequestBody Employee e) {
        return repo.save(e);
    }
}
```

Run the app — instantly live on `http://localhost:8080/api/employees`.  
No XML, no manual server deployment.

---

### 10.10 CommandLineRunner and ApplicationRunner

You can run startup logic immediately after Boot loads the context.

```java
@Component
public class StartupRunner implements CommandLineRunner {
    @Override
    public void run(String... args) {
        System.out.println("App started successfully!");
    }
}
```

Use this for initial setup, seed data, or quick checks.

---

### 10.11 Actuator — Monitoring and Health

Add this dependency:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Now Boot exposes endpoints:

```
/actuator/health
/actuator/info
/actuator/metrics
/actuator/env
```

You can enable more in `application.properties`:

```properties
management.endpoints.web.exposure.include=*
```

---

### 10.12 Logging

Boot configures logging automatically with Logback.

You can control level globally:

```properties
logging.level.root=INFO
logging.level.com.example=DEBUG
```

Or direct logs to file:

```properties
logging.file.name=app.log
```

---

### 10.13 Exception Handling in REST

Spring Boot simplifies error handling with `@ControllerAdvice`.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleNotFound(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
}
```

When you throw an exception, this automatically catches it and sends the proper HTTP status.

---

### 10.14 Spring Boot DevTools

Hot reload for development.  
Add this dependency:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
</dependency>
```

Automatically restarts your app when you change code.

---

### 10.15 Building the Executable JAR

```bash
mvn clean package
java -jar target/employee-app-0.0.1-SNAPSHOT.jar
```

Boot embeds the server and dependencies inside one fat JAR — deployable anywhere Java runs.

---

### 10.16 Testing with Boot

```java
@SpringBootTest
class EmployeeAppTests {

    @Autowired
    private EmployeeRepository repo;

    @Test
    void testSave() {
        Employee e = new Employee();
        e.setName("Nishanth");
        e.setDept("Engineering");
        repo.save(e);

        assertEquals(1, repo.findAll().size());
    }
}
```

`@SpringBootTest` loads the full context, making integration testing easy.

---

### 10.17 Security Basics

Add `spring-boot-starter-security` — Boot instantly adds authentication.  
Default user credentials are printed on startup.

You can configure your own:

```properties
spring.security.user.name=admin
spring.security.user.password=pass123
```

Or disable it in dev:

```java
@Bean
SecurityFilterChain security(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
        .csrf().disable();
    return http.build();
}
```

---

### 10.18 Actuator + Security

Combine both for production-grade health checks:

```properties
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=always
management.security.enabled=true
```

---

### 10.19 Typical Boot Project Structure

```
src/
 └── main/
      ├── java/
      │   └── com.example.employee/
      │        ├── EmployeeApp.java
      │        ├── controller/
      │        ├── service/
      │        └── repository/
      └── resources/
           ├── application.yml
           └── static/
```

Organized, clean, and automatically scanned.

---

### 10.20 Summary

|Concept|Description|
|---|---|
|**@SpringBootApplication**|Entry point; enables auto-config and scanning|
|**Starters**|Pre-packaged dependency groups|
|**application.properties/yml**|Central configuration|
|**Profiles**|Environment-specific settings|
|**Actuator**|Health, metrics, monitoring endpoints|
|**Embedded server**|Run anywhere; no WAR deployment|
|**CommandLineRunner**|Startup logic hook|
|**DevTools**|Hot reload for development|

---

### 10.21 Final Advice

1. Never manually configure what Boot can auto-configure.
    
2. Keep one `application.yml` per environment.
    
3. Disable DevTools in production.
    
4. Always test with `@SpringBootTest`.
    
5. Understand what Boot auto-wires — don’t treat it as black magic.
    
6. Add `spring-boot-actuator` to every production service.
    

---

Next up: **Chapter 11 — Spring Boot Advanced Topics**,  
where we’ll cover custom starters, configuration properties, profiles, Actuator extensions, and health indicators — the stuff that separates a decent Boot app from a real production system. Continue?