---
title: Combination Sum
date: 2026-11-02
description: Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.  
tags:
  - leetcode
  - recursive
  - backtracking
problem: Combination Sum 
difficulty: medium
topics:
  - leetcode
  - recursive
  - backtracking
language: java python
timee: O(N%(T/M))
space: O(T/M)
sourceUrl: https://leetcode.com/problems/combination-sum/description/
draft: false
---

## Python and Java implemenation

```java
class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<Integer> path = new ArrayList<>();
        List<List<Integer>> res = new ArrayList<>();

        backtrack(candidates, 0, target, path, res);
        return res;
    }

    private void backtrack(int[] c, int start, int remaining, List<Integer> path, List<List<Integer>> res) {
        if (remaining == 0) {
            res.add(new ArrayList<>(path));
            return;
        }

        for (int i = start; i < c.length; i++) {
            if (c[i] > remaining) {
                break;
            }

            path.add(c[i]);
            backtrack(c, i, remaining-c[i], path, res);
            path.remove(path.size() -1);
        }
    }
}
```

```python
class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        candidates.sort()

        res, path = [], []

        def backtrack(start, remaining):
            if remaining == 0:
                res.append(path[:])

            for i in range(start, len(candidates)):
                if candidates[i] > remaining:
                    break

                path.append(candidates[i])
                backtrack(i, remaining - candidates[i])
                path.pop()

        backtrack(0, target)
        return res

```

## Trackina an example

```bash
candidates = [2, 3, 6, 7] target = 7

candidatesSum(candidates, target):
	candidates.sort() => [2, 3, 6, 7]
	res = []
	path = []
	
	backtrack(0, target):
		remaining == 0 ==> 7 == 0 if false
		for i in range(start, len(candidates)(0, 4):
			if candidates[0] > remaining --> 2 > 7 is false
			
			path.app(candidates[i]) = [2]
			backtrack(i, remaining - candidates[i])
			backtrack(0, 7 - 2)
				start = 0
				remaining = 5
				if remaining == 0 is false
				
				for i in range(0, 4):
					if 2 > 5 is false
					
					path.append(candidates[i]) = [2, 2]
					backtrack(0, 5-2)
						start = 0
						remaining = 3
						if remaining == 0 is false
						
						for i in range(0, 4):
							if 2 > 3 is false
							
							path.append(2) = [2, 2, 2]
							backtrack(0, 3 -2)
								start = 0
								remaining = 1
								if remaining == 0 is false
								
								for i in range(0, 4):
									if 2 > 1 is true
										break
							path.pop() = [2, 2]
						for i = 1
							if 3 > 3 is false
							
							path.append(3) --> [2, 2, 3]
							backtrack(1, 3 - 3)
								start = 1
								remaining = 0
								if remaining == 0 is true:
									res.append(path[:]) --> [2, 2, 3]
									return
							path.pop() -> [2,2]
						for i = 2
							if 6 > 3 is true
								break
						path.pop() --> [2]
				for i = 1:
					if 3 > 5 is false
					
					path.append(3) -> [2, 3]
					backtrack(1, 5 - 3)
						start = 1
						remaining = 2
						if remaining == 0 is false
						for i = 1
							if 3 > 2 is true:
								break
					
					path.pop() - [2]
				for i = 2:
					if 6 > 5 is true
						break
			
			path.pop() ---> []
		for i = 1:
			if 3 > 7 is false
			
			path.append(3) ---> [3]
			backtrack(1, 7 -3)
				start = 1
				remaining = 4
				if remaining == 0 is false
				
				for i = 1:
					if 3 > 4 is false
					
					path.append(3) = [3, 3]
					backtrack(1, 4 -3)
						start = 1
						remaining =1
					
						if remaining == 0 is false
					
						for i = 2
							if 6 > 1 is true
								break
				
					path.pop() - [3]
				
				for i = 2:
					if 6 > 4 is true:
						break
			path.pop() --> []
			
		for i = 2:
			if 6 > 7 is false
			
			path.append(6) -> [6]
			backtrack(2, 7 - 6)
				start = 2
				remaining = 1
				
				if remaining == 0 is false
				
				for i = 2:
					if 6 > 1 is true
						break
			path.pop() --> []
			
		for i = 3:
			if 7 > 7 is false
			
			path.append(7) --> [7]
			backtrack(3, 7 - 7)
				if remaining == 0 is true
					res.append(path[:]) --.> [[2, 2, 3], [7]]
					return
		path.pop()-- > []
		
		return res
```