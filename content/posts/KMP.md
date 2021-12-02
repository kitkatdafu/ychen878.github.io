---
title: Knuth-Morris-Pratt Algorithm
date: 2021-01-22
draft: true
tags:
  - Algorithm
keywords:
  - KMP
  - String
  - Pattern Matching
category: notes
---
Paper: [Fast Pattern Matching in Strings](https://doi.org/10.1137/0206024), by Donald E. Knuth, James H. Morris, Jr., and Vaughan R. Pratt.
## Substring problem
A substring, $s$, of a string, $a$, is a continuous chuck of characters of $a$.
Knuth-Morris-Pratt (KMP) algorithm can find if $a$ contains $s$ and returns the left-most index of the first character of the substring in $a$.
## Naive, Brutal-force approach
The naive approach is straightforward
```rust
fn contains(str_a: &String, str_s: &String) -> Option<usize> {
	if str_a.len() < str_s.len() {
		return None;
	}
    if str_s.len() == 0 {
		return Some(0);
    }
	for (i, _) in str_a.chars().enumerate() {
		let mut str_a_iter = str_a.chars().skip(i);
		let mut matched = true;
		for ch_s in str_s.chars() {
			if let Some(ch) = str_a_iter.next() {
				if ch == ch_s {
					continue;
				}
			}
			matched = false;
			break;
		}
		if matched {
			return Some(i);
		}
	}
	None
}
```
However, the time compleixity is $O(NM)$, where $N$ is the length of $a$ and $M$ is the length of $M$.
The case where $a = \text{aaaaaaaaaab}$ and $b = \text{aaaab}$ is one of the worst cases that the naive appraoch could face.

## Precompute `next` table

