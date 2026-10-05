---
title: "Difference Arrays"
date: 2025-11-24
categories: ["Algorithms"]
tags: ["algorithms", "arrays", "prefix sums", "range queries"]
---

## Difference Arrays

1. For an array $a$, the difference array $\mathrm{diff}$ is defined as:
    $$
    \mathrm{diff}[i] = a[i] - a[i - 1], \quad \text{where } a[0] = 0.
    $$
2. Computing the prefix sums of the difference array restores the original array:
    $$
    \mathrm{diff}[1] + \mathrm{diff}[2] + \dots + \mathrm{diff}[i] = a[1] + (a[2] - a[1]) + \dots + (a[i] - a[i - 1]) = a[i].
    $$
3. To perform range addition on the original array (adding $x$ to all elements in the interval $[l, r]$), the operations on the difference array are:
    $$
    \mathrm{diff}[l] \mathrel{+}= x, \quad \mathrm{diff}[r + 1] \mathrel{-}= x.
    $$

### Two-dimensional Difference Arrays

$$
\mathrm{diff}_{i, j} = a_{i, j} - a_{i - 1, j} - a_{i, j - 1} + a_{i - 1, j - 1}
$$
To perform range addition between $(x_{1}, y_{1})$ and $(x_{2}, y_{2})$, do
$$
\mathrm{diff}[x_{1}][y_{1}] \mathrel{+}= x
$$
$$
\mathrm{diff}[x_{1}][y_{2} + 1] \mathrel{-}= x
$$
$$
\mathrm{diff}[x_{2} + 1][y_{1}] \mathrel{-}= x
$$
$$
\mathrm{diff}[x_{2} + 1][y_{2} + 1] \mathrel{+}= x
$$
