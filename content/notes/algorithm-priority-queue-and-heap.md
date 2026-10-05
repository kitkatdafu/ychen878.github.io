---
title: "Priority Queues and Heaps"
date: 2026-04-08
categories: ["Algorithms"]
tags: ["algorithms", "data structures", "priority queues", "heaps"]
---

## Concept: A Special Kind of Queue

A **priority queue** is an abstract data type that allows us to store elements and retrieve (usually remove) the minimum or maximum element at any time.

- Unlike a regular queue's "first-in, first-out" principle, a priority queue outputs the **highest-priority** element first.
- An element's "priority" is typically determined by its value.

### Comparison with Stack and Queue

|Structure|Order Policy|
|---|---|
|Regular Queue|First-In, First-Out (FIFO) — cares about insertion order|
|Stack|Last-In, First-Out (LIFO) — also cares about insertion order|
|Priority Queue|Highest priority out first — cares about the element's own priority, regardless of insertion order|

---

## 1. What Is a Heap?

A **heap** is a special data structure based on a **complete binary tree**, commonly used to implement priority queues.

**Complete Binary Tree:** Every level is fully filled except possibly the last, and the last level's nodes are as far left as possible.

**Heap Properties:**

- **Min-Heap:** Every node's value is ≤ its children's values. The root is always the minimum element in the heap.
- **Max-Heap:** Every node's value is ≥ its children's values. The root is always the maximum element in the heap.

---

## 2. Array Representation of a Heap

Since a heap is a complete binary tree, we can conveniently store it in an array (or list) from top to bottom, left to right — no pointers needed.

For a node at index `i`:

- **Parent index:** `(i - 1) // 2`
- **Left child index:** `2 * i + 1`
- **Right child index:** `2 * i + 2`

---

## 3. Core Operations

### Push (Insert)

1. Append the new element to the end of the array (the next available position in the complete binary tree).
2. Compare the new element with its parent.
3. If the new element is smaller than its parent (for a min-heap), swap them.
4. Repeat until the new element is no longer smaller than its parent, or it has reached the root. This process is called **sift-up (bubbling up)**.

### Pop (Remove)

1. Extract the root's value (this is the minimum value we want).
2. Move the last element in the array to the root position.
3. Compare the new root with its smaller child.
4. If the new root is larger than its smaller child, swap them.
5. Repeat until the node is no longer larger than either child, or it has become a leaf node. This process is called **sift-down (sinking down)**.

---

## 4. The `heapq` Module

### Module Basics: Operates In-Place on Lists

Python's standard library `heapq` provides efficient algorithms to implement a **min-heap on a regular list**.

- **Important:** It is a functional module, not a data type like `deque`. You provide a list; it modifies that list in-place to satisfy the heap property.
- After operations, `heap[0]` is always the smallest element.
- Since it operates directly on a list, you can mix in regular list operations — but this may corrupt the heap structure, so use with care.

### `heapify`: Efficient Heap Construction

`heapq.heapify(x)` is a very important function. It converts an arbitrary list `x` into a valid min-heap **in-place** in **O(N) linear time**.

```python
import heapq
# Starting from an arbitrary list
data = [40, 20, 80, 10, 50]
print(f"Original list: {data}")
heapq.heapify(data)
print(f"Heapified list: {data}")
# The top is the minimum
print(f"Heap top: {data[0]}")
```

**Output:**

```
Original list: [40, 20, 80, 10, 50]
Heapified list: [10, 20, 80, 40, 50]
Heap top: 10
```

---

## 5. Core Operations: `heappush` & `heappop`

These are the two most commonly used methods for operating on a heap, corresponding to "push" and "pop". Both have **O(log N)** time complexity.

- `heapq.heappush(heap, item)`: Pushes `item` onto the heap while maintaining the heap property.
- `heapq.heappop(heap)`: Pops and returns the smallest element from the heap while maintaining the heap property. Raises `IndexError` if the heap is empty.

```python
import heapq
# Start with an empty list
heap = []
# Push elements in
heapq.heappush(heap, 30)
heapq.heappush(heap, 10)
heapq.heappush(heap, 20)
print(f"Heap after pushes: {heap}")
# Pop the minimum
min_val = heapq.heappop(heap)
print(f"Popped: {min_val}, Heap is now: {heap}")
min_val = heapq.heappop(heap)
print(f"Popped: {min_val}, Heap is now: {heap}")
```

**Output:**

```
Heap after pushes: [10, 30, 20]
Popped: 10, Heap is now: [20, 30]
Popped: 20, Heap is now: [30]
```

---

## 6. Advanced Operations (1): Combined Methods

### Efficient "Push and Pop"

`heapq` provides two highly optimized combined operations that are faster than calling `heappush` and `heappop` separately:

- `heapq.heappushpop(heap, item)`: Pushes `item` onto the heap, then pops and returns the smallest element. The heap's maximum size stays the same.
- `heapq.heapreplace(heap, item)`: Pops and returns the smallest element, then pushes the new `item`. The heap's maximum size stays the same.

**Key Difference** — when the pushed `item` is smaller than the current heap top, the two behave differently:

- `heappushpop`: first pushes the item, so it may return the item itself.
- `heapreplace`: pops the original top first, then pushes the item.

```python
import heapq
heap = [10, 20, 30]
# heappushpop: 5 < 10, so push first, then pop 5 itself
ret1 = heapq.heappushpop(heap, 5)
print(f"heappushpop(5): returns {ret1}, heap is {heap}")
# 25 > 10, so 10 is popped
ret2 = heapq.heappushpop(heap, 25)
print(f"heappushpop(25): returns {ret2}, heap is {heap}")
# heapreplace: pops top (20) first, then pushes 15
heap = [20, 25, 30]
ret3 = heapq.heapreplace(heap, 15)
print(f"heapreplace(15): returns {ret3}, heap is {heap}")
```

**Output:**

```
heappushpop(5): returns 5, heap is [10, 20, 30]
heappushpop(25): returns 10, heap is [20, 25, 30]
heapreplace(15): returns 20, heap is [15, 25, 30]
```

---

## 7. Advanced Operations (2): Convenience Functions

### Handy Top-K Tools

`heapq` also provides two very convenient functions to find the N largest or smallest elements from any iterable:

- `heapq.nlargest(n, iterable, key=None)`: Returns a list of the n largest elements from the iterable.
- `heapq.nsmallest(n, iterable, key=None)`: Returns a list of the n smallest elements from the iterable.

**Performance Notes:**

- Very efficient when `n` is relatively small.
- When `n` is close to the total length of the iterable, using `sorted()` may be more efficient.
- These are the cleanest way to solve "Top K" problems.

```python
import heapq
data = [1, 3, 5, 7, 9, 2, 4, 6, 8, 0]
# Find the 3 largest elements
top3 = heapq.nlargest(3, data)
print(f"Top 3 largest: {top3}")
# Find the 4 smallest elements
bottom4 = heapq.nsmallest(4, data)
print(f"Top 4 smallest: {bottom4}")
# Solve a Top K problem — find the 2nd largest element
k = 2
kth_largest = heapq.nlargest(k, data)[-1]
print(f"The 2th largest is: {kth_largest}")
```

**Output:**

```
Top 3 largest: [9, 8, 7]
Top 4 smallest: [0, 1, 2, 3]
The 2th largest is: 8
```

---

## 8. Trick: Simulating a Max-Heap

### Problem

The `heapq` module only provides a min-heap. What if we want to pop the maximum element first?

### Trick: Store Negated Values

We can use a simple math trick — the larger a number, the smaller its negation.

- **Push:** When pushing an element onto the "max-heap", we actually push its negation.
- **Pop:** When popping from this heap, it pops the smallest negated value. We negate it once more to get the original maximum.

```python
import heapq
# Simulate a max-heap
max_heap = []
# Push negated values
heapq.heappush(max_heap, -30)
heapq.heappush(max_heap, -10)
heapq.heappush(max_heap, -20)
print(f"Internal min-heap: {max_heap}")
# Pop and negate to get original max
max_val = -heapq.heappop(max_heap)
print(f"Popped max value: {max_val}")
print(f"Internal min-heap after pop: {max_heap}")
```

**Output:**

```
Internal min-heap: [-30, -10, -20]
Popped max value: 30
Internal min-heap after pop: [-20, -10]
```

---

## 9. Comparison: `heapq` vs. `queue.PriorityQueue`

### Another Option: `queue.PriorityQueue`

Python's `queue` module also provides a `PriorityQueue` class. It is essentially a thread-safe priority queue implemented using `heapq`.

### Why Not Recommended for Algorithm Competitions?

`PriorityQueue` is designed for multithreaded programming. Its internal thread-safety lock brings extra performance overhead. In single-threaded algorithm competitions, this makes it significantly slower than using `heapq` directly.

**Therefore, in algorithm competitions, always prefer `heapq`.**

|`heapq` Usage|`PriorityQueue` Usage|
|---|---|
|`import heapq`|`from queue import PriorityQueue`|
|`h = []`|`q = PriorityQueue()`|
|`heapq.heappush(h, (10, 'task1'))`|`q.put((10, 'task1'))`|
|`item = heapq.heappop(h)`|`item = q.get()`|
