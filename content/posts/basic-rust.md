---
title: Some basic Rust
date: 2021-01-18
category: notes
tags:
  - Rust
keywords:
  - rust
  - types
  - control-flow
---
Notes on [Rust in Action](https://www.manning.com/books/rust-in-action?query=rust%20in%20action), by Tim McNamara
## Numbers
Rust supports operator overloading. Therefore, operators like `+` can be used on different types, not only numbers (Java does not support it).

There is not implicit conversion between types.  `i32` is always `i32` unless otherwise indicated.

Numbers have methods. But the type of a number must be specified.

To print the binary representation of a number, use `{:b}`  as the placeholder for the number.

### Comparing numbers
#### Integer
Numbers with different types are not comparable. For example, `a:i32` cannot be compared to `b:i8`. A compiler error would raise if one tried to compile the code. To solve this issue, one has to manually cast a number to the type of the other. For example, `b as i32` casts `b` to a `i32` number.

#### Floating point
In Java, `0.1 + 0.2 == 0.3`  returns a `false` due to the idiosyncrasy of how floating numbers are stored in memory. However, the same code returns `true` in Rust. This is because Rust tolerate some error in floating number. The tolerances are defined as `f32::EPSILON` and `f64::EPSILON`. Rust is checking if the absolute difference between two numbers is smaller than the `EPSILON` value corresponding to the type.

Not a number in Rust is `NAN`, which represents undefined numbers result of invalid mathematical operations such. Comparing one  `NAN` to anther `NAN` value returns `false` by default.

#### Relational, complex and other numbers
`num` create must be used in order to access complex numbers, big integer/decimal numbers, etc.

## Iteration
Either use `&` to create a reference of the collection or use `iter()` method to create a iterator to the collection (Not all types support `&` referencing.
`iter()` borrows, but `into_iter()` takes ownership.

## Flow control
### `for`
```rust
for item in collection {
	// todo
}
```
You would want to use a reference if you want to use collection again later.
```rust
for item in &collection {
	// todo
}
```
Exclusive range: n..m, [n, m)
Inclusive range: n..=m, [n, m]
If you are not trying to use item, use `_` as a placeholder.
```rust
for _ in 0..10 {
	// todo
}
```
Try not to indexing through a collection. Indexing involves run-time boundary checking, which slows the program. Use a for loop on the collection involves compile-time checking only.

### `while`
Does what you expect.

### `loop`
Basically, a `while true` loop.

### `continue`
Does what you expect.

### `break`
Does what you expect. It also supports breaking from nested loops. 
An awkward example:
```rust
use std::time::{Duration, Instant};

fn main() {
    let mut age = 58;
    let mut years_in_office = 0;
    'presidency: loop { // '{loop_label}:
        if age == 82 {
            let start = Instant::now();
            let time_limit = Duration::new(2, 0);
            loop {
                if (Instant::now() - start) < time_limit {
                    break 'presidency;
                }
            }
        }
        if years_in_office % 5 == 0 {
            println!("连任!");
        }
        age += 1;
        years_in_office += 1;
    }
}
```

### `goto`
No such thing

### `if`-`else`
If only accepts boolean value. Unlike Java or C/C++, curly braces are required not matter how many statements belong to `if`/`else`/`for`/`while`.

Conditional expressions return values. Therefore,  one can bind (the return value of) a conditional expression to a variable.

```rust
fn main() {
    let name = if 0 > 1 { "硬点" } else { "钦定" };
    println!("name = {}", name);
}
```

### `match`

Match allows you to do pattern-matching. It also informs you if the cases you used is not exhaustive. Similar to `if`-`else`, it also returns value.
```rust
fn main() {
    let speed: u8 = 10;
    let job = match speed {
        0 => "蜗牛",
        1..=20 => "乌龟",
        21..=50 => "兔子",
        _ => "港记",
    };
    println!("job = {}", job);
}
```
When `match` reaches an `matched` arm, it immediately returns from the matching process.
