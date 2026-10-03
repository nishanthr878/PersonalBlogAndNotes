---
title: Same  Binary Tree
date: 2026-10-03
description: Given the roots of two binary trees p and q, write a function to check if they are the same or not. Two binary trees are considered the same if they are structurally identical, and the nodes have the same value
tags:
  - leetcode
  - tree
  - recursive
problem: same binary tree
difficulty: easy
topics:
  - tree
  - recursive
language: java, python
time: O(min(n, m))
space: O(h) for the call stack, where h is the height of the smaller tree
sourceUrl: https://leetcode.com/problems/same-tree/description/
draft: false
---

Iterative and recursive solution

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isSameTree(self, p: TreeNode | None, q: TreeNode | None) -> bool:
        if p is None and q is None:
            return True

        if p is None or q is None:
            return False
        
        if p.val != q.val:
            return False

        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)
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
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) {
            return true;
        }

        if (p == null || q == null) {
            return false;
        }

        if (p.val != q.val) {
            return false;
        }

        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}
```

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isSameTree(self, p: TreeNode | None, q: TreeNode | None) -> bool:
        stack = [(p, q)]

        while stack:
            a, b = stack.pop()

            if not a and not b:
                continue

            if not a or not b or a.val != b.val:
                return False

            stack.append((a.left, b.left))
            stack.append((a.right, b.right))

        return True
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
    public boolean isSameTree(TreeNode p, TreeNode q) {
        Deque<TreeNode[]> stack = new ArrayDeque<>();
        stack.push(new TreeNode[]{p, q});

        while (!stack.isEmpty()) {
            TreeNode[] pairs = stack.pop();
            TreeNode a = pairs[0], b = pairs[1];

            if (a == null && b == null) {
                continue;
            }

            if (a == null || b ==null || a.val != b.val) {
                return false;
            }

            stack.push(new TreeNode[] {a.left, b.left});
            stack.push(new TreeNode[]{a.right, b.right});

        }

        return true;
    }
}
```