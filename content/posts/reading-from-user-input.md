---
title: Reading from user input
date: 2021-01-19
draft: false
category: notes
tags:
  - Rust
keywords:
  - user inputs
---
Notes on [Rust in Action](https://www.manning.com/books/rust-in-action?query=rust%20in%20action), by Tim McNamara
## Command line tooling
A 3rd party crate called `clap` is better at handling command line arguments.
[GitHub - clap-rs/clap: A full featured, fast Command Line Argument Parser for Rust](https://github.com/clap-rs/clap)
```rust
use clap::{App, Arg};
fn main() {
    let args = App::new("grep-lite")
        .version("0.1")
        .about("serach for patterns")
        .arg(
            Arg::with_name("pattern")
                .help("The pattern to search for")
                .takes_value(true)
                .required(true),
        )
        .arg(
            Arg::with_name("input")
                .help("File to search")
                .takes_value(true)
                .required(true),
        )
        .get_matches();

	  let pattern = args.value_of("pattern").unwrap();
	  let input = args.value_of("input").unwrap();
}
```

## Reading file
Need to use to open the file first with `File::open()` and pass the untapped return value to  `BufReader::new()`.
```rust
use std::fs::File;
use std::io::prelude::*;
use std::io::BufReader;

fn main() {
    let f = File::open(input).unwrap();
    let reader = BufReader::new(f);
    for line_ in reader.lines() {
        let line = line_.unwrap();
    }
}
```
`reader.lines()` provide a iterator to read lines from the buffered file.

## STDIN
```rust
let stdin = io::stdin();
let reader = stdin.lock();
```

