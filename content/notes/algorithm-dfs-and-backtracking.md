---
title: "Depth-First Search and Backtracking"
date: 2026-05-17
categories: ["Algorithms"]
tags: ["algorithms", "search", "depth-first search", "backtracking"]
---

## Introduction to DFS (Depth-First Search)

### What is a Search Algorithm?

A search algorithm exhaustively explores part or all of the solution space of a problem to find its solution.

### Depth-First Search (DFS)

- **Essence:** DFS is essentially brute-force enumeration.
- **"Depth-first" principle:** Go as far down one path as possible; only backtrack when no further progress can be made.

### Example: Finding a Path from Node 1 to Node 8

Starting from node 1, always move to an unvisited node if one exists; otherwise, backtrack.

Following this rule, a valid path can always be found from 1 to 8, for example:

`1 → 3 → 7 → A → 7 → 9 → 3 → 5 → 6 → 8`

The portions shown in red (e.g., the second `7` and second `3`) represent backtracking steps.

By modeling problems as graphs, DFS can be used to brute-force solve a wide variety of problems.

---

## Backtracking

### Definition

Backtracking is a form of DFS used to search for solutions. When the current state is found to no longer satisfy the solution conditions, we "backtrack" and try a different path.

### Key Characteristics

- **Backtracking emphasizes:** When one path fails, try another; visited paths must be marked.
- Backtracking generally builds on DFS by adding pruning strategies.

---

## Backtracking Trees

### Subset Tree

For a subset problem, each element has two choices: **include (1)** or **exclude (0)**. This produces a binary tree structure where each level corresponds to a decision about one element.

### Permutation Tree

For a permutation problem with elements {1, 2, 3}, the root branches into each possible first choice (1, 2, or 3). At each subsequent level, the remaining unused numbers branch out, forming a tree of all possible orderings.

---

## Pruning

### Why Prune?

During the search process, exhaustively traversing all possibilities can be very time-consuming. If at some state we can determine that no valid solution lies further down that branch, we don't need to continue searching that subtree.

**Example:** Given N positive integers, count how many subsets have a sum ≤ K. During the search, if the current sum already exceeds K, we can stop exploring that branch.

### Types of Pruning

1. **Feasibility Pruning:** If the current state already violates the problem constraints and all subsequent states will also violate them, prune this branch.

2. **Optimality Pruning:** If the current state can no longer improve upon the best solution found so far, prune this branch.


---

## DFS and N-Nested Loops

### Motivating Problem

Given a number `x`, split it into 3 positive integers where each subsequent integer is greater than or equal to the previous one. Output all valid partitions.

- **Simplest approach:** Triple nested loop, brute-force search.
- **What if we need to split into 4 positive integers?**
- **What about n positive integers?**
    - We would need to implement an n-nested loop.
    - **An n-nested loop is equivalent to a specific tree structure, which can be implemented via DFS.**

### Visualization (x = 6, split into 3 integers)

- **Level 1:** Choose first integer from {1, 2, 3, 4, 5, 6}
- **Level 2:** Choose second integer (≥ first)
- **Level 3:** Choose third integer (≥ second), with total sum = 6

This forms a tree where DFS traces a valid path from top to bottom — the path must be non-decreasing, length n, and sum to x.

### Generic DFS Template for N-Nested Loops

```python
def dfs(depth):
    """
    :param depth: current loop level
    :return:
    """
    if depth == N:
        # Code executed at the innermost loop
        return
    # Enumeration/selection at each loop level
```

### Implementation (Without Pruning)

```python
x, n = map(int, input().split())

# Record the number chosen at each level
a = [0] * n
# Counter for number of computations
cnt = 0

def dfs(depth):
    """
    :param depth: current loop level
    """
    global cnt
    cnt = cnt + 1
    # Levels 0 through n-1 have all been chosen; now check the answer
    if depth == n:
        # Condition 1: numbers must be non-decreasing
        for i in range(1, n):
            if a[i] >= a[i - 1]:
                continue
            else:
                return
        # Condition 2: sum must equal x
        if sum(a) != x:
            return
        # This is a valid answer
        print(a)
        return
    # Enumerate the number at level `depth` from [1, x]
    for i in range(1, x + 1):
        # Choose the number at level `depth`
        a[depth] = i
        # Recurse into the next level
        dfs(depth + 1)

dfs(0)
print("Total computations = {}".format(cnt))
```

### Implementation (With Pruning)

By checking conditions during enumeration rather than only at the leaves, we can dramatically reduce computation:

```python
def dfs(depth, last_val):
    """
    :param depth: current loop level
    """
    global cnt
    cnt = cnt + 1
    # All n levels have chosen numbers; check answer
    if depth == n:
        # Condition 2: sum must equal x
        if sum(a) != x:
            return
        # This is a valid answer
        print(a)
        return
    # At level `depth`, enumerate numbers in [last_val, x]
    # Condition 1: numbers must be non-decreasing (enforced via loop range)
    for i in range(last_val, x + 1):
        # Choose the number at level `depth`
        a[depth] = i
        # Recurse into the next level
        dfs(depth + 1, i)

dfs(0, 1)
```

**Key insight:** Placing conditions inside the enumeration loop (rather than only checking at the leaves) reduces computation — **this is pruning.**

---

## Backtracking Template — Permutations

### Problem

Generate all permutations of N distinct numbers.

### Key Requirements

- **No repeated numbers in a permutation** → mark each chosen number using a `vis` (visited) array.
- **Output the current permutation** → record the current path using a `path` array.
- **Backtracking pattern:** mark → record path → recurse to next level → return to previous level → clear mark.

### Implementation

```python
def dfs(depth):
    # Currently at the depth-th position; positions 0 to depth-1 are set
    if depth == n:
        print(path)
        return

    # Enumerate the number at position `depth`
    for i in range(1, n + 1):
        # Number i must not have been chosen before
        if vis[i] is False:
            # Mark current state
            vis[i] = True
            # Record current path
            path.append(i)
            # Recurse into the next level
            dfs(depth + 1)
            # Clear mark (backtrack)
            vis[i] = False
            path.pop(-1)

n = int(input())
path = []
vis = [False] * (n + 1)
dfs(0)
```

---

## Backtracking Template — Subsets

### Problem

Given N numbers, generate all possible subsets.

### Approach

At each level, we have a binary choice for each number: **include (Y)** or **exclude (N)**. This creates a binary tree of depth N.

### Implementation

```python
n = int(input())
a = list(map(int, input().split()))

path = []

def dfs(depth):
    if depth == n:
        print(path)
        return

    # Include a[depth]
    path.append(a[depth])
    dfs(depth + 1)
    path.pop(-1)

    # Exclude a[depth]
    dfs(depth + 1)

dfs(0)
```

---

## Summary

|Concept|Key Idea|
|---|---|
|**DFS**|Brute-force enumeration that goes as deep as possible before backtracking|
|**Backtracking**|DFS variant that marks visited states and reverts on failure|
|**Pruning**|Skip branches that cannot lead to valid or improved solutions|
|**N-nested loops**|Equivalent to a tree of depth N, implementable via DFS|
|**Subset tree**|Binary tree: include or exclude each element|
|**Permutation tree**|Multi-way tree where each level chooses an unused number|

The general backtracking pattern is:

1. **Mark** the current choice
2. **Record** the path
3. **Recurse** to the next level
4. **Return** to the previous level
5. **Clear** the mark
