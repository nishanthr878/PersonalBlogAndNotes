---
title: validate binary search tree
date: 2026-10-16
description: Given the root of a binary tree, determine if it is a valid binary search tree (BST).
tags:
  - leetcode
  - tree
  - recursive
problem: Maximum depth of binary tree
difficulty: medium
topics:
  - tree
  - recursive
language: java, python, 
time: O(n)
space: O(n)
sourceUrl: https://leetcode.com/problems/validate-binary-search-tree/description/
draft: false
---

## Python and Java recursive approach

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
    public boolean isValidBST(TreeNode root) {
        return validate(root, null, null);
    }

    private boolean validate(TreeNode root, Integer low, Integer high) {
        if (root == null) {
            return true;
        }

        if (low != null && low >= root.val) {
            return false;
        }

        if (high != null && high <= root.val ) {
            return false;
        }

        return (validate(root.left, low, root.val) && validate(root.right, root.val, high));


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
    def isValidBST(self, root: TreeNode | None) -> bool:
        return self.validate(root, float("-inf"), float("inf"))

    def validate(self, root, low, high):
        if root is None:
            return True

        if not (low < root.val < high):
            return False
        
        return (self.validate(root.left, low, root.val) and self.validate(root.right, root.val, high))
        
```

> Java gotcha: don’t use Integer.MIN_VALUE / Integer.MAX_VALUE as initial bounds. A node with value Integer.MIN_VALUE then fails the strict check even though it’s valid. Use null (as above) or long bounds.

