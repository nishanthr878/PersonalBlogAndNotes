---
title: Floyd's cycle detection aka tortoise and hare
date: 2026-09-02
description: Given a sequence where each element points to the next one (a linked list, or an array used as an implicit pointer graph), you want to detect whether a cycle exists, and if so find where it starts - using  O(1) space and O(n) time. No hash set, no visited array.

tags:
  - writing
  - algorithm
draft: false
---

## Mechanics:
1. Two pointers, `slow` and `fast`, both start at the same place.
2. Every step: `slow` moves 1 node forward, `fast` moves 2 nodes forward.
3. If there's no cycle, `fast` hits the end (null) and you're done - no cycle.
4. if there's a cycle, `fast` will eventually catch up to `slow` from behind, inside the loop, because it's gaining one extra step of distance every iteration relative to slow. This meeting is guaaranteed - it's not probabilisitic.
5. Once they meet, reset one pointer to the start. Move both one step at a time now. Where they meet the secont time is the cycle's entry point.

### Applicable
- **Linked list cycle detection** - the canonical case "does this list have a cycle and where does it start?"
- **Array-as-implicit-linked-list-problems** - when array values are constrained to valid indices (like `[1, n] in an n + 1 lenght array`), so `nums[i]` can be read as pointer to next index" + "O(1) extra space." 
- **Functional graph problem in general** any strucutre where each node has exactly one outgoing edge (a function `f` applied repeatedly).

### When it's not applicable
- The array / list has no value-to-index correspondence (arbitrary duplicate-finding without range constraints) - that's a hash set problem, full stop, unless space is explicilty constrained.
- You need to find all duplicates, not just one
- Space isnt actually constrained i.e, O(n).


