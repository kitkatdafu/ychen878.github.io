---
title: "Merge Sort"
date: 2025-11-10
categories: ["Algorithms"]
tags: ["algorithms", "sorting", "divide and conquer"]
---

The algorithm breaks the problem down into smaller, manageable pieces and then reassembles them in a sorted order. This happens in three main phases:
1. **Divide:** The list is repeatedly divided in half until you are left with many small lists, each containing only one element. A list with one element is considered, by definition, to be sorted (this is the **base case** for the recursion).
2. **Conquer:** This phase is trivial. Since the base-case lists (of one element) are already sorted, there's no work to do. The real work happens in the "Combine" step.
3. **Combine (The "Merge"):** This is the core of the algorithm. Merge sort begins to combine (or "merge") the small, one-element lists back together, two at a time. Crucially, it merges them _in sorted order_. It then takes those newly sorted lists (now of 2 elements) and merges _them_ together, and so on, until the entire list is reassembled into one final, sorted list.

```python
def merge_sort(arr):
    """
    Sorts a list in ascending order using the merge sort algorithm.
    """

    # Base case: A list with 0 or 1 elements is already sorted
    if len(arr) <= 1:
        return arr

    # 1. Divide: Split the list into two halves
    mid = len(arr) // 2
    left_half = arr[:mid]
    right_half = arr[mid:]

    # 2. Conquer: Recursively sort each half
    sorted_left = merge_sort(left_half)
    sorted_right = merge_sort(right_half)

    # 3. Combine: Merge the two sorted halves
    merged = []
    i = 0  # Pointer for sorted_left
    j = 0  # Pointer for sorted_right

    # Loop while both halves have elements to compare
    while i < len(sorted_left) and j < len(sorted_right):
        if sorted_left[i] < sorted_right[j]:
            merged.append(sorted_left[i])
            i += 1
        else:
            merged.append(sorted_right[j])
            j += 1

    # At this point, one of the halves is empty.
    # Add all remaining elements from the non-empty half.
    merged.extend(sorted_left[i:])
    merged.extend(sorted_right[j:])

    return merged

# --- Example Usage ---
my_list = [38, 27, 43, 3, 9, 82, 10]

print(f"Original list: {my_list}")
sorted_list = merge_sort(my_list)
print(f"Sorted list:   {sorted_list}")
```
