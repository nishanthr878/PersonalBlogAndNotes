---
title: word search
date: 2026-11-17
description: Given an m x n grid of characters board and a string word, return true if word exists in the grid.
tags:
  - leetcode
  - recursive
  - backtracking
problem: word search
difficulty: medium
topics:
  - tree
  - recursive
  - backtracking
language: java, python
time: O(mn 3 ^ L)
space: O(n) 
sourceUrl: https://leetcode.com/problems/word-search/description/
draft: false
---

### Intution

Imagine walking through a maze of letter tiles. At each tile you ask whether it matches the next letter of the word. If it does, you step on it and flip it face-down so you can’t reuse it. Then you try the 4 neighbors. If none work, you flip the tile back up and retreat, so other paths can use it. The “flip back” step is the backtrack. Leave it out and one failed path poisons every later path.

Trace for ABCCED on ABCE / SFCS / ADEE:

```bash
A B C E     [A] B  C  E      # B  C  E      # # C  E      # # #  E      # # #  E      # # #  E
S F C S  →   S  F  C  S  →   S  F  C  S  →  S  F [C] S  → S  F  #  S  → S  F  #  S  → S  F  #  S
A D E E      A  D  E  E      A  D  E  E      A  D  E  E     A  D [E] E     A [D] E E     ...
 i=0         i=0 → i=1       i=1 → i=2 ...  C(0,2) → C(1,2) → E(2,2) → D(2,1)  ✔ i=6
```

The path is A(0,0) → B(0,1) → C(0,2) → C(1,2) → E(2,2) → D(2,1).

Each DFS call has three jobs:

If i == len(word), every letter matched, so return true.
If the cell is out of bounds or doesn’t match word[i], return false. A cell marked # can never match a letter, so this check also stops cell reuse.
Otherwise mark the cell, recurse into 4 neighbors with i+1, unmark it, and return the result.


## Python and Java Implementation

```python
class Solution():
    def exist(self, board, word):
        m = len(board)
        n = len(board[0])

        def dfs(r, c , i):
            if i == len(word):
                return True

            if r not in range(m) or c not in range(n) or board[r][c] != word[i]:
                return False

            saved = board[r][c]
            board[r][c] = '#'

            neighbors = ((r +1, c), (r -1, c), (r, c + 1), (r, c - 1))
            fournd = any(dfs(nr, nc, i + 1) for nr, nc in neighbors)
            
            board[r][c] = saved
            return fournd

        return any(dfs(r, c, 0) for r in range(m) for c in range(n))
```

```java
class Solution {
    public boolean exist(char[][] board, String word) {
        for (int r = 0; r < board.length; r++)
            for (int c = 0; c < board[0].length; c++)
                if (dfs(board, word, r, c, 0)) return true;
        return false;
    }

    private boolean dfs(char[][] b, String w, int r, int c, int i) {
        if (i == w.length()) return true;
        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || b[r][c] != w.charAt(i))
            return false;
        char saved = b[r][c];
        b[r][c] = '#';                             // mark
        boolean found = dfs(b, w, r + 1, c, i + 1) || dfs(b, w, r - 1, c, i + 1)
                     || dfs(b, w, r, c + 1, i + 1) || dfs(b, w, r, c - 1, i + 1);
        b[r][c] = saved;                           // unmark
        return found;
    }
}
```

For the above solution we run into time limit exceeded error

so we improve the solution by implementing below approch

In the below solution we will revers the word to get single starting point instead of multiple starting point.

ELI5: you’re looking for one particular person in a huge crowd, and you know two things about them: they wear a common hat color (lots of people have it) and a rare scarf (only one person has it). You’d look for the scarf first. The word has two ends, and a path through the grid can be read from either end. So start from whichever end is rarer on the board.

The two lines do exactly that:

have[word[0]] is how many times the word’s first letter appears on the board.
have[word[-1]] is the same count for its last letter.
If the first letter is more common than the last, reverse the word so the DFS starts at the rarer one.

Why reversing is safe: adjacency is symmetric. If A→B→C is a valid path, then C→B→A is the same path read backwards. A word exists on the grid exactly when its reverse does.

Visualization: the board is mostly A, with one B in the corner, and the word is AAAAB.

```bash
B A A A A
A A A A A
A A A A A      Forward (AAAAB):  25 possible starting cells, each fans out
A A A A A                        into up to 3^4 branches before any of them
A A A A A                        finds out whether a B is near.

                Reversed (BAAAA): 1 possible starting cell (the B).
                                  Every other cell dies at i=0 in one check.
```


### Below is the optimal solution

```python 
class Solution(object):
    def exist(self, board, word):
        """
        :type board: List[List[str]]
        :type word: str
        :rtype: bool
        """
        m = len(board)
        n = len(board[0])

        have, need = Counter(ch for row in board for ch in row), Counter(word)
        if any(have[c] < k for c, k in need.items()):
            return False

        if have[word[0]] > have[word[-1]]:
            word = word[::-1]

        def dfs(r, c, i):
            if i == len(word):
                return True

            if not(0 <= r < m and 0 <= c < n) or board[r][c] != word[i]:
                return False

            saved, board[r][c] = board[r][c], '#'
            found = any(dfs(r + dr, c + dc, i + 1) for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)))

            board[r][c] = saved
            return found

        return any(dfs(r, c, 0) for r in range(m) for c in range(n))
```

```java
class Solution {
    private char[][] board;
    private char[] w;
    private int m, n;
    public boolean exist(char[][] board, String word) {
        this.board = board;
        this.m = board.length;
        this.n = board[0].length;

        // representing char in numbers
        int[] have = new int[128];
        int[] need = new int[128];

        // updating data to have and need
        for (char[] row : board) for (char c : row) have[c]++;
        for(char c : word.toCharArray()) need[c]++;

        // checking if we have ther required characters in the board
        for (int c = 0; c < 128; c++) if (have[c] < need[c]) return false;

        // reversing the string based on the starting point
        if(have[word.charAt(0)] > have[word.charAt(word.length() -1)]) {
            word = new StringBuilder(word).reverse().toString();
        }
        this.w = word.toCharArray();

        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if(dfs(r, c, 0)) return true;
            }
        }
        return false;
    }

    private boolean dfs(int r, int c, int i) {
        if (i == w.length) return true;
        if (r < 0 || c < 0 || r >= m || c >= n || board[r][c] != w[i]) return false;

        char saved = board[r][c];
        board[r][c] = '#';
        boolean found = dfs(r+1, c, i+1) || dfs(r-1, c, i+1) || dfs(r, c+1, i+1) || dfs(r, c -1, i + 1);
        board[r][c] = saved;  // backtracking
        return found; 
    }
}
```

#### Complexity

Time is O(m·n·3^L), where L = len(word). Each cell starts a DFS, and after the first step each level has at most 3 choices, since you can’t go back to the cell you came from. The worst case is a grid of all a and a word like aaaa…ab. The two prunes stop some of these cases, but not all of them. Prune 1 only fires when a letter is missing. A board full of a plus a single b far from the start still passes both prunes and runs exponentially.
Space is O(L) for the recursion stack. Marking cells in place avoids a separate visited array.