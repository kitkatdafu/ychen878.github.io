---
title: "Binary Search"
date: 2025-11-27
categories: ["Algorithms"]
tags: ["algorithms", "search", "divide and conquer"]
---

## 1. Core Concepts

Binary search is the standard algorithm for locating a specific element in a **sorted** sequence. It operates on the divide-and-conquer principle.

- **Mechanism:** Repeatedly halves the search space. By comparing the target with the middle element, we eliminate half of the candidates instantly.
- **Prerequisite:** The sequence **must be sorted** (monotonic).
- **Complexity:**
    - **Time:** $O(\log n)$ (Dramatically faster than the $O(n)$ of linear search).
    - **Space:** $O(1)$ (Iterative implementation).

---

## 2. Python’s `bisect` Module

implementing binary search manually is error-prone (off-by-one errors are common). Python’s `bisect` module provides a standardized, robust C-optimized implementation.

### Key Functions

|**Function**|**Purpose**|**Partition Logic**|
|---|---|---|
|**`bisect_left(a, x)`**|Finds the **leftmost** insertion point to maintain order.|`a[:i] < x` and `a[i:] >= x`|
|**`bisect_right(a, x)`**|Finds the **rightmost** insertion point to maintain order.|`a[:i] <= x` and `a[i:] > x`|

> **Note:** `bisect.bisect` is an alias for `bisect_right`.

**Example Usage:**


```python
import bisect
a = [10, 20, 30, 30, 40, 50]

# bisect_left: First index >= 30
idx1 = bisect.bisect_left(a, 30)   # Returns 2

# bisect_right: First index > 30
idx2 = bisect.bisect_right(a, 30)  # Returns 4
```

### Inserting Elements (`insort`)

`insort_left` and `insort_right` insert element $x$ into the list while maintaining sorted order.

- **Complexity:** $O(n)$.
    - _Why?_ Finding the index is $O(\log n)$, but shifting elements in the list to make room is linear $O(n)$.
- **Return:** `None` (modifies list in-place).

### Practical Recipes

1. Check Existence

Check if x is present without a linear scan.

```python
def check_existence(a, x):
    i = bisect.bisect_left(a, x)
    # Check if index is within bounds AND the value matches
    return i != len(a) and a[i] == x
```

2. Count Elements in Range $[L, R]$

Find how many numbers fit between left and right inclusive.

```python
def count_in_range(a, left, right):
    start = bisect.bisect_left(a, left)   # First number >= left
    end = bisect.bisect_right(a, right)   # First number > right
    return end - start
```

---

## 3. General Binary Search Template

For problems beyond simple array lookups, we conceptualize Binary Search as a **Decision Problem**.

### The Boolean Boundary

Any monotonic problem can be mapped to a boolean array where we seek the boundary between `True` and `False`.

- **Pattern A:** `[T, T, T, F, F, F]` (Find the last True)
- **Pattern B:** `[F, F, F, T, T, T]` (Find the first True)

### The Invariant Template (`l + 1 < r`)

This approach minimizes off-by-one errors by maintaining an invariant where `l` and `r` always point to opposite boolean values.

- **Invariant:** `check(l)` is True, `check(r)` is False (or vice versa).
- **Initialization:** Set `l` and `r` to bounds outside the actual range (e.g., `-1` and `n`) to handle edge cases gracefully.
- **Termination:** Loop ends when `l + 1 == r`. The boundary is exactly between `l` and `r`.

**Code Template:**

```python
def check(mid):
    # Returns True if condition is met, False otherwise
    return nums[mid] <= target

def solve(nums, target):
    # Initialize pointers outside the array bounds
    l, r = -1, len(nums)

    while l + 1 < r:
        mid = (l + r) // 2
        if check(mid):
            l = mid  # l preserves the 'True' property
        else:
            r = mid  # r preserves the 'False' property

    return l # Returns the index of the last element satisfying check()
```

---

## 4. Binary Search on the Answer

This technique transforms an **Optimization Problem** (find the best X) into a **Feasibility Problem** (can X work?).

**The Logic:**

1. Guess a candidate answer `ans`.
2. Run `check(ans)` to see if it is valid.
3. If `check(ans)` implies that all values to one side are also valid/invalid (monotonicity), use Binary Search.

### Type 1: Maximize the Minimum

- **Goal:** Make the smallest value in a set as large as possible (e.g., "Aggressive Cows", "H-Index").
- **Pattern:** `[T, T, T, F, F]` (Small values are possible, huge values are impossible).
- **Strategy:** Find the **Last True**.
- **Check:** Can we satisfy the condition if the minimum value is at least `ans`?

### Type 2: Minimize the Maximum

- **Goal:** Make the largest value in a set as small as possible (e.g., "Split Array Largest Sum", "Koko Eating Bananas").
- **Pattern:** `[F, F, F, T, T]` (Small capacities fail, large capacities succeed).
- **Strategy:** Find the **First True**.
- **Check:** Is it possible to complete the task if the maximum load is limited to `ans`?
