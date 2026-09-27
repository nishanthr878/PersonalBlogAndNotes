---
title: Maximum depth of binary tree
date: 2026-09-27
description: Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.
tags:
  - leetcode
  - tree
  - recursive
problem: Maximum depth of binary tree
difficulty: easy
topics:
  - tree
  - recursive
language: java, python, rust
time: O(n)
space: O(n)
sourceUrl: https://leetcode.com/problems/maximum-depth-of-binary-tree/description/
draft: false
---

### Python solution

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution(object):
    def maxDepth(self, root):
        """
        :type root: Optional[TreeNode]
        :rtype: int
        """
        if root is None:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
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
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}
```

```rust
// Definition for a binary tree node.
// #[derive(Debug, PartialEq, Eq)]
// pub struct TreeNode {
//   pub val: i32,
//   pub left: Option<Rc<RefCell<TreeNode>>>,
//   pub right: Option<Rc<RefCell<TreeNode>>>,
// }
// 
// impl TreeNode {
//   #[inline]
//   pub fn new(val: i32) -> Self {
//     TreeNode {
//       val,
//       left: None,
//       right: None
//     }
//   }
// }
use std::rc::Rc;
use std::cell::RefCell;
impl Solution {
    pub fn max_depth(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
         match root {
            None => 0,
            Some(node) => {
                let node = node.borrow();
                1 + Self::max_depth(node.left.clone()).max(Self::max_depth(node.right.clone()))
            }
        }
    }
}
```

- Stack tracing the example  root = [3,9,20,null,null,15,7]

```
          3
         / \
        9   20
            / \
           15  7
```

```bash
max_depth(3)
├─ max_depth(9)
│  ├─ max_depth(null) → 0
│  ├─ max_depth(null) → 0
│  └─ return 1 + max(0, 0) = 1
├─ max_depth(20)
│  ├─ max_depth(15)
│  │  ├─ max_depth(null) → 0
│  │  ├─ max_depth(null) → 0
│  │  └─ return 1 + max(0, 0) = 1
│  ├─ max_depth(7)
│  │  ├─ max_depth(null) → 0
│  │  ├─ max_depth(null) → 0
│  │  └─ return 1 + max(0, 0) = 1
│  └─ return 1 + max(1, 1) = 2
└─ return 1 + max(1, 2) = 3
```

*Call Stack order*(what actually executes, deepest first)
1. max_depth(null) (9's left) → 0
2. max_depth(null) (9's right) → 0
3. max_depth(9) returns 1
4. max_depth(null) (15's left) → 0
5. max_depth(null) (15's right) → 0
6. max_depth(15) returns 1
7. max_depth(null) (7's left) → 0
8. max_depth(null) (7's right) → 0
9. max_depth(7) returns 1
10. max_depth(20) returns 1 + max(1,1) = 2
11. max_depth(3) returns 1 + max(1,2) = 3