---
title: Create Binary Tree From Descriptions (LeetCode)
date: 2026-03-08
description: Given a discription create a binary tree.
tags:
  - leetcode
  - trees
problem: Create Binary Tree From Descriptions
difficulty: medium
topics:
  - array
  - trees
language: Java
time: O(n)
space: O(n)
sourceUrl: https://leetcode.com/problems/create-binary-tree-from-descriptions/
draft: false
---

## Problem

- Boundary: Build an in-memory binary tree from parent-child edge triples.
- Inputs: descriptions: List[[parent:int, child:int, isLeft:int]]
- Outputs: root: TreeNode (root of the constructed tree)
- Constraints: len(descriptions) `<= 1e4`, values unique per node, tree is valid, value `<= 1e5`
- Observability: Can validate via invariants (1 root, each child has 1 parent, each parent has `<=` 2 children, linkage matches isLeft)

## Approach

- Why: Root is the only node that is never a child in any description.
- What Pattern: `“Graph edges -> node index + indegree/parent tracking -> root by set difference”`
- Why That Pattern: One pass builds structure; another identifies root deterministically; linear time.
- How Mechanism Works: `Create nodes for all values; attach pointers per edge; compute root_val = only(all_vals - child_vals); return nodes_by_val[root_val].`

## Complexity

- Time: `O(n)`
- Space: `O(n)`

## Solution (Java)

```java

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;


/**
 * LeetCode provides:
 *
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val; this.left = left; this.right = right;
 *     }
 * }
 */

public class CreateBinaryTree {
    /**
     * Orchestrator Only
     *
     * Boundary:
     *   Build a binary tree from (parent, child, isLeft) triples and return the root node.
     *
     * Inputs:
     *   descriptions[i] = [parent, child, isLeft]
     *
     * Outputs:
     *   root TreeNode
     *
     * Observability:
     *   - Root is the unique value that never appears as a child.
     *   - All pointer wiring is performed inside attachPointers(...).
     *
     * Time:  O(n)
     * Space: O(k) where k is number of unique node values
     */
    public TreeNode createBinaryTree(int[][] descriptions) {
        int[][] edges = validateInput(descriptions);
        if (edges.length == 0) return null;
        Map<Integer, TreeNode> nodesByVal = indexAllNodes(edges);
        Set<Integer> childVals = collectChildVals(edges);
        attachPointers(edges, nodesByVal);
        int rootVal = findRootValue(nodesByVal.keySet(), childVals);
        return buildRootReturn(nodesByVal, rootVal);

    }
    /**
     * Subsystem: Input Validation / Parsing
     *
     * Responsibility:
     *   Accept input and apply minimal guardrails. (LeetCode guarantees validity.)
     *
     * Inputs:
     *   descriptions: int[][]
     *
     * Outputs:
     *   edges: int[][] (same reference or safe fallback)
     *
     * Side Effects:
     *   None
     *
     * Invariants:
     *   - For valid tests: each row has 3 ints; isLeft in {0,1}; unique node values.
     *
     * Time:  O(1)
     * Space: O(1)
     */
    private int[][] validateInput(int[][] descriptions) {
        if (descriptions == null) return new int[0][0];
        return descriptions;
    }

    /**
     * Subsystem: Data Structure Preparation (Node Index)
     *
     * Responsibility:
     *   Create a TreeNode object for every value appearing as a parent or child.
     *
     * Inputs:
     *   edges: int[n][3]
     *
     * Outputs:
     *   nodesByVal: Map value -> TreeNode instance
     *
     * Side Effects:
     *   Allocates TreeNode objects
     *
     * Invariants:
     *   - nodesByVal contains keys for every parent and child value found in edges
     *   - nodesByVal.get(v).val == v
     *
     * Time:  O(n)
     * Space: O(k)
     */
    private Map<Integer, TreeNode> indexAllNodes(int[][] edges) {
        Map<Integer, TreeNode> nodesByVal = new HashMap<>();
        for (int i = 0; i < edges.length; i++) {
            int parent = edges[i][0];
            int child = edges[i][1];
            nodesByVal.computeIfAbsent(parent, TreeNode::new);
            nodesByVal.computeIfAbsent(child, TreeNode::new);
        }
        return nodesByVal;
    }

    /**
     * Subsystem: Core Support Data (Child Set)
     *
     * Responsibility:
     *   Collect all values that appear as a child at least once.
     *
     * Inputs:
     *   edges: int[n][3]
     *
     * Outputs:
     *   childVals: Set of child values
     *
     * Side Effects:
     *   None
     *
     * Invariants:
     *   childVals == { edges[i][1] for all i }
     *
     * Time:  O(n)
     * Space: O(n) (worst case: every edge has unique child)
     */
    private Set<Integer> collectChildVals(int[][] edges) {
        Set<Integer> childVals = new HashSet<>();
        for (int i = 0; i < edges.length; i++) {
            childVals.add(edges[i][1]);
        }
        return childVals;
    }

    /**
     * Subsystem: Data Structure Manipulation (Pointer Rewiring)
     *
     * Responsibility:
     *   Perform ALL left/right pointer wiring according to edges.
     *
     * Inputs:
     *   edges: int[n][3]
     *   nodesByVal: value -> TreeNode
     *
     * Outputs:
     *   None
     *
     * Side Effects:
     *   Mutates TreeNode.left / TreeNode.right
     *
     * Invariants:
     *   For each edge (p, c, isLeft):
     *     - if isLeft==1 then nodesByVal[p].left  == nodesByVal[c]
     *     - if isLeft==0 then nodesByVal[p].right == nodesByVal[c]
     *
     * Time:  O(n)
     * Space: O(1) extra
     */
    private void attachPointers(int[][] edges, Map<Integer, TreeNode> nodesByVal) {
        for (int i = 0; i < edges.length; i++) {
            int parentVal = edges[i][0];
            int childVal = edges[i][1];
            int isLeft = edges[i][2];
            TreeNode parent = nodesByVal.get(parentVal);
            TreeNode child = nodesByVal.get(childVal);
            if (isLeft == 1) parent.left = child;
            else parent.right = child;
        }
    }

    /**
     * Subsystem: Core Algorithm (Root Identification)
     *
     * Responsibility:
     *   Find the unique root value: the only node value that never appears as a child.
     *
     * Inputs:
     *   allVals: all node values present in the tree (parents + children)
     *   childVals: values that appear as a child
     *
     * Outputs:
     *   rootVal: the unique root node value
     *
     * Side Effects:
     *   None (pure)
     *
     * Invariants:
     *   - rootVal is in allVals
     *   - rootVal is NOT in childVals
     *   - Exactly one such value exists for valid input
     *
     * Time:  O(k)
     * Space: O(1) extra (given sets already exist)
     */
    private int findRootValue(Set<Integer> allVals, Set<Integer> childVals) {
        for (int v : allVals) {
            if (!childVals.contains(v)) return v;
        }
        return -1; // unreachable for valid input
    }

    /**
     * Subsystem: Output / Return
     *
     * Responsibility:
     *   Return the root TreeNode instance for the computed root value.
     *
     * Inputs:
     *   nodesByVal: value -> TreeNode
     *   rootVal: root value
     *
     * Outputs:
     *   root TreeNode
     *
     * Side Effects:
     *   None
     *
     * Invariants:
     *   root == nodesByVal.get(rootVal)
     *
     * Time:  O(1)
     * Space: O(1)
     */
    private TreeNode buildRootReturn(Map<Integer, TreeNode> nodesByVal, int rootVal) {
        return nodesByVal.get(rootVal);
    }

    public static void main(String[] args) {
        CreateBinaryTree solution = new CreateBinaryTree();
        int[][] descriptions = {{20,15,1},{20,17,0},{50,20,1},{50,80,0},{80,19,1}};
        TreeNode root = solution.createBinaryTree(descriptions);

        // Expected output: root node with val=50, left child val=20 (with children 15 and 17), right child val=80 (with left child 19)
    }
}

```
    