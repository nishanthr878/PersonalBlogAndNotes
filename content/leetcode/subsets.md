---
title: Subsets
date: 2026-10-26
description: Given an integer array nums of unique elements, return all possible subsets (the power set).
tags:
  - leetcode
  - backtracking
  - recursive
problem: Subsets
difficulty: medium
topics:
  - leetcode
  - backtracking
  - recursive
language: java python
time: O(n * 2 ^n)
space: O(n)
sourceUrl: https://leetcode.com/problems/subsets/description/
draft: false
---

## Python and Java implementation

```python
class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        res = []
        path = []

        def backtracking(start):
            res.append(path[:])

            for i in range(start, len(nums)):
                path.append(nums[i])
                backtracking(i + 1)
                path.pop()

        backtracking(0)
        return res
        
```

```java
class Solution {
    private List<List<Integer>> res = new ArrayList<>();
    private List<Integer> path = new ArrayList<>();

    public List<List<Integer>> subsets(int[] nums) {
        backtrack(0, nums);
        return res;    
    }

    private void backtrack(int start, int[] nums) {
        res.add(new ArrayList<>(path));

        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            backtrack(i + 1, nums);
            path.remove(path.size() - 1);
        }

    }
}
```

## Tracking an example

```bash

nums = [1, 2, 3]
res = []
path = []

backtrack(0)
	start = 0
	path = []
	res = []
	
	for loop i = 0, start = 0, len(nums) = 3
		path.append(nums[0]) = path = [1]
		
		backtrack(i + 1) i = 0
			start = 1
			res = [[], [1]]
			for loop i = 1, start = 1, len(nums) = 3
				path.append(nums[1]) = [1, 2]
				backtrack(i + 1) i = 1
					start = 2
					res = [[], [1], [1, 2]]
					for loop i = 2 start = 2, len = 3
						path.append(nums[2]) = [1, 2, 3]
						backtrack(i + 1) i = 2
							res = [[], [1], [1, 2], [1, 2, 3]]
							
							for loop fails because start = len = 3
					path.pop() = [1, 2]
				path.pop() = [1]
				for loop i = 2, start = 1, len(nums) = 3
					path.append(nums[2]) = [1, 3]
					backtrack(i + 1) i = 2
						start = 3
						res = [[], [1], [1, 2], [1, 2, 3], [1, 3]]
						for loop fails because start = len = 3
					path.pop() = [1]
		path.pop() = []
		
		for loop i = 1, start = 0, len = 3
			path.append(nums[1]) = [2]
			backtrack(i + 1) i = 1
				start = 2
				res.append(path[:]) = [[], [1], [1, 2], [1, 2, 3], [1, 3], [2]]
				for loop i = 2, start = 2, len = 3
					path.append(nums[2]) = [2, 3]
					backtrack(i + 1) i = 2
						start = 3
						res.append(path[:]) = [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3]]
						for loop fails so it will return
				path.pop = [2]
			
			path.pop() = []
			
		for loop i = 2, start = 0, len = 3
			path.append(nums[2]) = [3]
			backtrack(i + 1) i = 2
				start = 3
				res.append(path[:]) = [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]
				for loop closed and it returns backtrack
			
			path.pop() = []
```

Recursion tree for [1, 2, 3]

```bash
[]
├─1→ [1]
│      ├─2→ [1,2]
│      │       └─3→ [1,2,3]
│      └─3→ [1,3]
├─2→ [2]
│      └─3→ [2,3]
└─3→ [3]
```