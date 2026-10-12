---
title: Count good nodes in binary tree
date: 2026-10-11
description: Given a binary tree root, a node X in the tree is named good if in the path from root to X there are no nodes with a value greater than X.Return the number of good nodes in the binary tree.
tags:
  - leetcode
  - tree
  - recursive
  - stack
  - queue
problem: Count good nodes in binary tree
difficulty: medium
topics:
  - tree
  - recursive
  - stack
  - queue
language: java, python
time: O(n)
space: O(h)
sourceUrl: https://leetcode.com/problems/count-good-nodes-in-binary-tree/description/
draft: false
---

## Recursive implementation

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def goodNodes(self, root: TreeNode) -> int:
        
        def dfs(node, max_so_far):
            if not node:
                return 0
            
            count = 1 if node.val >= max_so_far else 0
            max_so_far = max(node.val, max_so_far)
            return count + dfs(node.left, max_so_far) + dfs(node.right, max_so_far)

        return dfs(root, root.val)
        
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
    public int goodNodes(TreeNode root) {
        return dfs(root, root.val);
    }

    private int dfs(TreeNode node, int maxSoFar) {
        if (node == null) {
            return 0;
        }

        int count = 0;
        if (node.val >= maxSoFar) {
            count = 1;
        }
        maxSoFar = Math.max(node.val, maxSoFar);
        return count + dfs(node.left, maxSoFar) + dfs(node.right, maxSoFar);
    }
}
```

### tracking an a example

```bash

		3
	   / \
	  1   4
     /   / \
    3	 1  5
	
	
goodNodes(3):
	
	dfs(3, 3)
		if not node is false
		
		count = 1 (because node.val = max_so_far)
		new_max = max(max_so_far, node.val) => max(3, 3) = 3
		
		return 1 + dfs(1, 3) + dfs(4, 3)<-2-----------------------------------------
					  |                                                            |
		dfs(1, 3):  --- 1                                                          |
			if not node is false                                                   |
			count = 0 (node.val >= max_so_far => 1 >= 3)                           |
			new_max = max(3, 1) = 3                                                |
			return 0 + dfs(3, 3) + dfs(None, 3) --- returns 1                      |
						|                                                          |
						|	                                                       |
			dfs(3, 3):--1                                                          |
				if not node is false                                               |
				count = 1 (node.val >= max_so_far => 3 >= 3)                       |
				new_max = max(3, 3) = 3                                            |
				return 1 + dfs(None, 3) + dfs(None, 3) => 1 + 0 + 0 = 1            | 
			                                                                       |
			                                                                       |
		def(4, 3): -----------------------------------------------------------------
			if not node is false
			count = 1(node.val >= max_so_far => 4 >= 3)
			new_max = max(4, 3) = 4
			return 1 + dfs(1, 4) + dfs(5, 4)<-----1----------------------------------
			             |                                                          |
		def(1, 4): ----0--                                                          |  
			if not node is false                                                    |
			count = 0 (node.val >= max_so_far => 1 >= 4 is false)                   |
			new_max = max(1, 4) = 4                                                 |
			return 0 + dfs(None, 4) + dfs(None, 4)                                  |
			                                                                        |
                                                                                    |
		def(5, 4)--------------------------------------------------------------------
			if not node is false
			count = 1 (node.val >= max_so_far => 5 >= 4 is true)
			new_max = max(5, 4) = 5
			return 1 + dfs(None, 5) + dfs(None,5)
			
	return 4
```

## Iterative approach

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def goodNodes(self, root: TreeNode) -> int:
        count = 0
        q = deque([(root, root.val)])

        while q:
            node, mx = q.popleft()
            
            if node.val >= mx:
                count+=1
            new_max = max(node.val, mx)

            if node.left:
                q.append((node.left, new_max))
            if node.right:
                q.append((node.right, new_max))
        
        return count

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
    public int goodNodes(TreeNode root) {
        int count = 0;
        Deque<Object[]> q = new ArrayDeque<>();
        q.add(new Object[]{root, root.val});
            
        while (!q.isEmpty()) {
            Object[] cur = q.poll();
            TreeNode node = (TreeNode) cur[0];
            int mx = (int) cur[1];
            if (node.val >= mx) {
                count++;
            }
            int new_max = Math.max(node.val, mx);

            if (node.left != null) {
                q.add(new Object[]{node.left, new_max});
            }

            if (node.right != null) {
                q.add(new Object[]{node.right, new_max});
            }

        }
        return count;

    }
}

```