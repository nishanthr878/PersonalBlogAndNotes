---
title: Add Two Numbers II (leetcode)
date: 2026-03-23
description: given 2 reviersed linked list add provide the result
tags:
  - leetcode
  - linked list
  - deque
problem: Add Two Numbers II
difficulty: medium
topics:
  - deque
  - linked list
language: TypeScript
time: O(n)
space: O(n)
sourceUrl: https://leetcode.com/problems/add-two-numbers-ii/
draft: false
---

## Problem

You are given two non-empty linked lists representing two non-negative integers. The most significant digit comes first and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.


## Complexity

- Time: `O(n)`
- Space: `O(n)`

## Solution (Java)

```java
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

public class AddNumbers2 {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Orchestrator only: no inline algorithmic logic.
        validateInputs(l1, l2);
        Deque<Integer> s1 = listToDigitStack(l1);
        Deque<Integer> s2 = listToDigitStack(l2);
        int[] revDigits = addDigitStacks(s1, s2);
        ListNode out = buildForwardListFromRevDigits(revDigits);
        return finalizeOutput(out);
    }

    static void validateInputs(ListNode l1, ListNode l2) {
        /**
         * Responsibility: Validate structural/digit assumptions for l1/l2.
         * Inputs: l1, l2 (expected non-null, non-empty lists)
         * Outputs: none (throws IllegalArgumentException if invalid)
         * Side Effects: none
         * Invariants: on return, both lists are non-null; every node val is in [0..9]
         * Time: O(n+m)
         * Space: O(1)
         */
        if (l1 == null || l2 == null) throw new IllegalArgumentException("l1/l2 must be non-null");
        validateDigitRange(l1);
        validateDigitRange(l2);
    }


    static void validateDigitRange(ListNode head) {
        /**
         * Responsibility: Ensure every node value is a digit [0..9].
         * Inputs: head (non-null)
         * Outputs: none (throws IllegalArgumentException if invalid)
         * Side Effects: none
         * Invariants: traverses without modifying list
         * Time: O(n)
         * Space: O(1)
         */
        for (ListNode cur = head; cur != null; cur = cur.next) {
            if (cur.val < 0 || cur.val > 9) throw new IllegalArgumentException("Digit out of range: " + cur.val);
        }
    }

    static Deque<Integer> listToDigitStack(ListNode head) {
        /**
         * Responsibility: Convert forward-order list into a digit stack (removeLast() gives LSD).
         * Inputs: head (non-null)
         * Outputs: Deque<Integer> where tail is least-significant digit
         * Side Effects: none
         * Invariants: deque size == list length; all elements are digits [0..9]
         * Time: O(n)
         * Space: O(n)
         */
        Deque<Integer> stack = new ArrayDeque<>();
        for (ListNode cur = head; cur != null; cur = cur.next) stack.addLast(cur.val);
        return stack;
    }

    static int[] addDigitStacks(Deque<Integer> s1, Deque<Integer> s2) {
        /**
         * Responsibility: Pop-add digits with carry; emit least-significant-first digits.
         * Inputs: s1, s2 (digits, tail is top for popping via removeLast())
         * Outputs: revDigits array (index 0 is least-significant digit)
         * Side Effects: consumes s1 and s2 via removeLast()
         * Invariants:
         *   - carry is always 0 or 1
         *   - every emitted digit is in [0..9]
         * Time: O(n+m)
         * Space: O(n+m)
         */
        int cap = Math.max(s1.size(), s2.size()) + 1;
        int[] rev = new int[cap];
        int k = 0;
        int carry = 0;

        while (!s1.isEmpty() || !s2.isEmpty() || carry != 0) {
            int d1 = s1.isEmpty() ? 0 : s1.removeLast();
            int d2 = s2.isEmpty() ? 0 : s2.removeLast();
            int sum = d1 + d2 + carry;
            rev[k++] = sum % 10;
            carry = sum / 10;
        }

        return Arrays.copyOf(rev, k);
    }

    static ListNode buildForwardListFromRevDigits(int[] revDigits) {
        /**
         * Responsibility: Build forward-order list from LSD-first digits using head insertion.
         * Inputs: revDigits (LSD-first), non-empty for valid problem inputs
         * Outputs: head of forward-order list
         * Side Effects: allocates new nodes
         * Invariants: output digits in [0..9]; no cycles
         * Time: O(k)
         * Space: O(k)
         */
        ListNode head = null;
        for (int i = 0; i < revDigits.length; i++) {
            head = new ListNode(revDigits[i], head);
        }
        return head;
    }


    static ListNode finalizeOutput(ListNode head) {
        /**
         * Responsibility: Return final head; defensively strip leading zeros if any.
         * Inputs: head (non-null for this problem)
         * Outputs: head
         * Side Effects: none
         * Invariants: no leading zeros unless single node
         * Time: O(k) worst-case (only if trimming happens)
         * Space: O(1)
         */
        while (head != null && head.val == 0 && head.next != null) head = head.next;
        return head;
    }

    public static void main(String[] args) {
        // Example usage:
        ListNode l1 = new ListNode(7, new ListNode(2, new ListNode(4, new ListNode(3))));
        ListNode l2 = new ListNode(5, new ListNode(6, new ListNode(4)));
        AddNumbers2 sol = new AddNumbers2();
        ListNode result = sol.addTwoNumbers(l1, l2);
        while (result != null) {
            System.out.print(result.val + " ");
            result = result.next;
        }
        // Expected output: 7 8 0 7 (representing 7807)
    }

}
```
