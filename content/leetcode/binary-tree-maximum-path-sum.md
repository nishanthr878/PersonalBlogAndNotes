---
title: Binary tree maximum path sum
date: 2026-10-22
description: A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.The path sum of a path is the sum of the node's values in the path. Given the root of a binary tree, return the maximum path sum of any non-empty path.
tags:
  - leetcode
  - tree
  - recursive
problem: Binary tree maximum path sum
difficulty: hard
topics:
  - leetcode
  - tree
  - recursive
language: java python
time: O(n)
space: O(h)
sourceUrl: https://leetcode.com/problems/binary-tree-maximum-path-sum/description/
draft: false
---

## Python and Java implementation

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maxPathSum(self, root: TreeNode | None) -> int:
        best = float("-inf")

        def gain(node):
            nonlocal best

            if node is None:
                return 0
            
            left = max(gain(node.left), 0)
            right = max(gain(node.right), 0)

            best = max(best, node.val + left + right)

            return node.val + max(left, right)

        gain(root)
        return best
        
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
    private int best;

    public int maxPathSum(TreeNode root) {
        best = Integer.MIN_VALUE;
        gain(root);
        return best;
    }

    private int gain(TreeNode node) {
        
        if (node == null) {
            return 0;
        }

        int left = Math.max(gain(node.left), 0);
        int right = Math.max(gain(node.right), 0);

        best = Math.max(best, node.val + left + right);

        return node.val + Math.max(left, right);


    }
}
```

- The core idea is we have to compute the best "downward" path starting at that node (can only extend into one child.)
- At each node also check the best path that bends there, using both children. 

Caviates to look into is 
- Negative subtree contibuitons must be clamped to 0
- The global max must be initilized to `-inf` (or the root's vaalue) 