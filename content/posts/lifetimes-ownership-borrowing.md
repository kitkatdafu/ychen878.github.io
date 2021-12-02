---
title: Lifetimes, Ownership, and Borrowing
date: 2021-01-21
category: notes
tags:
  - Rust
keywords:
  - lifetime
  - ownership
  - borrow
---
Notes on [Rust in Action](https://www.manning.com/books/rust-in-action?query=rust%20in%20action), by Tim McNamara

Lifetimes, ownership, and boring are the three essential aspect of the borrow checking system, which is the bedrock of Rust’s fearless concurrency.

## Behavior of primitive types
Primitive types in Rust implement the `Copy` trait, which allows these types “to be duplicated at times that would otherwise be illegal”. Primitive types follow the **copy semantics**, whereas other types follow the **move semantics**.
In fact, all types that implement `Copy` trait follow the **copy semantics**.
### `Copy` vs. `Clone`
Types that implement `Copy` do the copy implicitly.
	Fast and cheap, exact bit-for-bit copy.
Types that implement `Clone` has to call the `clone()` method to perform the cloning.
	May be expensive, user defined.

## Owner
An owner’s responsibility is to clean up the memory that it owns when that memory’s lifetime ends. This ownership system means that a value cannot outlive its owner.
### Movement of ownership
1. Binding (assignment) 
2. Through function: pass as an argument or return
### print macros
[rust - Does println! borrow or own the variable? - Stack Overflow](https://stackoverflow.com/a/30451360)
> The macros print!, println!, eprint!, eprintln!, write!, writeln! and format! are a special case and implicitly take a reference to any arguments to be formatted.  
> These macros do not behave as normal functions and macros do for reasons of convenience; the fact that they take references silently is part of that difference.  

## Ownership strategies
1. Use reference where full ownership is not required.
2. Duplicate the value
3. Refactoring code to reduce the number of long-lives objects
4. Wrap you data in a type designed to assist with moment issues
