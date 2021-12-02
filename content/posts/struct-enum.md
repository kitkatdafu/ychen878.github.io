---
title: Struct, Enum
date: 2021-01-20
category: notes
tags:
  - Rust
keyword:
  - struct
  - enum
---
Notes on [Rust in Action](https://www.manning.com/books/rust-in-action?query=rust%20in%20action), by Tim McNamara
## `type`
Just an aliasing mechanism.
For example, the following code will compile and run:
```rust
type MyString = String;
fn main() {
	let haha: MyString = String::from("haha");
	let hehe: String = MyString::from("hehe");
}
```
## “new type” `struct` wrapping
If aliasing is not ideal, try this:
```rust
struct MyString(String); // a tuple
```
Now, the following code will not compile since MyString and String are no longer interchangeable.
```rust
fn main() {
	let haha: MyString = String::from("haha");
}
1  |     let haha: MyString = String::from("haha");
   |               --------   ^^^^^^^^^^^^^^^^^^^^ expected struct `MyString`, found struct `String`
```

## methods
Use `impl` block with the name of the struct to declare methods.
```rust
impl StructName {
	// todo
}
```
Although structs can be initialized using the struct literal, a more common way is to declare a `new()` methods, as a helper function, to create a new instant of the struct.

## `Result`
`Result` is an enum, it consists of two variants: `Ok(T)` and `Err(E)`.

## `enum`
1. Works with pattern matching
2. Can have methods
3. Can include data within its variants

## `trait`
Similar to an interface, it defines a behavior that struct implemented this trait shall follow.
To define a trait, create a block with the `trait` keyword and the name of the trait. Place method’s name, parameters, and return value only inside the `trait` block:
```rust
trait Read {
    fn read(self: &Self, save_to: &mut Vec<u8>) -> Result<usize, String>;
}
```
The `Self` is a pseudo type, playing as a player holder for the type that will implement this `trait`
To implement a trait, create a block with  `impl [trait name] for [struct name]`.
