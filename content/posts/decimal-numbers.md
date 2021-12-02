---
title: Decimal Numbers
date: 2021-01-24
draft: false
tags:
  - Rust
category: notes
keywords:
  - floating-point
  - numbers
---
Notes on [Rust in Action](https://www.manning.com/books/rust-in-action?query=rust%20in%20action), by Tim McNamara

## Scientific Notation
\\[3.14 \times 10 ^ 8 \\]
1. ::Sign:: representing positive or negative
2. ::Mantissa::  3.14
3. ::Radix::  10
4. ::Exponent:: 8

## Floating Point
Computers use scientific notation in memory to represent floating point numbers. A floating number in memory is constitutive of 3 parts
1. ::Sign::
2. ::Mantissa::
3. ::Exponent::
The ::radix:: is predefined to be 2 and therefore does not need to be stored.
The ::sign::, self-evidently, requires only 1 bit.

## IEEE 754 Binary32
The leftmost bit, or $b_{31}$ is called the sign bit; the next eight bits are the exponent bits ($b_{23} - b_{30}$); and the last  23 bits are fraction bits ($b_0 -  b_{22}$).
\\[v = (-1)^\text{sign} \times 2^{(exp - 127)} \times (1 + \sum_{i=1}^{23} b_{23-i} 2^{-i})\\]
When ::sign = 1:: , the number is negative.

## Get the Sign
To retrieve the sign bit of a `f32` in rust, one first needs to use `u32` to represent the bits of the floating number. This process is unsafe and should be placed inside the `unsafe` block. The function that reinterprets the bits is called `transmute`.

```rust
let n: u32 = unsafe { std::mem::transmute(7.7_f32) };
```
Then, use the bit-wise move operator to move the the bits of `n` 31 bits to the left. 
```rust
let sign_bit = n >> 31;
```
The left bits will be filled with 0. Since 1 represents negative and 0 represents positive, we would use the exponential function to get the sign (-1 or 1).
```rust
let sign = (-1_f32).powf(sign_bit as f_32);
```

## Get the Exponent
Before doing anything, the 8 exponent bits from the floating number has to be retrieved. To achieve this, we move bitwise shift the bits to the left for 23 bits. This way, we have 9 bits left. The leftmost bit is the sign bit and the rest are the exponent bits.
The `&` operator, or bitwise-and operator, allows us to retrieve the bits we want. To get the 8 bits we are interested in, simply `&` the number with 0xFF. Since 0xFF only has 8 1-bits on the position we are interested in,  the non-relevant sign-bit has therefore been filtered out. We call the number we got from this step $n$.
Finally, according to IEEE 754, a bias, 127, should be subtracted from the decimal number represented by the 8-bits we got. Then the exponent is going to be $2^{n}$.

### Special cases
1. If $n$ is 0xFF,  then the decimal number could be positive infinity, negative infinity (mantissa is 0), or Not a Number (mantissa is anything but 0). These type of numbers are generated from invalid mathematical operations. And comparisons between these number usually do not provide ideal results.
2. If $n$ is 0x00, then the decimal number is a subnormal number. The implicit 24th bit of mantissa is set to be 0.

## Get the Mantissa
Although there are only 23 bits in  `f32`  left for  mantissa.  There is an implicit bit that is always 1, which represents the value 1.0, or $2^0$. Then, the $i^{th}$ value, ranging from 22 to 0, represents number $2^{i-23}$, if that bit is set to 1, otherwise 0. The sum of all these number, including the 1.0 of the implicit bit, is the mantissa.

We could use the bitwise and operator and the bitwise shift operator in a loop to retrieve the bit value at bit $i$.
```rust
fn main() {
    let n: u32 = unsafe { std::mem::transmute(0.1_f32) };
    let mut mantissa = 0.15625;
    let base = 2_f32;
    let mut ad = 1;
    for i in 0..23 {
		let bit = n & ad;
		if bit == 0 {
	    	continue;
		}
		mantissa += base.powf((i-23) as f32);
		ad = ad << 1;
    }
    println!("{}", mantissa);
}

```
