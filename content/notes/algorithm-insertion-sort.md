---
title: "Insertion Sort"
date: 2025-10-31
categories: ["Algorithms"]
tags: ["algorithms", "sorting"]
---

1. **Start** with the second element (at index 1), assuming the first element (at index 0) is already a sorted list of one.
2. **Store** this current element in a temporary variable (let's call it the `key`).
3. **Compare** the `key` with the elements in the sorted subarray, moving from right to left (i.e., from index $i-1$ down to 0).
4. **Shift** any element in the sorted subarray that is _greater_ than the `key` one position to the right. This opens up a "gap" for the `key`.
5. **Insert** the `key` into the gap once you find an element smaller than it, or when you reach the beginning of the list.
6. **Repeat** this process, expanding the sorted subarray by one element each time, until the entire list is sorted.

```python
def insertion_sort(arr):
    """
    Sorts a list in ascending order using the insertion sort algorithm.
    """

    # Start from the second element (index 1)
    # The first element (index 0) is treated as the initial sorted part
    for i in range(1, len(arr)):

        # Step 2: Store the current element to be inserted
        key = arr[i]

        # Step 3 & 4: Move elements of the sorted part (arr[0..i-1])
        # that are greater than key, one position to the right
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]  # Shift element to the right
            j -= 1

        # Step 5: Insert the key into its correct position
        arr[j + 1] = key

# --- Example Usage ---
my_list = [12, 11, 13, 5, 6]

print(f"Original list: {my_list}")
insertion_sort(my_list)
print(f"Sorted list:   {my_list}")
```
