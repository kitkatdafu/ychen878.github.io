---
title: "Linked Lists"
date: 2026-04-11
categories: ["Algorithms"]
tags: ["algorithms", "data structures", "linked lists"]
---

## What is a Linked List?

### Concept: A Dynamic Data Structure

- A **Linked List** is a linear data structure, but its elements are **not stored contiguously in memory**.
- It is composed of a series of **Nodes**, where each node contains two parts:
    - **Data field**: stores the element's data.
    - **Pointer field**: stores the memory address of the next node.
- This structure — discrete memory blocks chained together via pointers — makes linked lists very efficient for insertion and deletion operations.

### Comparison with Arrays

||Array|Linked List|
|---|---|---|
|Memory|Contiguous|Non-contiguous|
|Access|Fast — O(1)|Slow — O(n)|
|Insert/Delete|Slow — O(n)|Fast — O(1)|

---

## Structure: Nodes and Pointers

### Singly Linked List

The simplest type of linked list. Each node has exactly one pointer pointing to its successor node.

```
[ 12 | • ] ──→ [ 99 | • ] ──→ [ 37 | Null ]
  Node 1          Node 2          Node 3
```

### Key Terminology

- **Head**: The first node of the linked list.
- **Tail**: The last node of the linked list; its pointer field points to **Null**.

---

## Implementing a Linked List in Python

### Defining the `ListNode` Class

In Python, we typically define a node using a class that holds data and a reference to the next node.

```python
# Define the linked list node
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val    # node's data value
        self.next = next  # reference to the next node

# Create a simple linked list: 1 -> 2 -> 3
node3 = ListNode(3)
node2 = ListNode(2, node3)
head  = ListNode(1, node2)

# Traverse the list
current = head
while current:
    print(current.val, end=" -> ")
    current = current.next
print("None")
```

**Output:** `1 -> 2 -> 3 -> None`

### Dummy Head Node

When solving linked list problems, we often create a **dummy head node** whose `next` pointer points to the true head node.

The advantage is that it **unifies operations on all nodes**, avoiding special-casing the head node (e.g., inserting or deleting at the front). This makes the code cleaner and less error-prone.

---

## Core Operation (1): Insert

### Process: Insert New Node X After Node A

1. Find node A.
2. Set new node X's `next` pointer to A's current successor node.
3. Set node A's `next` pointer to the new node X.

```
Step 1:  X.next = A.next   (X now points to B)
Step 2:  A.next = X        (A now points to X)

Before: A ──→ B
After:  A ──→ X ──→ B
```

### Code Implementation

```python
# Insert new_val after the node with value target_val
def insert_after(head, target_val, new_val):
    curr = head
    # 1. Find the target node
    while curr and curr.val != target_val:
        curr = curr.next
    # 2. If found, perform insertion
    if curr:
        new_node = ListNode(new_val)
        new_node.next = curr.next
        curr.next = new_node
    return head

# Example: list is 1 -> 2 -> 3
# insert_after(head, 2, 99)
# Result: 1 -> 2 -> 99 -> 3
```

---

## Core Operation (2): Delete

### Process: Delete the Node with Value `target_val`

1. Use a dummy head node to simplify edge cases.
2. Find the **predecessor node** `prev` of the node to be deleted.
3. Set `prev.next` to point directly to the node **after** the deleted node.

```
Before: A ──→ [B] ──→ C
                       ↑
        A.next = B.next (skip over B)
After:  A ──────────→ C
```

### Code Implementation

```python
# Delete the first node with value target_val
def delete_node(head, target_val):
    dummy = ListNode(next=head)
    prev, curr = dummy, head
    while curr:
        if curr.val == target_val:
            # Found it — bypass the current node
            prev.next = curr.next
            break  # delete the first one, then exit
        prev = curr
        curr = curr.next
    return dummy.next

# Example: list is 1 -> 2 -> 99 -> 3
# delete_node(head, 99)
# Result: 1 -> 2 -> 3
```

### How is Memory Freed?

In Python, we don't need to manually free memory like in C++. When an object (such as the removed node) has no variables or pointers referencing it, Python's **Garbage Collector** automatically reclaims its memory. So the `prev.next = curr.next` operation simultaneously breaks the link _and_ ensures the discarded node will eventually be reclaimed by the system.

---

## Classic Problem: Josephus Problem

### Problem Description

_n_ people (numbered 1, 2, …, n) stand in a circle. Starting from person 1, every _m_-th person is eliminated. The next round restarts from the person after the one just eliminated, counting up to _m_ again. This continues until everyone has been eliminated.

**Find the original number of the last person to be eliminated.**

### Approach: Simulate with a Circular Linked List

1. This problem has an inherently circular structure — a **circular linked list** is a natural fit.
2. Create a circular linked list of _n_ nodes representing the people.
3. Starting from the head, advance _m_ − 1 steps each round to find the person to eliminate.
4. "Delete" that node (modify its predecessor's pointer) and record its value.
5. Repeat until only one node remains.

### Example Walkthrough (_n_ = 5, _m_ = 3)

1. **Initial:** 1 → 2 → 3 → 4 → 5 → (1)
2. **Round 1:** Count 3 from 1 — **3** is eliminated. Remaining: 1 → 2 → 4 → 5 → (1)
3. **Round 2:** Count 3 from 4 — **1** is eliminated. Remaining: 2 → 4 → 5 → (2)
4. **Round 3:** Count 3 from 2 — **5** is eliminated. Remaining: 2 → 4 → (2)
5. **Round 4:** Count 3 from 2 — **2** is eliminated. Remaining: 4
6. **Final:** The last person is **4**.

### Code Implementation (Circular Linked List)

```python
# (ListNode class defined previously)
def josephus_linked_list(n, m):
    if n <= 0:
        return -1

    # 1. Build the circular linked list
    head = ListNode(1)
    curr = head
    for i in range(2, n + 1):
        curr.next = ListNode(i)
        curr = curr.next
    curr.next = head  # close the circle

    # 2. Find and delete nodes
    prev = head       # prev points to the node just before head
    curr = head
    count = n
    while count > 1:
        # Advance m-1 steps to reach the node to eliminate
        for _ in range(m - 1):
            prev = curr
            curr = curr.next
        # Delete the current node
        prev.next = curr.next
        curr = prev.next
        count -= 1

    return curr.val

print(f"n=5,  m=3 -> Winner: {josephus_linked_list(5, 3)}")
print(f"n=10, m=4 -> Winner: {josephus_linked_list(10, 4)}")
```

**Output:**

```
n=5,  m=3 -> Winner: 4
n=10, m=4 -> Winner: 5
```

### Complexity Analysis

**Time Complexity: O(n·m)**

- In the naive simulation, there are _n_ − 1 elimination rounds.
- Each round requires walking _m_ − 1 steps from the current position.
- Using a true circular linked list, finding the node to delete is O(m) and deletion is O(1), giving O(n·m) overall.
- This complexity is acceptable when _m_ ≪ _n_.

**Space Complexity: O(n)**

- We need a data structure (the linked list) of size _n_ to hold all people.

### Better Solution

The Josephus problem has a well-known **mathematical recurrence** that reduces time complexity to O(n) and space complexity to O(1):

$$
f(n, m) = \bigl(f(n-1, m) + m\bigr) \bmod n
$$

where _f(n, m)_ denotes the survivor's index among _n_ people counting every _m_-th (0-indexed).

---

## Programming Exercise: Reverse a Linked List

### Problem

Write a function `reverse_list(head)` that takes the head node `head` of a singly linked list and returns the head node of the reversed list.

**Example:**

- Input: `1 -> 2 -> 3 -> 4 -> 5 -> None`
- Output: `5 -> 4 -> 3 -> 2 -> 1 -> None`

### Solution

```python
def reverse_list(head):
    prev = None
    curr = head

    while curr:
        next_temp = curr.next  # temporarily save the next node
        curr.next = prev       # point current node's next to the previous node
        prev = curr            # advance prev and curr pointers
        curr = next_temp

    return prev
```
