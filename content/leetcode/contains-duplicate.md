---
title: Contains Duplicate
date: 2026-04-14
description: Set approach to find if the array contains duplicate
tags:
  - leetcode
  - set
problem: Contains duplicate
difficulty: easy
topics:
  - array
  - set
language: Java
time: O(n)
space: O(n)
sourceUrl: https://leetcode.com/problems/contains-duplicate/
draft: false
---

## Problem

Given an array of integers, return true if any value appears more than once.

## Approach 1: Brute Force — O(n²)

For every element, scan the rest of the array to check if it appears again. Simple to reason about, unusable at scale. With n up to 10⁵, you're looking at 10¹⁰ operations in the worst case. Dead on arrival.

## Approach 2: HashMap (Frequency Count) — O(n) time, O(n) space
Count occurrences of each number. If any frequency hits 2, return true.
Works, but you're doing more work than needed. You don't care how many times something appears — just whether it appears again. Storing full frequency counts is wasteful.

## Approach 3: HashSet (Early Exit) — O(n) time, O(n) space
The clean solution. Add each number to a set. Before adding, check if it's already there — if yes, return true immediately. You short-circuit the moment a duplicate is found instead of grinding through the whole array.

## Complexity

- Time: `O(n)`
- Space: `O(n)`

## Solution (TypeScript)

```java
import java.util.HashSet;
import java.util.Set;

public class ContainsDuplicate {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int num : nums) {
            if(seen.contains(num)) {
                return true;
            }
            seen.add(num);
        }
        return false;
    }

    public static void main(String[] args) {
        int nums[] = {1, 2, 3, 1};
        ContainsDuplicate sol = new ContainsDuplicate();
        System.out.println(sol.containsDuplicate(nums));

    }
}
```
