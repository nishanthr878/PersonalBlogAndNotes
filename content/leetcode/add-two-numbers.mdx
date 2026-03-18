---
title: Add two numbers (LeetCode)
date: 2026-03-18
description: given 2 reviersed linked list add provide the result 
tags:
  - leetcode
  - linked list
problem: Add two numbers
difficulty: medium
topics:
  - linked list
language: Java
time: O(n)
space: O(n)
sourceUrl: https://leetcode.com/problems/add-two-numbers/
draft: false
---

## Problem

You are given two non-empty linked lists representing two non-negative integers. 
The digits are stored in reverse order, and each of their nodes contains a single digit. 
Add the two numbers and return the sum as a linked list.


## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Solution (Java)

```java

public class AddTwoNumbers {
    /**
     * Orchestrator only.
     * Contract:
     * - Input: two non-null reverse-order digit lists (0..9 per node).
     * - Output: new reverse-order digit list representing their sum.
     * Side effects:
     * - Does not mutate l1/l2; allocates result nodes.
     * Complexity: O(n+m) time, O(n+m) output space.
     */
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        validateInputs(l1, l2);

        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        ListNode p1 = l1;
        ListNode p2 = l2;
        int carry = 0;

        while (shouldContinue(p1, p2, carry)) {
            int aDigit = readDigit(p1);
            int bDigit = readDigit(p2);

            int[] step = addDigitsWithCarry(aDigit, bDigit, carry); // [outDigit, carryOut]

            tail = appendNode(tail, step[0]);

            p1 = advance(p1);
            p2 = advance(p2);
            carry = step[1];
        }

        return finalizeResult(dummy);
    }

    // ------------------------------------------------------------
    // SUBSYSTEM: validateInputs
    // Contract: throws IllegalArgumentException if inputs are invalid.
    // Invariants: does not mutate input lists.
    // Time: O(n+m) worst-case for a full traversal; O(1) here since
    //       LeetCode guarantees valid nodes (we just null-check).
    // Space: O(1).
    // ------------------------------------------------------------
    static void validateInputs(ListNode l1, ListNode l2) {
        if(l1 == null || l2 == null) {
            throw new  IllegalArgumentException("Input lists cannot be null");
        }
    }

    // ------------------------------------------------------------
    // SUBSYSTEM: readDigit
    // Contract: returns node.val if node != null, else 0.
    // Invariants: return value is always in [0..9].
    // Time: O(1), Space: O(1).
    // ------------------------------------------------------------
    static int readDigit(ListNode node) {
        if(node == null) {
            return 0;
        } else {
            return node.val;
        }
    }

    // ------------------------------------------------------------
    // SUBSYSTEM: readDigit
    // Contract: returns node.val if node != null, else 0.
    // Invariants: return value is always in [0..9].
    // Time: O(1), Space: O(1).
    // ------------------------------------------------------------
    static ListNode advance(ListNode node) {
        if(node == null) {
            return null;
        } else {
            return node.next;
        }
    }

    // ------------------------------------------------------------
    // SUBSYSTEM: addDigitsWithCarry
    // Contract:
    //   - Inputs: aDigit in [0..9], bDigit in [0..9], carryIn in [0..1].
    //   - Output: int[]{outDigit (0..9), carryOut (0..1)}.
    // Invariant: aDigit + bDigit + carryIn == outDigit + 10 * carryOut.
    // Time: O(1), Space: O(1).
    // ------------------------------------------------------------
    static int[] addDigitsWithCarry(int aDigit, int bDigit, int carryIn) {
        int total = aDigit + bDigit + carryIn;
        int outDigit = total % 10;
        int carryout = total / 10;
        return new int[]{outDigit, carryout};
    }

    // ------------------------------------------------------------
    // SUBSYSTEM: appendNode
    // Contract:
    //   - Allocates a new ListNode with the given digit.
    //   - Links it after the current tail and returns the new tail.
    // Invariants: tail.next is set; new tail is the appended node;
    //             original list structure is not altered.
    // Time: O(1), Space: O(1) auxiliary (one node allocated).
    // ------------------------------------------------------------
    static ListNode appendNode(ListNode tail, int digit) {
        ListNode newNode = new ListNode(digit);
        tail.next = newNode;
        return newNode;
    }

    // ------------------------------------------------------------
    // SUBSYSTEM: shouldContinue
    // Contract:
    //   - Returns true if there is remaining work:
    //       any unread input node OR a non-zero carry.
    //   - Returns false only when both lists are exhausted AND carry is 0.
    // Invariants: loop terminates; no side effects.
    // Time: O(1), Space: O(1).
    // ------------------------------------------------------------
    static boolean shouldContinue(ListNode p1, ListNode p2, int carry) {
        if(p1 != null || p2 != null || carry != 0) {
            return true;
        } else {
            return false;
        }
    }

    // ------------------------------------------------------------
    // SUBSYSTEM: finalizeResult
    // Contract:
    //   - Discards the dummy head and returns the real first node.
    //   - If result would be empty (should not happen by problem
    //     constraints), returns a node representing 0.
    // Invariants: does not mutate the result list.
    // Time: O(1), Space: O(1).
    // ------------------------------------------------------------
    static ListNode finalizeResult(ListNode dummyHead) {
        if(dummyHead.next == null) {
            return new ListNode(0);
        } else {
            return dummyHead.next;
        }
    }


    public static void main(String[] args) {
        AddTwoNumbers solution = new AddTwoNumbers();

        // Example test case: (2 -> 4 -> 3) + (5 -> 6 -> 4) = (7 -> 0 -> 8)
        ListNode l1 = new ListNode(2, new ListNode(4, new ListNode(3)));
        ListNode l2 = new ListNode(5, new ListNode(6, new ListNode(4)));
        ListNode result = solution.addTwoNumbers(l1, l2);

        // Print the result list
        while (result != null) {
            System.out.print(result.val);
            if (result.next != null) {
                System.out.print(" -> ");
            }
            result = result.next;
        }
    }
}

```