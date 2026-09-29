---
title: Diameter of Binary Tree
date: 2026-09-29
description: Given the root of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.The length of a path between two nodes is represented by the number of edges between them.
tags:
  - leetcode
  - tree
  - recursive
problem: Maximum depth of binary tree
difficulty: easy
topics:
  - tree
  - recursive
language: java, python
time: O(n)
space: O(n)
sourceUrl: https://leetcode.com/problems/diameter-of-binary-tree/description/
draft: false
---

Implementation in Python, Java

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

Class Solution:
    def diameterOfBinaryTree(self, root):
        self.best = 0
        self.height(root)

        return self.best

    def height(self, node):
        if node is none:
            return 0
        
        l = height(node.left)
        r = height(node.right)

        self.best = max(self.best, (l + r))

        return 1 + max(l, r)
```
```java
Class Solution {
    int best = 0;

    public int diameterOfBinaryTree(TreeNode root) {
        height(root);
        return best
    }

    public int height(TreeNode node) {
        if (node == null) {
            return 0;
        }

        int l = height(node.left);
        int r = height(node.right);

        best = Math.max(best, l + r);

        return 1 + Math.max(l, r);
    }
}
```


Stack tracking for example root = [1, 2, 3, 4, 5]

```bash
            1
           /  \
          2    3
         / \
        4   5
```

```bash
height(1)
 └─ l = height(2)
     ├─ l = height(4)
     │   ├─ l = height(None) = 0
     │   ├─ r = height(None) = 0
     │   ├─ best = max(0, 0+0) = 0
     │   └─ return 1 + max(0,0) = 1
     ├─ r = height(5)
     │   ├─ l = height(None) = 0
     │   ├─ r = height(None) = 0
     │   ├─ best = max(0, 0+0) = 0        (still 0)
     │   └─ return 1 + max(0,0) = 1
     ├─ best = max(0, 1+1) = 2            (2's own update)
     └─ return 1 + max(1,1) = 2
 └─ r = height(3)
     ├─ l = height(None) = 0
     ├─ r = height(None) = 0
     ├─ best = max(2, 0+0) = 2            (still 2)
     └─ return 1 + max(0,0) = 1
 └─ best = max(2, 2+1) = 3                (1's own update)
 └─ return 1 + max(2,1) = 3

diameterOfBinaryTree returns self.best = 3
```

