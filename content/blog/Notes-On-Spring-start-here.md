---
title: Spring Starts Here Notes
date: 2026-03-16
description: Spring starts here notes
tags:
  - spring boot
  - java
draft: false
---

## Chapter 1 — Introduction to Spring Framework

> **Core idea:** The framework, not your code, creates and wires objects. This is Inversion of Control (IoC).

### IoC + DI

Without Spring: `new EmailService()` inside `InvoiceService` — tight coupling, untestable, brittle.

**IoC** = framework controls object creation.  
**DI** = the mechanism — dependencies are injected into your class, not instantiated inside it.

| Injection Type | When to Use |
|---|---|
| Constructor | Always preferred. Explicit, immutable, testable. |
| Setter | Optional dependencies only. |
| Field (`@Autowired` on field) | Avoid. Hidden deps, kills testability. |

### ApplicationContext

The IoC container. Registry of `bean name → bean instance`. Instantiates beans, resolves deps, manages lifecycle.

```java
try (var ctx = new AnnotationConfigApplicationContext(AppConfig.class)) {
    InvoiceService svc = ctx.getBean(InvoiceService.class);
}
```

### Two Ways to Define Beans

| Approach | When to Use |
|---|---|
| `@Bean` in `@Configuration` class | Third-party / library objects you can't annotate |
| `@Component` / `@Service` / `@Repository` | Your own application classes — detected via `@ComponentScan` |

> ⚠️ **Pitfall:** Circular dependencies throw `BeanCurrentlyInCreationException`. Redesign — don't use `@Lazy` as a crutch.

### Summary

| Concept | Meaning |
|---|---|
| IoC | Framework controls object creation |
| DI | Mechanism to inject dependencies |
| Bean | Any object managed by Spring |
| `ApplicationContext` | Core container managing all beans |
| `@Configuration` + `@Bean` | Manual bean definition |
| `@Component` + `@ComponentScan` | Auto-detected beans |

---

## Chapter 2 — Configuring Spring Applications

> Configuration tells Spring which objects to manage, how they relate, and what lifecycle rules apply.

### `@Configuration` Class

Marks a class as a source of bean definitions. It is itself a Spring-managed bean.

```java
@Configuration
public class AppConfig { }
```

### `@Bean`

Spring calls this method once, stores the returned instance. Bean name defaults to method name.

```java
@Bean
public Parrot parrot() {
    Parrot p = new Parrot();
    p.setName("Miki");
    return p;
}
```

Custom name: `@Bean("bird")` | Multiple names: `@Bean({"bird", "featheredFriend"})`

### Wiring Beans Inside Config

```java
// Option 1 — method call (Spring intercepts; returns same bean instance)
p.setParrot(parrot());

// Option 2 — parameter injection (preferred)
@Bean public Person person(Parrot parrot) { ... }
```

### Stereotype Annotations

| Annotation | Purpose |
|---|---|
| `@Component` | Generic bean |
| `@Service` | Service layer |
| `@Repository` | Data access layer |
| `@Controller` | Web controller (returns views) |
| `@RestController` | REST API controller (returns JSON) |

### `@ComponentScan`

Tells Spring where to look. Must be specified — Spring won't scan blindly.

```java
@ComponentScan("com.example.service")
```

> ⚠️ 90% of "Spring can't find a bean" errors are `@ComponentScan` misconfiguration.

### `@Primary` and `@Qualifier`

When multiple beans share the same type:
- `@Primary` — marks default. Used when no qualifier is specified.
- `@Qualifier("beanName")` — picks a specific bean at the injection point.

### Lifecycle Hooks

```java
@PostConstruct void init() { /* runs after context starts */ }
@PreDestroy void cleanup() { /* runs before context closes */ }
```

### Summary

| Concept | Description |
|---|---|
| `@Configuration` | Source of bean definitions |
| `@Bean` | Manual bean creation |
| `@Component` et al. | Auto-detected beans |
| `@ComponentScan` | Package to scan |
| `@Primary` | Default bean when multiple exist |
| `@Qualifier` | Choose specific bean by name |
| `@PostConstruct` / `@PreDestroy` | Init and destroy hooks |

---

## Chapter 3 — Dependency Injection in Detail

> DI removes `new` from your code. You declare dependencies; Spring supplies them.

### Injection Types

| Type | When / Why |
|---|---|
| Constructor | Mandatory deps. Explicit, immutable, testable. **Always prefer.** |
| Setter | Optional deps only. Allows partial construction — use cautiously. |
| Field (`@Autowired` on field) | Avoid. Hidden deps, can't inject mocks without reflection. |

### How Spring Resolves

Matches by **type** first. Multiple candidates → error, unless you use `@Qualifier` or `@Primary`. No match → `BeanCreationException`.

### Interface-Based Injection

Inject the interface, not the implementation. Swap implementations or inject mocks freely.

```java
public interface PaymentProcessor { void process(double amount); }

@Component
public class PaymentService {
    private final PaymentProcessor processor; // interface type
    public PaymentService(PaymentProcessor processor) { this.processor = processor; }
}
```

### Multiple Beans of Same Type

```java
@Component("creditCard") public class CreditCardProcessor implements PaymentProcessor {}
@Component("upi") public class UPIProcessor implements PaymentProcessor {}

// In consumer:
@Autowired @Qualifier("upi") PaymentProcessor processor;
```

### Optional Dependencies

```java
@Autowired private Optional<AuditService> auditService;
```

### Circular Dependencies

A depends on B, B depends on A → `BeanCurrentlyInCreationException`. Fix by redesigning (interface boundary, event listener). `@Lazy` on one side breaks the cycle but masks bad design.

### Profiles

```java
@Component @Profile("dev") public class LocalDatabase implements Database {}
@Component @Profile("prod") public class CloudDatabase implements Database {}
// Activate: -Dspring.profiles.active=prod
```

### Summary

| Concept | Description |
|---|---|
| Constructor injection | Always preferred |
| `@Qualifier` | Select between multiple same-type beans |
| `@Primary` | Default bean when multiple exist |
| Interface injection | Enables flexibility and testability |
| `@Lazy` | Break circular deps (treat as code smell) |
| `@Profile` | Environment-conditional beans |

> ⚠️ Rules: Never hide dependencies. Circular deps = poor design. If you see NPE, check your context wiring.

---

## Chapter 4 — Bean Scopes and Lifecycle

> Scope defines how many instances Spring creates and how long they live.

### Six Scopes

| Scope | Behavior |
|---|---|
| `singleton` | One instance per container. Default. **Stateless only.** |
| `prototype` | New instance every request. You manage cleanup. |
| `request` | One per HTTP request. Web apps. |
| `session` | One per HTTP session. Web apps. |
| `application` | One per `ServletContext`. |
| `websocket` | One per WebSocket connection. |

### Singleton (Default)

```java
SingletonBean a = ctx.getBean(SingletonBean.class);
SingletonBean b = ctx.getBean(SingletonBean.class);
a == b; // TRUE — same instance
```

> ⚠️ Never store mutable state in singletons — multi-threading nightmares guaranteed.

### Prototype

```java
@Component @Scope("prototype") public class PrototypeBean {}
// Each getBean() creates a new instance
```

Spring does **not** manage prototype bean cleanup. You handle destruction.

### Lazy Initialization

`@Lazy` delays creation until first use. Singletons are eager by default (created at startup).

### Lifecycle Hooks

```java
@PostConstruct void init() { /* after DI, before use */ }
@PreDestroy void destroy() { /* before context closes */ }
```

Or implement `InitializingBean.afterPropertiesSet()` / `DisposableBean.destroy()` — functionally identical, less elegant.

For third-party classes: `@Bean(initMethod="init", destroyMethod="cleanup")`

### Scoped Proxies

When a singleton depends on a request-scoped bean, Spring injects a proxy. Without `proxyMode`, Spring throws `ScopeNotActiveException`.

```java
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
```

### Singleton + Prototype Gotcha

Injecting a prototype into a singleton gives you **one instance** — injected at startup. To get a new instance each call:

```java
@Autowired private ObjectProvider<PrototypeService> provider;
provider.getObject(); // fresh instance every call
```

### Summary

| Concept | Description |
|---|---|
| `singleton` | One instance per container (default) |
| `prototype` | New instance per request; you handle cleanup |
| Web scopes | `request` / `session` / `application` / `websocket` |
| `@PostConstruct` / `@PreDestroy` | Init and destroy hooks |
| `@Lazy` | Defers bean creation |
| Scoped Proxy | Safe injection of narrow-scoped into wider-scoped |
| `ObjectProvider` | Get new prototype instances dynamically |

> ⚠️ Pitfalls: Mutable state in singletons. Mixing scopes without Provider/proxy. Not closing context (`@PreDestroy` never runs).

---

## Chapter 5 — Aspects and Cross-Cutting Concerns (AOP)

> AOP separates concerns like logging, security, and transactions from business logic — via runtime proxy interception.

### Core Terminology

| Term | Meaning |
|---|---|
| Aspect | Class containing cross-cutting logic (`@Aspect`) |
| Advice | The actual code that runs (before, after, around) |
| Join Point | Execution point where advice can run (method call) |
| Pointcut | Expression defining which join points to target |
| Weaving | Applying aspects to target classes (Spring does this via proxies at runtime) |

### Advice Types

| Annotation | When / Use |
|---|---|
| `@Before` | Before method executes — logging, security checks |
| `@After` | After execution (always) — cleanup |
| `@AfterReturning` | After successful return — auditing |
| `@AfterThrowing` | After exception — error logging |
| `@Around` | Wraps entire call — profiling, transactions. Most powerful. |

### Minimal Setup

```java
@Configuration @EnableAspectJAutoProxy
public class AppConfig {}

@Aspect @Component
public class LoggingAspect {
    @Before("execution(* com.example.service.*.*(..))") // all public methods in package
    public void logBefore() { System.out.println("Start"); }
}
```

### `@Around` — Full Control

```java
@Around("execution(* com.example.service.*.*(..))")
public Object time(ProceedingJoinPoint pjp) throws Throwable {
    long t = System.currentTimeMillis();
    Object result = pjp.proceed(); // call actual method
    System.out.println("Took: " + (System.currentTimeMillis() - t) + "ms");
    return result;
}
```

### Custom Annotation Pointcut

```java
@Target(ElementType.METHOD) @Retention(RetentionPolicy.RUNTIME)
public @interface ToLog {}

@Before("@annotation(com.example.ToLog)")
public void logAnnotated() { System.out.println("Logging @ToLog method"); }
```

### Aspect Order

```java
@Order(1) // lower number = higher priority
```

### Limitations

- Only works on Spring-managed beans
- Only intercepts **public** methods
- Cannot intercept static, private, or final methods
- Self-invocation (`this.method()`) bypasses proxy — extract to another bean

### Summary

| Concept | Description |
|---|---|
| `@EnableAspectJAutoProxy` | Activates AOP |
| `@Aspect` + `@Component` | Define an aspect class |
| `@Before` / `@After` / `@Around` | Advice types |
| Pointcut expression | `execution(* package.*.*(..))` — defines targets |
| `@Order` | Controls aspect priority |
| Custom `@annotation` | Cleanest way to mark methods for aspects |

> 💡 Real-world: `@Transactional` is just an `@Around` aspect. Spring Security is just `@Before` aspects.

---

## Chapter 6 — Spring MVC and Web Applications

> Spring MVC handles HTTP: `DispatcherServlet` routes requests → Controller → (ViewResolver or JSON serialization) → Response.

### Request Flow

```
Browser → DispatcherServlet → HandlerMapping → Controller Method → ViewResolver/JSON → Response
```

### `@Controller` vs `@RestController`

| Annotation | Behavior |
|---|---|
| `@Controller` | Returns view name (e.g. `"greeting"` → `greeting.html` via Thymeleaf) |
| `@RestController` | = `@Controller` + `@ResponseBody`. Returns data (JSON) directly. Use for APIs. |

### Routing Annotations

| Annotation | HTTP Method |
|---|---|
| `@GetMapping` | GET |
| `@PostMapping` | POST |
| `@PutMapping` | PUT |
| `@DeleteMapping` | DELETE |
| `@PatchMapping` | PATCH |

### Path Variables and Query Params

```java
@GetMapping("/{id}") public String get(@PathVariable int id) {}
@GetMapping public String search(@RequestParam String name) {}
```

### Request Body + ResponseEntity

```java
@PostMapping
public ResponseEntity<Employee> create(@RequestBody Employee e) {
    return ResponseEntity.status(HttpStatus.CREATED).body(service.save(e));
}
```

`ResponseEntity` gives full control over status code + headers.

### Validation

```java
public class User {
    @NotBlank private String name;
    @Email private String email;
}

@PostMapping
public ResponseEntity<?> register(@Valid @RequestBody User u, BindingResult r) {
    if (r.hasErrors()) return ResponseEntity.badRequest().body("Invalid");
    return ResponseEntity.ok("Registered");
}
```

### Exception Handling

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handle(ResourceNotFoundException e) {
        return ResponseEntity.status(404).body(e.getMessage());
    }
}
```

### CORS

```java
@CrossOrigin(origins = "http://localhost:3000") // on method or class
// Global: registry.addMapping("/**").allowedOrigins("*") in WebMvcConfigurer
```

### Interceptors

```java
public class LogInterceptor implements HandlerInterceptor {
    public boolean preHandle(HttpServletRequest r, ...) { return true; }
}
// Register in WebMvcConfigurer.addInterceptors()
```

### Summary

| Concept | Description |
|---|---|
| `DispatcherServlet` | Front controller — routes all requests |
| `@RestController` | REST API — returns JSON |
| `@PathVariable` / `@RequestParam` | URL segment / query string binding |
| `@RequestBody` | Deserialize JSON body to Java object |
| `ResponseEntity` | Control status code + headers |
| `@Valid` + `BindingResult` | Input validation |
| `@ControllerAdvice` | Global exception handling |
| `@CrossOrigin` | CORS config |

> ⚠️ Pitfalls: `@RestController` returning a view name → raw string response. Forgetting `@RequestBody` → JSON won't bind. Mixing view + API logic in one controller.

---

## Chapter 7 — Working with REST Clients

> Three options: `RestTemplate` (synchronous), `WebClient` (reactive/async), `OpenFeign` (declarative).

### Comparison

| Client | Characteristics |
|---|---|
| `RestTemplate` | Synchronous, blocking. Simple. In maintenance mode. |
| `WebClient` | Reactive, non-blocking. Modern default. |
| `Feign` | Declarative interface. Best for microservices. Minimal boilerplate. |

### RestTemplate — Key Methods

| Method | Purpose |
|---|---|
| `getForObject(url, Class)` | GET, returns deserialized object |
| `postForObject(url, body, Class)` | POST, returns response body |
| `postForEntity(url, body, Class)` | POST, returns `ResponseEntity` (status + body) |
| `exchange(url, method, entity, Class)` | Full control: custom headers, method, body |

### Setting Headers (RestTemplate)

```java
HttpHeaders headers = new HttpHeaders();
headers.set("Authorization", "Bearer token");
HttpEntity<Employee> entity = new HttpEntity<>(body, headers);
restTemplate.exchange(url, HttpMethod.POST, entity, Employee.class);
```

### WebClient — Basics

```java
WebClient client = WebClient.builder().baseUrl("https://api.example.com").build();

// GET — reactive
Mono<String> result = client.get().uri("/data").retrieve().bodyToMono(String.class);

// Synchronous (avoid in reactive stacks)
String data = result.block();
```

### WebClient — POST with Error Handling

```java
client.post().uri("/employees")
    .bodyValue(emp)
    .retrieve()
    .onStatus(HttpStatus::is4xxClientError, r -> Mono.error(new RuntimeException("4xx")))
    .bodyToMono(Employee.class);
```

### Parallel Calls (WebClient)

```java
Mono<User> u = client.get().uri("/users/1").retrieve().bodyToMono(User.class);
Mono<List<Order>> o = client.get().uri("/orders/1").retrieve().bodyToFlux(Order.class).collectList();
Mono.zip(u, o).subscribe(t -> System.out.println(t.getT1().getName()));
```

### Feign — Declarative Client

```java
@FeignClient(name = "weather", url = "https://api.weatherapi.com/v1")
public interface WeatherClient {
    @GetMapping("/current.json")
    WeatherResponse getWeather(@RequestParam("q") String city, @RequestParam("key") String key);
}
// Enable: @EnableFeignClients on @SpringBootApplication
```

### When to Use What

| Client | Use When |
|---|---|
| `RestTemplate` | Legacy / simple sync calls only |
| `WebClient` | Modern default — new projects |
| `Feign` | Microservice-to-microservice communication |
| `.block()` | Sync behavior from WebClient — avoid in reactive stacks |

> ⚠️ Always set timeouts. Externalize URLs and API keys. Use circuit breakers (Resilience4j) for unstable APIs.

---

## Chapter 8 — Database Access with Spring

> `JdbcTemplate` = raw SQL control. Spring Data JPA = ORM abstraction. Use both in their right context.

### DataSource

Manages DB connections. Spring Boot auto-configures HikariCP (connection pool).

```java
@Bean public DataSource dataSource() {
    DriverManagerDataSource ds = new DriverManagerDataSource();
    ds.setUrl("jdbc:h2:mem:testdb");
    ds.setUsername("sa"); return ds;
}
```

### JdbcTemplate — CRUD

```java
// Insert / Update / Delete
jdbcTemplate.update("INSERT INTO emp VALUES (?,?)", 1, "Nishanth");

// Query many
List<Emp> list = jdbcTemplate.query(sql, (rs, n) ->
    new Emp(rs.getInt("id"), rs.getString("name")));

// Query one
Emp e = jdbcTemplate.queryForObject(sql, new Object[]{1},
    (rs, n) -> new Emp(rs.getInt("id"), rs.getString("name")));
```

### `@Transactional`

Wraps methods in a transaction. On exception → auto rollback. Only works on Spring-managed beans called through the proxy.

```java
@Transactional
public void transfer(int from, int to, double amount) {
    jdbcTemplate.update("UPDATE account SET balance=balance-? WHERE id=?", amount, from);
    jdbcTemplate.update("UPDATE account SET balance=balance+? WHERE id=?", amount, to);
}
```

### Propagation Types

| Propagation | Behavior |
|---|---|
| `REQUIRED` (default) | Join existing or start new |
| `REQUIRES_NEW` | Always start new (suspends outer) |
| `MANDATORY` | Must have existing transaction |
| `SUPPORTS` | Join if exists, else no transaction |
| `NEVER` | Throw if inside transaction |
| `NESTED` | Savepoint within existing |

Default rollback: unchecked (`RuntimeException`). Override: `@Transactional(rollbackFor = Exception.class)`

### `NamedParameterJdbcTemplate`

```java
namedJdbc.update("INSERT INTO emp VALUES (:id, :name)", Map.of("id", 1, "name", "Ravi"));
```

### Spring Data JPA

```java
@Entity public class Employee {
    @Id @GeneratedValue private int id;
    private String name, dept;
}

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    List<Employee> findByDept(String dept); // Spring generates query from method name
}
```

### Transaction Troubleshooting

| Problem | Cause / Fix |
|---|---|
| Changes not persisted | `this.method()` bypasses proxy — must call through Spring bean |
| Rollback not happening | Checked exception — add `rollbackFor = Exception.class` |
| `LazyInitializationException` | Accessing lazy entity outside transaction — use `@Transactional` or `FetchType.EAGER` |

### Summary

| Concept | Description |
|---|---|
| `DataSource` | DB connection management |
| `JdbcTemplate` | Simplified JDBC — raw SQL |
| `RowMapper` / Lambda | Map `ResultSet` rows to objects |
| `@Transactional` | Automatic transaction management |
| `NamedParameterJdbcTemplate` | Named SQL params (cleaner) |
| Spring Data JPA | ORM — auto-generates CRUD from repository interface |

> ⚠️ Use JPA for domain modeling and standard CRUD. Use `JdbcTemplate` when you need raw SQL control or performance.

---

## Chapter 9 — Spring Data JPA (Deep Dive)

> Spring Data generates repository implementations at runtime via dynamic proxies. You write interfaces; it writes SQL.

### Repository Hierarchy

| Interface | What It Adds |
|---|---|
| `CrudRepository<T, ID>` | Basic save, findById, findAll, delete |
| `PagingAndSortingRepository<T, ID>` | Adds pagination and sorting |
| `JpaRepository<T, ID>` | Adds batch ops, flush — **extend this by default** |

### Query Method Naming

Spring parses the method name and generates SQL automatically:

```java
List<Employee> findByDept(String dept);
Employee findByName(String name);
List<Employee> findByDeptAndName(String dept, String name);
List<Employee> findTop3ByDept(String dept);
List<Employee> findByDeptOrderByNameAsc(String dept);
boolean existsByName(String name);
long countByDept(String dept);
```

### `@Query` — Custom Queries

```java
// JPQL
@Query("SELECT e FROM Employee e WHERE e.name LIKE %:name%")
List<Employee> searchByName(@Param("name") String name);

// Native SQL
@Query(value = "SELECT * FROM employees WHERE dept=:d", nativeQuery = true)
List<Employee> findByDeptNative(@Param("d") String dept);
```

### `@Modifying`

```java
@Modifying @Transactional
@Query("UPDATE Employee e SET e.dept=:dept WHERE e.id=:id")
void updateDept(@Param("id") int id, @Param("dept") String dept);
```

### Pagination

```java
Page<Employee> findByDept(String dept, Pageable pageable);

Pageable p = PageRequest.of(0, 5, Sort.by("name").ascending());
Page<Employee> page = repo.findByDept("IT", p);
page.getTotalPages(); page.getContent();
```

### Specifications — Dynamic Queries

```java
Specification<Employee> highEarners = (root, q, cb) -> cb.greaterThan(root.get("salary"), 50000);
Specification<Employee> inIT = (root, q, cb) -> cb.equal(root.get("dept"), "IT");
repo.findAll(Specification.where(inIT).and(highEarners));
// Repository must also extend JpaSpecificationExecutor<Employee>
```

### Auditing

```java
@EnableJpaAuditing // in config

@EntityListeners(AuditingEntityListener.class)
@Entity public class Employee {
    @CreatedDate private LocalDateTime createdAt;
    @LastModifiedDate private LocalDateTime updatedAt;
}
```

### Custom Repository Implementation

```java
public interface EmpRepositoryCustom { List<Employee> findHighSalary(); }

@Repository public class EmpRepositoryImpl implements EmpRepositoryCustom {
    @PersistenceContext EntityManager em;
    public List<Employee> findHighSalary() {
        return em.createQuery("FROM Employee e WHERE e.salary > 100000", Employee.class).getResultList();
    }
}

public interface EmpRepository extends JpaRepository<Employee, Integer>, EmpRepositoryCustom {}
```

### Common Mistakes

| Mistake | Fix |
|---|---|
| `LazyInitializationException` | `@Transactional` or `FetchType.EAGER` |
| Changes not saved in `@Modifying` | Forgot `@Transactional` — required |
| N+1 query problem | Lazy collections fetched in a loop — use `JOIN FETCH` or `@BatchSize` |
| Overusing native queries | Hard to maintain — prefer JPQL or method naming |

### Summary

| Concept | Description |
|---|---|
| `JpaRepository` | Base interface for all CRUD + pagination |
| Method naming | Auto-generated queries from method names |
| `@Query` | Custom JPQL or native SQL |
| `@Modifying` + `@Transactional` | Update/delete custom queries |
| `Pageable` + `Page<T>` | Pagination and sorting |
| `Specification` | Dynamic, composable query predicates |
| `@EnableJpaAuditing` | Auto-populate created/updated timestamps |
| `EntityManager` | Low-level JPA — full control |

---

## Chapter 10 — Spring Boot

> Spring Boot = sensible defaults + auto-configuration + embedded server. It eliminates boilerplate; it doesn't change how Spring works under the hood.

### `@SpringBootApplication`

```java
// One annotation, three jobs:
// @SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan

public class App {
    public static void main(String[] args) { SpringApplication.run(App.class, args); }
}
```

### Auto-Configuration

Boot detects what's on the classpath and configures it. Add `spring-boot-starter-data-jpa` → `EntityManagerFactory`, transaction manager, repo scanning — all set up automatically.

Override anything in `application.properties`. Boot always defers to explicit configuration.

### Key Starters

| Starter | What You Get |
|---|---|
| `spring-boot-starter-web` | REST APIs, embedded Tomcat |
| `spring-boot-starter-data-jpa` | Hibernate + JPA |
| `spring-boot-starter-security` | Auth and authorization |
| `spring-boot-starter-test` | JUnit + MockMVC + Mockito |
| `spring-boot-starter-actuator` | Health, metrics, monitoring |
| `spring-boot-devtools` | Hot reload in dev |

### `application.properties`

```properties
server.port=8081
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
logging.level.com.example=DEBUG
```

### Profiles

```properties
# application-dev.properties
server.port=8080

# application-prod.properties
server.port=9090

# Activate:
spring.profiles.active=prod
# Or: java -jar app.jar --spring.profiles.active=dev
```

Property resolution priority: `command-line args > env vars > application.properties > defaults`

### `CommandLineRunner`

```java
@Component public class StartupRunner implements CommandLineRunner {
    public void run(String... args) { System.out.println("Context loaded!"); }
}
```

### Actuator

```properties
# Expose all (restrict in prod):
management.endpoints.web.exposure.include=*
```

Endpoints: `/actuator/health`, `/actuator/info`, `/actuator/metrics`, `/actuator/env`

### Testing

| Annotation | What It Tests |
|---|---|
| `@SpringBootTest` | Full context integration test |
| `@DataJpaTest` | Repository tests only (no web layer) |
| `@WebMvcTest` | Controller tests only (no DB layer) |
| `@MockBean` | Replace a bean with a mock in Spring context |

### Build and Run

```bash
mvn clean package
java -jar target/app.jar
```

### Summary

| Concept | Description |
|---|---|
| `@SpringBootApplication` | Entry point + auto-config + component scan |
| Starters | Pre-packaged dependency groups |
| `application.properties` | Central configuration |
| Profiles | Environment-specific settings |
| Auto-configuration | Boot detects and configures based on classpath |
| Embedded server | No WAR, no external Tomcat |
| Actuator | Health + metrics for production |
| `CommandLineRunner` | Startup logic hook |

> ⚠️ Never treat auto-configuration as magic. Know what Boot configures so you can override it. Always add Actuator to prod services.