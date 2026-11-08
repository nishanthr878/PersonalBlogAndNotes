---
title: Permutations
date: 2026-11-08
description: Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.
tags:
  - leetcode
  - recursion
  - backtracking
  - depth first search
problem: Permutations
difficulty: medium
topics:
  - recursion
  - backtracking
  - depth first search
language: java, python
time: O(n.n!)
space: O(n)
sourceUrl: https://leetcode.com/problems/permutations/description/
draft: false
---

## Python and Java implementation

```java
class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        boolean[] used = new boolean[nums.length];
        dfs(res, path, used, nums); 
        return res;
    }

    private void dfs(List<List<Integer>> res, List<Integer> path, boolean[] used, int[] nums) {
        if (nums.length == path.size()) {
            res.add(new ArrayList(path));
            return;
        }

        for (int i = 0; i < nums.length; i++) {
            if (used[i]) {
                continue;
            }
            used[i] = true;
            path.add(nums[i]);

            dfs(res, path, used, nums);
            path.remove(path.size() - 1);
            used[i] = false;

        }
    }
}
```

```python
class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        res = []
        path = []
        used = [False] * len(nums)

        def dfs():
            if len(path) == len(nums):
                res.append(path[:])
                return

            for i, x  in enumerate(nums):
                if used[i]:
                    continue

                used[i] = True
                path.append(x)

                dfs()
                path.pop()
                used[i] = False

        dfs()

        return res
```

tracing one example nums = [1, 2, 3]

```mermaid
flowchart LR
  n0["#0 path [] pool (1,2,3)"]
  n1["#1 path [1] pool (2,3)"]
  n2["#2 path [1,2] pool (3)"]
  n3["#3 path [1,2,3]"]
  n4["#4 path [1,3] pool (2)"]
  n5["#5 path [1,3,2]"]
  n6["#6 path [2] pool (1,3)"]
  n7["#7 path [2,1] pool (3)"]
  n8["#8 path [2,1,3]"]
  n9["#9 path [2,3] pool (1)"]
  n10["#10 path [2,3,1]"]
  n11["#11 path [3] pool (1,2)"]
  n12["#12 path [3,1] pool (2)"]
  n13["#13 path [3,1,2]"]
  n14["#14 path [3,2] pool (1)"]
  n15["#15 path [3,2,1]"]

  n0 -- choose 1 --> n1
  n1 -- choose 2 --> n2
  n2 -- choose 3 --> n3
  n1 -- choose 3 --> n4
  n4 -- choose 2 --> n5
  n0 -- choose 2 --> n6
  n6 -- choose 1 --> n7
  n7 -- choose 3 --> n8
  n6 -- choose 3 --> n9
  n9 -- choose 1 --> n10
  n0 -- choose 3 --> n11
  n11 -- choose 1 --> n12
  n12 -- choose 2 --> n13
  n11 -- choose 2 --> n14
  n14 -- choose 1 --> n15

  classDef leaf fill:#C0DD97,stroke:#3B6D11,color:#173404
  class n3,n5,n8,n10,n13,n15 leaf
```

