---
title: Design Linked List (LeetCode 707)
date: 2026-03-16
description: Sentinel-node + contract-driven subsystems for a clean linked list implementation.
tags:
  - leetcode
  - linked-list
  - data-structures
problem: Design Linked List
difficulty: medium
topics:
  - linked-list
  - design
language: Java
time: O(n)
space: O(n)
sourceUrl: https://leetcode.com/problems/design-linked-list/
draft: false
---

## Problem

Implement a linked list with these operations:

- `get(index)`: return value at `index`, or `-1` if invalid
- `addAtHead(val)`: insert before first element
- `addAtTail(val)`: append to end
- `addAtIndex(index, val)`: insert before `index` (append if `index == length`; no-op if `index > length`)
- `deleteAtIndex(index)`: delete node at `index` if valid

## Approach

Treat the linked list as a small system of independent subsystems:

- A sentinel `dummy` node removes head special-casing.
- A single navigation primitive `nodeBeforeIndex` centralizes traversal.
- Pointer rewiring lives only in `linkNewNodeAfter` / `unlinkNodeAfter`.
- Public methods act as orchestrators: validate -> navigate -> rewire/read -> update size.

## Complexity

- Time: `O(n)` worst-case per operation (due to traversal)
- Space: `O(n)` for `n` nodes

## Solution (Java)

```java
public final class MyLinkedList {

    // -----------------------------
    // Data model subsystem
    // -----------------------------

    /**
     * Node
     * Responsibility: store one element and a link to the next node (singly linked).
     * Inputs: val, next (implicit via field assignment)
     * Outputs: none
     * Side Effects: none
     * Invariants: next is either another Node or null
     * Time Complexity: O(1)
     * Space Complexity: O(1)
     */
    private static final class Node {
        int val;
        Node next;
        Node(int val) { this.val = val; }
    }

    // Sentinel head (does NOT represent a user element)
    private final Node dummy;

    // Number of real elements (not counting dummy)
    private int size;

    // -----------------------------
    // Construction orchestrator
    // -----------------------------

    /**
     * MyLinkedList()
     * Responsibility: initialize system state.
     * Inputs: none
     * Outputs: constructed MyLinkedList
     * Side Effects: allocates sentinel node
     * Invariants established: dummy != null; size == 0; dummy.next == null
     * Time Complexity: O(1)
     * Space Complexity: O(1)
     */
    public MyLinkedList() {
        this.dummy = initSentinel();
        this.size = initSizeForEmpty();
    }

    // -----------------------------
    // Public API (Orchestrators only)
    // -----------------------------

    /**
     * get(index)
     * Orchestrator: validate -> read subsystem -> return.
     */
    public int get(int index) {
        if (!isIndexValidForGet(index, size)) return -1;
        return valueAtIndex(dummy, index);
    }

    /**
     * addAtHead(val)
     * Orchestrator: insert at index 0 using subsystems.
     */
    public void addAtHead(int val) {
        // index 0 is always valid for insert when size >= 0
        Node prev = nodeBeforeIndex(dummy, 0);
        linkNewNodeAfter(prev, val);
        size = sizeAfterSuccessfulInsert(size);
    }

    /**
     * addAtTail(val)
     * Orchestrator: validate (always true for index=size) -> insert.
     */
    public void addAtTail(int val) {
        Node prev = nodeBeforeIndex(dummy, size);
        linkNewNodeAfter(prev, val);
        size = sizeAfterSuccessfulInsert(size);
    }

    /**
     * addAtIndex(index, val)
     * Orchestrator: validate -> navigate -> rewire -> update size.
     */
    public void addAtIndex(int index, int val) {
        if (!isIndexValidForInsert(index, size)) return;

        Node prev = nodeBeforeIndex(dummy, index);
        linkNewNodeAfter(prev, val);
        size = sizeAfterSuccessfulInsert(size);
    }

    /**
     * deleteAtIndex(index)
     * Orchestrator: validate -> navigate -> rewire -> update size.
     */
    public void deleteAtIndex(int index) {
        if (!isIndexValidForDelete(index, size)) return;

        Node prev = nodeBeforeIndex(dummy, index);
        Node deleted = unlinkNodeAfter(prev);
        if (deleted == null) return; // defensive; should not happen if validation + invariants hold
        size = sizeAfterSuccessfulDelete(size);
    }

    // -----------------------------
    // Input validation subsystems
    // -----------------------------

    /**
     * isIndexValidForGet(index, size)
     * Responsibility: validate index for reading.
     * Inputs: index, size
     * Outputs: true iff 0 <= index < size
     * Side Effects: none
     * Invariants: does not modify list/state
     * Time Complexity: O(1)
     * Space Complexity: O(1)
     */
    private boolean isIndexValidForGet(int index, int size) {
        return index >= 0 && index < size;
    }

    /**
     * isIndexValidForInsert(index, size)
     * Responsibility: validate index for insertion.
     * Inputs: index, size
     * Outputs: true iff 0 <= index <= size
     * Side Effects: none
     * Invariants: does not modify list/state
     * Time Complexity: O(1)
     * Space Complexity: O(1)
     */
    private boolean isIndexValidForInsert(int index, int size) {
        return index >= 0 && index <= size;
    }

    /**
     * isIndexValidForDelete(index, size)
     * Responsibility: validate index for deletion (same bounds as get).
     * Inputs: index, size
     * Outputs: true iff 0 <= index < size
     * Side Effects: none
     * Invariants: does not modify list/state
     * Time Complexity: O(1)
     * Space Complexity: O(1)
     */
    private boolean isIndexValidForDelete(int index, int size) {
        return isIndexValidForGet(index, size);
    }

    // -----------------------------
    // Navigation subsystem
    // -----------------------------

    /**
     * nodeBeforeIndex(dummy, index)
     * Responsibility: return the node immediately BEFORE logical position index.
     * Inputs:
     *  - dummy: sentinel head node (not a data element)
     *  - index: target position, requires 0 <= index <= size
     * Outputs:
     *  - Node prev such that prev.next is the node at "index" (or null if index == size)
     * Side Effects: none
     * Invariants:
     *  - does not change list structure
     *  - returned node is reachable from dummy by following next pointers
     * Time Complexity: O(index)
     * Space Complexity: O(1)
     */
    private Node nodeBeforeIndex(Node dummy, int index) {
        Node prev = dummy;
        for (int i = 0; i < index; i++) {
            prev = prev.next; // safe under precondition index <= size and list well-formed
        }
        return prev;
    }

    // -----------------------------
    // Pointer rewiring subsystems
    // -----------------------------

    /**
     * linkNewNodeAfter(prev, val)
     * Responsibility: allocate a new node and insert it immediately after prev.
     * Inputs: prev (non-null), val
     * Outputs: inserted Node
     * Side Effects: allocates one node; mutates prev.next
     * Invariants:
     *  - inserted.next equals the old prev.next
     *  - list remains connected through dummy
     * Time Complexity: O(1)
     * Space Complexity: O(1) extra (new node)
     */
    private Node linkNewNodeAfter(Node prev, int val) {
        Node inserted = new Node(val);
        inserted.next = prev.next;
        prev.next = inserted;
        return inserted;
    }

    /**
     * unlinkNodeAfter(prev)
     * Responsibility: remove the node immediately after prev (if present).
     * Inputs: prev (non-null)
     * Outputs: removed Node, or null if nothing to remove
     * Side Effects: mutates prev.next; detaches removed node from list
     * Invariants:
     *  - after removal, prev.next skips the removed node
     *  - removed.next is set to null (detached)
     * Time Complexity: O(1)
     * Space Complexity: O(1)
     */
    private Node unlinkNodeAfter(Node prev) {
        Node removed = prev.next;
        if (removed == null) return null;

        prev.next = removed.next;
        removed.next = null;
        return removed;
    }

    // -----------------------------
    // Read/output subsystem
    // -----------------------------

    /**
     * valueAtIndex(dummy, index)
     * Responsibility: read the value at index (assuming index is valid).
     * Inputs: dummy, index where 0 <= index < size
     * Outputs: int value at index
     * Side Effects: none
     * Invariants: list structure unchanged
     * Time Complexity: O(index)
     * Space Complexity: O(1)
     */
    private int valueAtIndex(Node dummy, int index) {
        Node prev = nodeBeforeIndex(dummy, index);
        // Under preconditions, prev.next exists.
        return prev.next.val;
    }

    // -----------------------------
    // Size/state update subsystems
    // -----------------------------

    /**
     * sizeAfterSuccessfulInsert(size)
     * Responsibility: compute next size after exactly one successful insertion.
     * Inputs: current size
     * Outputs: size + 1
     * Side Effects: none
     * Invariants: result >= 0
     * Time Complexity: O(1)
     * Space Complexity: O(1)
     */
    private int sizeAfterSuccessfulInsert(int size) {
        return size + 1;
    }

    /**
     * sizeAfterSuccessfulDelete(size)
     * Responsibility: compute next size after exactly one successful deletion.
     * Inputs: current size (must be > 0)
     * Outputs: size - 1
     * Side Effects: none
     * Invariants: result >= 0
     * Time Complexity: O(1)
     * Space Complexity: O(1)
     */
    private int sizeAfterSuccessfulDelete(int size) {
        return size - 1;
    }

    // -----------------------------
    // Initialization subsystems
    // -----------------------------

    /**
     * initSentinel()
     * Responsibility: create the sentinel node.
     * Inputs: none
     * Outputs: new sentinel Node
     * Side Effects: allocates one node
     * Invariants: returned node is non-null; returned.next == null
     * Time Complexity: O(1)
     * Space Complexity: O(1)
     */
    private Node initSentinel() {
        return new Node(0);
    }

    /**
     * initSizeForEmpty()
     * Responsibility: define the size value for an empty list.
     * Inputs: none
     * Outputs: 0
     * Side Effects: none
     * Invariants: output == 0
     * Time Complexity: O(1)
     * Space Complexity: O(1)
     */
    private int initSizeForEmpty() {
        return 0;
    }

    // -----------------------------
    // Testing/edge validation subsystem (optional)
    // -----------------------------

    /**
     * assertWellFormed(dummy, size)
     * Responsibility: validate structural invariants (use in tests/debug).
     * Inputs: dummy, size
     * Outputs: none (throws AssertionError if broken when assertions enabled)
     * Side Effects: none
     * Invariants checked:
     *  - dummy != null
     *  - traversal count from dummy.next equals size
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    private void assertWellFormed(Node dummy, int size) {
        assert dummy != null;
        int count = 0;
        Node cur = dummy.next;
        while (cur != null) {
            count++;
            cur = cur.next;
        }
        assert count == size;
    }
}
```
