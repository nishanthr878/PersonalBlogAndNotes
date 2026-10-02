---
title: Balanced  Binary Tree
date: 2026-10-02
description: Given a binary tree, determine if it is height-balanced.
tags:
  - leetcode
  - tree
  - recursive
problem: Balanced binary tree
difficulty: easy
topics:
  - tree
  - recursive
language: java, python
time: O(n)
space: O(n)
sourceUrl: https://leetcode.com/problems/balanced-binary-tree/description/
draft: false
---

A binary tree is height-balanced if, for **every** node, the heights of its left and right subtrees differ by at most 1.

The word "every" is where people go wrong. It's not enough for the root to look balanced. The condition has to hold at each node independently.

**Balanced:**

```
      3
     / \
    9   20
       /  \
      15   7
```

- Node 3: left height 1, right height 2 → diff 1 ✓
- Node 20: left height 1, right height 1 → diff 0 ✓
- Leaves: trivially fine ✓

**Not balanced:**

```
        1
       / \
      2   2
     / \
    3   3
   / \
  4   4
```

The root looks okay-ish (left height 4, right height 1 → diff 3, actually already bad), but even if you fix the root, node 2 on the left has left height 3 and right height 1, so it fails too. One violating node anywhere is enough to make the whole tree unbalanced.

**The trap: balanced root isn't enough.**

```
        1
       / \
      2   2
     /     \
    3       3
   /         \
  4           4
```

Root: left height 3, right height 3 → diff 0, looks perfect. But node 2 (left) has left height 2 and right height 0 → diff 2 ✗. This tree is **not** balanced, even though both halves have equal height. That's exactly why a check only at the root fails, and why the solution has to verify every node.

**Why the definition exists:** a tree with height h can hold up to 2^h − 1 nodes, so a balanced tree keeps height near log n. That keeps search, insert and delete at O(log n). An unbalanced tree can degrade into a linked list, where those operations become O(n). AVL trees enforce this exact "differ by at most 1" rule on every insertion and deletion via rotations. Red-black trees use a looser guarantee.

**Common confusions:**

- Height-balanced ≠ perfect or complete. A balanced tree can have missing nodes, as in the first example.
- Balanced is about **height difference**, not node count. A node can have 10 nodes on the left and 2 on the right and still be balanced if the heights are within 1.
- An empty tree is balanced (height 0, no node to violate the rule)

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isBalanced(self, root: TreeNode | None) -> bool:
        def height(node):
            if node is None:
                return 0

            left = height(node.left)
            if left == -1:
                return -1

            right = height(node.right)
            if right == -1:
                return -1

            if abs(left - right) > 1:
                return -1

            return 1 + max(left, right)

        return height(root) != -1

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
    public boolean isBalanced(TreeNode root) {
        if (height(root) == -1) {
            return false;
        }
        return true;
    }

    private int height(TreeNode node) {
        if (node == null) {
            return 0;
        }

        int left = height(node.left);
        if (left == -1) {
            return -1;
        }

        int right = height(node.right);
        if (right == -1) {
            return -1;
        }

        if (Math.abs(left - right) > 1) {
            return -1;
        }

        return 1 + Math.max(left, right);
    }
}
```

Here is the full trace for Example 1. Indentation shows call depth, and each call's return value is on its own line.

**Call tree**

```
isBalanced(3)
└─ height(3)
   ├─ height(9)
   │  ├─ height(None)  -> 0
   │  ├─ height(None)  -> 0
   │  └─ |0-0| = 0, ok -> return 1 + max(0,0) = 1
   │
   ├─ height(20)
   │  ├─ height(15)
   │  │  ├─ height(None)  -> 0
   │  │  ├─ height(None)  -> 0
   │  │  └─ |0-0| = 0, ok -> return 1
   │  │
   │  ├─ height(7)
   │  │  ├─ height(None)  -> 0
   │  │  ├─ height(None)  -> 0
   │  │  └─ |0-0| = 0, ok -> return 1
   │  │
   │  └─ |1-1| = 0, ok -> return 1 + max(1,1) = 2
   │
   └─ left=1, right=2, |1-2| = 1, ok -> return 1 + max(1,2) = 3

3 != -1 -> True
```

**Stack snapshots (what's actually on the stack, bottom to top)**

| Step | Event | Stack |
|---|---|---|
| 1 | call height(3) | 3 |
| 2 | call height(9) | 3, 9 |
| 3 | call height(None), returns 0 | 3, 9, None |
| 4 | popped, call height(None), returns 0 | 3, 9, None |
| 5 | popped, 9 returns 1 | 3 |
| 6 | call height(20) | 3, 20 |
| 7 | call height(15) | 3, 20, 15 |
| 8 | two None calls, each returns 0 | 3, 20, 15, None |
| 9 | 15 returns 1, popped | 3, 20 |
| 10 | call height(7) | 3, 20, 7 |
| 11 | two None calls, each returns 0 | 3, 20, 7, None |
| 12 | 7 returns 1, popped | 3, 20 |
| 13 | 20 returns 2, popped | 3 |
| 14 | 3 returns 3, popped | empty |

(`isBalanced` sits under all of these as the bottom frame, which I left out for readability.)

**What the trace shows**

- Every node is visited once, and each `None` is visited once. That's the O(n) time.
- The deepest the stack gets is 4 `height` frames (3, 20, 15, None). That's tree height + 1 for the `None` frame, which is the O(h) space.
- Siblings never share the stack. `height(9)` is fully gone before `height(20)` starts, and `height(15)` is gone before `height(7)` starts. Your earlier trace got this wrong.
- The `-1` early-exit never fired. This input can't exercise it.

Now do Example 2 (`[1,2,2,3,3,null,null,4,4]`) yourself. Find the exact call that first returns `-1`, then list which calls never happen because of the early exit. If you can't name the skipped calls, you haven't understood the pruning.

