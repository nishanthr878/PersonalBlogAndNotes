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

## Python and Java iterative solution

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def rightSideView(self, root: TreeNode | None) -> list[int]:
        if root == None:
            return []

        result = []
        q = deque([root])

        while q:
            size = len(q)

            for i in range(size):
                node = q.popleft()

                if i == size - 1:
                    result.append(node.val)

                if node.left:
                    q.append(node.left)

                if node.right:
                    q.append(node.right)

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
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();

        if (root == null) {
            return result;
        }

        q.offer(root);

        while (!q.isEmpty()) {
            int size = q.size();

            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                if (i == (size - 1)) {
                    result.add(node.val);
                }

                if (node.left != null) {
                    q.offer(node.left);
                }

                if (node.right != null) {
                    q.offer(node.right);
                }
            }
        }

        return result;


    }
}
```

## Tracking an example in iterative approch


```bash

		 1
		/ \
	   2   3
	    \   \
		 5   4
``` 

```bash
rightSideViewBFS(1)
root is not null
res = []
q = [1]

while q is true:
	size = len(q) = 1
	
	for i in range(size):
		i = 0
			node = q.popleft() => node = 1
			if = i == size -1 => 0 == 1 - 1 = 0 is true:
				res.append(node.val) => res = [1]
			
			if node.left is true:
				q.append(node.left) => q = [2]
			if node.right is true:
				q.append(node.right) => q = [2, 3]
			

whle q is true:
	size = len(q) = 2
	
	for i in range(size):
		i = 0
			node = q.popleft() => 2
			if i == size -1 => 0 == 2 - 1 = 0 is false
			if node.left is false:
			if node.right is true:
				q.append(node.right) => [3, 5]
			
		i = 1
			node = q.popleft() => 3
			if i == size -1 => 1 == 2 -1 is true:
				res.append(node.val) => res = [1, 3]
			if node.left is false
			if node.right is true:
				q.append(node.right) => [5, 4]
				
while q is true:
	size = len(q) = 2
	
	for i in range(size):
	i = 0
		node = q.popleft() => 5
		if i == size -1 => 0 == 2 - 1 is  false
		if node.left is false
		if node.right is false
		
	i = 1
		node = q.popleft() => 4
		if i == size -1 => 1 == 2 -1 is true
			result.append(node.val) => [1, 3, 4]
		if node.left is false
		if node.right is false
		

while q is empty so false

return result => [1, 3, 4]
```

### Recursive DFS approach in Python & java

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def rightSideView(self, root: TreeNode | None) -> list[int]:
        res = []

        def dfs(node, depth):
            if node is None:
                return []

            if depth == len(res):
                res.append(node.val)

            dfs(node.right, depth + 1)
            dfs(node.left, depth + 1)

        dfs(root, 0)

        return res
        
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

     List<Integer> res = new ArrayList<>();

    public List<Integer> rightSideView(TreeNode root) {
        

        if (root == null) {
            return res;
        }
        
        dfs(root, 0);
        return res;
    }

    private void dfs(TreeNode node, int depth) {
        if (node == null) {
            return;
        }

        if (depth == res.size()) {
            res.add(node.val);
        }

        dfs(node.right, depth + 1);
        dfs(node.left, depth + 1);
    }
}
```