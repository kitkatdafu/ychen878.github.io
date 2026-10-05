---
title: "Dynamic Programming — Part I"
date: 2026-09-27
categories: ["Algorithms"]
tags: ["algorithms", "dynamic programming"]
---

## Dynamic Programming — Lecture Notes

### 1. What Is Dynamic Programming?

- **Dynamic programming (DP)** is an algorithmic paradigm for solving problems that have **overlapping subproblems** and **optimal substructure**.
- **Overlapping subproblems:** the subproblems are smaller versions of the original problem.
- **Optimal substructure:** the optimal solution to a larger problem contains the optimal solutions to its smaller problems, so the larger problem can be derived from the smaller ones.

---

### 2. Example: Climbing Stairs

> A staircase has $n$ steps. Each move, you can climb **1 or 2** steps. How many distinct ways are there to reach the top?

- **Original problem:** the number of ways to climb $n$ steps.
- **Subproblems:** the number of ways to climb $n-1$ steps, $n-2$ steps, $n-3$ steps, …
- **Optimal substructure:** can the optimal solutions of the subproblems yield the optimal solution of the original problem?
    - To reach step $n$, you must arrive either from step $n-1$ (one step) or from step $n-2$ (one move of two steps). Therefore:

$$
\operatorname{ways}(n) = \operatorname{ways}(n-1) + \operatorname{ways}(n-2)
$$

- **No aftereffect (Markov property):** "the future is independent of the past." We only need to consider how to get to step $n$ _now_; we don't care _how_ we previously reached step $n-1$ or $n-2$ — we just use their computed results. The optimal substructure satisfies the no-aftereffect property.

#### Variations (exercises)

1. A staircase has $n$ steps; each move you can climb **1, 2, or 4** steps. How many distinct ways are there?
2. A staircase has $n$ steps; each move you can climb **1 or $k$** steps. How many distinct ways are there?
3. A staircase has $n$ steps; each move you can climb **1, 2, …, $k$** steps. How many distinct ways are there?

---

### 3. Steps for DP Analysis

1. **Decompose into subproblems:** break the original problem into subproblems and find the relationships between them.
2. **Define the state:** a "state" refers to a distinct subproblem. E.g., earlier, $dp[x]$ denoted the number of ways to climb $x$ steps, so $x$ is the state. Defining the state means determining how many dimensions of known variables the problem needs. Typically it takes a form like "the max value / min value / number of ways for the first $n$ items when xxx equals $m$."
3. **State transition equation:** how states (subproblems) transition between each other — i.e., which states a given state is derived from, or which states it can transition to.
4. **Implementation:** compute the final state (the answer) using iteration (bottom-up loops), memoized search (top-down recursion), etc.

---

### 4. Longest Increasing Subsequence (LIS)

#### Problem

- Given a list of length $n$, find its longest increasing subsequence.
- **Subsequence:** a new sequence formed by deleting some elements of the original sequence without changing the relative order of the remaining elements.
- **Example:** in `[1, 3, 4, 2, 5, 3, 7, 2]`, `[1, 4, 2, 7]` is a subsequence; the longest increasing subsequence is `[1, 3, 4, 5, 7]`.

#### What should the state be?

1. **Option 1:** the LIS of the first $i$ numbers?
    - This state does **not** support a state transition, because we don't know what the actual subsequence is (in particular, what its last element is).
2. **Option 2:** the LIS **ending at the $i$-th number**. ✅

#### Transition

$$
dp[i] = 1 + \max_{\substack{0 \le j < i \\ a[j] < a[i]}} dp[j]
$$

(with $dp[i] = 1$ if no such $j$ exists). The final answer is $\max_i dp[i]$.

#### Worked example

|a|1|3|4|2|5|3|7|2|
|---|---|---|---|---|---|---|---|---|
|dp|1|2|3|2|4|3|5|2|

Maximum $dp$ value is 5 → LIS length 5 (`[1, 3, 4, 5, 7]`).

---

### 5. Longest Common Subsequence (LCS)

#### Problem

- Given an array $a$ of length $N$ and an array $b$ of length $M$, find their longest common subsequence.
- **Common subsequence:** a subsequence contained in both $a$ and $b$.

#### Formulation

- **State:** $dp[i][j]$ = length of the LCS of the first $i$ elements of $a$ and the first $j$ elements of $b$.
- **Boundary:** $dp[0][0] = dp[\cdot][0] = dp[0][\cdot] = 0$
- **State transition equation:**

$$
dp[i][j] =
\begin{cases}
dp[i-1][j-1] + 1, & a_i = b_j, \\[4pt]
\max\left(dp[i-1][j],\ dp[i][j-1]\right), & \text{otherwise}.
\end{cases}
$$

#### Worked example

- `a = [1, 3, 4, 2, 5]`
- `b = [1, 4, 3, 5, 2]`

DP table (rows = prefix length $i$ of $a$, columns = prefix length $j$ of $b$):

|dp|j=1|j=2|j=3|j=4|j=5|
|---|---|---|---|---|---|
|i=1|**1**|**1**|1|1|1|
|i=2|1|1|**2**|**2**|2|
|i=3|1|2|2|**2**|2|
|i=4|1|2|2|2|**3**|
|i=5|1|2|2|3|**3**|

(Bold cells mark the backtracking path.)

#### Recovering the actual subsequence

Start from $(n, m)$ and walk backward:

- If moving **up** or **left** keeps the $dp$ value unchanged, move in that direction.
- Otherwise, move **diagonally up-left** and record that element as part of the subsequence.

For the example above, backtracking yields the LCS **`[1, 3, 2]`** (length 3).
