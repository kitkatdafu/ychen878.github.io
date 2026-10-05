---
title: "Selection Sort"
date: 2025-10-31
categories: ["Algorithms"]
tags: ["algorithms", "sorting"]
---

Selection sort works by conceptually dividing the list into two parts:
1. A **sorted** subarray, which is built up from left to right at the beginning.
2. An **unsorted** subarray, which makes up the rest of the list.
The algorithm iterates through the list, and at each step $i$ (from $i = 0$ to $n-1$):
3. **Find:** It finds the smallest element in the **unsorted** subarray (i.e., from index $i$ to the end).
4. **Swap:** It swaps that smallest element with the element at the _first position_ of the unsorted subarray (which is index $i$).

```python
def selection_sort(arr):
    """
    Sorts a list in ascending order using the selection sort algorithm.
    """
    n = len(arr)

    # Outer loop: Move the boundary of the sorted subarray
    # This corresponds to your "i-th position"
    for i in range(n):

        # Step 1: Find the index of the smallest element in the
        # remaining unsorted part (from index i to n-1)
        min_index = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j

        # Step 2: Swap the found smallest element with the
        # element at the i-th position
        # This "puts the smallest element" into its final sorted place
        arr[i], arr[min_index] = arr[min_index], arr[i]

# --- Example Usage ---
my_list = [64, 25, 12, 22, 11]

print(f"Original list: {my_list}")
selection_sort(my_list)
print(f"Sorted list:   {my_list}")
```
