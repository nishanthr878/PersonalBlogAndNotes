---
title: Kth Smallest Element in a BST
date: 2026-10-18
description: Given root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.
tags:
  - leetcode
  - tree
  - stack
  - in-order traversal
problem: Kth smallest element in a BST
difficulty: medium
topics:
  - tree
  - recursive
  - stack
  - in-order traversal
language: java, python, 
time: O(h + k)
space: O(h)
sourceUrl: https://leetcode.com/problems/kth-smallest-element-in-a-bst/
draft: false
---

### Python & Java iterative solution

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def kthSmallest(self, root: TreeNode | None, k: int) -> int:
        stack = []
        curr = root

        while curr or stack:
            while curr:
                stack.append(curr)
                curr = curr.left
            
            curr = stack.pop()

            k -= 1

            if k == 0:
                return curr.val
            
            curr = curr.right
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
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode curr = root;

        while ((!stack.isEmpty()) || (curr != null)) {
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }

            curr = stack.pop();
            k--;

            if (k == 0) {
                return curr.val;
            }

            curr = curr.right;


        }

        return -1;

    }
}
```

### Recursive version (Python)
- Shorter but uses call stack and needs state:

```python
class Solution:
    def kthSmallest(self, root, k):
        self.k, self.ans = k, None
        def inorder(node):
            if not node or self.k == 0:
                return
            inorder(node.left)
            self.k -= 1
            if self.k == 0:
                self.ans = node.val
                return
            inorder(node.right)
        inorder(root)
        return self.ans
```


### Tracking the below example

```bash

	
       3
	  / \
	 1
	  \
	   2
	   
	   
kthSmallest(3, 1)
	stack = []
	curr = 3
	while curr or stack is true
		while curr is true
			stack.append(3) = [3]
			curr = curr.left = 1
			
		curr = stack.pop()
		k -= 1 => 0
		
		k == 0 is true
			return curr.val => 1
			

different example
kthSmallest(3, 2):
	stack = []
	while curr or stack is true
		while curr is true
			stack.append(3) = [3]
			curr = curr.left = 1
			
		curr = stack.pop() = 3
		k -= 1 => 1
		
		if k ==0 is false
		
		curr = curr.right => null
```
