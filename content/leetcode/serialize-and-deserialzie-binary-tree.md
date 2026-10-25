---
title: Serialize-and-Deserialize-binary-tree
date: 2026-10-25
description: Serialize and deserialize the binary tree 
tags:
  - leetcode
  - tree
  - recursive
  - deque
  - stack
problem: Serialize and Deserialize binary tree
difficulty: hard
topics:
  - leetcode
  - tree
  - recursive
  - deque
  - stack
language: java python
time: O(n)
space: O(n)
sourceUrl: https://leetcode.com/problems/serialize-and-deserialize-binary-tree/description/
draft: false
---

## Python and Java recursive implementation

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Codec:

    def serialize(self, root):
        """Encodes a tree to a single string.
        
        :type root: TreeNode
        :rtype: str
        """
        out = []

        def dfs(node):
            if node is None:
                out.append("#")
                return
            
            out.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
        
        dfs(root)

        return ",".join(out)
        

    def deserialize(self, data):
        """Decodes your encoded data to tree.
        
        :type data: str
        :rtype: TreeNode
        """

        it = iter(data.split(","))

        def build():
            v = next(it)
            if v == "#":
                return None
            node = TreeNode(int(v))
            node.left = build()
            node.right = build()

            return node
        
        return build() 

# Your Codec object will be instantiated and called as such:
# ser = Codec()
# deser = Codec()
# ans = deser.deserialize(ser.serialize(root))
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
public class Codec {

    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        dfs(root, sb);
        return sb.toString();
    }

    private void dfs(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append("#,");
            return;
        }

        sb.append(node.val).append(",");
        dfs(node.left, sb);
        dfs(node.right, sb);
    }

    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {
        Queue<String> q = new LinkedList(Arrays.asList(data.split(",")));
        return build(q);
    }

    private TreeNode build(Queue<String> q) {
        String it = q.poll();

        if (it.equals("#")) {
            return null;
        }
        TreeNode node = new TreeNode(Integer.parseInt(it));
        node.left = build(q);
        node.right = build(q);

        return node;
    }
}

// Your Codec object will be instantiated and called as such:
// Codec ser = new Codec();
// Codec deser = new Codec();
// TreeNode ans = deser.deserialize(ser.serialize(root));
```

Tracing an example to 

```bash
	
Example

		 1
		/ \
	   2   3
          /	\   
		 4   5
		 
ser = Codec()
desr = Codec()
ans = desr.deserialize(ser.serialize(root))

	serialize(root)
	out = []
	
	dfs(1):
		if not Node is false
		out.append(str(node.val)) = [1]
		dfs(node.left)
		dfs(2)
			if not Node is false
			out.append(str(node.val)) = [1, 2]
			dfs(node.left)
			dfs(None)
				if not Node is true:
					out.append("#") = [1, 2, #]
					return
			dfs(node.right)
			dfs(None):
				if not Node is true:
					out.append("#") = [1, 2, "#", "#"]
					return
					
		dfs(node.right)
		dfs(3)
			if not Node is false
			out.append(str(node.val)) = [1, 2 "#", "#", 3]
			
			dfs(node.left)
			dfs(4)
				if not Node is false
				out.append(str(node.val)) = [1, 2, "#", "#", 3, 4]
				dfs(node.left)
				dfs(None)
					if not Node is true
					out.append("#") = [1, 2, "#", "#", 3, 4, "#"]
				dfs(node.right)
				dfs(None)
					if not node is true
					out.append("#") = [1, 2, "#", "#", 3, 4, "#", "#"]
			
			dfs(node.right)
			dfs(5)
				if not Node is false
				out.appen(str(node.val)) = [1, 2, "#", "#", 3, 4, "#", "#", 5]
				dfs(node.left)
				dfs(None)
					if not Node is true
					out.append("#") = [1, 2, "#", "#", 3, 4, "#", 5 "#"]
				dfs(node.right)
				dfs(None)
					if not node is true
					out.append("#") = [1, 2, "#", "#", 3, 4, "#", "#", 5, "#", "#"]
					
ser = [1, 2, "#", "#", 3, 4, "#", "#", 5, "#", "#"]

deserialize(ser)
	it = iter(data.split(",")
	
	def build():
		v = next(it) = 1
		if v == "#" is false
		node = TreeNode(int(v)) -> 1
		node.left = build()
			build()
			v = next(it) = 2
			if v == "#" is false
			node = TreeNode(int(v)) ->2
			node.left = build()
				v = next(it) = "#"
				if v== "#" is true
					return None
			node.right = build()
				v = next(it) = "#"
				if v == "#" is true
					return None
			
			return node --- 2
		
		node.right = build()
			build()
			v = next(it) = 3
			if v == "#" is false
			node = TreeNode(int(v)) ->3
			node.left = build()
				v = next(it) = 4
				if v == "#" is false
				node = TreeNode(int(v)) - 4
				node.left = build()
					v = next(it) = "#"
					if v == "#" is true:
						return None
				node.right = build()
					v = next(it) = "#"
					if v == "#" is true:
						return None
				
				return node ----------------- 4
						
			node.right = build()
				v = next(it) = 5
				if v == "#" is false
				node = TreeNode(int(v))
				node.left = build()
					v = next(it) = "#"
					if v == "#" is true
						return None
				node.right = build()
					v = next(it) = "#"
					if v == "#" is true
						return None
				return node -------------------  5
			
			return node ----------------------------------3
		return node ---------------------------------------------1
```


### Java and python iterative implementation

```java
public class Codec {
    public String serialize(TreeNode root) {
        if (root == null) return "";
        StringBuilder sb = new StringBuilder();
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            TreeNode n = q.poll();
            if (n == null) { sb.append("#,"); continue; }
            sb.append(n.val).append(',');
            q.add(n.left);
            q.add(n.right);
        }
        return sb.toString();
    }

    public TreeNode deserialize(String data) {
        if (data.isEmpty()) return null;
        String[] p = data.split(",");
        TreeNode root = new TreeNode(Integer.parseInt(p[0]));
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty()) {
            TreeNode n = q.poll();
            if (!p[i].equals("#")) { n.left = new TreeNode(Integer.parseInt(p[i])); q.add(n.left); }
            i++;
            if (!p[i].equals("#")) { n.right = new TreeNode(Integer.parseInt(p[i])); q.add(n.right); }
            i++;
        }
        return root;
    }
}
```

```python
from collections import deque

class Codec:
    def serialize(self, root):
        if not root:
            return ""
        out, q = [], deque([root])
        while q:
            n = q.popleft()
            if n is None:
                out.append("#")
                continue
            out.append(str(n.val))
            q.append(n.left)
            q.append(n.right)
        return ",".join(out)

    def deserialize(self, data):
        if not data:
            return None
        p = data.split(",")
        root = TreeNode(int(p[0]))
        q, i = deque([root]), 1
        while q:
            n = q.popleft()
            if p[i] != "#":
                n.left = TreeNode(int(p[i]))
                q.append(n.left)
            i += 1
            if p[i] != "#":
                n.right = TreeNode(int(p[i]))
                q.append(n.right)
            i += 1
        return root
```