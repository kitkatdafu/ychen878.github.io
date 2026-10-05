---
title: "Quicksort"
date: 2025-11-10
categories: ["Algorithms"]
tags: ["algorithms", "sorting", "divide and conquer"]
---

Quicksort is a **Divide and Conquer** algorithm.
1. **Divide (Pick Pivot):** Choose one element from the array to be the **pivot**.
2. **Conquer (Partition):** Rearrange the array so that the pivot is in its final sorted position. All elements **smaller** than the pivot are placed to its left, and all elements **greater** than the pivot are placed to its right. (Elements equal to the pivot can go on either side, depending on the scheme).
3. **Combine (Recurse):** Recursively apply the same strategy to the two smaller subarrays—the one to the left of the pivot's new position and the one to the right. The "combine" step is trivial as the sorting happens in place.

```python
def partition(a, left, right):
    """
    Partitions the subarray a[left...right] using the Lomuto scheme
    with a[left] as the pivot.

    Returns the final index of the pivot.
    """
    # The pivot is the first element
    pivot_value = a[left]

    # 'idx' will track the boundary of the 'less-than-or-equal-to' partition.
    # All elements at indices [left+1 ... idx-1] will be <= pivot.
    idx = left + 1

    # Iterate through the array to partition it
    for i in range(left + 1, right + 1):
        # If current element is smaller or equal to the pivot
        if a[i] <= pivot_value:
            # Move it to the 'less-than' partition
            a[idx], a[i] = a[i], a[idx]
            # Expand the 'less-than' partition
            idx += 1

    # At the end, swap the pivot (originally at a[left]) with
    # the last element of the 'less-than' partition (at a[idx - 1])
    # to put the pivot in its final sorted position.
    pivot_final_index = idx - 1
    a[left], a[pivot_final_index] = a[pivot_final_index], a[left]

    return pivot_final_index


def quicksort(a, left, right):
    """
    Sorts the array 'a' in-place from index 'left' to 'right'
    using the quicksort algorithm.
    """
    if left < right:
        # Partition the array and get the pivot's final index
        pivot_index = partition(a, left, right)

        # Recursively sort the two subarrays
        quicksort(a, left, pivot_index - 1)  # Subarray to the left of pivot
        quicksort(a, pivot_index + 1, right) # Subarray to the right of pivot
```
