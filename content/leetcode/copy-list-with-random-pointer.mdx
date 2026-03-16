---
title: Copy List with Random Pointer (LeetCode)
date: 2026-03-15
description: O(1) extra space deep copy by weaving clones into the original list.
tags:
  - leetcode
  - linked-list
  - pointer-manipulation
problem: Copy List with Random Pointer
difficulty: medium
topics:
  - linked-list
  - hash-table
language: Java
time: O(n)
space: O(1)
sourceUrl: https://leetcode.com/problems/copy-list-with-random-pointer/
draft: false
---

## Problem

Given the head of a linked list where each node has `next` and `random` pointers (where `random` may point to any node in the list or `null`), return a deep copy of the list.

## Approach

Weave clones into the original list to create an implicit mapping from original -> copy without a hash map.

1) Insert a cloned node after each original node.
2) Set each clone's `random` using `original.random.next` (the clone of `original.random`).
3) Detach the cloned list while restoring the original list.

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Solution (Java)

```java
/*
// LeetCode provides this definition:
class Node {
    int val;
    Node next;
    Node random;
    public Node(int val) { this.val = val; }
}
*/

public class Solution {
    /**
     * Orchestrator only: deep-copy list with next/random pointers.
     *
     * Inputs: head (nullable)
     * Outputs: head of deep-copied list (nullable)
     * Side Effects: Temporarily mutates original `next` pointers; restores them before returning.
     * Invariants: Returned list contains only new nodes; original list structure is restored.
     * Time: O(n)
     * Space: O(1) auxiliary (excluding newly allocated nodes)
     */

    public Node copyRandomList(Node head) {
        boolean empty = isEmptyInput(head);
        if (empty) return returnResult(null);

        Node validatedHead = validateInput(head);

        Node wovenHead = interleaveClonesWithOriginals(validatedHead);
        Node wovenWithRandom = assignRandomPointersOnClones(wovenHead);
        Node cloneHead = detachClonedListAndRestoreOriginal(wovenWithRandom);

        return returnResult(cloneHead);
    }


    /**
     * Responsibility: Decide if input is trivially empty.
     * Inputs: head
     * Outputs: true iff head == null
     * Side Effects: None
     * Invariants: Pure function
     * Time: O(1)
     * Space: O(1)
     */
    private boolean isEmptyInput(Node head) {
        return head == null;
    }

    /**
     * Responsibility: Validate preconditions required by subsystems.
     * Inputs: head (non-null)
     * Outputs: same head reference
     * Side Effects: None
     * Invariants: head != null
     * Time: O(1)
     * Space: O(1)
     */
    private Node validateInput(Node head) {
        return head;
    }

    /**
     * Responsibility: Weave clone nodes into original list: X -> x -> nextOriginal.
     * Inputs: headOriginal (non-null)
     * Outputs: same head reference, now woven
     * Side Effects: Mutates `next` pointers; allocates n new nodes
     * Invariants:
     * - For every original X, X.next is its clone x
     * - x.val == X.val
     * - x.next is the original successor of X (pre-weave)
     * Time: O(n)
     * Space: O(1) auxiliary
     */
    private Node interleaveClonesWithOriginals(Node headOriginal) {
        Node curr = headOriginal;
        while (curr != null) {
            Node clone = new Node(curr.val);
            Node nextOriginal = curr.next;

            curr.next = clone;
            clone.next = nextOriginal;

            curr = nextOriginal;
        }
        return headOriginal;
    }

    /**
     * Responsibility: Assign random pointers for clone nodes using woven structure.
     * Inputs: headOriginalWoven
     * Outputs: same head reference, with clone.random populated
     * Side Effects: Mutates `random` pointers of clone nodes only
     * Invariants:
     * - Let x be clone of X (x == X.next). If X.random == null -> x.random == null
     * - If X.random == R -> x.random == R.next (clone of R)
     * Time: O(n)
     * Space: O(1) auxiliary
     */
    private Node assignRandomPointersOnClones(Node headOriginalWoven) {
        Node curr = headOriginalWoven;
        while (curr != null) {
            Node clone = curr.next;
            clone.random = (curr.random == null) ? null : curr.random.next;
            curr = clone.next;
        }
        return headOriginalWoven;
    }

    /**
     * Responsibility: Unweave into two lists; restore original; return clone head.
     * Inputs: headOriginalWoven
     * Outputs: headClone
     * Side Effects: Mutates `next` pointers to separate lists
     * Invariants:
     * - Original list `next` chain restored exactly
     * - Clone list is standalone and mirrors original `next` chain
     * - No clone `next` points to an original node
     * Time: O(n)
     * Space: O(1) auxiliary
     */
    private Node detachClonedListAndRestoreOriginal(Node headOriginalWoven) {
        Node original = headOriginalWoven;
        Node cloneHead = headOriginalWoven.next;

        while (original != null) {
            Node clone = original.next;
            Node nextOriginal = clone.next;

            original.next = nextOriginal;
            clone.next = (nextOriginal == null) ? null : nextOriginal.next;

            original = nextOriginal;
        }

        return cloneHead;
    }

    /**
     * Responsibility: Single exit point to return output.
     * Inputs: headClone
     * Outputs: headClone
     * Side Effects: None
     * Invariants: Output equals input
     * Time: O(1)
     * Space: O(1)
     */
    private Node returnResult(Node headClone) {
        return headClone;
    }
}
```
