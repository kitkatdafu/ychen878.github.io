---
title: "Prefix Sums"
date: 2025-11-25
categories: ["Algorithms"]
tags: ["algorithms", "arrays", "prefix sums", "range queries"]
---

## Prefix Sum

A **prefix sum** array `p` is a data structure that helps answer range sum queries efficiently.
Given an input array `a` of length $n$, its prefix sum array `p` (also of length $n$) is defined as:
$$
p[i] = a[0] + a[1] + \dots + a[i] = \sum_{k=0}^{i} a[k]
$$
This means $p[i]$ stores the cumulative sum of all elements from the start of the array up to and including index $i$. For example, if:
$$
a = [1, 3, 4, 2, 5]
$$
Then the corresponding prefix sum array `p` is:
$$
p = [1, 4, 8, 10, 15]
$$

### Properties

The prefix sum array has two key properties that make it useful:
1. **Efficient Calculation:** The array `p` can be computed in $O(n)$ time using a single pass:
	- **Base Case:** $p[0] = a[0]$
	- **Recursive Relation:** $p[i] = p[i - 1] + a[i]$ for $i > 0$
2. **Constant-Time Range Sums:** You can find the sum of any subarray $a[l \dots r]$ (the sum $a[l] + \dots + a[r]$) in $O(1)$ time:
$$
\text{sum}(l, r) = p[r] - p[l - 1]
$$
* **Edge Case:** If the range starts from the beginning ($l = 0$), the sum is just $p[r]$.

### Code

```python
from itertools import accumulate
from typing import List

def get_prefix_sum_v1(arr: List[int]) -> List[int]:
    """
    Computes the prefix sum array using the optimized
    itertools.accumulate function.

    Args:
        arr: The input list of numbers.

    Returns:
        The prefix sum list.
    """
    # Use list() to convert the 'accumulate' iterator to a list
    return list(accumulate(arr))

def get_prefix_sum_v2(arr: List[int]) -> List[int]:
    """
    Computes the prefix sum array using a manual loop.

    Args:
        arr: The input list of numbers.

    Returns:
        The prefix sum list.
    """
    # CRITICAL FIX: Handle the edge case of an empty list
    if not arr:
        return []

    n = len(arr)
    p = [0] * n  # Pre-allocate the list

    # Set the base case
    p[0] = arr[0]

    # Build the rest of the prefix sum array
    for i in range(1, n):
        p[i] = p[i - 1] + arr[i]

    return p

def query_range_sum(p: List[int], l: int, r: int) -> int:
    """
    Finds the sum of a subarray from index l to r (inclusive)
    using the precomputed prefix sum array 'p' in O(1) time.

    Args:
        p: The prefix sum array.
        l: The left-bound index of the query (inclusive).
        r: The right-bound index of the query (inclusive).

    Returns:
        The sum of the subarray arr[l...r].
    """
    # Assumes 0 <= l <= r < len(p)
    if l == 0:
        return p[r]
    else:
        return p[r] - p[l - 1]

# --- Example Usage ---

a = [1, 3, 4, 2, 5]

# v1 is the preferred, more Pythonic way
p = get_prefix_sum_v1(a)
print(f"Input array: {a}")
print(f"Prefix sum:    {p}")

# Query the sum from index 1 to 3 (i.e., 3 + 4 + 2)
# p[3] - p[1-1] = p[3] - p[0] = 10 - 1 = 9
sum_1_to_3 = query_range_sum(p, 1, 3)
print(f"Sum of range [1...3]: {sum_1_to_3}") # Output: 9

# Query the sum from index 0 to 2 (i.e., 1 + 3 + 4)
# p[2] = 8
sum_0_to_2 = query_range_sum(p, 0, 2)
print(f"Sum of range [0...2]: {sum_0_to_2}") # Output: 8
```

### Two-dimensional Prefix Sum

$$
p_{i, j} = p_{i - 1, j} + p_{i, j - 1} - p_{i - 1, j - 1} + a_{i, j}
$$
