---
title: Generate Parentheses
date: 2026-11-15
description: Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.
tags:
  - leetcode
  - recursive
  - backtracking
problem: Generate Parentheses
difficulty: medium
topics:
  - tree
  - recursive
  - backtracking
language: java, python
time: O(4^n / root of n)
space: O(n) 
sourceUrl: https://leetcode.com/problems/generate-parentheses/description/
draft: false
---

### Intution

build the string one character at a time, and never allow a mistake

ELI5: You have n “(” blocks and n “)” blocks, and you stack them in a row. There are only two ways to ruin the stack:

You use more than n “(” blocks.
You place a “)” when nothing is open to close, for example ()).

Don’t generate every string and filter afterwards. That is 2^(2n) strings, almost all of them invalid. Refuse to place a bad block at all.

Two rules, tracked by two counters:

You may add “(” if opens < n.
You may add “)” if closes < opens.

Here is the decision tree for n = 2. Each branch is a legal choice, and the dead ends never exist:
```bash
                      ""
                      |
                      (            opens=1
                    /   \
                  ((     ()        ( opens<2 ok | ) closes<opens ok
                  |       |
                 (()     ()(
                  |       |
                (())    ()()       <- length 4, record it
```

### Python and Java Implementation

```python
class Solution(object):
    def generateParenthesis(self, n):
        """
        :type n: int
        :rtype: List[str]
        """
        res = []
        cur = []

        def bt(cur, opens, closes):
            if len(cur) == 2 * n:
                res.append("".join(cur))
                return

            if opens < n:
                cur.append("(")
                bt(cur, opens+1, closes)
                cur.pop()

            if closes < opens:
                cur.append(")")
                bt(cur, opens, closes+1)
                cur.pop()

        bt(cur, 0, 0)

        return res
```

```java
class Solution {
    List<String> res = new ArrayList<>();
    StringBuilder cur = new StringBuilder();
    public List<String> generateParenthesis(int n) {
        bt(cur, 0, 0, n);
        return res;
    }

    private void bt(StringBuilder cur, int opens, int closes, int n) {
        if (cur.length() == 2 * n) {
            res.add(cur.toString());
            return;
        }

        if (opens < n) {
            cur.append('(');
            bt(cur, opens + 1, closes, n);
            cur.deleteCharAt(cur.length() - 1);
        }

        if (closes < opens) {
            cur.append(')');
            bt(cur, opens, closes + 1, n);
            cur.deleteCharAt(cur.length() - 1);
        }
    }
}
```

the number of results must follow the Catalan numbers `(1, 2, 5, 14, 42, ...)`

Complexity
Output size: the answer has Cₙ = (1/(n+1))·C(2n, n) ≈ 4ⁿ / (n^1.5 · √π) strings.
Time: O(4ⁿ / √n). You can’t beat this, because you must write out every result and each one has length 2n.
Space: O(n) recursion depth, excluding the output.