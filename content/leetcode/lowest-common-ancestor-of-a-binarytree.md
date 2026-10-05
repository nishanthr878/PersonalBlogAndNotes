---
title: Lowest common ancestor of a binary tree
date: 2026-10-05
description: Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST. According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).”
tags:
  - leetcode
  - tree
problem: Lowest common ancestor of a binary tree
difficulty: medium
topics:
  - tree
language: java, python
time: O(h)
space: O(1)
sourceUrl: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/description/
draft: false
---

## Python and Java Solution

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        node = root
        
        while node:
            if p.val < node.val and q.val < node.val:
                node = node.left
            elif p.val > node.val and q.val > node.val:
                node = node.right
            else:
                return node
        
        return None
        
```

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */

class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode node = root;

        while (node != null) {
            if (p.val < node.val && q.val < node.val) {
                node = node.left;
            } else if (p.val > node.val && q.val > node.val) {
                node = node.right;
            } else {
                return node;
            }
        }
        return null;
    }
}
```

**Walkthrough of 2 examples**

```bash
         6
        /  \
       2     8
      / \   / \
     0   4 7   9
        / \
       3  5

lowestCommanAncestor(root, p, q)
lowestCommanAncestor(6, 2, 8)

node = root => 6
while node is true
    if  p.val < node.val and q.val < node.val => 2 < 6 and 8 < 6 is false
    if p.val > node.val and q.val > node.val => 2 > 6 and 8 > 6 is false
    else return Node => 6 is the answer
    
    
         6
        /  \
       2     8
      / \   / \
     0   4 7   9
        / \
       3  5

lowestCommanAncestor(6, 2, 4)
node = root => 6

while node is true:
    if p.val < node.val and q.val < node.val => 2 < 6 and 4 < 6 is true
        node = node.left => 2
        
while node is true:
    if p.val < node.val and q.val < node.val => 2 < 2 and 4 < 2 is false
    if p.val > node.val and q.val > node.val => 2 > 2 and 4 > 2 is false
    else return Node => 2 is the answer 
        
```