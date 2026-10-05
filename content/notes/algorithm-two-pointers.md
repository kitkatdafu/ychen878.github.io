---
title: "Two Pointers"
date: 2026-05-01
categories: ["Algorithms"]
tags: ["algorithms", "arrays", "two pointers", "sliding window"]
---

Two pointers are useful when performing operations on a range: two indices traverse the data simultaneously and exploit the range's structure. The technique can often reduce $\mathcal{O}(n^2)$ time complexity to $\mathcal{O}(n)$.

## Opposite-Direction Scan

The `left` pointer starts at the beginning and continuously moves to the right, while the `right` pointer starts at the end and continuously moves to the left, until they meet and stop. This is generally used for problems involving sorted arrays or strings.

## Same-Direction Scan

Also known as the sliding-window technique, this approach maintains an interval $[\mathrm{left}, \mathrm{right}]$. It tracks information about that interval, such as its sum or the count of each element.

- Moving the left endpoint to the right represents removing an element.
- Moving the right endpoint to the right represents adding an element.

It stops when it reaches the end, or when a specific condition is met.
