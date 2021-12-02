---
title: Global variables
date: 2021-01-20
category: notes
tags:
  - Rust
keywords:
  - global variables
---
Notes on [Rust in Action](https://www.manning.com/books/rust-in-action?query=rust%20in%20action), by Tim McNamara
1. All caps
2. If mutable, it’s modifier is `static mut`, meaning the variable has a mutable static lifetime (valid for the life of the program).
3. If immutable, use `const` instead.

Code that modify global variable should be placed into an `unsafe` block. `unsafe` means as safe as `C`.

### `const` vs. `let`
Although `let` also defines immutable variable, it defines run time constant. Whereas `const` defines compile the constant. 
