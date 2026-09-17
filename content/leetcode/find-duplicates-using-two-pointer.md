---
title: Find the duplicate number
date: 2026-09-02
description: Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive. There is only one repeated number in nums, return this repeated number. You must solve the problem without modifying the array nums and using only constant extra space.

 
tags:
  - leetcode
  - two pointer
  - fast and slow
problem: find the duplicate number
difficulty: easy
topics:
  - array
  - fast and slow
  - two pointer
  - Floyd's cycle detection algorith.
language: java python
time: O(n)
space: O(1)
sourceUrl: https://leetcode.com/problems/find-the-duplicate-number/description/
draft: false
---

```python
def findDuplicate(nums):
    slow, fast = nums[0], nums[nums[0]]

    while slow != fast:
        slow = nums[slow]
        fast = nums[nums[fast]]
    
    slow = 0
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow

# Example usage:
nums = [3, 1, 3, 4, 2]
duplicate = findDuplicate(nums)
print(f"The duplicate number is: {duplicate}")


nums = [1, 3, 4, 2, 2]
duplicate = findDuplicate(nums)
print(f"The duplicate number is: {duplicate}")
```

```java
public class FindDuplicatesUsing2Pointers {
    public int findDuplicate(int[] nums) {
        int slow = nums[0];
        int fast = nums[nums[0]];

        // Phase 1: find a meeting point inside the cycle
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[nums[fast]];
        }

        // Phase 2: find the entrance to the cycle
        slow = 0;
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }

        return slow;
    }

    public static void main(String[] args) {
        FindDuplicatesUsing2Pointers solution = new FindDuplicatesUsing2Pointers();
        int[] nums = {3, 1, 3, 4, 2}; // Example input
        int duplicate = solution.findDuplicate(nums);
        System.out.println("The duplicate number is: " + duplicate);
    }
}
```

## ELI5 Version: 

- Imagine 5 treasure chests in a row, numbered 0 to 4. Each chest has a note inside it saying "go open chest number ___."
- You (the slow kid) open chest 0. The note says "go to chest 3." So now you're standing at
chest 3 - you moved, based on the note.
- Your friend (the fast kid) does the same thing but takes two notes at once before stopping to wait for you.
- You keep following notes: 0 → 3 → 4 → 2 → 3 → 4 → 2 → 3 → 4 → 2... forever. You never run out of chests to visit because eventually the notes just send you in a loop between chest 2, 3, and 4 forever. You'll never reach chest 1 no matter how long you walk, because nothing points there.
- Because your friend moves faster, they lap you inside that loop - you two bump into each other at some chest. That bump is Phase 1. But the chest where you bump into each other isn't special - it's just wherever your speeds happened to line up.
- To find the actual doorway into the loop - the first chest that's part of the repeating cycle - you send yourself back to chest 0 and walk one step at a time, while your friend also now only takes one step at a time from where you bumped. Walk, walk, walk - you meet again, and this meeting spot is guaranteed to be the doorway. That's Phase 2.

