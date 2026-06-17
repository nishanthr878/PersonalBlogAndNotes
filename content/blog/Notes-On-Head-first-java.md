---
title: Java Notes (Parts 1-7)
date: 2026-03-16
description: A single mega-post covering Java fundamentals, OOP, core concepts, advanced topics, concurrency, I/O/serialization, and networking.
tags:
  - java
  - notes
  - oops
  - concurrency
  - io
  - networking
draft: false
---
# Java Reference Notes (Parts 1–7)

---

## Part 1 — Java Fundamentals

> **Core idea:** Java compiles to bytecode → JVM runs it on any OS. Write once, run anywhere.

### JDK vs JRE vs JVM

| Term | Contains | Purpose |
|---|---|---|
| JVM | bytecode interpreter | Runs `.class` files |
| JRE | JVM + standard libraries | Runtime environment |
| JDK | JRE + compiler + tools | Development environment |

### Primitive Types

| Type | Size | Default | Example |
|---|---|---|---|
| `byte` | 1B | 0 | `byte b = 10;` |
| `short` | 2B | 0 | `short s = 1000;` |
| `int` | 4B | 0 | `int x = 42;` |
| `long` | 8B | 0L | `long n = 99999L;` |
| `float` | 4B | 0.0f | `float f = 3.14f;` |
| `double` | 8B | 0.0 | `double d = 3.14159;` |
| `char` | 2B Unicode | `\u0000` | `char c = 'A';` |
| `boolean` | logical | `false` | `boolean ok = true;` |

Reference types live on the heap; variables hold references. A reference with no object is `null`.

### Control Flow

```java
// Switch expression (modern)
switch (day) {
    case 1 -> System.out.println("Mon");
    default -> System.out.println("Other");
}

// Enhanced for
for (String s : names) System.out.println(s);
```

### Stack vs Heap

| Area | Stores | Lifetime |
|---|---|---|
| Stack | locals, method calls | until method returns |
| Heap | objects, instance vars | until GC collects |

```java
Dog d = new Dog(); // reference on stack → object on heap
```

### Strings

- **Immutable** — modifications create a new object.
- `==` checks reference equality. `equals()` checks content.
- Use `StringBuilder` in loops — string concatenation with `+` creates a new object each time.

```java
StringBuilder sb = new StringBuilder("Hi");
sb.append(" there");
sb.toString(); // "Hi there"
```

### Key Pitfalls

- `==` vs `equals()` — classic trap.
- Instance vars get defaults (0/null/false); local vars do not — compiler error if uninitialized.
- Static methods can't access instance vars directly.
- Default no-arg constructor disappears once you define any constructor.
- Pass-by-value always. References are copied, not objects.
- GC timing is not guaranteed — only eligibility matters.

---

## Part 2 — Object-Oriented Programming

> **The four pillars:** Encapsulation, Abstraction, Inheritance, Polymorphism.

### Encapsulation

```java
public class BankAccount {
    private double balance;

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public double getBalance() { return balance; }
}
```

`private` state + controlled public access. Enables validation, hides internals, future-proofs the API.

### Inheritance

```java
class Animal {
    void eat() { System.out.println("Eating..."); }
}

class Dog extends Animal {
    void bark() { System.out.println("Woof!"); }
}
```

- Single inheritance only (`extends` one class).
- Private members are not inherited.
- `super()` calls parent constructor — must be first statement.

### Method Overriding vs Overloading

| Feature | Overloading | Overriding |
|---|---|---|
| Where | Same class | Subclass modifies superclass |
| Signature | Must differ | Must be identical |
| Resolved | Compile-time | Runtime |
| Polymorphism | No | Yes |

Rules for overriding: same signature, can't reduce visibility, can't override `final` or `static`.

### Polymorphism

```java
Animal a = new Dog(); // reference type = Animal, object type = Dog
a.eat();              // Dog's eat() runs — determined at runtime
```

Reference type controls what you can *call*. Object type controls what *runs*.

### Abstract Classes vs Interfaces

| Feature | Abstract Class | Interface |
|---|---|---|
| Inheritance | One | Many |
| Methods | Abstract + concrete | Abstract + default/static (Java 8+) |
| Variables | Any | `public static final` only |
| Constructors | Yes | No |
| Use case | Shared partial logic | Shared contract |

```java
abstract class Animal {
    abstract void makeSound();       // subclass must implement
    void sleep() { /* shared */ }   // optional override
}

interface Flyable {
    void fly();
    default void land() { System.out.println("Landing..."); } // Java 8+
}
```

### `Object` Class

Every class extends `java.lang.Object`. Always override both `equals()` and `hashCode()` together — breaking one breaks hashed collections.

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Dog)) return false;
    return this.name.equals(((Dog) o).name);
}

@Override
public int hashCode() { return name.hashCode(); }
```

### IS-A vs HAS-A

- **IS-A** → inheritance (`Dog extends Animal`)
- **HAS-A** → composition (prefer this — less coupling)

```java
class Car {
    private Engine engine = new Engine(); // HAS-A
}
```

### Design Principles

- Prefer composition over inheritance.
- Program to an interface: `List<String> list = new ArrayList<>();`
- Encapsulate what varies.
- Don't call overridable methods in constructors — the subclass isn't fully initialized yet.

### Key Pitfalls

- Constructors are not inherited.
- Static methods are hidden, not overridden.
- Overusing `instanceof` signals poor polymorphic design.
- Avoid deep inheritance chains — they become unmaintainable.

---

## Part 3 — Core Java Concepts

### `static` vs Instance

| | Static | Instance |
|---|---|---|
| Memory | One per class | One per object |
| Access | `ClassName.method()` | `object.method()` |
| Can access instance members? | No | Yes |

### `final`

| Usage | Effect |
|---|---|
| `final` variable | No reassignment after init |
| `final` method | Cannot be overridden |
| `final` class | Cannot be extended |

Blank finals must be assigned in constructor:

```java
class Config {
    final int port;
    Config(int port) { this.port = port; }
}
```

### Initialization Order

```java
class Sample {
    static { System.out.println("1. Static block"); }     // once, on class load
    { System.out.println("2. Instance block"); }          // each instantiation
    Sample() { System.out.println("3. Constructor"); }    // each instantiation
}
```

### Wrapper Classes + Autoboxing

| Primitive | Wrapper |
|---|---|
| `int` | `Integer` |
| `double` | `Double` |
| `char` | `Character` |
| `boolean` | `Boolean` |

```java
Integer a = 5;       // autoboxing
int b = a + 1;       // unboxing

int i = Integer.parseInt("42");
String s = Integer.toString(100);
```

> ⚠️ Unboxing `null` throws `NullPointerException`.

### Nested / Inner Classes

| Type | Access to outer | Instantiation |
|---|---|---|
| Member inner | Yes | `new Outer().new Inner()` |
| Static nested | No (static only) | `new Outer.Nested()` |
| Local inner | Yes (effectively final vars) | Inside method only |
| Anonymous | Yes | Inline at usage point |

```java
// Anonymous (old style)
Runnable r1 = new Runnable() { public void run() { ... } };

// Lambda (prefer this)
Runnable r2 = () -> System.out.println("Running");
```

### Enums

```java
enum Level {
    LOW(1), MEDIUM(2), HIGH(3);
    private final int code;
    Level(int code) { this.code = code; }
    public int getCode() { return code; }
}
```

Type-safe constants. Can have fields, methods, constructors.

### Immutable Classes

Recipe: `final` class + `private final` fields + no setters + defensive copies of mutable fields.

```java
final class Employee {
    private final String name;
    private final int id;
    Employee(String name, int id) { this.name = name; this.id = id; }
    public String getName() { return name; }
}
```

### `var` (Java 10+)

Local variables only. Type inferred at compile time — not dynamic.

```java
var list = new ArrayList<String>(); // inferred as ArrayList<String>
```

### Access Modifiers

| Modifier | Same Class | Same Package | Subclass | Everywhere |
|---|---|---|---|---|
| `public` | ✓ | ✓ | ✓ | ✓ |
| `protected` | ✓ | ✓ | ✓ | ✗ |
| default | ✓ | ✓ | ✗ | ✗ |
| `private` | ✓ | ✗ | ✗ | ✗ |

---

## Part 4 — Advanced Java

### Exception Handling

```java
try {
    int x = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Caught: " + e.getMessage());
} finally {
    System.out.println("Always runs — cleanup here");
}
```

- Catch specific exceptions first, broader ones last.
- `finally` always runs — even if you `return` inside `try`.
- **Try-with-resources** — auto-closes anything implementing `AutoCloseable`:

```java
try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
    System.out.println(br.readLine());
} catch (IOException e) {
    e.printStackTrace();
}
```

- **Checked** exceptions (must declare or catch): `IOException`, `SQLException`.
- **Unchecked** exceptions (runtime, no forced handling): `NullPointerException`, `IllegalArgumentException`.

Custom exception:

```java
class InvalidUserException extends Exception {
    InvalidUserException(String msg) { super(msg); }
}
```

### Collections Framework

```
Collection
├── List   → ArrayList, LinkedList
├── Set    → HashSet, LinkedHashSet, TreeSet
└── Queue  → PriorityQueue, ArrayDeque

Map        → HashMap, LinkedHashMap, TreeMap
```

**Choose by behavior:**

| Collection | Order | Duplicates | Null | Performance |
|---|---|---|---|---|
| `ArrayList` | insertion | yes | yes | O(1) get |
| `LinkedList` | insertion | yes | yes | O(1) add/remove at ends |
| `HashSet` | none | no | one null | O(1) add/contains |
| `TreeSet` | sorted | no | no | O(log n) |
| `HashMap` | none | keys unique | yes | O(1) |
| `LinkedHashMap` | insertion | keys unique | yes | O(1) |
| `TreeMap` | key-sorted | keys unique | no | O(log n) |

```java
// Safe removal during iteration — never use for-each to remove
Iterator<String> it = names.iterator();
while (it.hasNext()) {
    if (it.next().equals("Bob")) it.remove(); // safe
}
```

### Generics

Type-safe containers. Errors caught at compile time, not runtime.

```java
class Box<T> {
    private T value;
    void set(T v) { value = v; }
    T get() { return value; }
}

// Bounded type
class Calculator<T extends Number> {
    double add(T a, T b) { return a.doubleValue() + b.doubleValue(); }
}
```

Wildcards:

| Syntax | Meaning | Use when |
|---|---|---|
| `?` | any type | read-only, unknown type |
| `? extends T` | T or subtype | reading from structure |
| `? super T` | T or supertype | writing to structure |

> ⚠️ Type erasure: generic type info is removed at runtime. `List<String>` and `List<Integer>` are both `List` at runtime.

### Comparable vs Comparator

```java
// Comparable — natural ordering, built into the class
class Student implements Comparable<Student> {
    int id;
    public int compareTo(Student s) { return this.id - s.id; }
}

// Comparator — external, flexible, multiple orderings
Comparator<Student> byName = (a, b) -> a.name.compareTo(b.name);
list.sort(byName);
```

### Key Pitfalls

- `ConcurrentModificationException` — modifying a collection while iterating with for-each.
- `equals()`/`hashCode()` mismatch — breaks `HashMap`, `HashSet`.
- Mutable objects as `HashMap` keys — hash changes, key is lost.
- Raw types (`List` instead of `List<String>`) — lose all type safety.

---

## Part 5 — Concurrency & Threads

> **Core problem:** Multiple threads sharing mutable state → race conditions, data corruption, deadlocks.

### Creating Threads

```java
// Option 1 — extend Thread (limits flexibility)
class MyThread extends Thread {
    public void run() { System.out.println("Running"); }
}
new MyThread().start();

// Option 2 — implement Runnable (preferred)
Thread t = new Thread(() -> System.out.println("Running"));
t.start();
```

> ⚠️ `start()` schedules the thread. `run()` just calls the method on the current thread. Never call `run()` directly.

### Thread Lifecycle

| State | Description |
|---|---|
| New | Created, not started |
| Runnable | Ready or actively running |
| Blocked/Waiting | Waiting for lock or signal |
| Timed Waiting | `sleep()` or `wait(timeout)` |
| Terminated | Finished execution |

### Synchronization

```java
class Counter {
    private int count = 0;

    public synchronized void increment() { count++; } // method-level lock

    public void decrement() {
        synchronized(this) { count--; }               // block-level lock
    }
}
```

- `synchronized` on an instance method locks `this`.
- `synchronized` on a static method locks the `Class` object.
- `wait()` releases the lock. `sleep()` does not.

### `volatile`

Guarantees visibility across threads. Does **not** guarantee atomicity.

```java
volatile boolean running = true; // reads/writes always go to main memory
```

Use for simple flags. For increment/decrement, use `AtomicInteger`.

### Atomic Operations

```java
AtomicInteger count = new AtomicInteger(0);
count.incrementAndGet(); // thread-safe, no synchronization needed
count.compareAndSet(5, 10); // CAS operation
```

### Executors (Prefer Over Raw Threads)

```java
ExecutorService pool = Executors.newFixedThreadPool(4);
pool.submit(() -> System.out.println("Task"));
pool.shutdown(); // don't forget this
```

### Callable + Future (Get Results from Threads)

```java
Callable<Integer> task = () -> 5 + 10;
ExecutorService ex = Executors.newSingleThreadExecutor();
Future<Integer> result = ex.submit(task);
System.out.println(result.get()); // blocks until done
ex.shutdown();
```

### `ReentrantLock` (More Control Than `synchronized`)

```java
Lock lock = new ReentrantLock();
lock.lock();
try {
    // critical section
} finally {
    lock.unlock(); // always in finally
}
```

### Inter-Thread Communication

```java
// Must be inside synchronized block
wait();    // releases lock, waits for notify()
notify();  // wakes one waiting thread
notifyAll(); // wakes all
```

### Deadlocks

Caused by two threads each holding a lock the other needs. Avoid by:
- Always acquiring locks in the same order.
- Keeping lock scope minimal.
- Using `tryLock()` with timeout.

### Concurrent Collections

Prefer over manually synchronized wrappers:

| Class | Use Case |
|---|---|
| `ConcurrentHashMap` | Thread-safe map, segment-level locking |
| `CopyOnWriteArrayList` | Read-heavy, rare writes |
| `ArrayBlockingQueue` | Producer-consumer pattern |

### `ThreadLocal`

Per-thread variable — each thread gets its own copy. Common in web frameworks for user context.

```java
ThreadLocal<Integer> threadId = ThreadLocal.withInitial(() -> 0);
```

### Key Pitfalls

- Calling `run()` instead of `start()` — no new thread created.
- `sleep()` doesn't release locks — can cause contention.
- Missing `volatile` on shared flags — thread may never see update.
- Forgetting `finally` around `lock.unlock()` — deadlock on exception.

---

## Part 6 — I/O, Files, and Serialization

> **Always use try-with-resources.** Always use buffered streams for performance.

### I/O Stream Hierarchy

| Type | Root Classes | For |
|---|---|---|
| Byte streams | `InputStream` / `OutputStream` | Binary data (images, files) |
| Char streams | `Reader` / `Writer` | Text data |

### Reading and Writing Files

```java
// Text — buffered for performance
try (BufferedReader br = new BufferedReader(new FileReader("input.txt"));
     BufferedWriter bw = new BufferedWriter(new FileWriter("output.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {
        bw.write(line);
        bw.newLine();
    }
}
```

```java
// Binary
try (FileInputStream in = new FileInputStream("file.bin");
     FileOutputStream out = new FileOutputStream("copy.bin")) {
    byte[] buf = new byte[1024];
    int bytesRead;
    while ((bytesRead = in.read(buf)) != -1) {
        out.write(buf, 0, bytesRead);
    }
}
```

### NIO (`java.nio.file`) — Prefer for Modern Code

```java
Path path = Paths.get("data.txt");

// Check existence
Files.exists(path);

// Read all lines
List<String> lines = Files.readAllLines(path);

// Write
Files.write(path, lines);

// Copy
Files.copy(path, Paths.get("backup.txt"), StandardCopyOption.REPLACE_EXISTING);

// Walk directory tree
try (Stream<Path> paths = Files.walk(Paths.get("/projects"))) {
    paths.filter(Files::isRegularFile).forEach(System.out::println);
}
```

### Serialization

Persist an object's state to disk or network.

```java
class Employee implements Serializable {
    private static final long serialVersionUID = 1L; // versioning
    private String name;
    private int id;
    transient String password; // excluded from serialization
}

// Write
try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("emp.ser"))) {
    out.writeObject(new Employee("Alice", 101));
}

// Read
try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("emp.ser"))) {
    Employee e = (Employee) in.readObject();
}
```

- `transient` — skips that field during serialization.
- `serialVersionUID` — if it mismatches on deserialization, `InvalidClassException` is thrown. Always declare it explicitly.

### `Externalizable` vs `Serializable`

| | `Serializable` | `Externalizable` |
|---|---|---|
| Control | Automatic | Full manual control |
| Performance | Slower | Faster (you choose what to write) |
| Methods needed | None | `writeExternal()` + `readExternal()` |

### Key Pitfalls

- Forgetting to close streams → resource leak. Use try-with-resources.
- Unbuffered streams are slow — always wrap with `Buffered*`.
- Serializing sensitive data without `transient` — passwords end up on disk.
- Missing `serialVersionUID` — class changes break deserialization silently.

---

## Part 7 — Networking & Distributed Systems

> **TCP** = reliable, ordered, connection-based. **UDP** = fast, connectionless, no delivery guarantee.

### TCP Client/Server

```java
// Server
ServerSocket server = new ServerSocket(5000);
Socket socket = server.accept(); // blocks until client connects
DataInputStream in = new DataInputStream(socket.getInputStream());
System.out.println(in.readUTF());
server.close();

// Client
Socket socket = new Socket("localhost", 5000);
DataOutputStream out = new DataOutputStream(socket.getOutputStream());
out.writeUTF("Hello Server");
socket.close();
```

For production: wrap in `BufferedReader`/`BufferedWriter` and handle each client in a thread pool.

### UDP (Datagrams)

```java
// Sender
DatagramSocket socket = new DatagramSocket();
byte[] data = "Hello".getBytes();
DatagramPacket packet = new DatagramPacket(data, data.length, InetAddress.getLocalHost(), 5000);
socket.send(packet);
socket.close();

// Receiver
DatagramSocket socket = new DatagramSocket(5000);
byte[] buf = new byte[1024];
DatagramPacket packet = new DatagramPacket(buf, buf.length);
socket.receive(packet);
System.out.println(new String(packet.getData()).trim());
```

### URL — Quick HTTP Read

```java
URL url = new URL("https://example.com");
try (BufferedReader br = new BufferedReader(new InputStreamReader(url.openStream()))) {
    br.lines().forEach(System.out::println);
}
```

### RMI vs Sockets vs Modern Alternatives

| Option | Level | Use Case |
|---|---|---|
| Sockets | Low (bytes) | Custom protocols, max control |
| RMI | High (objects) | Legacy distributed Java objects |
| REST + JSON | High | Standard web APIs — use this |
| gRPC | High + typed | High-performance microservices |
| WebSockets | Persistent | Real-time bidirectional |
| Kafka/RabbitMQ | Async | Event-driven, decoupled systems |

> RMI is legacy. For anything new, use REST or gRPC. For event-driven systems, use a message broker.

### `InetAddress`

```java
InetAddress addr = InetAddress.getByName("www.example.com");
addr.getHostName();    // domain name
addr.getHostAddress(); // IP string
```

### Key Pitfalls

- Not running server before client — connection refused.
- Not closing sockets → resource leak.
- UDP has no delivery guarantee — implement your own ACK for reliability.
- RMI requires registry running, policy files, and is a pain in firewalled environments. Use REST.

---

## Quick Reference — When to Use What

### Collections

| Need | Use |
|---|---|
| Fast random access | `ArrayList` |
| Fast insert/delete at ends | `LinkedList` or `ArrayDeque` |
| Unique elements, fast lookup | `HashSet` |
| Unique + sorted | `TreeSet` |
| Key-value, fast lookup | `HashMap` |
| Key-value + insertion order | `LinkedHashMap` |
| Key-value + sorted keys | `TreeMap` |
| Thread-safe map | `ConcurrentHashMap` |

### Concurrency

| Need | Use |
|---|---|
| Thread pool | `ExecutorService` |
| Thread-safe counter | `AtomicInteger` |
| Return value from thread | `Callable` + `Future` |
| Shared flag across threads | `volatile boolean` |
| Fine-grained locking | `ReentrantLock` |
| Per-thread state | `ThreadLocal` |

### I/O

| Need | Use |
|---|---|
| Read text file | `BufferedReader` + `FileReader` |
| Write text file | `BufferedWriter` + `FileWriter` |
| Read binary | `FileInputStream` |
| Modern file ops | `Files` + `Paths` (NIO) |
| Persist objects | `ObjectOutputStream` / `ObjectInputStream` |