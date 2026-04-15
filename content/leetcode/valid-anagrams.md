---
title: Valid Anagrams (LeetCode)
date: 2026-04-15
description: Given 2 strings check if they are anagrams
tags:
  - leetcode
  - hashmap
problem: Valid Anagrams
difficulty: easy
topics:
  - array
  - hash-table
language: java
time: O(n)
space: O(1)
sourceUrl: https://leetcode.com/problems/valid-anagram/
draft: false
---

## Problem
- Given 2 string check if they are anagrams
- **Input** = two string s, t
  - only lower case letters, and length will be 1 to 5 * 10^4
- **output** = boolean

## Approach 1:
- Probably first we will be check the length
- we can sort both string and loop through it to check each character matches

## Approach 2:
- Hashmap approach we create a hasmap char frequency for the one string
- we will remove the count from the frequency by looping char from other string
- later we will check if the frequency is zero, if not we will return false

Store previously-seen numbers in a map from value -> index. For each value `x`, check whether `target - x` is already in the map.

## Complexity

- Time: `O(n)`
- Space: `O(1)`


## Solution (java)

```java

import java.util.HashMap;

/**
 * Valid Anagrams
 * Given 2 string check if they are anagrams
 *
 * input = two string s, t
 *   - only lower case letters, and length will be 1 to t * 10^4
 * output = boolean
 *
 * Approach 1:
 * - Probably first we will be check the length
 * - we can sort both string and loop through it to check each character matches
 *
 * Approach 2:
 * - Hashmap approach we create a hasmap char frequency for the one string
 * - we will remove the count from the frequency by looping char from other string
 * - later we will check if the frequency is zero, if not we will return false
 *
 * Time complexity: O(n)
 * Space complexity: O(1)
 *
 */
public class ValidAnagram {
    public boolean isAnagram(String s, String t) {
        HashMap<Character, Integer> frequency = new HashMap<>();
        if (s.length() != t.length()) {
            return false;
        }
        for(char c : s.toCharArray()) {
            frequency.put(c, frequency.getOrDefault(c, 0) + 1);
        }

        for (char c : t.toCharArray()) {
            frequency.put(c, frequency.getOrDefault(c, 0) - 1);
        }

        for (int val : frequency.values()) {
            if (val != 0) {
                return false;
            }
        }
        return true;
    }

    public static void main(String args[]) {
        String s = "anagram";
        String t = "nagaram";
        ValidAnagram testAnagram = new ValidAnagram();
        System.out.println(testAnagram.isAnagram(s, t)); // Output: true

        s = "rat";
        t = "car";
        System.out.println(testAnagram.isAnagram(s, t)); // Output: false
    }

}
```
