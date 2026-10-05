---
title: "Union-Find (Disjoint Set Union)"
date: 2026-04-12
categories: ["Algorithms"]
tags: ["algorithms", "data structures", "graphs", "disjoint sets"]
---

## Union-Find (Disjoint Set Union)

### Problem Definition

Given **N mutually disjoint sets**, we need to support two operations:

- **Merge**: Union two sets together
- **Query**: Determine whether two elements belong to the same set

#### Example Operation Sequence

Elements: `a, b, c, d, e, f`

Operations: `Merge(a,b)`, `Merge(b,e)`, `Merge(c,f)`, `Merge(b,f)`

---

### Approach 1: Naive Label-Based

Assign each element a set ID. To merge, update all elements of one set to the other's ID.

|Operation|a|b|c|d|e|f|
|---|---|---|---|---|---|---|
|Init|1|2|3|4|5|6|
|Merge(a,b)|**1**|**1**|3|4|5|6|
|Merge(b,e)|1|**1**|3|4|**1**|6|
|Merge(c,f)|1|1|**3**|4|1|**3**|
|Merge(b,f)|1|**1**|**1**|4|1|**1**|

> **Complexity:** Query: O(1)  |  Merge: O(n)

---

### Approach 2: Tree-Based Representation

Represent each set as a **tree**, where each node points to its parent. The **root node** serves as the set's identifier.

#### Step-by-step Tree Evolution

|Step|State|
|---|---|
|Init|6 singleton nodes: `a b c d e f`|
|Merge(a,b)|`b → a`; sets: `{a,b}`, `{c}`, `{d}`, `{e}`, `{f}`|
|Merge(b,e)|root of `b` = `a`, attach `e → a`; sets: `{a,b,e}`, `{c}`, `{d}`, `{f}`|
|Merge(c,f)|`f → c`; sets: `{a,b,e}`, `{c,f}`, `{d}`|
|Merge(b,f)|root of `b` = `a`, root of `f` = `c`, attach `c → a`; sets: `{a,b,c,e,f}`, `{d}`|

> Merges are always performed between **root nodes** to maintain valid tree structure.

---

### Core Operations

#### Merge(x, y)

Find the root of each element, then attach one root as a child of the other:

```
p[rootx] = rooty
```

#### Query(x, y)

Check if both elements share the same root:

```
rootx == rooty  →  same set
```

#### Implementation Details

- For each node `x`, maintain `p[x]` = parent of `x`
- Initialize `p[x] = x` for all nodes (each node is its own root)

---

### Python Implementation

```python
def Findroot(x):
    while x != p[x]:
        x = p[x]
    return x

def Merge(x, y):
    # Merge the sets containing x and y
    rootx, rooty = Findroot(x), Findroot(y)
    p[rootx] = rooty

def Query(x, y):
    # Check if x and y belong to the same set
    rootx, rooty = Findroot(x), Findroot(y)
    return rootx == rooty

n, m = map(int, input().split())
p = list(range(n + 1))

for _ in range(m):
    op, x, y = map(int, input().split())
    if op == 1:
        Merge(x, y)
    else:
        print("YES" if Query(x, y) else "NO")
```

---

### Drawback & Optimization

**Problem:** `Findroot` is O(n) in the worst case. Repeated merges can produce a degenerate **chain structure**, making traversal to the root expensive.

**Solution: Path Compression**

During `Findroot`, flatten the tree so every node on the path points **directly to the root**. This amortizes the per-operation cost to nearly O(1).

```python
def Findroot(x):
    if x != p[x]:
        p[x] = Findroot(p[x])  # Recursively compress path
    return p[x]
```

> With path compression (and optionally **union by rank**), the amortized complexity per operation is O(α(n)), where α is the inverse Ackermann function — effectively constant for all practical input sizes.
