---
title: Invert Binary Tree
date: 2026-09-26
description: Invert binary tree
tags:
  - leetcode
  - tree
  - queue
problem: Invert Binary Tree
difficulty: easy
topics:
  - tree
  - queue
language: java, python, rust
time: O(n)
space: O(n)
sourceUrl: https://leetcode.com/problems/invert-binary-tree/description/
draft: false
---


- Implementing binary tree in Python, Java, Rusth

```python
class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

```java
class TreeNode {
    int val;
    TreeNode left, right;

    TreeNode(int val) {
        this.val = val;
    }
}
```

```rust
use std::rc::Rc;
use std::cell::RefCell;

pub struct TreeNode {
    pub val: i32,
    pub left: Option<Rc<RefCell<TreeNode>>>,
    pub right: Option<Rc<RefCell<TreeNode>>>,
}
```

- Implementation in recursive solution

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution(object):
    def invertTree(self, root):
        """
        :type root: Optional[TreeNode]
        :rtype: Optional[TreeNode]
        """
        if root is None:
            return root
        
        # another way of implementing below lines
        # node.left, node.right = invert(node.right), invert(node.left)

        left_inverted = self.invertTree(root.left)
        right_inverted = self.invertTree(root.right)

        root.left = right_inverted
        root.right = left_inverted

        return root
```

### Tuples assignment
```python
node.left, node.right = invert(node.right), invert(node.left)
```
The mechanics: Python fully evaluates the entire right-hand side tuple (invert(node.right), invert(node.left)) before assigning anything to node.left or node.right. So:

Compute invert(node.right) → uses original node.right (3) → returns 3
Compute invert(node.left) → uses original node.left (1), which has not been touched yet → returns 1
Only now: assign both results at once → node.left = 3, node.right = 1

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
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return root;
        }

        TreeNode tmp = root.left;
        root.left = invertTree(root.right);
        root.right = invertTree(tmp);
        return root;
    }
}
```

```rust
impl Solution {
    pub fn invert_tree(root: Option<Rc<RefCell<TreeNode>>>) -> Option<Rc<RefCell<TreeNode>>> {
        if let Some(node) = &root {
            let mut node_ref = node.borrow_mut();
            let left = node_ref.left.take();
            let right = node_ref.right.take();
            node_ref.left = Self::invert_tree(right);
            node_ref.right = Self::invert_tree(left);
        }
        root
    }
}
```

- Iterative solution implementationt

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution(object):
    def invertTree(self, root):
        """
        :type root: Optional[TreeNode]
        :rtype: Optional[TreeNode]
        """
        if root is None:
            return root

        q = deque([root])

        while q:
            node = q.popleft()
            node.left, node.right = node.right, node.left

            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)

        return root
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
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return root;
        }

        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);

        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            TreeNode tmp = node.left;
            node.left = node.right;
            node.right = tmp;

            if (node.left != null) {
                q.add(node.left);
            }
            if (node.right != null) {
                q.add(node.right);
            }
        }

        return root;


    }
}
```

```rust
use std::collections::VecDeque;

impl Solution {
    pub fn invert_tree(root: Option<Rc<RefCell<TreeNode>>>) -> Option<Rc<RefCell<TreeNode>>> {
        let mut q: VecDeque<Rc<RefCell<TreeNode>>> = VecDeque::new();
        if let Some(r) = &root {
            q.push_back(Rc::clone(r));
        }

        while let Some(node) = q.pop_front() {
            let mut node_ref = node.borrow_mut();
            let left = node_ref.left.take();
            let right = node_ref.right.take();

            if let Some(l) = &left {
                q.push_back(Rc::clone(l));
            }
            if let Some(r) = &right {
                q.push_back(Rc::clone(r));
            }

            node_ref.left = right;
            node_ref.right = left;
        }

        root
    }
}
```

