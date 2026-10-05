---
title: "Queues"
date: 2026-05-01
categories: ["Algorithms"]
tags: ["algorithms", "data structures", "queues"]
---

## Queue

- A Queue is a special linear data structure that only allows insertion at one end of the structure and deletion at the other end.
- The end where insertion occurs is called the Rear, and the end where deletion occurs is called the Front.
- Queue operations follow the First-In, First-Out (FIFO) principle.

## Enqueue

Add a new element at the rear of the queue.

### Dequeue

Remove and return the element at the front of the queue.

## Using a List to Simulate a Queue (Not Recommended)

- Enqueue: Use the list's `append()` method
- Dequeue: Use the list's `pop(0)` method
- Peek at the front: Access the first element of the list with `queue[0]`

### Performance Issues

While simulating a queue with a list is functionally feasible, it is inefficient. Removing an element from the head of a list is an inefficient operation. The `pop(0)` operation on a list has a time complexity of $\mathcal{O}(n)$, where $n$ is the length of the list. This is because after removing the first element, all subsequent elements need to be shifted forward by one position to fill the gap.

## Double-Ended Queue (Deque)

Python's `collections` module provides a specifically optimized data structure called `deque`. It is the preferred way to implement a queue.

- A `deque` is a double-ended queue, meaning that adding and removing elements at both ends is highly efficient, with a time complexity of $\mathcal{O}(1)$.
- Its internal implementation is based on a doubly linked list, which avoids the performance issues that lists have with head operations.
- Enqueue: Use the `append()` method
- Dequeue: Use the `popleft()` method
- Peek at the front: Use `queue[0]` to access the first element

## deque vs. list

deque and list each have their own strengths and weaknesses for different operations. Understanding the performance differences between them is key to efficient programming.

|Operation|deque|list|
|---|:-:|--:|
|append|$\mathcal{O}(1)$|$\mathcal{O}(1)$|
|pop|$\mathcal{O}(1)$|$\mathcal{O}(1)$|
|appendleft|$\mathcal{O}(1)$|$\mathcal{O}(n)$|
|popleft|$\mathcal{O}(1)$|$\mathcal{O}(n)$|
|getitem|$\mathcal{O}(n)$|$\mathcal{O}(1)$|

### Trade-off

- deque: Optimized for fast $\mathcal{O}(1)$ insertions and deletions at both ends. However, the performance of indexed access depends on the position being accessed: accessing elements at either end is $\mathcal{O}(1)$, while accessing elements in the middle is more costly, with a worst-case time complexity of $\mathcal{O}(n)$.
- list: Optimized for fast $\mathcal{O}(1)$ random access and $\mathcal{O}(1)$ insertions and deletions at the tail, but insertions and deletions at the head are slow $\mathcal{O}(n)$ operations.
- Conclusion: In scenarios that require frequent operations at both ends of the data (such as queues, stacks, and sliding windows), deque is the ideal choice.

## Initializing a deque and Bounded Deques

- Create an empty deque: `d = deque()`
- Create from an iterable: `d = deque([1, 2, 3])`

### Bounded Deque

When creating a deque, you can provide an optional parameter `maxlen` to limit its maximum length. When a bounded deque is full and a new element is added at one end, the element at the other end is automatically pushed out. This is very useful in many algorithmic scenarios, such as solving "sliding window" problems.
