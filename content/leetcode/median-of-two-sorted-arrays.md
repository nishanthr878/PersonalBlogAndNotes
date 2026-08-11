---
title: Median of two sorted arrays
date: 2026-08-11
description: given 2 arrays find the median of it
tags:
  - leetcode
  - binary search
problem: Median of two sorted arrays
difficulty: hard
topics:
  - binary search
language: Java
time: Olog(m + n)
space: O(m + n)
sourceUrl: https://leetcode.com/problems/median-of-two-sorted-arrays/
draft: false
---

Median split the array into 2 half where left half the array is <= to right of the array, in this problem we are given the 2 split array we have to find the median of it.


Brute way of doint this will be merge nums1 and num2, we will sort the array and divide the array, but as we are merging and sorting the array the time complexity will be O(m + n) to reduce the time complixity we will use binary search.

So here lets take the below example to implement the solution

```
nums1 = [1, 3, 8]
nums2 = [7, 9, 10, 11]
```

- lets consider `nums1 = [1, 3, 8]`
- if we cut the array where i = 2 we will be left with 2 chunks i.e 

```
left chunk -> [1,3]
right chun -> [8]
```

- from the left chunk we will only care about the one number that is nearer to the cut, that will `left1  = 3`
- from the right chunk we will only care about the one number that is nearer to the cut, that will `right1 = 8`

if we perform the similar kind of action on the nums2 we will get as below

```
nums2 = [7, 9, 10, 11]
left chunk -> [7, 9]
right chunk -> [10, 11]

left2 = 9
right2 = 10
```

so now we compare the `left1` with `right2`,
```
left2 <= right2
2 <= 10 ---> true
```

we will compare the `left2` with `right1`
```
left2 <= righ1
9 <= 8 ---> false
```
here the nums2 chunk is bigger so we will reduce it by reducing the j, but j is dependent i, 

```
j will be inversely dependent on i
j = half - 1
```
so we will increase i to decrease j

so the algorithm will be

```
1. Two sorted arrays, m and n elements.
2. Binary search a candidate i over nums1's index range (0 to m); derive j = half - i where half = (m+n+1)/2.
3. Compute left1, right1, left2, right2 — the four boundary values at that cut.
4. Check left1 ≤ right2 and left2 ≤ right1.
5. If both hold — stop. This is the valid partition.
6. If left2 > right1 fails — nums2's left chunk is oversized — increase i (forces j down).
7. If left1 > right2 fails — nums1's left chunk is oversized — decrease i (forces j up).
8. Median: odd total → max(left1, left2). Even total → (max(left1,left2) + min(right1,right2)) / 2.
```

```java
class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        
        if (nums1.length > nums2.length) {
        	int[] temp = nums1;
        	nums1 = nums2;
        	nums2 = temp;
        }
        
        int m = nums1.length;
        int n = nums2.length;
        
        int half = (m + n + 1) / 2;
        int lo = 0, hi = m;
        while (lo <= hi) {
        	int i = (lo + hi) / 2;
        	int j = half - i;
        	
        	int left1 = (i==0) ? Integer.MIN_VALUE : nums1[i -1];
        	int right1 = (i == m) ? Integer.MAX_VALUE : nums1[i];
        	int left2 = (j == 0) ? Integer.MIN_VALUE : nums2[j - 1];
        	int right2 = (j == n) ? Integer.MAX_VALUE : nums2[j];
        	
        	if (left1 <= right2 && left2 <= right1) {
        		if((m + n) % 2 == 0) {
        			return (double) (Math.max(left1, left2) + Math.min(right1, right2)) / 2;
        		} else {
        			return Math.max(left1, left2);
        		}
        	} else {
        		if (left2 > right1) {
        			lo = i + 1;
        		}
        		else {
        			hi = i - 1;
        		}
        	}
        }
        return 0;
    }
}
```

