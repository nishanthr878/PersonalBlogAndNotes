---
title: Design Browser History (LeetCode 1472)
date: 2026-03-16
description: Implementation of Browser history in a single tab
tags:
  - leetcode
  - Stack, Deque
  - data-structures
problem: Design Browser History
difficulty: medium
topics:
  - Stacks, Deque
  - design
language: Java
time: O(n)
space: O(1)
sourceUrl: https://leetcode.com/problems/design-browser-history/
draft: false
---


## Solution (Java)

```java

import java.util.ArrayDeque;
import java.util.Deque;

class BrowserHistory {
    // Back-history: pages you can go back to (top = most recent).
    private final Deque<String> backHistory;

    // Forward-history: pages you can go forward to (top = most recent).
    private final Deque<String> forwardHistory;

    // Current visible page.
    private String current;

    /**
     * Orchestrator: initialize system boundary state.
     *
     * Inputs: homepage (initial page)
     * Outputs: BrowserHistory instance with current=homepage
     * Side effects: allocates deques; sets internal state
     * Invariants: current is non-empty; both histories start empty
     * Time: O(L) for validation; Space: O(1) extra (excluding stored strings)
     */
    public BrowserHistory(String homepage) {
        String hp = validateHomepage(homepage);
        this.backHistory = new ArrayDeque<>();
        this.forwardHistory = new ArrayDeque<>();
        this.current = hp;
    }

    /**
     * Orchestrator: branch navigation to a new url.
     *
     * Responsibility: record the old current into back-history, set new current,
     * and clear all forward history (because the timeline is replaced).
     *
     * Inputs: url (target page)
     * Outputs: none
     * Side effects: mutates backHistory, forwardHistory, and current
     * Invariants after call:
     * - backHistory.top is the previous current
     * - forwardHistory is empty
     * - current == url
     * Time: O(1) + O(F) to clear forward; Space: O(1) extra
     */
    public void visit(String url) {
        String u = validateUrl(url);
        recordCurrentIntoBackHistory(current, backHistory);
        current = u;
        clearForwardHistory(forwardHistory);
    }

    /**
     * Orchestrator: move back up to steps in history.
     *
     * Inputs: steps
     * Outputs: current url after movement
     * Side effects: mutates backHistory, forwardHistory, and current
     * Invariants: never pops from empty backHistory; current always valid
     * Time: O(k), k=min(steps, backHistory.size()); Space: O(1) extra
     */
    public String back(int steps) {
        int s = validateSteps(steps);
        current = moveBack(s, backHistory, forwardHistory, current);
        return getCurrentUrl(current);
    }

    /**
     * Orchestrator: move forward up to steps in history.
     *
     * Inputs: steps
     * Outputs: current url after movement
     * Side effects: mutates backHistory, forwardHistory, and current
     * Invariants: never pops from empty forwardHistory; current always valid
     * Time: O(k), k=min(steps, forwardHistory.size()); Space: O(1) extra
     */
    public String forward(int steps) {
        int s = validateSteps(steps);
        current = moveForward(s, backHistory, forwardHistory, current);
        return getCurrentUrl(current);
    }

    // ---------------- Subsystems (one responsibility each) ----------------

    /**
     * Input validation subsystem (constructor).
     *
     * Responsibility: ensure homepage token is usable.
     * Inputs: homepage
     * Outputs: homepage (same string) if valid
     * Side effects: none
     * Invariants: returned value is non-null and non-empty
     * Time: O(1) here; Space: O(1)
     */
    private String validateHomepage(String homepage) {
        if (homepage == null || homepage.isEmpty()) throw new IllegalArgumentException("homepage");
        return homepage;
    }

    /**
     * Input validation subsystem (visit).
     *
     * Responsibility: ensure url token is usable.
     * Inputs: url
     * Outputs: url (same string) if valid
     * Side effects: none
     * Invariants: returned value is non-null and non-empty
     * Time: O(1) here; Space: O(1)
     */
    private String validateUrl(String url) {
        if (url == null || url.isEmpty()) throw new IllegalArgumentException("url");
        return url;
    }

    /**
     * Input normalization subsystem (steps).
     *
     * Responsibility: normalize steps to a safe non-negative value.
     * Inputs: steps (possibly negative)
     * Outputs: steps' >= 0
     * Side effects: none
     * Invariants: returned value >= 0
     * Time: O(1); Space: O(1)
     */
    private int validateSteps(int steps) {
        return Math.max(0, steps);
    }

    /**
     * Data-structure manipulation subsystem: record the page we are leaving.
     *
     * Responsibility: push current page into back-history.
     * Inputs: current, backHistory
     * Outputs: none
     * Side effects: mutates backHistory
     * Invariants: after call, backHistory.top == previous current
     * Time: O(1); Space: O(1) extra
     */
    private void recordCurrentIntoBackHistory(String current, Deque<String> backHistory) {
        backHistory.push(current);
    }

    /**
     * Data-structure manipulation subsystem: clear forward path.
     *
     * Responsibility: delete all forward-history entries on visit branching.
     * Inputs: forwardHistory
     * Outputs: none
     * Side effects: mutates forwardHistory
     * Invariants: forwardHistory is empty after call
     * Time: O(F); Space: O(1) extra
     */
    private void clearForwardHistory(Deque<String> forwardHistory) {
        forwardHistory.clear();
    }

    /**
     * Core algorithm subsystem: execute back moves by symmetric transfers.
     *
     * Mechanism per step:
     * 1) push current into forwardHistory (it becomes a candidate for "forward")
     * 2) pop from backHistory into current (the previous page becomes visible)
     *
     * Inputs: steps, backHistory, forwardHistory, current
     * Outputs: newCurrent
     * Side effects: mutates both histories
     * Invariants:
     * - performs at most min(steps, backHistory.size()) steps
     * - never pops from empty backHistory
     * Time: O(k); Space: O(1) extra
     */
    private String moveBack(int steps, Deque<String> backHistory, Deque<String> forwardHistory, String current) {
        int k = Math.min(steps, backHistory.size());
        for (int i = 0; i < k; i++) {
            forwardHistory.push(current);
            current = backHistory.pop();
        }
        return current;
    }

    /**
     * Core algorithm subsystem: execute forward moves by symmetric transfers.
     *
     * Mechanism per step:
     * 1) push current into backHistory (it becomes a candidate for "back")
     * 2) pop from forwardHistory into current (the next page becomes visible)
     *
     * Inputs: steps, backHistory, forwardHistory, current
     * Outputs: newCurrent
     * Side effects: mutates both histories
     * Invariants:
     * - performs at most min(steps, forwardHistory.size()) steps
     * - never pops from empty forwardHistory
     * Time: O(k); Space: O(1) extra
     */
    private String moveForward(int steps, Deque<String> backHistory, Deque<String> forwardHistory, String current) {
        int k = Math.min(steps, forwardHistory.size());
        for (int i = 0; i < k; i++) {
            backHistory.push(current);
            current = forwardHistory.pop();
        }
        return current;
    }

    /**
     * Output/return subsystem.
     *
     * Responsibility: provide the observable output (current url).
     * Inputs: current
     * Outputs: current
     * Side effects: none
     * Invariants: returned value equals internal current
     * Time: O(1); Space: O(1)
     */
    private String getCurrentUrl(String current) {
        return current;
    }

    /**
     * Testing/edge-case validation subsystem (optional).
     *
     * Responsibility: assert internal state consistency (use in unit tests/debug).
     * Inputs: current, backHistory, forwardHistory
     * Outputs: none (throws if violated)
     * Side effects: none (other than throwing)
     * Invariants checked: current non-empty; histories non-null
     * Time: O(1) as written; Space: O(1)
     */
    @SuppressWarnings("unused")
    private void assertHistoryInvariants(String current, Deque<String> backHistory, Deque<String> forwardHistory) {
        if (current == null || current.isEmpty()) throw new IllegalStateException("current");
        if (backHistory == null) throw new IllegalStateException("backHistory");
        if (forwardHistory == null) throw new IllegalStateException("forwardHistory");
    }


    public static void main(String[] args) {
        BrowserHistory bh = new BrowserHistory("leetcode.com");
        bh.visit("google.com");
        bh.visit("facebook.com");
        bh.visit("youtube.com");
        System.out.println(bh.back(1)); // facebook.com
        System.out.println(bh.back(1)); // google.com
        System.out.println(bh.forward(1)); // facebook.com
        bh.visit("linkedin.com");
        System.out.println(bh.forward(2)); // linkedin.com (no forward history)
        System.out.println(bh.back(2)); // google.com
        System.out.println(bh.back(7)); // leetcode.com (only 1 back available)
    }
}


```