---
title: Reverse Nodes in K group
date: 2026-09-23
description: Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list. k is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of k then left-out nodes, in the end, should remain as it is. You may not alter the values in the list's nodes, only nodes themselves may be changed.
tags:
  - leetcode
  - Linked list
problem: Revers Nodes in K group
difficulty: hard
topics:
  - linked list
language: java
time: O(kn)
space: O(n)
sourceUrl: https://leetcode.com/problems/reverse-nodes-in-k-group/description/
draft: false
---

Based on the previous solution ([merge k sorted list](https://leetcode.com/problems/merge-k-sorted-lists/)) 

First we will check if we have k values in the given linked list so we can reverse it.

```python
def has_k_nodes(node, k):
    count = 0
    while node and count < k:
        node = node.next
        count += 1
    return count == k
```

The below code snippet is example to revers the linked list
```python
def reverse_linked_list_short(self, head):
    prev = None
    while head:
        next_node = head.next   # save before overwriting
        head.next = prev
        prev = head
        head = next_node
    return prev
```

But we will not be able to use the above code snippet, we have to only reverse k pair of nodes linked list, not whole linked list so we will use the below code to do that

```python
def reverse_k_nodes(self, head, k):
    prev = None
    curr = head
    for _ in range(k):
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev, curr
```

Now only a part of the linked list will be reversed for example lets say we have linked list head = 1 -> 2 -> 3 -> 4 -> 5. and K is 2.

if we run the above code we will just get a two Linked list as below
```
prev = 2 -> 1 -> None
curr = 3 -> 4 -> 5 -> None
```

to get a fully K paired linked list we have to use a recursive approach as below

```python
def reverseKGroup(self, head, k):
    # Step 1: check if there are k nodes left
    node = head
    count = 0
    while node and count < k:
        node = node.next
        count += 1
    if count < k:
        return head  # fewer than k left, leave as-is

    # Step 2: reverse this group
    new_head, rest = self.reverse_k_nodes(head, k)

    # Step 3: 'head' is now the TAIL of this reversed group (it was the old head).
    # Connect it to the recursively-processed remainder.
    head.next = self.reverseKGroup(rest, k)

    return new_head
```

so wiring it all we will have below solution
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:

    def has_k_nodes(self, head, k):
        count = 0
        while head and count < k:
            head = head.next
            count += 1

        return count == k

    def reverse_k_nodes(self, head, k):
        prev = None
        current = head
        for _ in range(k):
            next_node = current.next
            current.next = prev
            prev = current
            current = next_node

        return prev, current



    def reverseKGroup(self, head: ListNode | None, k: int) -> ListNode | None:
        node = head

        if not self.has_k_nodes(node, k):
            return head

        new_head, rest = self.reverse_k_nodes(node, k)

        head.next = self.reverseKGroup(rest, k)

        return new_head
```
Tracing `reverse_k_nodes(head, k=2)` on the list `1 -> 2 -> 3 -> 4 -> 5`.

**Before the loop:**
```
prev = None
current = head = 1 -> 2 -> 3 -> 4 -> 5
```
(`current` points at node `1`; since `1` still has its original `.next`, "following" current shows you the whole untouched list from that point.)

**Iteration 1 (`_ = 0`):**

`next_node = current.next`
```
current  = 1 -> 2 -> 3 -> 4 -> 5      (unchanged so far)
next_node =      2 -> 3 -> 4 -> 5     (just a second pointer into the same list, at node 2)
```

`current.next = prev`  → node `1`'s pointer is overwritten to point at `prev` (`None`)
```
prev     = None
current  = 1 -> None                  (node 1 is now cut off from the rest — this is the only structural change)
next_node =      2 -> 3 -> 4 -> 5     (still intact, untouched)
```

`prev = current` → `prev` now points at node `1`
```
prev     = 1 -> None
current  = 1 -> None                  (same node, two names pointing at it right now)
next_node =      2 -> 3 -> 4 -> 5
```

`current = next_node` → `current` moves forward to node `2`
```
prev     = 1 -> None
current  =      2 -> 3 -> 4 -> 5      (current now sits where next_node was)
```
End of iteration 1. Note: `prev` and `current` are two completely separate chains right now — `1` is fully detached, `2->3->4->5` is still the original untouched tail.


**Iteration 2 (`_ = 1`):**

`next_node = current.next` → grab node `3`
```
prev      = 1 -> None
current   = 2 -> 3 -> 4 -> 5
next_node =      3 -> 4 -> 5
```

`current.next = prev` → node `2`'s pointer overwritten to point at `prev` (node `1`)
```
prev      = 1 -> None
current   = 2 -> 1 -> None            (node 2 now points backward to node 1 — this LINKS the reversed pair)
next_node =      3 -> 4 -> 5          (untouched)
```

`prev = current` → `prev` moves to node `2`
```
prev      = 2 -> 1 -> None
current   = 2 -> 1 -> None            (same object as prev right now)
next_node =      3 -> 4 -> 5
```

`current = next_node` → `current` moves to node `3`
```
prev      = 2 -> 1 -> None
current   =      3 -> 4 -> 5
```
Loop has run `k=2` times — stops here.


**Return `prev, current`:**
```
prev (new_head) = 2 -> 1 -> None      ← the reversed segment
current (rest)  = 3 -> 4 -> 5         ← untouched remainder, where the caller resumes
```

The key thing to notice: at every step, `prev` is the **already-reversed portion** (growing backward), `current` is **where you are now, about to be flipped**, and `next_node` is a **temporary bookmark** so you don't lose the rest of the list the instant you overwrite `current.next`. Three pointers, three distinct roles — that's the whole trick.

also let's trace the recursive stack frames for deeper understing

Using our running example `[1,2,3,4,5]`, `k=2`. Three stack frames deep:

**Frame C (innermost): `reverseKGroup(5, 2)`**
`has_k_nodes(5, 2)` → only one node left, fails. Returns `head` unchanged:
```
returns: 5 -> None
```

**Frame B: `reverseKGroup(3, 2)`**
Before recursing, this frame already reversed its own pair: `reverse_k_nodes(3, 2)` gave `new_head=4`, and node `3` (the *old* head, now the *tail* of this reversed pair) has `.next = None` at this point — not yet stitched.
```
new_head = 4 -> None
head (old head, now tail) = 3 -> None
```
Then it calls Frame C and gets back `5`. It stitches: `head.next = reverseKGroup(rest, k)` → **`3.next = 5`**.
```
now: 4 -> 3 -> 5 -> None
```
Frame B returns `new_head = 4` (pointing into the chain `4->3->5`).

**Frame A (outermost): `reverseKGroup(1, 2)`**
This frame reversed its own pair first: `reverse_k_nodes(1, 2)` gave `new_head=2`, and node `1` (old head, now tail) has `.next = None`.
```
new_head = 2 -> 1 -> None
head (old head, now tail) = 1 -> None
```
It calls Frame B and gets back `4` (which represents the already-fully-stitched chain `4->3->5`). It stitches: **`1.next = 4`**.
```
now: 2 -> 1 -> 4 -> 3 -> 5 -> None
```
Frame A returns `new_head = 2`.


**The mechanism, stated plainly:** every frame does exactly one stitch — `head.next = <whatever the recursive call returned>` — where `head` is *that frame's own* old-head-turned-tail node, and the recursive call's return value is the *fully assembled head* of everything after it (already combined by deeper frames). So the combining isn't "three heads getting merged at the end" — it's each frame doing **one link**, and it happens on the way *back up* the stack, not after all frames finish. By the time frame A does its single stitch, frame B has already done its stitch, which already included frame C's untouched node.

#### Frame B's body runs in this sequence, in this order
```python
def reverseKGroup(self, head, k):     # head = 3
    node = head
    if not self.has_k_nodes(node, k):
        return head

    new_head, rest = self.reverse_k_nodes(node, k)
    # ← AT THIS EXACT POINT: new_head=4, head(=3).next=None, rest=5
    # this is your "4 -> 3 -> None" snapshot. Correct here.

    head.next = self.reverseKGroup(rest, k)
    # ← THIS LINE RUNS NEXT. It overwrites 3.next.
    # self.reverseKGroup(rest, k) is Frame C, which returns 5.
    # So this line executes: 3.next = 5
    # Now the chain is 4 -> 3 -> 5 -> None

    return new_head
    # ← ONLY NOW does Frame B return. new_head is still the variable '4',
    # but node 4 is now the head of the chain 4 -> 3 -> 5, because
    # node 3 (which node 4 points to) was just modified above.
```

### Java solution
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode node = head;

        if(!hasKNodes(node, k)) {
            return head;
        }

        List<ListNode> result = reverseKNodes(head, k);
        ListNode newHead = result.get(0);
        ListNode rest = result.get(1);

        head.next = reverseKGroup(rest, k);

        return newHead; 
       
    }

    private boolean hasKNodes(ListNode head, int k) {
        int count = 0;
        while (head != null && count < k) {
            head = head.next;
            count++;
        }

        return count == k;
    }

    private List<ListNode> reverseKNodes(ListNode head, int k) {
        List<ListNode> result = new ArrayList<>();
        ListNode prev = null;
        ListNode current = head;
        for (int i = 0; i < k; i++) {
            ListNode nextNode = current.next;
            current.next = prev;
            prev = current;
            current = nextNode;
        }
        result.add(prev);
        result.add(current);

        return result;
    }
}
```