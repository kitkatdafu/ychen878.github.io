---
title: "Bucket Sort"
date: 2025-11-10
categories: ["Algorithms"]
tags: ["algorithms", "sorting", "non-comparison sorting"]
---

Bucket sort is a non-comparison sorting algorithm that works by distributing the elements of an array into a number of "buckets." It is highly efficient when the input data is uniformly distributed (i.e., spread out evenly) across its range.

The algorithm follows these four main steps:
1. **Initialize Buckets:** First, create a fixed number of empty buckets (in your case, `bucket_count`).
2. **Scatter:** Iterate through the input array. For each element, calculate its proper bucket index (based on its value relative to the min/max values) and place the element into that bucket.
3. **Sort Buckets:** Go through each bucket, one by one, and sort the elements _within_ it. This is typically done using another algorithm like insertion sort (or, in this case, Python's built-in `sort()`).
4. **Gather:** Finally, concatenate the sorted buckets in order (from bucket 0 to the last bucket) to reassemble the full, sorted array.

```python
from itertools import chain

def bucket_sort(arr, bucket_count):
    """
    Sorts a list in ascending order using the bucket sort algorithm.
    """

    # 1. Edge case: Handle empty or single-element lists
    if len(arr) <= 1:
        return arr

    # 2. Initialize Buckets & Find Range
    min_val, max_val = min(arr), max(arr)

    # Edge case: If all elements are the same, no sorting needed
    if min_val == max_val:
        return arr

    # Calculate the size of each bucket.
    # The '+1' ensures the range [min_val, max_val] is covered.
    bucket_size = (max_val - min_val + 1) // bucket_count
    # Fix for bucket_size becoming 0 if bucket_count > (max_val - min_val)
    if bucket_size == 0:
        bucket_size = 1

    buckets = [[] for _ in range(bucket_count)]

    # 3. Scatter: Distribute elements into buckets
    for x in arr:
        # Calculate the bucket index for the element
        idx = (x - min_val) // bucket_size
        # CRITICAL FIX: Ensure max_val lands in the last bucket
        idx = min(idx, bucket_count - 1)
        buckets[idx].append(x)

    # 4. Sort Buckets: Sort each individual bucket
    for bucket in buckets:
        bucket.sort() # Using built-in sort (Timsort)

    # 5. Gather: Concatenate the sorted buckets
    return list(chain(*buckets))

# --- Example Usage ---
my_list = [0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51]
# Using bucket_count = 5
sorted_list = bucket_sort(my_list, 5)
print(f"Original list: {my_list}")
print(f"Sorted list:   {sorted_list}")

my_list_2 = [29, 25, 3, 49, 9, 37, 21, 43]
# Using bucket_count = 4
sorted_list_2 = bucket_sort(my_list_2, 4)
print(f"\nOriginal list: {my_list_2}")
print(f"Sorted list:   {sorted_list_2}")
```
