---
title: "Memoization"
date: 2026-06-14
categories: ["Algorithms"]
tags: ["algorithms", "dynamic programming", "memoization"]
---

## Memoization

### 1. What Is Memoization?

**Memoization:** a way of implementing a search that **records information about states it has already visited**, so that the same state is never traversed (recomputed) more than once.

**Memoization = DFS + an extra dictionary (cache)**

- **If the state has been searched before:** look it up in the dictionary and return the stored result directly.
- **If the state has not been searched before:** keep searching, and finally record that state's result into the dictionary.

---

### 2. Worked Example — Fibonacci Sequence

#### Problem

Define the Fibonacci sequence as:

$$
F[0] = 1,\quad F[1] = 1,\quad F[n] = F[n-1] + F[n-2]
$$

Compute $F[n]$, giving the result modulo $10^9 + 7$.

**Constraints:** `0 <= n <= 10000`

|||
|---|---|
|**Sample input**|`5000`|
|**Sample output**|`976496506`|

---

#### 2.1 Direct Recursion — Lots of Repeated Work

Solving by plain recursion produces **a large number of repeated computations**. Expanding `F(5)`:

```
                       F(5)
              ┌──────────┴──────────┐
            F(3)                    F(4)
         ┌───┴───┐            ┌──────┴──────┐
       F(1)     F(2)        F(2)           F(3)
              ┌──┴──┐     ┌──┴──┐       ┌───┴───┐
            F(0)  F(1)   F(0)  F(1)    F(1)    F(2)
                                              ┌──┴──┐
                                            F(0)  F(1)
```

The dashed regions in the original slide highlight identical subtrees that get evaluated again and again — e.g. `F(3)` is computed twice and `F(2)` three times. The number of redundant calls grows exponentially.

---

#### 2.2 Memoization — Store Once, Reuse Later

Each time a state is solved, **record its answer in the dictionary**; any later request for the same state **returns the stored result immediately** instead of recursing.

Annotating the same tree (**store** = save a newly computed value, **retrieve** = read a cached value):

```
                       F(5)          store: F[5] = 8
              ┌──────────┴──────────┐
            F(3)                    F(4)         store: F[4] = 5
   store: F[3] = 3              ┌────┴────┐
         ┌───┴───┐            F(2)        F(3)
       F(1)     F(2)        retrieve     retrieve
   retrieve  store: F[2]=2    F[2]         F[3]
     F[1]      ┌──┴──┐
              F(0)  F(1)
           retrieve retrieve
             F[0]    F[1]
```

Once `F[2]`, `F[3]`, and `F[4]` are cached on the left branch, the right branch's `F(2)`, `F(3)` resolve in O(1) by lookup — turning the exponential tree into a linear pass.

---

### 3. Three Implementations in Python

#### Original (plain recursion)

```python
# Original
def f(x):
    if x == 0 or x == 1:
        return 1
    return f(x - 1) + f(x - 2)
```

#### Memoization 1 — explicit dictionary

```python
# Memoization 1
dic = {0: 1, 1: 1}

def f(x):
    if x in dic.keys():
        return dic[x]
    dic[x] = f(x - 1) + f(x - 2)
    return dic[x]
```

#### Memoization 2 — `functools.lru_cache`

```python
# Memoization 2
from functools import lru_cache

@lru_cache(maxsize=None)
def f(x):
    if x == 0 or x == 1:
        return 1
    return f(x - 1) + f(x - 2)
```

> Note: To satisfy the `mod 1e9 + 7` requirement and the recursion depth at `n = 10000`, you'd typically apply the modulus inside the addition and raise Python's recursion limit (`sys.setrecursionlimit`) — or convert the memoized recursion into a bottom-up loop.
