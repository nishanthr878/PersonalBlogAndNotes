---
title: Minimum Window Substring
date: 2026-08-13
description: Given 2 strings check if the second string is a substring of first string with a minimum window
tags:
  - leetcode
  - sliding window
problem: Minimum window substring
difficulty: hard
topics:
  - sliding window
  - hash-table
language: java
time: O(m + n)
space: O(m + n)
sourceUrl: https://leetcode.com/problems/minimum-window-substring/description/
draft: false
---

- First we will check how many distinct characters in the second substring.
- We will compute a hash table to get the distinct charcters.

```java
public static Map<Character, Integer> buildNeed(String t) {
        Map<Character, Integer> need = new HashMap<>();
        for (char c : t.toCharArray()) {
            need.put(c, need.getOrDefault(c, 0) + 1);
        }
        return need;
    }
```

- Then we will check the substring in below example we don't shrink it to minimum window, we will just check if the character and count of character are present.

```java
public class MinWindowTest {

    public static Map<Character, Integer> buildNeed(String t) {
        Map<Character, Integer> need = new HashMap<>();
        for (char c : t.toCharArray()) {
            need.put(c, need.getOrDefault(c, 0) + 1);
        }
        return need;
    }

    public static void tryExpand(String s, String t) {
        Map<Character, Integer> need = buildNeed(t);
        int needDistinct = need.size();
        Map<Character, Integer> window = new HashMap<>();
        int formed = 0;
        boolean foundValid = false;

        System.out.println("s=\"" + s + "\", t=\"" + t + "\", needDistinct=" + needDistinct);

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            window.put(c, window.getOrDefault(c, 0) + 1);

            if (need.containsKey(c) && window.get(c).intValue() == need.get(c).intValue()) {
                formed++;
            }

            if (formed == needDistinct) {
                foundValid = true;
                System.out.println("  right=" + right + " -> window[0.." + right + "]=\""
                        + s.substring(0, right + 1) + "\" is VALID, formed=" + formed);
            }
        }

        if (!foundValid) {
            System.out.println("  never reached formed==needDistinct. formed ended at " + formed);
        }
    }

    public static void main(String[] args) {
        System.out.println("--- passing case ---");
        tryExpand("ab", "ab");

        System.out.println("--- failing case ---");
        tryExpand("a", "aa");
    }
}
```

- If we dry run the above code for this input `s = aaobc` and `t = abc`.
- we will get the output as `aaobc` which is a valid substring but it's not a minimum window substring, the minimum window substring would be `aobc` of length `4`.

- so we will shrink it from the left once we have the valid substring.

```java
class Solution {
    public String minWindow(String s, String t) {
        Map<Character, Integer> need = buildNeed(t);
        int needDistinct = need.size();

        Map<Character, Integer> window = new HashMap<>();
        int formed = 0;
        boolean foundValid = false;
        int left = 0;
        int bestLen = Integer.MAX_VALUE;
        int bestLeft = -1;


        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            window.put(c, window.getOrDefault(c, 0) + 1);

            if (need.containsKey(c) && window.get(c).intValue() == need.get(c).intValue()) {
                formed++;
            }

            // shrink while the window is still valid.
            while (formed == needDistinct) {
                // this window (left..right) is valid - is it the best so far?
                if (right - left +1 < bestLen){
                    bestLen = right - left + 1;
                    bestLeft = left;
                }

                char leftChar = s.charAt(left);
                window.put(leftChar, window.get(leftChar) - 1);

                if (need.containsKey(leftChar) && window.get(leftChar).intValue() < need.get(leftChar).intValue()) {
                    formed--;
                }
                left++; // shrink
            }
        }
        if (bestLeft != -1) {
            return s.substring(bestLeft, bestLeft + bestLen);
        } else {
            return "";
        }
    }

    public static Map<Character, Integer> buildNeed(String t) {
        Map<Character, Integer> need = new HashMap<>();
        for (char c : t.toCharArray()) {
            need.put(c, need.getOrDefault(c, 0) + 1);
        }
        return need;
    }
}
```

