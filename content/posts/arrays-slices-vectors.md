---
title: Arrays, slices, and vectors
date: 2021-01-19
category: notes
tags:
  - Rust
keywords:
  - array
  - slice
  - vector
---
Notes on [Rust in Action](https://www.manning.com/books/rust-in-action?query=rust%20in%20action), by Tim McNamara
## Arrays
1. A collection of same thing (type).
2. Size is not changeable.
3. Size is known at compile time.
4. Unlike arrays in Java, arrays in Rust are allocated on stack.
### Array initialization
1. Comma-delimited list within square brackets `[8, 9, 6, 4]`
2. Repeat expression `[5; 10]`: An array contains ten 5s.
### Type annotation
Similar to the repeat expression `[type; size]`, the left hand side is the type of individual element, and the right hand side is the size of the array.

## Slices
1. Size is not changeable.
2. Size is **not** known at compile time.
### Type annotation
Since its size is not known at compile time,  there is no size parameter in the type annotation, i.e. `[type]` only.
### Why slices?
Easy typing. Arrays with the same type of elements but different sizes are considered as different types. Therefore, implementing traits for arrays are harder. On the other hand, since slice does not have size, it is much easier to implement a trait for a type of slice.

Slice also gives a view to the underlying data. 
> Slices can gain fast, read-only access of data without needing to copy anything around   
(similar to `numpy` array in Python?)

## Vectors
1. Size is changeable.
2. Has a small runtime penalty that arrays do not have.
3. It’s a vector.
