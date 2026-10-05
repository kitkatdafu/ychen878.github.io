---
title: "Difference on Trees"
date: 2026-08-08
categories: ["Algorithms"]
tags: ["algorithms", "trees", "prefix sums", "lowest common ancestor"]
---

## Difference on Trees

### 1. Concept

**Tree difference** means applying the difference-array technique to a tree structure instead of a linear array. It is almost always used together with **LCA** (lowest common ancestor).

On an array, _prefix sum_ and _difference_ are inverse operations:

```
prefix sum  <----- inverse ----->  difference
```

On a tree, the analogue of "prefix sum" is the **subtree sum**: after all marks have been placed, the true value at node `u` equals the sum of the difference values over the whole subtree rooted at `u`. That aggregation is done with a single post-order DFS.

#### Example tree used throughout

```
                1
              /   \
             2     3
           / | \   / \
         11  4  5 6   7
                      |
                      8
                     / \
                    9   10
```

---

### 2. Problem 1 — Add 1 to every **node** on a path

> Given a tree, each query adds 1 to **all nodes** on some path. After all queries, report the final value of every node.

Example: add 1 to every node on the path 6 → 10, i.e. nodes **6, 3, 7, 8, 10**.

Doing this by walking the path costs O(path length) per query. With difference + LCA it costs O(1) marks per query (plus the LCA lookup).

#### Marking rule

For a query on path `(x, y)` with `l = LCA(x, y)`:

1. Mark `+1` at the start `x` and at the end `y`.
2. Mark `-1` at `l`.
3. Mark `-1` at `parent(l)`.

```
c[x]           += 1
c[y]           += 1
c[l]           -= 1
c[parent(l)]   -= 1
```

For the example (x = 6, y = 10, LCA = 3, parent = 1):

```
node 1 : -1
node 3 : -1
node 6 : +1
node 10: +1
```

Then **the answer at each node is the sum of the difference values in its subtree**.

#### Why it works

`+1` at `x` propagates up to every ancestor of `x` when subtree sums are taken, and likewise for `y`. Everything strictly above `l` would be counted twice (once from each branch), so `-1` at `l` and `-1` at `parent(l)` cancel it: the `-1` at `l` removes one of the two counts at `l` itself and above, and the `-1` at `parent(l)` removes the remaining count for all strict ancestors of `l`, leaving `l` correctly counted once.

---

### 3. Problem 2 — Add 1 to every **edge** on a path

> Given a tree, each query adds 1 to **all edges** on some path. After all queries, report the final weight of every edge.

Example: add 1 to every edge on the path 6 → 10, i.e. edges (3,6), (3,7), (7,8), (8,10).

#### Marking rule

1. **Push each edge's weight down onto its lower endpoint** — an edge `(parent, child)` is represented by the node `child`. Every node except the root then corresponds to exactly one edge.
2. Mark `+1` at the start `x` and at the end `y`.
3. Mark `-2` at `l = LCA(x, y)`.

```
c[x] += 1
c[y] += 1
c[l] -= 2
```

For the example (x = 6, y = 10, LCA = 3):

```
node 3 : -2
node 6 : +1
node 10: +1
```

No `parent(LCA)` term this time: the edge above the LCA is _not_ on the path, so both upward contributions must be killed at `l` itself, hence `-2` instead of two separate `-1`s.

#### Node vs. edge difference at a glance

||Node version|Edge version|
|---|---|---|
|Marks|`+1` at `x`, `+1` at `y`, `-1` at `l`, `-1` at `parent(l)`|`+1` at `x`, `+1` at `y`, `-2` at `l`|
|Meaning of `c[u]` after subtree sum|value of node `u`|value of the edge `(parent(u), u)`|
|Root|included if on the path|meaningless (no edge above it)|

---

### 4. Reference implementation

Binary-lifting LCA template plus node-version tree difference. The final line prints the maximum node value over all `k` path-increment operations.

```python
import sys
sys.setrecursionlimit(100000)

input = sys.stdin.readline
n, k = map(int, input().split())
G = [[] for i in range(n + 1)]
# deep[u] is the depth of node u
deep = [0] * (n + 1)
# p[u][i] is the node reached by moving 2^i steps up from u
p = [[0] * 21 for i in range(n + 1)]

for _ in range(n - 1):
    u, v = map(int, input().split())
    G[u].append(v)
    G[v].append(u)


def dfs(u, fa):
    # preprocessing
    deep[u] = deep[fa] + 1
    p[u][0] = fa
    for i in range(1, 21):
        p[u][i] = p[p[u][i - 1]][i - 1]
    for v in G[u]:
        if v == fa:
            continue
        dfs(v, u)


def lca(x, y):
    # make sure x is the deeper node
    if deep[x] < deep[y]:
        x, y = y, x

    # lift x with binary lifting until deep[x] == deep[y];
    # enumerate step sizes 2^i from large to small.
    # A step is allowed if the node reached, p[x][i],
    # is still at depth >= deep[y].
    for i in range(20, -1, -1):
        if deep[p[x][i]] >= deep[y]:
            x = p[x][i]

    # now deep[x] == deep[y]
    if x == y:
        return x

    # lift both together: if a 2^i step lands them on the same
    # ancestor, the step is too big; otherwise take it
    for i in range(20, -1, -1):
        if p[x][i] != p[y][i]:
            x, y = p[x][i], p[y][i]
    return p[x][0]


dfs(1, 0)

# ---- tree difference ----
c = [0] * (n + 10)
for i in range(k):
    x, y = map(int, input().split())
    c[x] += 1
    c[y] += 1
    c[lca(x, y)] -= 1
    c[p[lca(x, y)][0]] -= 1


def dfs2(u, fa):
    for v in G[u]:
        if v == fa:
            continue
        dfs2(v, u)
        c[u] += c[v]


dfs2(1, 0)
print(max(c))
```

For the **edge** version, replace the marking block with:

```python
for i in range(k):
    x, y = map(int, input().split())
    l = lca(x, y)
    c[x] += 1
    c[y] += 1
    c[l] -= 2
```

and remember that after `dfs2`, `c[u]` is the weight of the edge between `u` and its parent (`c[root]` is meaningless).

---

### 5. Complexity

|Step|Cost|
|---|---|
|Binary-lifting preprocessing (`dfs`)|O(n log n)|
|Each query (LCA + O(1) marks)|O(log n)|
|Final subtree accumulation (`dfs2`)|O(n)|
|**Total**|**O((n + k) log n)**|

Compare with the naive approach of walking every path, which is O(nk) in the worst case.
