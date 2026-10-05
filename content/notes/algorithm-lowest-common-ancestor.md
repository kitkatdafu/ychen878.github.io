---
title: "Lowest Common Ancestor (LCA)"
date: 2026-06-16
categories: ["Algorithms"]
tags: ["algorithms", "trees", "lowest common ancestor", "binary lifting"]
---

## Lowest Common Ancestor (LCA)

### 1. Definition

**LCA (Lowest Common Ancestor)** refers to finding, in a rooted tree, the nearest (deepest) common ancestor of two given nodes `x` and `y`.

Using the reference tree below as an example:

- `LCA(5, 8) = 1`
- `LCA(6, 10) = 3`

#### Reference Tree

```
                1
              /   \
             2     3
           / | \   | \
         11  4  5  6  7
                       |
                       8
                      / \
                     9  10
```

---

### 2. Naive Solution

**Steps:**

1. Preprocess the depth `dep` of every node.
2. To find the LCA of `x` and `y`:
    - If `dep[x] > dep[y]`: climb `x` upward until `dep[x] == dep[y]`.
    - If `dep[x] < dep[y]`: climb `y` upward until `dep[x] == dep[y]`.
    - If `dep[x] == dep[y]`: climb `x` and `y` upward together until `x == y`. At this point we have found the LCA.

**Drawback:** This is essentially a brute-force approach. When the tree degenerates into a chain (linked-list shape), the time cost becomes too large.

---

### 3. Speeding Up With Binary Lifting

The naive approach moves up only **1 step at a time**. Can we move up faster?

**Idea — Binary Lifting:** move up by `1`, `2`, `4`, `8`, ... steps at once.

Similar to a **Sparse Table (ST table)**, we preprocess, for each node, its 1-step ancestor, 2-step ancestor, 4-step ancestor, and so on. Based on this table, the binary-lifting method finds the LCA in `O(log n)` time.

**Algorithm steps:**

1. Preprocess the array `p[u][i]`, defined as the node reached by moving `u` upward by `2^i` steps.
2. Use the `p` array to optimize the naive algorithm.

---

### 4. Preprocessing the `p` Array

- Moving from node `fa` to node `u`: `p[u][0] = fa`
- Recurrence: `p[u][i] = p[p[u][i-1]][i-1]`
- Intuition: moving `u` up `2^i` steps = moving `u` up `2^(i-1)` steps to reach some node, then moving that node up another `2^(i-1)` steps.

```python
def dfs(u, fa):
    # Preprocessing
    deep[u] = deep[fa] + 1
    p[u][0] = fa
    for i in range(1, 21):
        p[u][i] = p[p[u][i - 1]][i - 1]
    for v in G[u]:
        if v == fa:
            continue
        dfs(v, u)
```

---

### 5. Solving `LCA(x, y)`

Assume `deep[x] > deep[y]`:

#### Step 1 — Bring `x` up so that `deep[x] == deep[y]`

Use binary lifting: enumerate `i` from large to small. Try moving `x` up `2^i` steps to a node `p`. If `deep[p] < deep[y]` (the move would overshoot above `y`'s level), **do not move**; otherwise, **move**.

#### Step 2 — Now `deep[x] == deep[y]`

- If `x == y`, then the answer is `x`.
- Otherwise, climb both up together. Enumerate `i` from large to small. Move `x` up `2^i` steps to `px`, and `y` up `2^i` steps to `py`:
    - If `px == py`, they share a common ancestor, but we cannot guarantee it is the _lowest_ common ancestor, so **do not move**.
    - If `px != py`, then **move**.

This eventually lands `x` and `y` on the first pair of nodes that are **not** the common ancestor (i.e., just below the LCA). The LCA is then `p[x][0]`.

---

### 6. Implementation

```python
def lca(x, y):
    # Ensure x is the deeper node
    if deep[x] < deep[y]:
        x, y = y, x

    # Use binary lifting to climb up so that deep[x] == deep[y].
    # Enumerate the step size 2^i from large to small.
    # If the node reached after this move, p[x][i], still has
    # depth >= deep[y], then the move is allowed.
    for i in range(20, -1, -1):
        if deep[p[x][i]] >= deep[y]:
            x = p[x][i]

    # At this point deep[x] == deep[y]
    if x == y:
        return x

    # Climb up together: if moving 2^i steps makes both nodes share
    # the same ancestor, the move is not allowed; otherwise it is.
    for i in range(20, -1, -1):
        if p[x][i] != p[y][i]:
            x, y = p[x][i], p[y][i]

    return p[x][0]
```
