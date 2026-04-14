---
title: Group Anagrams (LeetCode)
date: 2026-04-11
description: Group Anagrams
tags:
  - leetcode
  - hashmap
problem: Group Anagrams
difficulty: medium
topics:
  - array
  - hash-table
language: java
time: O(n)
space: O(n)
sourceUrl: https://leetcode.com/problems/group-anagrams/description/
draft: false
---

## Problem
- Boundary: groupAnagrams(strs) transforms a list of lowercase strings into groups where each group shares the same anagram signature.
- Inputs: String[] strs
- Outputs: List<List<String>> grouped anagrams (order of groups and order within groups unspecified).
- Constraints: 1 <= strs.length <= 1e4, 0 <= strs[i].length <= 100, lowercase English letters.
- Observability: We can verify by comparing multiset of input strings vs flattened output + checking each group shares the same signature.

## Approach
- Subsystem: validateAndNormalizeInput
- Subsystem: computeSignatureByCounting
- Subsystem: indexStringsBySignature
- Subsystem: materializeGroupedOutput
- Subsystem: validateResultInvariants (Testing/Edge Case Validation)


## Complexity

- Time: `O(n)`
- Space: `O(n)`

## Solution (java)

```java
import java.util.*;
import java.util.function.Function;

public class GroupAnagrams {
    /** Orchestrator only: no inline algorithmic logic. */
    public static List<List<String>> groupAnagrams(String[] strs) {
        List<String> items = validateAndNormalizeInput(strs);
        Map<String, List<String>> groupsByKey = indexStringsBySignature(
                items,
                GroupAnagrams::computeSignatureByCounting
        );
        List<List<String>> result = materializeGroupedOutput(groupsByKey);
        // Optional for tests/debug:
        // validateResultInvariants(items, result, GroupAnagramsSystem::computeSignatureByCounting);
        return result;
    }

    /**
     * Responsibility: Validate input and normalize into internal list form.
     * Inputs: strs (array of strings)
     * Outputs: list of strings in same order
     * Side Effects: none
     * Invariants: size preserved; null-handling policy enforced
     * Time: O(n)
     * Space: O(n)
     */
    private static List<String> validateAndNormalizeInput(String[] strs) {
        if (strs == null || strs.length == 0) {
            return Collections.emptyList();
        }
        List<String> result = new ArrayList<>();
        for(String s : strs) {
            if ( s == null) {
                return result; // or throw IllegalArgumentException("Input contains null string");
            }
            result.add(s.trim());
        }
        return result;
    }

    /**
     * Responsibility: Compute an anagram-invariant signature using lowercase a-z counts.
     * Inputs: s (lowercase English letters, may be empty)
     * Outputs: deterministic signature string
     * Side Effects: none
     * Invariants: anagrams => same signature; non-anagrams => different signature
     * Time: O(L)
     * Space: O(1) auxiliary
     */
    private static String computeSignatureByCounting(String s) {
        int[] counts = new int[26];
        for(int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            counts[ch - 'a']++;
        }
        StringBuilder sb = new StringBuilder();
        for(int i = 0; i < 26; i++) {
            if(counts[i] > 0) {
                sb.append((char) ('a' + i));
                sb.append(counts[i]);
            }
        }
        return sb.toString();
    }

    /**
     * Responsibility: Bucket strings by signature into a map.
     * Inputs: items, signatureFn
     * Outputs: map from signature to list of original strings
     * Side Effects: allocates and populates map/lists
     * Invariants: every input appears exactly once in exactly one bucket
     * Time: O(totalChars)
     * Space: O(n)
     */
    private static Map<String, List<String>> indexStringsBySignature(
            List<String> items,
            Function<String, String> signatureFn
    ) {
        Map<String, List<String>> map = new HashMap<>();
        for(String item : items) {
            String signature = signatureFn.apply(item);
            if (map.containsKey(signature)) {
                map.get(signature).add(item);
            } else {
                map.put(signature, new ArrayList<>(Arrays.asList(item)));
                //cleaner alternative: map.computeIfAbsent(signature, k -> new ArrayList<>()).add(item);
            }
        }
        return map;
    }

    /**
     * Responsibility: Convert grouping map into required output type.
     * Inputs: groupsByKey
     * Outputs: list-of-lists view of groups
     * Side Effects: allocates outer list (and possibly copies inner lists per policy)
     * Invariants: flattened output size equals total input size
     * Time: O(k)
     * Space: O(k)
     */
    private static List<List<String>> materializeGroupedOutput(
            Map<String, List<String>> groupsByKey
    ) {
        List<List<String>> result = new ArrayList<>();
        for(List<String> group : groupsByKey.values()) {
            result.add(group);
        }
        return result;
        // entire method can be return in one line
        // return new ArrayList<>(groupsByKey.values());
    }


    /**
     * Responsibility: Validate postconditions for tests/debug.
     * Inputs: input items, output groups, signatureFn
     * Outputs: none (throws/asserts on violation)
     * Side Effects: may throw AssertionError/IllegalStateException
     * Invariants Checked: element preservation; per-group signature consistency
     * Time: O(totalChars)
     * Space: O(n)
     */
    private static void validateResultInvariants(
            List<String> input,
            List<List<String>> output,
            Function<String, String> signatureFn
    ) {
        throw new UnsupportedOperationException("stub");
    }

    public static void main(String[] args) {
        String[] input = {"eat", "tea", "tan", "ate", "nat", "bat"};
        List<List<String>> result = groupAnagrams(input);
        System.out.println(result);
    }
}
```
