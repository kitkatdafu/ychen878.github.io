---
title: "Stacks"
date: 2026-05-01
categories: ["Algorithms"]
tags: ["algorithms", "data structures", "stacks"]
---

## Stack

- A Stack is a special linear data structure that only allows insertion and deletion operations at one end of the structure.
- This end is called the Top, and the other end is called the Bottom.
- Stack operations follow the Last-In, First-Out (LIFO) principle.

### Push

Add a new element at the top of the stack.

### Pop

Remove and return the element at the top of the stack.

### Top (Peek)

Return the element at the top of the stack without removing it.

## Using a List to Simulate a Stack

Python's list provides all the necessary operations to easily simulate a stack.

- Push: Use the list's `append()` method
- Pop: Use the list's `pop()` method (without arguments)
- Top: Access the last element of the list with `stack[-1]`
- Check if the stack is empty: Check the length of the list with `len(stack) == 0`, or simply use `if not stack`
