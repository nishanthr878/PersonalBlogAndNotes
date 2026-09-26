---
title: "Binary Tree data sturcture - reference notes"
date: "2026-09-24"
description: "Binary Tree"
tags: [binay tree, java, python]
---

## Binary Tree implementation in java and python

```python
class TreeNode:
    def __init__(self, val, left = None, right = None):
        self.val = val
        self.left = left
        self.right = right
```

```java
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;

    TreeNode(int val) {
        this.val = val;
    }
}
```

- Creating a tree in both python and java

```python
#        1
#       / \
#      2   3
#     / \
#    4   5
```

```python
root = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(2))
```

```java
TreeNode root = new TreeNode(1);
root.left = new TreeNode(2);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
root.right = new TreeNode(2);
```

- Printing or retreving the binary tree

```python
def inorder(node):
    if not node:
        return []
    return inorder(node.left) + [node.val] + inorder(node.right)
```

```java
static void inorder(TreeNode root, List<Integer> out) {
    if (root != null) {
        return;
    }

    inorder(root.left, out);
    out.add(root.val)
    inorder(root.right, out);
}
```