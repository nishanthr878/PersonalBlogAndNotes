---
title: JAVA DSA Cheat Sheet
date: 2026-04-19
description: JAVA Cheat sheet for DSA and Collection frameworkd

tags:
  - meta
  - writing
  - JAVA
  - DSA
draft: false
---


## Array

```java
// Init
int[] arr = new int[20];
int[] arr = new int[]{ 1,2,3,4,5 };
int[][] grid = new int[10][10];

// Fill
Arrays.fill(arr, 10);

// Sort
Arrays.sort(arr);                              // ASC
Arrays.sort(arr, Collections.reverseOrder());  // DESC — requires Integer[], not int[]

// Reverse
Collections.reverse(Arrays.asList(arr));

// Copy
int[] copy  = Arrays.copyOf(arr, arr.length);
int[] slice = Arrays.copyOfRange(arr, 1, 4);  // indices [1, 4)

// Binary search (array must be sorted first)
int idx = Arrays.binarySearch(arr, target);   // returns index, or negative if not found
```

> [!warning] `Collections.reverseOrder()` only works on boxed types (`Integer[]`). For `int[]`, sort then swap manually.

---

## ArrayList

```java
// Init
List<Integer> list = new ArrayList<>();
List<Integer> list = new ArrayList<>(Arrays.asList(1, 2, 3));

// 2D list
List<List<String>> grid = new ArrayList<>();
for (int i = 0; i < n; i++) grid.add(new ArrayList<>());
```

|Method|Description|Cost|
|---|---|---|
|`list.add(val)`|Append to end|O(1) amortized|
|`list.add(i, val)`|Insert at index|O(n)|
|`list.get(i)`|Get by index|O(1)|
|`list.set(i, val)`|Replace at index|O(1)|
|`list.remove(i)`|Remove by index|O(n)|
|`list.size()`|Element count|O(1)|
|`list.contains(val)`|Membership check|O(n)|
|`list.indexOf(val)`|First occurrence or -1|O(n)|
|`list.isEmpty()`|Boolean check|O(1)|
|`list.clear()`|Remove all|O(n)|
|`list.addAll(other)`|Append collection|O(k)|
|`list.toArray()`|Convert to Object[]|O(n)|
|`list.subList(i, j)`|View of [i, j) — not a copy|O(1)|

```java
// Sorting
list.sort(Comparator.naturalOrder());
list.sort(Comparator.reverseOrder());
Collections.sort(list);
Collections.sort(list, Collections.reverseOrder());
list.sort((a, b) -> a[0] - b[0]);   // custom comparator
```

---

## LinkedList

```java
LinkedList<String> ll = new LinkedList<>();
```

|Method|Description|Cost|
|---|---|---|
|`ll.add(val)` / `ll.offer(val)`|Append to tail|O(1)|
|`ll.offerFirst(val)` / `ll.offerLast(val)`|Add to head / tail|O(1)|
|`ll.get(i)`|Get by index|O(n)|
|`ll.getFirst()` / `ll.getLast()`|View head / tail|O(1)|
|`ll.peek()` / `ll.peekFirst()` / `ll.peekLast()`|View without removing — null if empty|O(1)|
|`ll.poll()` / `ll.pollFirst()` / `ll.pollLast()`|Remove and return — null if empty|O(1)|
|`ll.remove()` / `ll.removeFirst()` / `ll.removeLast()`|Remove — throws if empty|O(1)|

> [!tip] Use `LinkedList` as a Deque when you need O(1) insert/remove at both ends. Random access `get(i)` is O(n) — use `ArrayList` if you need that.

---

## Stack

```java
// Prefer Deque over Stack (Stack extends Vector — synchronized, slow)
Deque<Integer> stack = new ArrayDeque<>();
```

|Method|Description|Cost|
|---|---|---|
|`stack.push(val)`|Push onto top|O(1)|
|`stack.pop()`|Remove and return top — throws if empty|O(1)|
|`stack.peek()`|View top without removing|O(1)|
|`stack.isEmpty()`|Boolean check|O(1)|
|`stack.size()`|Element count|O(1)|

> [!warning] `java.util.Stack` is legacy. Always use `Deque<T> stack = new ArrayDeque<>()`.

---

## Queue

```java
Queue<Integer> q = new ArrayDeque<>();  // faster than LinkedList in practice
```

|Method|Description|Cost|
|---|---|---|
|`q.offer(val)`|Enqueue — returns `false` if full|O(1)|
|`q.add(val)`|Enqueue — throws `IllegalStateException` if full|O(1)|
|`q.poll()`|Dequeue head — returns `null` if empty|O(1)|
|`q.remove()`|Dequeue head — throws if empty|O(1)|
|`q.peek()`|View head — returns `null` if empty|O(1)|
|`q.isEmpty()` / `q.size()`|Check / count|O(1)|

### offer vs add

|Method|Queue full?|On success|
|---|---|---|
|`add()`|throws `IllegalStateException`|returns `true`|
|`offer()`|returns `false`|returns `true`|

> [!tip] Default to `offer / poll / peek` — they never throw on capacity issues.

---

## Deque (Double-Ended Queue)

```java
Deque<Integer> dq = new ArrayDeque<>();
```

`ArrayDeque` is the single best general-purpose structure — use it as both Stack and Queue.

|Method|Description|Cost|
|---|---|---|
|`dq.offerFirst(val)` / `dq.offerLast(val)`|Add to front / back|O(1)|
|`dq.pollFirst()` / `dq.pollLast()`|Remove from front / back — null if empty|O(1)|
|`dq.peekFirst()` / `dq.peekLast()`|View front / back — null if empty|O(1)|

> [!tip] Deque is the backbone of **sliding window maximum/minimum** problems. Use it as a monotonic deque to get O(n) total over a naive O(nk).

---

## PriorityQueue (Heap)

```java
// Min-heap (default — smallest at top)
PriorityQueue<Integer> minH = new PriorityQueue<>();

// Max-heap
PriorityQueue<Integer> maxH = new PriorityQueue<>(Collections.reverseOrder());

// Custom comparator — sort int[] by index 1
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]); // min-heap on [1]
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[1] - a[1]); // max-heap on [1]
```

|Method|Description|Cost|
|---|---|---|
|`pq.offer(val)`|Insert|O(log n)|
|`pq.peek()`|View root (min/max)|O(1)|
|`pq.poll()`|Remove and return root|O(log n)|
|`pq.size()` / `pq.isEmpty()`|Count / empty check|O(1)|

> [!warning] Iterating over a `PriorityQueue` does **not** guarantee sorted order. Only `poll()` extracts in order.

### Common PQ Patterns

```java
// Top K largest elements — maintain a min-heap of size K
PriorityQueue<Integer> pq = new PriorityQueue<>();
for (int num : nums) {
    pq.offer(num);
    if (pq.size() > k) pq.poll();  // evict smallest
}
// pq.peek() == kth largest

// Top K frequent elements
Map<Integer, Integer> freq = new HashMap<>();
for (int n : nums) freq.merge(n, 1, Integer::sum);

PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
    pq.offer(new int[]{e.getKey(), e.getValue()});
    if (pq.size() > k) pq.poll();
}
```

---

## HashMap

```java
Map<String, Integer> map = new HashMap<>();
Map<Integer, List<String>> map = new HashMap<>();
```

|Method|Description|Cost|
|---|---|---|
|`map.put(k, v)`|Insert or overwrite|O(1) avg|
|`map.get(k)`|Get value or `null`|O(1) avg|
|`map.getOrDefault(k, def)`|Get value or return default|O(1) avg|
|`map.containsKey(k)`|Key existence check|O(1) avg|
|`map.remove(k)`|Delete entry|O(1) avg|
|`map.size()` / `map.isEmpty()`|Count / empty check|O(1)|
|`map.keySet()`|Set of all keys|—|
|`map.values()`|Collection of all values|—|
|`map.entrySet()`|Set of key-value pairs|—|
|`map.putIfAbsent(k, v)`|Put only if key absent|O(1) avg|
|`map.merge(k, 1, Integer::sum)`|Insert or combine with existing|O(1) avg|

```java
// Iterate
for (Map.Entry<String, Integer> e : map.entrySet()) {
    String k = e.getKey();
    int v = e.getValue();
}

// computeIfAbsent — creates value if key absent (use for nested structures)
map.computeIfAbsent(key, k -> new ArrayList<>()).add(item);

// Frequency count — two equivalent ways
map.merge(num, 1, Integer::sum);
map.put(num, map.getOrDefault(num, 0) + 1);
```

---

## TreeMap

```java
Map<String, Integer> tm = new TreeMap<>();                           // ASC
Map<String, Integer> tm = new TreeMap<>(Collections.reverseOrder()); // DESC
```

|Method|Description|Cost|
|---|---|---|
|`tm.put / tm.get / tm.remove`|Standard map ops|O(log n)|
|`tm.firstEntry()` / `tm.lastEntry()`|Min / max entry|O(log n)|
|`tm.firstKey()` / `tm.lastKey()`|Min / max key|O(log n)|
|`tm.floorKey(k)`|Largest key ≤ k|O(log n)|
|`tm.ceilingKey(k)`|Smallest key ≥ k|O(log n)|
|`tm.lowerKey(k)`|Largest key < k|O(log n)|
|`tm.higherKey(k)`|Smallest key > k|O(log n)|
|`tm.subMap(k1, k2)`|View of keys in [k1, k2)|O(log n)|
|`tm.keySet()` / `tm.values()` / `tm.entrySet()`|Ordered iteration|O(n)|

> [!tip] `floorKey` / `ceilingKey` are critical for interval and range problems. Know them cold.

---

## HashSet

```java
Set<String> set = new HashSet<>();
```

|Method|Description|Cost|
|---|---|---|
|`set.add(val)`|Insert — ignores duplicates, returns boolean|O(1) avg|
|`set.contains(val)`|Membership check|O(1) avg|
|`set.remove(val)`|Delete if present|O(1) avg|
|`set.size()` / `set.isEmpty()` / `set.clear()`|Count / check / wipe|O(1)|

```java
// Set operations (all modify set1 in-place)
set1.retainAll(set2);  // intersection
set1.addAll(set2);     // union
set1.removeAll(set2);  // difference
```

---

## TreeSet

```java
TreeSet<Integer> ts = new TreeSet<>();                             // ASC
TreeSet<Integer> ts = new TreeSet<>(Comparator.reverseOrder());   // DESC
```

|Method|Description|Cost|
|---|---|---|
|`ts.add / ts.contains / ts.remove`|Standard set ops|O(log n)|
|`ts.first()` / `ts.last()`|View min / max — no removal|O(log n)|
|`ts.pollFirst()` / `ts.pollLast()`|Remove and return min / max|O(log n)|
|`ts.floor(val)`|Largest element ≤ val|O(log n)|
|`ts.ceiling(val)`|Smallest element ≥ val|O(log n)|
|`ts.lower(val)`|Largest element < val|O(log n)|
|`ts.higher(val)`|Smallest element > val|O(log n)|
|`ts.subSet(a, b)`|View of [a, b)|O(log n)|

---

## StringBuilder + String Utils

```java
StringBuilder sb = new StringBuilder();
StringBuilder sb = new StringBuilder("hello");
```

|Method|Description|
|---|---|
|`sb.append(c / str / num)`|Append char, string, or number|
|`sb.insert(i, str)`|Insert at index|
|`sb.delete(i, j)`|Delete [i, j)|
|`sb.deleteCharAt(i)`|Remove char at index|
|`sb.replace(i, j, str)`|Replace [i, j) with str|
|`sb.reverse()`|Reverse in-place|
|`sb.toString()`|Convert to String|
|`sb.charAt(i)`|Get char at index|
|`sb.setCharAt(i, c)`|Set char at index|
|`sb.length()`|Number of chars|
|`sb.indexOf(str)`|First occurrence index or -1|

```java
// Conversions
String s = String.valueOf(42);       // int → String
int n    = Integer.parseInt("42");   // String → int

// Char frequency (a-z only)
int[] freq = new int[26];
for (char c : s.toCharArray())
    freq[c - 'a']++;

// Useful String methods
s.substring(i, j)                   // [i, j)
s.toLowerCase() / s.toUpperCase()
s.trim()                             // strip leading/trailing whitespace
s.replace('a', 'b')
s.contains("abc")
s.startsWith("ab") / s.endsWith("cd")
s.equals(other)                      // content equality — never use ==
s.compareTo(other)                   // lexicographic comparison
String.join("-", "a", "b", "c")     // "a-b-c"
String.valueOf(charArray)            // char[] → String
```

> [!warning] String concatenation with `+` in a loop is O(n²). Always use `StringBuilder`.

---

## Bit Manipulation

```java
// Core operations
a & b      // AND
a | b      // OR
a ^ b      // XOR
~a         // bitwise NOT
a << n     // left shift  (× 2^n)
a >> n     // signed right shift (÷ 2^n)
a >>> n    // unsigned right shift
```

```java
// Essential tricks
x & 1                    // 1 = odd, 0 = even
x & (x - 1)             // clear lowest set bit
x == 0                   // true only if x is 0 after above → x was power of 2
(x >> n) & 1             // get nth bit (0-indexed from right)
x | (1 << n)             // set nth bit
x & ~(1 << n)            // clear nth bit
x ^ (1 << n)             // toggle nth bit
Integer.bitCount(x)      // number of set bits (popcount)
Integer.highestOneBit(x) // value of highest set bit

// XOR identity: a ^ a = 0, a ^ 0 = a
// → find single non-duplicate where all others appear twice
int result = 0;
for (int n : nums) result ^= n;

// Power of 2 check
boolean isPow2 = n > 0 && (n & (n - 1)) == 0;

// Enumerate all subsets of n elements (bitmask)
for (int mask = 0; mask < (1 << n); mask++) {
    for (int i = 0; i < n; i++) {
        if ((mask & (1 << i)) != 0) { /* element i is in subset */ }
    }
}
```

---

## Two Pointers

```java
// Opposite ends — sorted array, pair sum
int l = 0, r = arr.length - 1;
while (l < r) {
    int sum = arr[l] + arr[r];
    if (sum == target) { /* found */ break; }
    else if (sum < target) l++;
    else r--;
}

// Fast / slow — cycle detection (Floyd's)
int slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) { /* cycle detected */ break; }
}
```

---

## Sliding Window

```java
// Fixed size window of length k
int windowSum = 0;
for (int i = 0; i < k; i++) windowSum += arr[i];
int maxSum = windowSum;
for (int i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
}

// Variable size window — shrink left when window becomes invalid
int l = 0, result = 0;
Map<Character, Integer> freq = new HashMap<>();
for (int r = 0; r < s.length(); r++) {
    freq.merge(s.charAt(r), 1, Integer::sum);
    while (freq.size() > k) {                         // condition violated
        freq.merge(s.charAt(l), -1, Integer::sum);
        if (freq.get(s.charAt(l)) == 0) freq.remove(s.charAt(l));
        l++;
    }
    result = Math.max(result, r - l + 1);
}
```

---

## Prefix Sum

```java
// 1D
int[] prefix = new int[n + 1];
for (int i = 0; i < n; i++)
    prefix[i + 1] = prefix[i] + arr[i];
// sum of arr[l..r] inclusive
int rangeSum = prefix[r + 1] - prefix[l];

// 2D
int[][] p = new int[m + 1][n + 1];
for (int i = 1; i <= m; i++)
    for (int j = 1; j <= n; j++)
        p[i][j] = grid[i-1][j-1] + p[i-1][j] + p[i][j-1] - p[i-1][j-1];
// sum of submatrix (r1,c1) to (r2,c2) inclusive
int sum = p[r2+1][c2+1] - p[r1][c2+1] - p[r2+1][c1] + p[r1][c1];
```

---

## Binary Search

```java
// Standard — find exact target in sorted array
int l = 0, r = arr.length - 1;
while (l <= r) {
    int mid = l + (r - l) / 2;   // never (l + r) / 2 — overflows
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) l = mid + 1;
    else r = mid - 1;
}
return -1;

// Lower bound — leftmost index where arr[i] >= target
int l = 0, r = arr.length;
while (l < r) {
    int mid = l + (r - l) / 2;
    if (arr[mid] >= target) r = mid;
    else l = mid + 1;
}
// l is the answer

// Upper bound — leftmost index where arr[i] > target  (i.e. r-1 is last occurrence of target)
int l = 0, r = arr.length;
while (l < r) {
    int mid = l + (r - l) / 2;
    if (arr[mid] > target) r = mid;
    else l = mid + 1;
}
// l - 1 is last occurrence of target

// Binary search on answer — "search on the result space, not the array"
// Pattern: find minimum X such that condition(X) is true
int l = minPossible, r = maxPossible;
while (l < r) {
    int mid = l + (r - l) / 2;
    if (condition(mid)) r = mid;
    else l = mid + 1;
}
// l is the minimum valid answer
```

> [!warning] Always `mid = l + (r - l) / 2`. `(l + r) / 2` overflows when both are large.

---

## Graph Traversal

```java
// Build adjacency list
Map<Integer, List<Integer>> graph = new HashMap<>();
for (int[] edge : edges) {
    graph.computeIfAbsent(edge[0], k -> new ArrayList<>()).add(edge[1]);
    graph.computeIfAbsent(edge[1], k -> new ArrayList<>()).add(edge[0]); // undirected
}

// BFS — shortest path in unweighted graph, level-by-level
Queue<Integer> queue = new ArrayDeque<>();
boolean[] visited = new boolean[n];
queue.offer(start);
visited[start] = true;
int level = 0;
while (!queue.isEmpty()) {
    int size = queue.size();          // freeze current level count
    for (int i = 0; i < size; i++) {
        int node = queue.poll();
        for (int nb : graph.getOrDefault(node, new ArrayList<>())) {
            if (!visited[nb]) {
                visited[nb] = true;
                queue.offer(nb);
            }
        }
    }
    level++;
}

// DFS — iterative
Deque<Integer> stack = new ArrayDeque<>();
boolean[] visited = new boolean[n];
stack.push(start);
while (!stack.isEmpty()) {
    int node = stack.pop();
    if (visited[node]) continue;
    visited[node] = true;
    for (int nb : graph.getOrDefault(node, new ArrayList<>()))
        if (!visited[nb]) stack.push(nb);
}

// DFS — recursive
boolean[] visited = new boolean[n];
void dfs(int node) {
    visited[node] = true;
    for (int nb : graph.getOrDefault(node, new ArrayList<>()))
        if (!visited[nb]) dfs(nb);
}
```

---

## Grid BFS / DFS

```java
int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};       // 4-directional
// 8-directional: also add {1,1},{1,-1},{-1,1},{-1,-1}

boolean[][] visited = new boolean[m][n];
Queue<int[]> q = new ArrayDeque<>();
q.offer(new int[]{startR, startC});
visited[startR][startC] = true;

while (!q.isEmpty()) {
    int[] curr = q.poll();
    for (int[] d : dirs) {
        int nr = curr[0] + d[0];
        int nc = curr[1] + d[1];
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {
            visited[nr][nc] = true;
            q.offer(new int[]{nr, nc});
        }
    }
}
```

---

## Sorting Comparators

```java
// Sort 2D array by first col, break ties by second col
Arrays.sort(intervals, (a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);

// Sort strings by length, then lexicographically
list.sort((a, b) -> a.length() != b.length() ? a.length() - b.length() : a.compareTo(b));

// Sort by absolute value
Arrays.sort(arr, (a, b) -> Math.abs(a) - Math.abs(b));
```

> [!warning] `(a - b)` comparators can silently overflow for large negatives/positives. Use `Integer.compare(a, b)` when values may be extreme.

---

## Math & Number Utils

```java
Integer.MAX_VALUE   // 2^31 - 1  ≈ 2.1 billion
Integer.MIN_VALUE   // -2^31     ≈ -2.1 billion
Long.MAX_VALUE      // use when intermediate products exceed int range

Math.max(a, b) / Math.min(a, b)
Math.abs(x)
Math.pow(base, exp)                          // returns double
Math.sqrt(x)                                 // returns double
(int)(Math.log(x) / Math.log(2))            // log base 2

// GCD / LCM
int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
int lcm(int a, int b) { return a / gcd(a, b) * b; }

// Overflow guard for multiplication
long result = (long) a * b;
```

---

## Useful Java Tricks

```java
// Convert List<Integer> → int[]
int[] arr = list.stream().mapToInt(Integer::intValue).toArray();

// Convert int[] → List<Integer>
List<Integer> list = Arrays.stream(arr).boxed().collect(Collectors.toList());

// Max / min / sum of array via stream
int max = Arrays.stream(arr).max().getAsInt();
int min = Arrays.stream(arr).min().getAsInt();
int sum = Arrays.stream(arr).sum();

// Fill 2D dp array
for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE);

// Char ↔ digit
int d = c - '0';
char c = (char)('0' + d);

// Character checks
Character.isDigit(c)
Character.isLetter(c)
Character.isAlphabetic(c)
Character.isUpperCase(c) / Character.isLowerCase(c)
Character.toLowerCase(c) / Character.toUpperCase(c)

// Ternary for inline min/max
int clamp = Math.max(lo, Math.min(val, hi));

// Integer overflow safe addition check
boolean overflows = (long) a + b > Integer.MAX_VALUE;
```

---

## Complexity Reference

|Structure|Access|Search|Insert|Delete|
|---|---|---|---|---|
|Array|O(1)|O(n)|O(n)|O(n)|
|ArrayList|O(1)|O(n)|O(1)*|O(n)|
|LinkedList|O(n)|O(n)|O(1)|O(1)|
|ArrayDeque (Stack/Queue)|O(1)|O(n)|O(1)|O(1)|
|HashMap / HashSet|—|O(1)*|O(1)*|O(1)*|
|TreeMap / TreeSet|—|O(log n)|O(log n)|O(log n)|
|PriorityQueue|O(1) peek|O(n)|O(log n)|O(log n)|
|Binary Search (sorted array)|—|O(log n)|—|—|

`*` = amortized average

---

## Quick Reference — Pick the Right Structure

|Need|Use|
|---|---|
|Fast random access|`ArrayList`|
|O(1) insert/remove at both ends|`ArrayDeque`|
|LIFO (stack)|`ArrayDeque` with `push/pop/peek`|
|FIFO (queue)|`ArrayDeque` with `offer/poll/peek`|
|Sliding window max/min|`ArrayDeque` as monotonic deque|
|Min / Max extraction|`PriorityQueue`|
|Top K elements|`PriorityQueue` of size K|
|Key-value, fast lookup|`HashMap`|
|Key-value, sorted keys|`TreeMap`|
|Range / floor / ceiling queries|`TreeMap` or `TreeSet`|
|Unique elements, fast lookup|`HashSet`|
|Unique elements, sorted|`TreeSet`|
|Mutable string building|`StringBuilder`|
|Prefix range sum queries|Prefix sum array|
|Shortest path (unweighted graph)|BFS|
|Connected components / cycle|DFS|
|Search on sorted data / answer space|Binary search|