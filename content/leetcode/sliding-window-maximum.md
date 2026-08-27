---
title: Sliding Window Maximum
date: 2026-08-27
description: Given an array find the maximum find the maximum of k elements in the array while sliding the array to right.
tags:
  - leetcode
  - sliding window
problem: Sliding window maximum
difficulty: hard
topics:
  - sliding window
  - deque
  - montionic deque
language: java
time: O(n)
space: O(n)
sourceUrl: https://leetcode.com/problems/minimum-window-substring/description/
draft: false
---

Let's imagine you're in line with a bunch of kits and you're the tallest-kid spotter.
You only have to find who's the tallest kid currently in your little group of k (lets keep that as 3 for now).

The trick is whenever a new kid walks up and is taler than the kids already lined up behind you
you kick out every shourter kid statnding behind you. 

So your line of kids is always sorted tallest-to-shortest, front to back.
The tallest kid is always standing at the very front.
Whenever you need the answer, you just look at the front kid - no searching required.

The only other thing you have to watch - if the kid at the front has been line so long they've walked out of your group of k(i.e 3), you let them leave from the front too.

Every kid gets added once, and removed at most once, we will not add or delete the kids twice...

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n - k + 1];

        // The "line of kids" - stores INDEXES, not values.
        // Front of line (peekFirst) = position of the tallest kid currently in group.
        Deque<Integer> line = new ArrayDeque<>();

        for (int i = 0; i < n; i++) {

            // STEP 1: Kick out kids from the FRONT who "aged out" of the group of k.
            // If the front kid's spot is more than k steps behind us, they're not
            // even in our window anymore. Send them home.
            if (!line.isEmpty() && line.peekFirst() <= i - k) {
                line.pollFirst();
            }


            // STEP 2: New kid (nums[i]) walks up. Kick every shorter kid off the
            // BACK of the line — they can never be tallest again once someone
            // taller AND later has arrived.
            while (!line.isEmpty() && nums[line.peekLast()] < nums[i]) {
                line.pollLast();
            }


            // STEP 3: New kid joins the back of the line.
            line.offerLast(i);

            // STEP 4: Once we actually have k kids in the group (window is full),
            // the tallest kid is always whoever is standing at the FRONT.
            if (i >= k - 1) {
                result[i - k + 1] = nums[line.peekFirst()];
            }
        }
        return result;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] nums = {1, 3, -1, -3, 5, 3, 6, 7};
        int k = 3;
        int[] result = solution.maxSlidingWindow(nums, k);

        for (int num : result) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}

```

