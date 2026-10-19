---
title: Construct binary tree from preorder and Inorder traversal
date: 2026-10-19
description: Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.
 
tags:
  - leetcode
  - tree
  - recursive
problem: Construct binary tree from preorder and Inorder traversal
difficulty: medium
topics:
  - leetcode
  - tree
  - recursive
language: java python
time: O(n)
space: O(n)
sourceUrl: https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/description/
draft: false
---

## The Tree traversal

```bash
PRE-ORDER Root --> Left --> Right
IN-ORDER Left--> Root --> Right
POST-ORDER Left --> Right --> Root
```

### Python and Java implementation

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def buildTree(self, preorder: list[int], inorder: list[int]) -> TreeNode | None:
        idx = {v : i for i, v in enumerate(inorder)}
        pre = 0

        def build(lo, hi):
            nonlocal pre
            if lo > hi:
                return None

            root = TreeNode(preorder[pre])
            pre += 1
            mid = idx[root.val]
            root.left = build(lo, mid -1)
            root.right = build(mid+1, hi)
            return root


        return build(0, len(inorder) - 1)
        
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
    private int[] preorder;
    private int pre;
    private Map<Integer, Integer> idx = new HashMap<>();

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        this.preorder = preorder;

        for (int i = 0; i < inorder.length; i++) {
            idx.put(inorder[i], i);
        }
        return build(0, inorder.length - 1);
    }

    private TreeNode build(int lo, int hi) {
        if (lo > hi) {
            return null;
        }

        TreeNode root = new TreeNode(preorder[pre]);
        pre++;
        int mid = idx.get(root.val);
        root.left = build(lo, mid -1);
        root.right = build(mid + 1, hi);
        return root;
    }
}
```

### Tracing one of the example

```bash
		
preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]

def buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])
	idx = {
			9: 0,
			3: 1,
			15: 2,
			20: 3,
			7: 4
	}
	
	pre = 0
	
	build(0, len(inorder) - 1) -> build(0, 4)
	if lo > hi -> 0 > 4 is false
	root = TreeNode([3])--------------------------------------------------------------------------3
	pre  =1                                                                                      / \
	mid = idx[root.val] => idx[3] = 1                                                          /    \
	root.left = build(0, mid -1) => build(0, 0)----------------------------------------------9       20
				pre = 1                                                                    |        / | \
				if lo > hi -> 0 > 0 is false                                               |       /  |  \
				root = TreeNode(preorder[1]) = 9 -------------------------------------------      15  |   7 
				pre = 2                                                                           |   |   |
				mid = idx[root.val] -> idx[9] = 0                                                 |   |   |
				root.left = build(0 , mid -1) -> build(0, -1)                                     |   |   |
							build(0, -1)                                                          |   |   |
							pre = 2                                                               |   |   |
							if lo > hi 0 >-1 is true                                              |   |   |
								return None                                                       |   |   |
	                                                                                              |   |   |
	root.right = build(mid + 1, hi) -> build(1 + 1 , 4) ------------------------------------------|----   |
	             build(2, 4)                                                                      |   |   |
				 pre = 2                                                                          |   |   |
				 if 2 > 4: is false                                                               |   |   |
				 root = TreeNode(preorder[2]) = 20 -----------------------------------------------|----   |
				 pre = 3                                                                          |       |
				 mid = idx[root.val] = idx[20] = 3                                                |       |
				 root.left = build(2, 3) ---------------------------------------------------------        |
							pre = 3                                                                       |
							if lo > hi -> 2 > 3 is false                                                  |
							root = TreeNode(preorder[3]) = 15                                             |
							pre = 4                                                                       |
							mid = idx[root.val] = idx[15] = 2                                             |
							root.left = build(2, 1)                                                       |
										pre = 4                                                           |
										if lo > hi = 2 > 1 is true                                        |
											return None                                                   |
				root.right = build(3 + 1, 4)---------------------------------------------------------------
							pre = 4                                                                       |
							lo > hi -> 4 > 4 is false                                                     |
							root = TreeNode(preorder[pre]) = 7--------------------------------------------
							pre += 5
							mid = idx[root.val] = idx[7] = 4
							root.left = build(4, 3)
								return None
							root.right = build(5, 4)
								return None
```
