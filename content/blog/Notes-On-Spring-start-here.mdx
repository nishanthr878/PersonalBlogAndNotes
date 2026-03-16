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

## Table of contents

- Chapter 1: Introduction to Spring Framework
- Chapter 2: Configuring Spring Applications
- Chapter 3: Dependency Injection in Detail
- Chapter 4: Bean Scopes and Lifecycle
- Chapter 5: Aspects and Cross-Cutting Concerns (AOP)
- Chapter 6: Spring MVC and Web Applications
- Chapter 7: Working with REST Clients
- Chapter 8: Database Access with Spring
- Chapter 9: Spring Data (JPA)
- Chapter 10: Spring Boot
- Chapter 11: Spring Boot Advanced Topics (outline)
- Chapter 12: Security and Best Practices (outline)

---

## Spring Start Here - Complete Study Notes (Textbook Style)

Based on _Spring Start Here_ by Laurentiu Spilca (compiled and expanded).

### Chapter plan

- Chapter 1: Introduction to Spring Framework
- Chapter 2: Configuring Spring Applications
- Chapter 3: Dependency Injection in Detail
- Chapter 4: Bean Scopes and Lifecycle
- Chapter 5: Aspects and Cross-Cutting Concerns (AOP)
- Chapter 6: Spring MVC and Web Applications
- Chapter 7: Working with REST Clients
- Chapter 8: Database Access with Spring
- Chapter 9: Spring Data
- Chapter 10: Testing in Spring
- Chapter 11: Spring Boot and Autoconfiguration
- Chapter 12: Security and Best Practices

---

## Chapter 1 - Introduction to the Spring Framework

### 1.1 Why Spring Exists

Early Java applications were a mess of manually created objects. Every class constructed its own dependencies and hard-wired them together, which meant:

- Zero flexibility: you had to rewrite code to swap an implementation.
- No testability: you could not isolate components without rewriting constructors.
- Brittle architecture: changing one class broke five others.

Spring was designed to fix this by introducing Inversion of Control (IoC): the framework, not your code, controls object creation and wiring.

---

### 1.2 Inversion of Control (IoC)

Traditional control flow:

```java
public class InvoiceService {
    private final EmailService emailService = new EmailService();

    public void sendInvoice() {
        emailService.send("invoice.pdf");
    }
}
```

Here, `InvoiceService` creates its own `EmailService`. You cannot replace it with a mock or a different implementation.

IoC flow:

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

Now, someone else decides which `EmailService` to use. That "someone else" is Spring's IoC container.

---

### 1.3 The Spring IoC Container

The container is the brain of a Spring application. It:

1. Instantiates objects (called beans)
2. Resolves dependencies among them
3. Manages their lifecycle (creation, initialization, destruction)

Think of it as a registry:

```text
Bean name  ->  Bean instance
```

Whenever your code asks for a dependency, the container supplies it.

---

### 1.4 Dependency Injection (DI)

IoC is the principle; Dependency Injection is the concrete mechanism Spring uses to implement it.

- Constructor injection: preferred for mandatory dependencies
- Setter injection: optional dependencies
- Field injection: avoid in serious projects

Example:

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

Spring needs configuration telling it which classes to treat as beans.

#### 1.5.1 Annotation-based configuration

```java
@Configuration
@ComponentScan("com.company.billing")
public class AppConfig {
}
```

- `@Configuration` marks a class that defines bean setup.
- `@ComponentScan` tells Spring where to look for `@Component`, `@Service`, `@Repository`, and `@Controller` classes.

#### 1.5.2 Java-based bean definition

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

| Problem Without IoC | Solved By Spring |
| --- | --- |
| Tight coupling between classes | Dependencies are injected via interfaces |
| Hard to test | You can inject mocks or stubs |
| Complex object creation | Centralized in configuration |
| Lifecycle management | Spring handles it automatically |

---

### 1.8 Common Pitfalls

1. Circular dependencies: Spring throws `BeanCurrentlyInCreationException`. Fix by redesigning or introducing an interface boundary.
2. Using field injection: makes testing painful. Prefer constructor injection.
3. Overusing configuration: do not add every object to the context; only those that need Spring features.

---

### 1.9 Mini Project - IoC and DI in Action

Goal: create a small greeting application using Spring's IoC container.

Step 1: define components

```java
@Component
public class MessageService {
    public String getMessage() {
        return "Hello from Spring!";
    }
}
```

Step 2: inject dependency

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

Step 3: run the context

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

Output:

```text
Hello from Spring!
```

---

### 1.10 Summary

- IoC: framework controls object creation instead of user code.
- DI: mechanism by which Spring provides dependencies.
- Bean: any object managed by Spring.
- ApplicationContext: core container managing all beans.
- `@Configuration` + `@Bean` or `@Component` + `@ComponentScan`: two main ways to define beans.
- Use constructor injection to ensure immutability and testability.

---

## Chapter 2 - Configuring Spring Applications

### 2.1 What Configuration Really Means

Configuration in Spring is the process of telling the framework which objects to manage, how they relate, and what rules apply to their lifecycle.

Spring needs two types of information:

1. Where to look for components
2. What additional beans or settings to create manually

You can provide this via:

- Java configuration (`@Configuration`, `@Bean`)
- Annotation scanning (`@ComponentScan`)
- Optional extras: XML, YAML, or programmatic registration

---

### 2.2 The Application Context

When you start a Spring app, the framework creates an ApplicationContext, which acts as a registry of beans.

```java
AnnotationConfigApplicationContext context =
        new AnnotationConfigApplicationContext(AppConfig.class);

MyService service = context.getBean(MyService.class);
```

---

### 2.3 Defining Configuration Classes

```java
@Configuration
public class AppConfig {
    // beans go here
}
```

`@Configuration` marks this class as a source of bean definitions.

---

### 2.4 Defining Beans with `@Bean`

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

---

### 2.5 Bean Naming and Aliases

Default name is the method name, but you can specify custom names and aliases:

```java
@Bean("bird")
public Parrot parrot() {
    return new Parrot("Miki");
}

@Bean({"bird", "featheredFriend"})
public Parrot parrot2() {
    return new Parrot("Kiki");
}
```

---

### 2.6 Linking Beans Inside Configuration

Option 1: method call wiring

```java
@Bean
public Person person() {
    Person p = new Person();
    p.setParrot(parrot());
    return p;
}
```

Option 2: parameter injection (preferred)

```java
@Bean
public Person person(Parrot parrot) {
    return new Person("John", parrot);
}
```

---

### 2.7 Stereotype Annotations

| Annotation | Purpose |
| --- | --- |
| `@Component` | Generic Spring-managed component |
| `@Service` | Marks a service layer class |
| `@Repository` | Marks a data access object (DAO) |
| `@Controller` | Marks a web controller |
| `@RestController` | Marks a REST API controller |

Example:

```java
@Component
public class Parrot {
    private String name = "Miki";
}
```

---

### 2.8 Component Scanning

```java
@Configuration
@ComponentScan("com.example.zoo")
public class AppConfig { }
```

---

### 2.9 `@Primary` and `@Qualifier`

```java
@Bean
@Primary
public Parrot parrot1() { return new Parrot("Miki"); }

@Bean
public Parrot parrot2() { return new Parrot("Kiki"); }

@Bean
public Person person(@Qualifier("parrot2") Parrot parrot) {
    return new Person("John", parrot);
}
```

---

### 2.10 Lifecycle Hooks

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

---

### 2.11 Programmatic Bean Registration

```java
context.registerBean("customBean", MyClass.class, MyClass::new);
```

---

### 2.12 Example - Wiring Components Together

Parrot:

```java
@Component
public class Parrot {
    private String name = "Miki";
    public String getName() { return name; }
}
```

Person:

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

AppConfig:

```java
@Configuration
@ComponentScan("com.example")
public class AppConfig { }
```

Main:

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

Output:

```text
My parrot is Miki
```

---

### 2.13 Key Takeaways

| Concept | Description |
| --- | --- |
| `@Configuration` | Marks class as a Spring config source |
| `@Bean` | Creates a bean manually |
| `@Component`, `@Service`, etc. | Automatically detected beans |
| `@ComponentScan` | Tells Spring where to look for annotated classes |
| `@Primary` | Marks one bean as default when multiple exist |
| `@Qualifier` | Chooses a specific bean by name |
| `@PostConstruct` / `@PreDestroy` | Hooks for init and destroy logic |

---

## Chapter 3 - Dependency Injection in Detail

### 3.1 Why Dependency Injection Exists

DI enforces inversion of control by removing the `new` keyword from your codebase. You declare dependencies; Spring provides them.

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

---

### 3.2 Types of Dependency Injection

Constructor injection (preferred):

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

Setter injection (optional dependencies):

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

Field injection (avoid):

```java
@Component
public class UserService {
    @Autowired
    private NotificationService notificationService;
}
```

---

### 3.3 How Spring Resolves Dependencies

Spring builds a dependency graph, matches dependencies by type, then by name (if qualifiers are used). Multiple candidates require `@Qualifier` or `@Primary`.

---

### 3.4 Example - Automatic Wiring

NotificationService:

```java
@Component
public class NotificationService {
    public void notifyUser(String msg) {
        System.out.println("Sending notification: " + msg);
    }
}
```

UserService:

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

---

### 3.5 Interface-Based Injection

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

---

### 3.6 Multiple Beans of the Same Type

```java
@Component("creditCardProcessor")
public class CreditCardProcessor implements PaymentProcessor { }

@Component("paypalProcessor")
public class PayPalProcessor implements PaymentProcessor { }
```

```java
@Autowired
@Qualifier("paypalProcessor")
private PaymentProcessor processor;
```

---

### 3.7 Optional Dependencies

```java
@Autowired(required = false)
private AuditService auditService;
```

Or:

```java
@Autowired
private Optional<AuditService> auditService;
```

---

### 3.8 Circular Dependencies

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

Fix by redesigning, or as a last resort use `@Lazy`:

```java
@Component
public class B {
    @Autowired
    @Lazy
    private A a;
}
```

---

### 3.9 Profiles

```java
@Component
@Profile("dev")
public class LocalDatabase implements Database { }

@Component
@Profile("prod")
public class CloudDatabase implements Database { }
```

---

### 3.10 Practical Example - Multiple Payment Strategies

```java
public interface PaymentProcessor {
    void process(double amount);
}

@Component("credit")
public class CreditCardProcessor implements PaymentProcessor {
    public void process(double amount) {
        System.out.println("Paid $" + amount + " via Credit Card");
    }
}

@Component("upi")
public class UPIProcessor implements PaymentProcessor {
    public void process(double amount) {
        System.out.println("Paid $" + amount + " via UPI");
    }
}

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

---

### 3.11 Testing with Mocked Dependencies

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

---

### 3.12 Summary

| Type | Description | Recommended Use |
| --- | --- | --- |
| Constructor Injection | Dependencies passed via constructor | Preferred |
| Setter Injection | Dependencies passed via setter | Optional dependencies |
| Field Injection | Direct field assignment | Avoid |
| `@Qualifier` | Select between multiple beans | Multiple candidates |
| `@Primary` | Marks default bean | One bean should be default |
| `@Lazy` | Delays bean creation | Break circular dependencies |
| `@Profile` | Conditional bean creation | Environment-based configs |

---

## Chapter 4 - Bean Scopes and Lifecycle

### 4.1 What a Bean Scope Means

Scope defines how many instances of a bean Spring creates and how long they live.

---

### 4.2 The Main Scopes

| Scope | Description | Typical Use |
| --- | --- | --- |
| singleton | One instance per container | Stateless services |
| prototype | New instance per request | Short-lived stateful objects |
| request | One per HTTP request | Request data |
| session | One per HTTP session | User session state |
| application | One per ServletContext | Shared app state |
| websocket | One per WebSocket session | Realtime sessions |

---

### 4.3 Singleton Scope (Default)

```java
@Component
public class SingletonBean {
    public SingletonBean() {
        System.out.println("Singleton created!");
    }
}
```

---

### 4.4 Prototype Scope

```java
@Component
@Scope("prototype")
public class PrototypeBean {
    public PrototypeBean() {
        System.out.println("Prototype created!");
    }
}
```

Spring does not manage prototype beans after creation; you handle cleanup.

---

### 4.5 Lazy vs Eager Initialization

```java
@Component
@Lazy
public class ExpensiveService {
    public ExpensiveService() {
        System.out.println("Initialized only when needed");
    }
}
```

---

### 4.6 Lifecycle Overview

1. Instantiation
2. Dependency injection
3. Initialization
4. Usage
5. Destruction

---

### 4.7 `@PostConstruct` and `@PreDestroy`

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

---

### 4.8 InitializingBean and DisposableBean

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

---

### 4.9 Custom Init and Destroy Methods

```java
@Bean(initMethod = "init", destroyMethod = "cleanup")
public Cache cache() {
    return new Cache();
}
```

---

### 4.10 Web Scopes and Scoped Proxies

```java
@Component
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestTracker {
    private final String id = UUID.randomUUID().toString();
    public String getId() { return id; }
}
```

---

### 4.11 Prototype Inside Singleton

Prototype beans injected into singletons are resolved once at singleton creation time. Use `ObjectProvider` to get a fresh instance:

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

---

### 4.12 Common Pitfalls

1. Mixing scopes blindly (prototype into singleton without provider/proxy).
2. Holding mutable state in singletons (race conditions).
3. Forgetting to close contexts (`@PreDestroy` never runs).
4. Ignoring lifecycle hooks (leaking resources).

---

## Chapter 5 - Aspects and Cross-Cutting Concerns (AOP)

### 5.1 The Problem AOP Solves

Cross-cutting concerns include logging, security, transactions, metrics, and exception handling.

Without AOP:

```java
public void createOrder(Order order) {
    System.out.println("Start transaction");
    // business logic
    System.out.println("Commit transaction");
}
```

---

### 5.2 What AOP Does

Spring AOP applies extra behavior via proxies. Method calls go through a generated proxy that runs advice before/after/around the target method.

---

### 5.3 AOP Terminology

| Term | Meaning |
| --- | --- |
| Aspect | Class containing cross-cutting behavior |
| Advice | Code to run at a join point |
| Join Point | Point in execution (e.g., method call) |
| Pointcut | Rule defining which join points to target |
| Weaving | Applying aspects (Spring does runtime proxy weaving) |

---

### 5.4 Enabling AOP

```java
@Configuration
@EnableAspectJAutoProxy
@ComponentScan("com.example")
public class AppConfig { }
```

---

### 5.5 Example - Logging Aspect

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

---

### 5.6 `@Around` Advice

```java
@Aspect
@Component
public class PerformanceAspect {

    @Around("execution(* com.example.service.*.*(..))")
    public Object measureExecutionTime(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = pjp.proceed();
        long end = System.currentTimeMillis();
        System.out.println(pjp.getSignature() + " took " + (end - start) + " ms");
        return result;
    }
}
```

---

### 5.7 Advice Types

| Annotation | Timing | Example |
| --- | --- | --- |
| `@Before` | Before method executes | logging, security checks |
| `@After` | After method executes (always) | cleanup |
| `@AfterReturning` | After method returns | auditing |
| `@AfterThrowing` | After method throws | error logging |
| `@Around` | Wraps the entire call | profiling, transactions |

---

### 5.8 Custom Annotation Pointcuts

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ToLog { }
```

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

---

### 5.9 Ordering

```java
@Aspect
@Order(1)
@Component
public class SecurityAspect { }

@Aspect
@Order(2)
@Component
public class LoggingAspect2 { }
```

---

### 5.10 Limitations

- Spring AOP works only on Spring-managed beans.
- Typically intercepts public methods.
- Does not intercept static/private/final methods.
- Proxy-based (runtime) weaving.

---

## Chapter 6 - Spring MVC and Web Applications

### 6.1 Big Picture

Spring MVC separates Model (data), View (UI/representation), and Controller (request handling).

DispatcherServlet is the front controller: every request goes through it.

---

### 6.2 Request Flow

```text
Browser -> DispatcherServlet -> HandlerMapping -> Controller -> ViewResolver -> Response
```

---

### 6.3 Basic Controller

```java
@Controller
public class HelloController {

    @RequestMapping("/hello")
    public String sayHello(Model model) {
        model.addAttribute("message", "Hello from Spring MVC!");
        return "greeting";
    }
}
```

---

### 6.4 `@RestController`

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

---

### 6.5 Mapping Annotations

| Annotation | HTTP Method |
| --- | --- |
| `@GetMapping` | GET |
| `@PostMapping` | POST |
| `@PutMapping` | PUT |
| `@DeleteMapping` | DELETE |
| `@PatchMapping` | PATCH |

---

### 6.6 Path Variables and Query Params

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

---

### 6.7 JSON Input/Output

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

---

### 6.8 `ResponseEntity`

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

### 6.9 Exception Handling

```java
@ExceptionHandler(IllegalArgumentException.class)
public ResponseEntity<String> handleInvalidArg(IllegalArgumentException e) {
    return ResponseEntity.badRequest().body(e.getMessage());
}
```

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

### 6.10 Validation with `@Valid`

```java
@PostMapping("/register")
public ResponseEntity<String> register(@Valid @RequestBody User user, BindingResult result) {
    if (result.hasErrors())
        return ResponseEntity.badRequest().body("Invalid data");
    return ResponseEntity.ok("User registered");
}
```

---

## Chapter 7 - Working with REST Clients

### 7.1 Options

1. `RestTemplate` (blocking)
2. `WebClient` (reactive)
3. OpenFeign (declarative)

---

### 7.2 RestTemplate Bean

```java
@Configuration
public class AppConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

---

### 7.3 GET

```java
String response = restTemplate.getForObject(url, String.class);
```

---

### 7.4 POST

```java
Employee created = restTemplate.postForObject(url, emp, Employee.class);
```

---

### 7.5 Headers and Exchange

```java
HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.APPLICATION_JSON);
headers.set("Authorization", "Bearer xyz123");

HttpEntity<Employee> entity = new HttpEntity<>(emp, headers);

ResponseEntity<Employee> response =
    restTemplate.exchange(url, HttpMethod.POST, entity, Employee.class);
```

---

### 7.6 WebClient Setup

```java
@Bean
public WebClient webClient() {
    return WebClient.builder().baseUrl("https://api.example.com").build();
}
```

---

### 7.7 WebClient GET

```java
public Mono<String> getWeather() {
    return webClient.get()
        .uri("/weather?q=London")
        .retrieve()
        .bodyToMono(String.class);
}
```

---

### 7.8 OpenFeign

```java
@FeignClient(name = "weatherClient", url = "https://api.weatherapi.com/v1")
public interface WeatherClient {

    @GetMapping("/current.json")
    WeatherResponse getWeather(@RequestParam("q") String city,
                               @RequestParam("key") String apiKey);
}
```

---

## Chapter 8 - Database Access with Spring

### 8.1 DataSource and JdbcTemplate

```java
@Configuration
public class JdbcConfig {

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
```

---

### 8.2 CRUD

```java
jdbcTemplate.execute("CREATE TABLE employees (id INT PRIMARY KEY, name VARCHAR(50), dept VARCHAR(50))");

jdbcTemplate.update("INSERT INTO employees (id, name, dept) VALUES (?, ?, ?)", 1, "Nishanth", "Engineering");
jdbcTemplate.update("UPDATE employees SET dept=? WHERE id=?", "IT", 1);
jdbcTemplate.update("DELETE FROM employees WHERE id=?", 1);
```

---

### 8.3 RowMapper

```java
List<Employee> list = jdbcTemplate.query("SELECT * FROM employees", (rs, n) ->
    new Employee(rs.getInt("id"), rs.getString("name"), rs.getString("dept"))
);
```

---

### 8.4 Transactions

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

---

### 8.5 NamedParameterJdbcTemplate

```java
String sql = "INSERT INTO employees (id, name, dept) VALUES (:id, :name, :dept)";
Map<String, Object> params = Map.of("id", 2, "name", "Ravi", "dept", "HR");
namedJdbc.update(sql, params);
```

---

## Chapter 9 - Spring Data (JPA)

### 9.1 Repository Interfaces

| Interface | Purpose |
| --- | --- |
| `CrudRepository` | Basic CRUD |
| `PagingAndSortingRepository` | Pagination and sorting |
| `JpaRepository` | JPA-specific enhancements |

Example:

```java
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> { }
```

---

### 9.2 Derived Query Methods

```java
List<Employee> findByDept(String dept);
Employee findByName(String name);
List<Employee> findByDeptAndName(String dept, String name);
List<Employee> findTop3ByDept(String dept);
boolean existsByName(String name);
long countByDept(String dept);
```

---

### 9.3 `@Query` and `@Modifying`

```java
@Query("SELECT e FROM Employee e WHERE e.name LIKE %:name%")
List<Employee> searchByName(@Param("name") String name);
```

```java
@Modifying
@Transactional
@Query("UPDATE Employee e SET e.dept = :dept WHERE e.id = :id")
void updateDept(@Param("id") int id, @Param("dept") String dept);
```

---

### 9.4 Pagination

```java
Page<Employee> findByDept(String dept, Pageable pageable);
```

---

### 9.5 Auditing

```java
@Configuration
@EnableJpaAuditing
public class JpaConfig { }
```

---

## Chapter 10 - Spring Boot

### 10.1 Boot Entry Point

```java
@SpringBootApplication
public class EmployeeApp {
    public static void main(String[] args) {
        SpringApplication.run(EmployeeApp.class, args);
    }
}
```

`@SpringBootApplication` = `@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan`.

---

### 10.2 Starters

Common starters:

- `spring-boot-starter-web`
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-test`
- `spring-boot-starter-security`
- `spring-boot-starter-thymeleaf`
- `spring-boot-starter-actuator`

---

### 10.3 `application.properties` / `application.yml`

```properties
server.port=8081
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

### 10.4 Profiles

```properties
spring.profiles.active=prod
```

---

### 10.5 Actuator

Common endpoints:

- `/actuator/health`
- `/actuator/info`
- `/actuator/metrics`

---

### 10.6 `CommandLineRunner`

```java
@Component
public class StartupRunner implements CommandLineRunner {
    @Override
    public void run(String... args) {
        System.out.println("App started successfully!");
    }
}
```

---

### 10.7 Building the Executable Jar

```bash
mvn clean package
java -jar target/employee-app-0.0.1-SNAPSHOT.jar
```

---

## Chapter 11 - Spring Boot Advanced Topics (Outline)

Not expanded in these notes yet.

---

## Chapter 12 - Security and Best Practices (Outline)

Not expanded in these notes yet.
