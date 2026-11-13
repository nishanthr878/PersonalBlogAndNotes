---
title: Subset LL
date: 2026-11-13
description: Given an integer array nums that may contain duplicates, return all possible subsets (the power set). order.
tags:
  - leetcode
  - recursion
  - backtracking
problem: Subset ll
difficulty: medium
topics:
  - recursion
  - backtracking
language: java, python
time: O(n.2^n)
space: O(n)
sourceUrl: https://leetcode.com/problems/subsets-ii/description/
draft: false
---

### Intution building

ELI5: You have toys on a shelf: a car, a ball, and a second identical ball. For each toy you choose “take it” or “skip it”. With distinct toys, every combination of choices gives a different bag. With two identical balls, “take ball A, skip ball B” and “skip ball A, take ball B” give the same bag. That’s where the duplicates come from.

The fix has two parts:
1. Sort, so identical toys sit next to each other.
2. At each decision level, never pick the same value twice as the “next toy”. If you skipped the first 2 at this level, you can’t then pick the second 2 at the same level, because that would rebuild a bag you already made.

### Visualization for [1, 2, 2]
```bash
                      []
          ┌────────────┼────────────┐
         [1]          [2]        [2'] ✗ skipped (same level as [2])
      ┌───┴───┐        │
    [1,2]  [1,2'] ✗   [2,2]
      │   (same level
    [1,2,2]  as [1,2])
```

### Python and Java Implementation

```Python
class Solution:
    def subsetsWithDup(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        res = []
        path = []

        def backtrack(start):
            res.append(path[:])

            for i in range(start, len(nums)):
                if i > start and nums[i] == nums[i -1]:
                    continue
                path.append(nums[i])
                backtrack(i + 1)
                path.pop()
        
        backtrack(0)
        return res
```

```java
class Solution {
    List<List<Integer>> res = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums);
        backtrack(0, res, path, nums);
        return res;
    }

    private void backtrack(int start, List<List<Integer>> res, List<Integer> path, int[] nums) {
        res.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i - 1]) {
                continue;
            }
            path.add(nums[i]);
            backtrack(i + 1, res, path, nums);
            path.remove(path.size() - 1);
        }
    }
}
```