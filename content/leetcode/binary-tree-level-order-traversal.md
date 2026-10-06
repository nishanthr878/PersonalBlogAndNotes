---
title: Binary Tree Level Order Traversal
date: 2026-10-06
description: Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right level by level).
tags:
  - leetcode
  - tree
  - queue
problem: Binary Tree Level Order Traversal
difficulty: easy
topics:
  - tree
  - recursive
  - queue
language: java, python
time: O(n)
space: O(w) 
sourceUrl: https://leetcode.com/problems/binary-tree-level-order-traversal/description/
draft: false
---

## Python and  Java Solution

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def levelOrder(self, root: TreeNode | None) -> list[list[int]]:
        if root is None:
            return []

        result = []
        q = deque([root])

        while q:
            level = []

            for _ in range(len(q)):
                
                node = q.popleft()
                level.append(node.val)

                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)

            result.append(level)

        return result
        
```


```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) {
            return result;
        }

        Queue<TreeNode> q = new LinkedList<>();

        q.offer(root);

        while(!q.isEmpty()) {
            List<Integer> level = new ArrayList<>();
            int size = q.size();

            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);

                if (node.left != null) {
                    q.offer(node.left);
                }

                if (node.right != null) {
                    q.offer(node.right);
                }

            }
            result.add(level);


        }
        return result;
    }
}
```

- If you take closer look in python we are directly using `range(len(q))` but in java we are appending this to a variable outsize of the for loop as `int size = q.size`

explaination below
------
The difference is in **when the loop bound gets evaluated**.

**Python: `for _ in range(len(q))`**

Evaluation order:
1. `len(q)` runs once, returns an int (say 2).
2. `range(2)` builds an immutable range object.
3. The `for` calls `iter()` on that object and pulls values until it's exhausted.

After step 2, the number 2 is just a number. It has no connection to `q`, so nothing you do to `q` can change how many iterations happen.

**Java: `for (int i = 0; i < q.size(); i++)`**

A Java `for` is shorthand for this:

```java
int i = 0;
while (i < q.size()) {   // condition re-evaluated every pass
    // body
    i++;
}
```

`q.size()` is a method call that asks the queue for its current length, every iteration. The queue is mutated inside the body, so the bound moves.

**Trace the buggy Java version on your own tree**

Start of level 1: `q = [3]`

| i | check `i < q.size()` | action | q after |
|---|---|---|---|
| 0 | 0 < 1 true | poll 3, enqueue 9, 20 | [9, 20] |
| 1 | 1 < 2 true | poll 9 (no children) | [20] |
| 2 | 2 < 1 false | exit | [20] |

`level = [3, 9]`. Node 3 and node 9 got mixed into one level, and 20 is left over for the next pass. The output is wrong with no exception, which is the worst kind of bug.

Note the bound is corrupted from both directions: `poll()` shrinks it, `offer()` grows it. My earlier note only mentioned enqueueing. That was incomplete.

**The fix**

```java
int size = q.size();           // snapshot: a plain int, detached from q
for (int i = 0; i < size; i++)
```

This reproduces what Python does automatically. `size` is a local int. Mutating `q` can't touch it.

**Related traps**

- **Python can have the same bug**, just not in this form. `i = 0; while i < len(q): ... i += 1` re-evaluates `len(q)` every pass, exactly like the Java version.
- **Iterating the container directly** (`for node in q:`) while mutating it raises `RuntimeError: deque mutated during iteration` in Python. Java's equivalent (a for-each over a `LinkedList` that you modify) throws `ConcurrentModificationException`. Those fail loudly, which is better than the silent bug above.

**Check your understanding:** what would happen in Python if you wrote `while q:` as the inner loop condition instead of `for _ in range(len(q))`? Work it out on the same tree before answering. The result tells you why the snapshot is the entire point of the algorithm.

------

### Tracing for one of the example

```bash
         3
        / \
       9   20
          / \       
         15  7
```

```bash
level_order(3)
    result = []
    
    q = deque([root])
    
    while q:
        level = []
        
        for _ in range(len(q)):
            
            _ = 0
            
            node = q.popleft() => 3
            level.append(node.val)
            
            if node.left is true:
                so q.append(node.left) => [9]
            if node.right is true:
                so q.append(node.right) => [9, 20]
        result.append(level) => [[3]]
        
    q is true:
        level = []
        
        for _ in range(len(q)): 2
        
            _ is 0
            
                node = q.popleft() => 9
                level.append(node.val) => [9]
            
                if node.left is false:
                if node.right is false:
            
            _ is 1
                
                node = q.popleft() => 20
                level.append(node.val) => [9, 20]
                
                if node.left is true:
                    so q.append(node.left) => [15]
                if node.right is true:
                    so q.append(node.right) => [15, 7]
                    
        result.append(level) => [[3], [9, 20]]


so on it will continue
```
