---
title: Two Sum (LeetCode)
date: 2026-04-06
description: Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.
tags:
  - leetcode
  - hashmap
problem: Top K frequent Elements
difficulty: medium
topics:
  - array
  - hash-table
language: Java
time: O(n)
space: O(n)
sourceUrl: https://leetcode.com/problems/top-k-frequent-elements/
draft: false
---

## Problem

Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.


## Complexity

- Time: `O(n)`
- Space: `O(n)`

## Solution (java)

```java
import java.util.*;

public class TopKFrequentElements {
    public int[] topKFrequent(int[] nums, int k) {
        validateInputs(nums, k);
        Map<Integer, Integer> freqByValue = buildFrequencyMap(nums);
        List<Integer>[] buckets = bucketizeByFrequency(freqByValue, nums.length);
        int[] topK = selectTopKFromBuckets(buckets, k);
        // Optional: validateEdgeCasesAndInvariants(nums, k, topK);
        return formatOutput(topK);
    }

    /**
     * Responsibility: Validate basic preconditions for nums and k.
     * Inputs: nums (int[]), k (int)
     * Outputs: none
     * Side Effects: throws IllegalArgumentException on invalid inputs
     * Invariants: if returns, nums != null, nums.length >= 1, 1 <= k <= nums.length
     * Time: O(1)
     * Space: O(1)
     */
    private static void validateInputs(int[] nums, int k) {
        if(nums.length == 0 || k < 1 || k > nums.length) {
            throw new IllegalArgumentException("Invalid input: nums must be non-empty and 1 <= k <= nums.length");
        }
    }

    /**
     * Responsibility: Build a frequency map value -> count.
     * Inputs: nums (int[])
     * Outputs: Map<Integer,Integer> where counts >= 1
     * Side Effects: allocations only
     * Invariants: sum(counts) == nums.length
     * Time: O(n)
     * Space: O(u)
     */
    private static Map<Integer, Integer> buildFrequencyMap(int[] nums) {
        Map<Integer, Integer> freqByValue = new HashMap<>();
        for(int num : nums) {
            freqByValue.put(num, freqByValue.getOrDefault(num, 0) + 1);
        }
        return freqByValue;
    }


    /**
     * explanation: the above frequency map for input [3,3,5,7,7,9,9,9] would be:
     * freqByValue = {
     *     3 -> 2,    // value 3 appears 2 times
     *     5 -> 1,    // value 5 appears 1 time
     *     7 -> 2,    // value 7 appears 2 times
     *     9 -> 3     // value 9 appears 3 times
     * }
     * n = 4  // array length (so max possible frequency is 4)
     *
     * so bucketizeByFrequency would produce:
     * - A list-of-lists where the index is the frequency, and the value at that index is all number with that frequency.
     * buckets[0] = []           // no values appear 0 times (unused)
     * buckets[1] = [5]          // value 5 appears 1 time
     * buckets[2] = [3, 7]       // values 3 and 7 appear 2 times
     * buckets[3] = [9]          // value 9 appears 3 times
     * buckets[4] = []           // no values appear 4 times (unused)
     *
     *
     * value=3, freq=2 → buckets[2].add(3) → buckets[2] now has [3]
     * value=5, freq=1 → buckets[1].add(5) → buckets[1] now has [5]
     * value=7, freq=2 → buckets[2].add(7) → buckets[2] now has [3, 7]
     * value=9, freq=3 → buckets[3].add(9) → buckets[3] now has [9]
     */

    /**
     * Responsibility: Create frequency buckets indexed by count.
     * Inputs: freqByValue (Map), n (array length)
     * Outputs: List<Integer>[] buckets of size n+1; buckets[f] contains values with frequency f
     * Side Effects: allocations only
     * Invariants: each key appears in exactly one bucket at its frequency; indices in [1..n]
     * Time: O(u)
     * Space: O(n + u)
     */
    private static List<Integer>[] bucketizeByFrequency(Map<Integer, Integer> freqByValue, int n) {
        List<Integer>[] buckets = new List[n + 1]; // Array of n+1 lists
        for(int i = 0; i <= n; i++) {
            buckets[i] = new ArrayList<>(); // Initialize each to empty
        }

        for(Map.Entry<Integer, Integer> entry : freqByValue.entrySet()) {
            int value = entry.getKey();  // e.g., 3
            int frequency = entry.getValue(); // e.g., 2
            buckets[frequency].add(value); // Put 3 into buckets[2]
        }
        return buckets;
    }

    /**
     * Responsibility: Select exactly k values by scanning buckets from high freq to low.
     * Inputs: buckets (List<Integer>[]), k (int)
     * Outputs: int[] of length k
     * Side Effects: none
     * Invariants: output length == k; all elements distinct
     * Time: O(n + k) worst-case
     * Space: O(k)
     */
    private static int[] selectTopKFromBuckets(List<Integer>[] buckets, int k) {
        int[] topK  = new int[k];
        int index = 0;
        for(int freq = buckets.length -1; freq >= 1 && index < k; freq--) {
            for(int value : buckets[freq]) {
                topK[index] = value;
                index++;
                if(index == k) {
                    break;
                }
            }
        }
        return topK;
    }

    /**
     * Responsibility: Return the result in required shape.
     * Inputs: topK (int[])
     * Outputs: int[] result
     * Side Effects: none
     * Invariants: result.length == topK.length
     * Time: O(1)
     * Space: O(1)
     */
    private static int[] formatOutput(int[] topK) {
        return topK;
    }

    /**
     * Responsibility: Debug/test-only invariant validation for edge cases.
     * Inputs: nums, k, result
     * Outputs: none
     * Side Effects: may throw/assert on failure
     * Invariants: result length k; values unique; each value appears in nums
     * Time: O(n) (debug/tests)
     * Space: O(k) or O(u) (debug/tests)
     */
    private static void validateEdgeCasesAndInvariants(int[] nums, int k, int[] result) {
        assert result.length == k : "Result length must be k";
        Set<Integer> seen = new HashSet<>();
        Set<Integer> numsSet = new HashSet<>();
        for(int num : nums) {
            numsSet.add(num);
        }
        for(int value : result) {
            assert !seen.contains(value) : "Values in result must be unique";
            assert numsSet.contains(value) : "Values in result must appear in input";
            seen.add(value);
        }
    }

    public static void main(String[] args) {
        TopKFrequentElements solution = new TopKFrequentElements();
        int[] nums = {1,1,1,2,2,3};
        int k = 2;
        int[] topK = solution.topKFrequent(nums, k);
        System.out.println(Arrays.toString(topK)); // Expected: [1, 2]
    }
}
```
