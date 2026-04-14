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

## Table of contents

- Part 1: Java Fundamentals
- Part 2: Object-Oriented Programming
- Part 3: Core Java Concepts
- Part 4: Advanced Java
- Part 5: Concurrency & Threads
- Part 6: I/O, Files, and Serialization
- Part 7: Networking & Distributed Systems

---

## Part 1 - Java Fundamentals

### 1. The Spirit of Java

#### Platform Independence

- Java code compiles into bytecode (`.class` files) understood by the JVM (Java Virtual Machine).
- "Write once, run anywhere": the JVM translates to native machine code per OS.
- JRE (Java Runtime Environment) = JVM + standard libraries.
- JDK (Java Development Kit) = JRE + compiler + debugging tools.

#### Key Features

| Concept | Description |
| --- | --- |
| OOP | Everything revolves around classes and objects. |
| Garbage Collection | Automatic memory cleanup; no manual `free()`. |
| Strong Typing | Variables and methods have explicit types. |
| Security Model | Runs in a controlled sandbox model. |
| Multithreading | Built-in concurrency support. |

---

### 2. The Basic Structure of a Java Program

A minimal program:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

What's going on:

- `public class HelloWorld` defines a class (filename must match).
- `public static void main(String[] args)` is the entry point.
- `System.out.println()` prints with a newline.

Compilation and execution:

```bash
javac HelloWorld.java   # produces HelloWorld.class
java HelloWorld         # runs it
```

---

### 3. Variables and Data Types

#### Primitive Types

| Type | Size | Example | Default |
| --- | --- | --- | --- |
| `byte` | 1 B | `byte b = 10;` | 0 |
| `short` | 2 B | `short s = 1000;` | 0 |
| `int` | 4 B | `int x = 42;` | 0 |
| `long` | 8 B | `long n = 99999L;` | 0L |
| `float` | 4 B | `float f = 3.14f;` | 0.0f |
| `double` | 8 B | `double d = 3.14159;` | 0.0 |
| `char` | 2 B Unicode | `char c = 'A';` | `\u0000` |
| `boolean` | logical | `boolean ok = true;` | `false` |

#### Reference Types

Objects and arrays live on the heap; variables hold references:

```java
String name = "Nishanth";
int[] nums = new int[5];
```

A reference variable holds `null` when it points to nothing.

---

### 4. Operators and Control Flow

#### Arithmetic

`+ - * / %` (integer division truncates):

```java
int x = 5 / 2;       // 2
double y = 5 / 2.0;  // 2.5
```

#### Relational and Logical

`== != > < >= <=` and `&& || !`

#### Assignment and Increment

```java
x += 5;  // x = x + 5
i++;     // post-increment
++i;     // pre-increment
```

#### Conditional Statements

```java
if (score > 90) grade = 'A';
else if (score > 75) grade = 'B';
else grade = 'C';
```

#### Switch

```java
switch (day) {
    case 1 -> System.out.println("Mon");
    case 2 -> System.out.println("Tue");
    default -> System.out.println("Other");
}
```

#### Loops

```java
for (int i = 0; i < 5; i++) System.out.println(i);

int i = 0;
while (i < 5) { i++; }

do { i--; } while (i > 0);

for (String s : names) System.out.println(s); // enhanced for
```

---

### 5. Arrays

```java
int[] nums = {1,2,3};
nums[0] = 99;
System.out.println(nums.length);
```

- Arrays are objects; `length` is a property, not a method.
- Elements get default values (0/false/null).

---

### 6. Classes and Objects

Defining a class:

```java
public class Dog {
    String name;
    int age;

    void bark() {
        System.out.println(name + " says Woof!");
    }
}
```

Creating objects:

```java
Dog d1 = new Dog();
d1.name = "Rex";
d1.age = 3;
d1.bark(); // Rex says Woof!
```

---

### 7. Instance Variables vs Local Variables

- Instance variables: declared in class; live as long as the object.
- Local variables: inside methods; live on the stack until method ends.

```java
class Phone {
    String model; // instance variable

    void setModel(String m) {
        String prefix = "Model:"; // local variable
        model = prefix + m;
    }
}
```

---

### 8. Methods

Declaration and return:

```java
int add(int a, int b) {
    return a + b;
}
```

Method overloading:

```java
void bark() {}
void bark(int times) {}
void bark(String sound) {}
```

---

### 9. Encapsulation and Access Control

Encapsulation:

```java
public class Account {
    private double balance;

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public double getBalance() {
        return balance;
    }
}
```

Access modifiers:

| Modifier | Visible To | Typical Use |
| --- | --- | --- |
| `public` | everywhere | API methods |
| `protected` | same package + subclasses | inheritance hooks |
| (default) | same package | package helpers |
| `private` | same class only | encapsulated state |

---

### 10. Constructors

```java
public class Cat {
    String name;
    Cat(String n) { name = n; }
}
```

If you define any constructor, Java doesn't create the default no-arg one. To have both:

```java
Cat() { name = "Unnamed"; }
Cat(String n) { name = n; }
```

Constructor chaining:

```java
class Car {
    String model;
    int year;
    Car() { this("Unknown", 0); }
    Car(String model, int year) {
        this.model = model;
        this.year = year;
    }
}
```

---

### 11. Memory Model - Stack vs Heap

| Memory Area | Stores | Lifetime |
| --- | --- | --- |
| Stack | locals, method calls | until return |
| Heap | objects, instance data | until GC |

```java
Dog d = new Dog(); // reference on stack -> object on heap
```

When no reference points to an object, it's eligible for GC.

---

### 12. Static and Final

Static (shared):

```java
class Counter {
    static int count = 0;
    Counter() { count++; }
}
```

Final:

- `final` variable: cannot reassign
- `final` method: cannot override
- `final` class: cannot extend

```java
final class Utility {}
static final double PI = 3.14159;
```

---

### 13. Math Class and Utility Methods

```java
double r = Math.random();
int max = Math.max(10, 20);
int min = Math.min(3, 9);
double abs = Math.abs(-3.5);
long rounded = Math.round(3.7);
```

---

### 14. Strings and StringBuilder

String basics:

- Immutable; modifications create a new object.
- `==` checks references; `equals()` checks content.

```java
String a = "hi";
String b = "hi";
System.out.println(a == b);
System.out.println(a.equals(b));
```

StringBuilder:

```java
StringBuilder sb = new StringBuilder("Hi");
sb.append(" there");
System.out.println(sb.toString());
```

---

### 15. Formatting and Wrapper Classes

Autoboxing:

```java
Integer i = 5;
int n = i;
```

Formatting:

```java
System.out.printf("Value: %.2f", 3.14159);
```

---

### 16. Summary Checklist

- Java -> bytecode -> JVM.
- Primitives typically on stack; objects on heap.
- Class = fields + methods.
- Constructors initialize objects.
- Encapsulation: `private` + controlled access.
- `static` shared; `final` unchangeable.
- String immutable; prefer StringBuilder in loops.
- GC handles unused objects.

---

### 17. Common Pitfalls and Interview Hints

1. `==` vs `equals()`
2. Default constructor disappears once you declare any constructor.
3. Static methods can't access instance vars directly.
4. GC timing isn't guaranteed; eligibility matters.
5. Pass-by-value always (references are copied).
6. Instance vars get defaults; local vars do not.
7. `private < default < protected < public`
8. String concatenation in loops is expensive.

---

## Part 2 - Object-Oriented Programming

### 1. The Core OOP Principles

#### Encapsulation

```java
public class BankAccount {
    private double balance;

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public double getBalance() {
        return balance;
    }
}
```

Encapsulation enables validation, hiding internals, and future-proofing.

#### Abstraction

Focus on what an object does, not how. Use interfaces/abstract classes as contracts.

---

### 2. Inheritance

```java
class Animal {
    void eat() { System.out.println("Eating..."); }
}

class Dog extends Animal {
    void bark() { System.out.println("Woof!"); }
}

Dog d = new Dog();
d.eat();
d.bark();
```

Rules:

- Single inheritance for classes (`extends` one superclass).
- Inherits public/protected members.
- Private members aren't inherited.

---

### 3. The `super` Keyword

```java
class Animal {
    Animal() { System.out.println("Animal created"); }
    void eat() { System.out.println("Animal eats"); }
}

class Dog extends Animal {
    Dog() {
        super();
        System.out.println("Dog created");
    }

    void eat() {
        super.eat();
        System.out.println("Dog munches kibble");
    }
}
```

---

### 4. Constructor Chaining

```java
class A { A() { System.out.println("A"); } }
class B extends A { B() { System.out.println("B"); } }
class C extends B { C() { System.out.println("C"); } }

new C(); // A B C
```

---

### 5. Method Overriding

```java
class Animal { void sound() { System.out.println("Some sound"); } }

class Cat extends Animal {
    @Override
    void sound() { System.out.println("Meow"); }
}
```

Rules: same signature; can't override `final` or `static`; can't reduce visibility.

---

### 6. Overloading vs Overriding

| Feature | Overloading | Overriding |
| --- | --- | --- |
| Relation | same class | subclass modifies superclass |
| Signature | must differ | must be identical |
| Polymorphism | no | yes |
| Resolved | compile-time | runtime |

---

### 7. IS-A and HAS-A

- IS-A: inheritance (`Dog extends Animal`)
- HAS-A: composition

```java
class Engine {}
class Car {
    private Engine engine = new Engine();
}
```

---

### 8. Polymorphism

```java
Animal a = new Dog();
a.eat();
```

Reference type controls what you can call; object type controls what runs.

---

### 9. `instanceof`

```java
if (obj instanceof Dog) {
    Dog d = (Dog) obj;
    d.bark();
}
```

---

### 10. Abstract Classes

```java
abstract class Animal {
    abstract void makeSound();
    void sleep() { System.out.println("Sleeping"); }
}

class Dog extends Animal {
    void makeSound() { System.out.println("Bark!"); }
}
```

---

### 11. Interfaces

```java
interface Animal {
    void eat();
    void move();
}

class Bird implements Animal {
    public void eat() { System.out.println("Pecking food"); }
    public void move() { System.out.println("Flying"); }
}
```

Defaults/statics (Java 8+):

```java
interface Vehicle {
    default void start() { System.out.println("Starting..."); }
    static void stop() { System.out.println("Stopped"); }
}
```

---

### 12. Multiple Inheritance Problem

Java avoids multiple class inheritance; interfaces allow multiple:

```java
interface Flyer { void fly(); }
interface Swimmer { void swim(); }

class Duck implements Flyer, Swimmer {
    public void fly() { System.out.println("Flying"); }
    public void swim() { System.out.println("Swimming"); }
}
```

---

### 13. Object Class

All classes extend `java.lang.Object`.

Key methods: `toString()`, `equals()`, `hashCode()`, `getClass()`, `clone()`, `finalize()` (deprecated).

Overriding `equals()` and `hashCode()`:

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Dog)) return false;
    Dog d = (Dog) o;
    return this.name.equals(d.name);
}

@Override
public int hashCode() {
    return name.hashCode();
}
```

---

### 14. `final` in OOP

```java
final class Constants {
    static final double PI = 3.14159;
}
```

---

### 15. Object Relationships in Memory

```java
Animal myDog = new Dog();
```

- Reference type: `Animal`
- Object type: `Dog`

```java
myDog.eat();  // ok
// myDog.bark(); // not visible via Animal reference
((Dog) myDog).bark();
```

---

### 16. Design Principles

1. Prefer composition over inheritance.
2. Program to an interface: `List<String> list = new ArrayList<>();`
3. Encapsulate what varies.
4. Open/Closed principle.
5. Liskov substitution.

---

### 17. Practical Example: Polymorphic Zoo

```java
abstract class Animal {
    abstract void speak();
}

class Dog extends Animal {
    void speak() { System.out.println("Woof"); }
}

class Cat extends Animal {
    void speak() { System.out.println("Meow"); }
}

class Zoo {
    void makeNoise(Animal a) { a.speak(); }

    public static void main(String[] args) {
        Zoo z = new Zoo();
        z.makeNoise(new Dog());
        z.makeNoise(new Cat());
    }
}
```

Output:

```text
Woof
Meow
```

---

### 18. Abstract Class vs Interface

| Feature | Abstract Class | Interface |
| --- | --- | --- |
| Inheritance | one | many |
| Methods | abstract + concrete | abstract (+ default/static) |
| Vars | any | `public static final` |
| Constructors | yes | no |
| Use case | shared partial logic | shared contract |

---

### 19. Common Pitfalls

1. Constructors aren't inherited.
2. Static methods are hidden, not overridden.
3. Overusing `instanceof` often signals poor design.
4. Avoid deep inheritance.
5. Don't call overridable methods in constructors.

---

### 20. Summary Checklist

- IS-A: inheritance; HAS-A: composition.
- Overriding enables polymorphism.
- `super()` for chaining.
- Abstract classes are templates; interfaces are contracts.
- Every class extends Object.
- Polymorphism runtime; overloading compile-time.

---

## Part 3 - Core Java Concepts

### 1. The Java Memory Model

| Area | Stores | Lifetime |
| --- | --- | --- |
| Stack | calls, locals, params | until method ends |
| Heap | objects, instance vars | until GC |

```java
class Person { String name; }

public class Test {
    public static void main(String[] args) {
        Person p = new Person();
        p.name = "Nishanth";
    }
}
```

GC is not deterministic:

```java
System.gc(); // hint only
```

Reference types: strong (default), weak/soft (caches).

---

### 2. Constructors - Deep Dive

```java
class Box {
    int width, height;
    Box(int w, int h) { width = w; height = h; }
}
```

Chaining:

```java
class Rectangle {
    int width, height;
    Rectangle() { this(1, 1); }
    Rectangle(int w, int h) { width = w; height = h; }
}
```

---

### 3. Initialization Blocks

```java
class Sample {
    static { System.out.println("Static block"); }
    { System.out.println("Instance block"); }
    Sample() { System.out.println("Constructor"); }
}
```

---

### 4. `this` Keyword

- `this.name = name;`
- `display(this);`
- `this("default");`

---

### 5. `static` Keyword

```java
class Counter {
    static int count = 0;
    Counter() { count++; }
}
```

Static methods:

```java
class MathUtils {
    static int square(int n) { return n * n; }
}
```

---

### 6. `final` Keyword

| Usage | Effect |
| --- | --- |
| final var | no reassignment |
| final method | no override |
| final class | no extend |

Blank finals:

```java
class Config {
    final int port;
    Config(int port) { this.port = port; }
}
```

---

### 7. Static vs Instance

| Feature | Static | Instance |
| --- | --- | --- |
| Memory | one per class | one per object |
| Access | class name | object |
| Lifetime | program | until GC |

---

### 8. Wrapper Classes

| Primitive | Wrapper |
| --- | --- |
| `int` | `Integer` |
| `double` | `Double` |
| `char` | `Character` |
| `boolean` | `Boolean` |

```java
Integer a = 5;
int b = a + 1;

int i = Integer.parseInt("42");
String s = Integer.toString(100);
```

---

### 9. Autoboxing/Unboxing

```java
List<Integer> list = new ArrayList<>();
list.add(10);
int n = list.get(0);
```

Beware `NullPointerException` when unboxing `null`.

---

### 10. `String`, `StringBuilder`, `StringBuffer`

```java
String s1 = "Java";
String s2 = "Java";
System.out.println(s1 == s2);
System.out.println(s1.equals(s2));
```

StringBuilder:

```java
StringBuilder sb = new StringBuilder("Java");
sb.append(" Rocks!");
System.out.println(sb);
```

StringBuffer is synchronized (thread-safe).

---

### 11. Packages and Imports

```java
package com.company.utils;

public class Helper {
    public static void print(String msg) {
        System.out.println(msg);
    }
}
```

```java
import com.company.utils.Helper;

public class Test {
    public static void main(String[] args) {
        Helper.print("Hello");
    }
}
```

Static imports:

```java
import static java.lang.Math.*;
System.out.println(sqrt(16));
```

---

### 12. Access Modifiers Recap

| Modifier | Class | Package | Subclass | World |
| --- | --- | --- | --- | --- |
| public | yes | yes | yes | yes |
| protected | yes | yes | yes | no |
| default | yes | yes | no | no |
| private | yes | no | no | no |

---

### 13. Nested and Inner Classes

Inner class:

```java
class Outer {
    class Inner {
        void show() { System.out.println("Inner"); }
    }
}
Outer.Inner obj = new Outer().new Inner();
```

Static nested:

```java
class Outer {
    static class Nested {
        void show() { System.out.println("Nested"); }
    }
}
Outer.Nested n = new Outer.Nested();
```

Anonymous class:

```java
Button b = new Button();
b.addActionListener(new ActionListener() {
    public void actionPerformed(ActionEvent e) {
        System.out.println("Clicked!");
    }
});
```

---

### 14. Enums

```java
enum Day { MONDAY, TUESDAY, WEDNESDAY; }
Day d = Day.MONDAY;
```

Enum with fields:

```java
enum Level {
    LOW(1), MEDIUM(2), HIGH(3);
    private int code;
    Level(int code) { this.code = code; }
    public int getCode() { return code; }
}
```

---

### 15. Immutable Classes

```java
final class Employee {
    private final String name;
    private final int id;

    Employee(String name, int id) {
        this.name = name;
        this.id = id;
    }

    public String getName() { return name; }
    public int getId() { return id; }
}
```

---

### 16. `var` (Java 10+)

```java
var list = new ArrayList<String>();
list.add("Java");
```

Local variables only; inferred at compile time.

---

### 17. Common Mistakes

1. Static methods can't access instance data.
2. Calling instance methods from `main()` without creating an object.
3. Comparing Strings with `==` instead of `equals()`.
4. Mutating objects that should be immutable.
5. Assuming GC is immediate.

---

### 18. Summary Checklist

- Stack vs heap.
- Constructors and default constructor rule.
- Static shared across instances.
- Final locks modification.
- Wrapper classes + autoboxing.
- StringBuilder for concatenation.
- Packages/imports for organization.
- Enums for type-safe constants.
- Immutable design patterns.

---

## Part 4 - Advanced Java

### 1. Exception Handling

```java
try {
    int x = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
} finally {
    System.out.println("Cleanup code runs always");
}
```

Multiple catch (specific first):

```java
try {
    FileReader f = new FileReader("data.txt");
} catch (FileNotFoundException e) {
    e.printStackTrace();
} catch (IOException e) {
    System.out.println("I/O Error");
}
```

Throwing and declaring:

```java
if (age < 18) throw new IllegalArgumentException("Too young");

void readFile() throws IOException {
    // code
}
```

Custom exception:

```java
class InvalidUserException extends Exception {
    InvalidUserException(String msg) { super(msg); }
}
```

Try-with-resources:

```java
try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
    System.out.println(br.readLine());
} catch (IOException e) {
    e.printStackTrace();
}
```

---

### 2. The Collections Framework

Hierarchy overview:

```text
Collection
|-- List: ArrayList, LinkedList, Vector/Stack
|-- Set: HashSet, LinkedHashSet, TreeSet
`-- Queue: PriorityQueue, ArrayDeque

Map: HashMap, LinkedHashMap, TreeMap
```

List:

```java
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
System.out.println(names.get(0));
```

Set:

```java
Set<String> set = new HashSet<>();
set.add("A");
set.add("A");
System.out.println(set.size());
```

Map:

```java
Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 90);
scores.put("Bob", 80);
System.out.println(scores.get("Alice"));
```

Queue:

```java
Queue<String> q = new LinkedList<>();
q.offer("First");
q.offer("Second");
System.out.println(q.poll());
```

Sorting and iteration:

```java
List<Integer> nums = Arrays.asList(3,1,2);
Collections.sort(nums);
for (int n : nums) System.out.println(n);
```

Safe removal with Iterator:

```java
Iterator<String> it = names.iterator();
while (it.hasNext()) {
    if (it.next().equals("Bob")) it.remove();
}
```

HashMap vs LinkedHashMap vs TreeMap:

| Type | Order | Performance | Null Allowed |
| --- | --- | --- | --- |
| HashMap | unordered | fastest | yes |
| LinkedHashMap | insertion | slightly slower | yes |
| TreeMap | sorted by key | O(log n) | no |

---

### 3. Generics

```java
List<String> list = new ArrayList<>();
list.add("Java");
String s = list.get(0);
```

Generic class:

```java
class Box<T> {
    private T value;
    void set(T v) { value = v; }
    T get() { return value; }
}
```

Bounded types:

```java
class Calculator<T extends Number> {
    double add(T a, T b) {
        return a.doubleValue() + b.doubleValue();
    }
}
```

Wildcards:

| Syntax | Meaning |
| --- | --- |
| `?` | any type |
| `? extends T` | upper bound |
| `? super T` | lower bound |

Type erasure note: JVM doesn't retain generic type params at runtime.

---

### 4. Inner Classes (Deeper)

Member inner:

```java
class Outer {
    private int x = 10;
    class Inner {
        void print() { System.out.println(x); }
    }
}
new Outer().new Inner().print();
```

Static nested:

```java
class Outer {
    static class Nested {
        void show() { System.out.println("Static Nested"); }
    }
}
Outer.Nested n = new Outer.Nested();
```

Local inner:

```java
class Test {
    void display() {
        class Local {
            void msg() { System.out.println("Inside local class"); }
        }
        new Local().msg();
    }
}
```

Anonymous + lambda:

```java
Runnable r1 = new Runnable() {
    public void run() { System.out.println("Running thread"); }
};

Runnable r2 = () -> System.out.println("Running thread");
```

---

### 5. Collections Utilities

```java
List<Integer> list = Arrays.asList(1,2,3);
Collections.reverse(list);
Collections.shuffle(list);
Collections.sort(list);
Collections.min(list);
Collections.max(list);
```

Immutable (Java 9+):

```java
List<String> imm = List.of("A", "B", "C");
```

---

### 6. Comparable and Comparator

Comparable:

```java
class Student implements Comparable<Student> {
    int id;
    public int compareTo(Student s) {
        return this.id - s.id;
    }
}
```

Comparator:

```java
Comparator<Student> byName = (a, b) -> a.name.compareTo(b.name);
Collections.sort(list, byName);
```

---

### 7. EnumSet and EnumMap

```java
enum Direction { NORTH, SOUTH, EAST, WEST }

EnumSet<Direction> dirs = EnumSet.of(Direction.NORTH, Direction.EAST);
EnumMap<Direction, String> map = new EnumMap<>(Direction.class);
map.put(Direction.NORTH, "Up");
```

---

### 8. Common Pitfalls

1. `ConcurrentModificationException` while modifying during iteration.
2. Unchecked casts / raw types.
3. `equals()`/`hashCode()` mismatch breaks hashed collections.
4. Mutable keys in HashMap.
5. Misusing synchronized wrappers vs concurrent collections.

---

### 9. Summary Checklist

- Use try/catch/finally or try-with-resources.
- Pick the right collection by behavior and performance.
- Use generics for type safety.
- Prefer lambdas for functional single-method cases.
- Don't mutate collections during foreach iteration.

---

## Part 5 - Concurrency & Threads

### 1. What Is a Thread?

A thread is a path of execution. Java starts with the main thread; you can create more.

---

### 2. Creating Threads

Extending `Thread`:

```java
class MyThread extends Thread {
    public void run() {
        System.out.println("Running in " + Thread.currentThread().getName());
    }
}

public class Demo {
    public static void main(String[] args) {
        MyThread t1 = new MyThread();
        t1.start();
    }
}
```

Implementing `Runnable`:

```java
class Task implements Runnable {
    public void run() {
        System.out.println("Running via Runnable");
    }
}

public class Demo {
    public static void main(String[] args) {
        Thread t = new Thread(new Task());
        t.start();
    }
}
```

---

### 3. Thread Lifecycle

| State | Description |
| --- | --- |
| New | created, not started |
| Runnable | ready/running |
| Blocked/Waiting | waiting for resource/condition |
| Timed waiting | sleeping |
| Terminated | finished |

---

### 4. Thread Methods

`start()`, `run()`, `sleep()`, `join()`, `isAlive()`, `interrupt()`, priorities.

```java
t1.start();
t1.join();
```

---

### 5. Synchronization

```java
class Counter {
    private int count = 0;
    public synchronized void increment() { count++; }
    public int getCount() { return count; }
}
```

Synchronized block:

```java
void increment() {
    synchronized(this) {
        // critical section
    }
}
```

Static synchronization locks the class object.

---

### 6. Inter-Thread Communication

```java
class Shared {
    synchronized void waitForSignal() {
        try { wait(); } catch (InterruptedException e) {}
    }

    synchronized void sendSignal() {
        notify();
    }
}
```

Must be in synchronized context; `wait()` releases the lock.

---

### 7. Deadlocks

Avoid by consistent lock ordering, minimal lock scope, higher-level utilities.

---

### 8. `volatile`

Visibility guarantee, not atomicity:

```java
volatile boolean running = true;
```

---

### 9. Atomic Operations

```java
AtomicInteger count = new AtomicInteger();
count.incrementAndGet();
```

---

### 10. Executors, Callable, Future

```java
ExecutorService executor = Executors.newFixedThreadPool(3);
executor.submit(() -> System.out.println("Task executed"));
executor.shutdown();
```

Callable/Future:

```java
Callable<Integer> task = () -> 5 + 10;
ExecutorService ex = Executors.newSingleThreadExecutor();
Future<Integer> result = ex.submit(task);
System.out.println(result.get());
ex.shutdown();
```

---

### 11. Locks (`ReentrantLock`)

```java
Lock lock = new ReentrantLock();
try {
    lock.lock();
} finally {
    lock.unlock();
}
```

---

### 12. Concurrent Collections

`ConcurrentHashMap`, `CopyOnWriteArrayList`, etc.

---

### 13. ThreadLocal

```java
ThreadLocal<Integer> counter = ThreadLocal.withInitial(() -> 0);
counter.set(counter.get() + 1);
System.out.println(counter.get());
```

---

### 14. Common Interview Traps

- `start()` vs `run()`
- `sleep()` doesn't release locks; `wait()` does
- visibility issues without `volatile`/locks
- deadlocks from lock order

---

### 15. Summary Checklist

- Prefer executors/pools over manual threads.
- Use synchronized/locks/atomics correctly.
- Use concurrent collections.
- Design to minimize shared mutable state.

---

## Part 6 - I/O, Files, and Serialization

### 1. Java I/O Model

Two hierarchies:

| Type | For | Root |
| --- | --- | --- |
| Byte streams | binary data | `InputStream` / `OutputStream` |
| Char streams | text | `Reader` / `Writer` |

---

### 2. Byte Streams

Read:

```java
try (FileInputStream in = new FileInputStream("input.bin")) {
    int data;
    while ((data = in.read()) != -1) {
        System.out.print((char) data);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

Write:

```java
try (FileOutputStream out = new FileOutputStream("output.bin")) {
    out.write("Hello".getBytes());
} catch (IOException e) {
    e.printStackTrace();
}
```

---

### 3. Character Streams

```java
try (FileReader fr = new FileReader("data.txt");
     FileWriter fw = new FileWriter("copy.txt")) {
    int ch;
    while ((ch = fr.read()) != -1) {
        fw.write(ch);
    }
}
```

Buffered:

```java
try (BufferedReader br = new BufferedReader(new FileReader("input.txt"));
     BufferedWriter bw = new BufferedWriter(new FileWriter("output.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {
        bw.write(line);
        bw.newLine();
    }
}
```

---

### 4. Data Streams

```java
try (DataOutputStream dos = new DataOutputStream(new FileOutputStream("data.bin"))) {
    dos.writeInt(42);
    dos.writeDouble(3.14);
}

try (DataInputStream dis = new DataInputStream(new FileInputStream("data.bin"))) {
    System.out.println(dis.readInt());
    System.out.println(dis.readDouble());
}
```

---

### 5. `File` and `java.nio.file`

`File` basics:

```java
File f = new File("notes.txt");
if (f.exists()) System.out.println(f.length());
```

NIO:

```java
Path path = Paths.get("data.txt");
System.out.println(Files.exists(path));
Files.copy(path, Paths.get("backup.txt"), StandardCopyOption.REPLACE_EXISTING);
```

Read all lines:

```java
List<String> lines = Files.readAllLines(Paths.get("data.txt"));
```

---

### 6. Serialization

Serializable:

```java
class Employee implements Serializable {
    private String name;
    private int id;
    Employee(String n, int i) { name = n; id = i; }
}
```

Write:

```java
try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("emp.ser"))) {
    Employee e = new Employee("Alice", 101);
    out.writeObject(e);
}
```

Read:

```java
try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("emp.ser"))) {
    Employee e = (Employee) in.readObject();
    System.out.println("Restored: " + e);
}
```

`transient`:

```java
class User implements Serializable {
    String name;
    transient String password;
}
```

`serialVersionUID`:

```java
private static final long serialVersionUID = 1L;
```

Externalizable:

```java
class Employee implements Externalizable {
    String name;
    int id;

    public void writeExternal(ObjectOutput out) throws IOException {
        out.writeObject(name);
        out.writeInt(id);
    }

    public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
        name = (String) in.readObject();
        id = in.readInt();
    }
}
```

---

### 7. Utilities

PrintWriter:

```java
try (PrintWriter pw = new PrintWriter("log.txt")) {
    pw.println("Error: Something broke");
}
```

Scanner:

```java
Scanner sc = new Scanner(new File("data.txt"));
while (sc.hasNextLine()) System.out.println(sc.nextLine());
sc.close();
```

Traversal:

```java
try (Stream<Path> paths = Files.walk(Paths.get("C:/projects"))) {
    paths.filter(Files::isRegularFile).forEach(System.out::println);
}
```

---

### 8. Summary Checklist

- Prefer try-with-resources.
- Use buffered streams for performance.
- Prefer NIO for modern filesystem operations.
- Serialization persists objects; use `transient` for secrets.

---

## Part 7 - Networking & Distributed Systems

### 1. Networking Basics

- IP address identifies a device.
- Port identifies a service.
- Socket = IP + port.

---

### 2. InetAddress

```java
import java.net.*;

public class IPDemo {
    public static void main(String[] args) throws Exception {
        InetAddress addr = InetAddress.getByName("www.example.com");
        System.out.println("Host Name: " + addr.getHostName());
        System.out.println("IP Address: " + addr.getHostAddress());
    }
}
```

---

### 3. TCP Sockets (Client/Server)

Server:

```java
import java.io.*;
import java.net.*;

class Server {
    public static void main(String[] args) throws IOException {
        ServerSocket server = new ServerSocket(5000);
        System.out.println("Server waiting...");
        Socket socket = server.accept();
        DataInputStream in = new DataInputStream(socket.getInputStream());
        System.out.println("Client says: " + in.readUTF());
        server.close();
    }
}
```

Client:

```java
import java.io.*;
import java.net.*;

class Client {
    public static void main(String[] args) throws IOException {
        Socket socket = new Socket("localhost", 5000);
        DataOutputStream out = new DataOutputStream(socket.getOutputStream());
        out.writeUTF("Hello Server");
        socket.close();
    }
}
```

---

### 4. Two-Way Communication

```java
BufferedReader br = new BufferedReader(new InputStreamReader(socket.getInputStream()));
BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
bw.write("Hello back!\n");
bw.flush();
```

---

### 5. UDP (Datagrams)

Sender:

```java
DatagramSocket socket = new DatagramSocket();
byte[] data = "Hello".getBytes();
DatagramPacket packet = new DatagramPacket(
    data, data.length, InetAddress.getLocalHost(), 5000
);
socket.send(packet);
socket.close();
```

Receiver:

```java
DatagramSocket socket = new DatagramSocket(5000);
byte[] buf = new byte[1024];
DatagramPacket packet = new DatagramPacket(buf, buf.length);
socket.receive(packet);
System.out.println(new String(packet.getData()).trim());
socket.close();
```

---

### 6. URL and URLConnection

```java
URL url = new URL("https://example.com");
BufferedReader br = new BufferedReader(new InputStreamReader(url.openStream()));
String line;
while ((line = br.readLine()) != null) System.out.println(line);
br.close();
```

---

### 7. RMI (Remote Method Invocation)

Remote interface:

```java
import java.rmi.*;

public interface Hello extends Remote {
    String sayHello(String name) throws RemoteException;
}
```

Implementation:

```java
import java.rmi.*;
import java.rmi.server.*;

public class HelloImpl extends UnicastRemoteObject implements Hello {
    HelloImpl() throws RemoteException {}
    public String sayHello(String name) { return "Hello, " + name; }
}
```

Server:

```java
import java.rmi.*;
import java.rmi.registry.*;

public class Server {
    public static void main(String[] args) throws Exception {
        HelloImpl obj = new HelloImpl();
        LocateRegistry.createRegistry(1099);
        Naming.rebind("rmi://localhost/HelloService", obj);
        System.out.println("RMI Server ready");
    }
}
```

Client:

```java
import java.rmi.*;

public class Client {
    public static void main(String[] args) throws Exception {
        Hello h = (Hello) Naming.lookup("rmi://localhost/HelloService");
        System.out.println(h.sayHello("Nishanth"));
    }
}
```

Policy file idea (be careful in real systems):

```text
grant {
    permission java.security.AllPermission;
};
```

---

### 8. RMI vs Sockets

| Feature | RMI | Sockets |
| --- | --- | --- |
| Level | high (objects) | low (bytes) |
| Ease | easier | more control |
| Performance | slower | faster |
| Use case | distributed objects | custom protocols |

---

### 9. Modern Alternatives

- REST (HTTP + JSON)
- gRPC
- WebSockets
- Message brokers (Kafka/RabbitMQ)

---

### 10. Summary Checklist

- TCP: `Socket` / `ServerSocket`
- UDP: `DatagramSocket`
- `InetAddress` for host/IP utilities
- `URL`/`URLConnection` for basic web reads
- RMI is legacy; prefer REST/gRPC for modern distributed systems
