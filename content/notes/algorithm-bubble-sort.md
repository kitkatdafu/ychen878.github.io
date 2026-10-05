---
title: "Bubble Sort"
date: 2025-10-31
categories: ["Algorithms"]
tags: ["algorithms", "sorting"]
---

1. **Make a "pass"** through the unsorted part of the list, comparing every pair of adjacent items (from the beginning to the end of the unsorted section).
2. For each pair, if the item on the left is greater than the item on the right, **swap them**. This moves the larger element one position to the right.
3. After the first full pass, the **largest element** in the list will have "bubbled up" to the very last position.
4. **Repeat** the process for the remaining unsorted portion of the list (i.e., from the beginning up to the now-sorted end), making one less comparison each time. Continue until no more swaps are needed.

```python
def bubble_sort(arr):
    """
    Sorts a list in ascending order using the bubble sort algorithm.
    """
    n = len(arr)

    # Outer loop for the number of passes
    for i in range(n):
        # A flag to optimize if the list becomes sorted early
        swapped = False

        # Inner loop for comparing adjacent elements
        # The range is (n-i-1) because the last 'i' elements are already in place
        for j in range(0, n - i - 1):

            # Compare adjacent elements
            if arr[j] > arr[j + 1]:
                # Swap them if the first is greater than the second
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True

        # If no swaps occurred in a full pass, the list is sorted
        if not swapped:
            break

# --- Example Usage ---
my_list = [64, 34, 25, 12, 22, 11, 90]

print(f"Original list: {my_list}")
bubble_sort(my_list)
print(f"Sorted list:   {my_list}")
```
