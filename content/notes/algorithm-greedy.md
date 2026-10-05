---
title: "Greedy Algorithms"
date: 2025-12-10
categories: ["Algorithms"]
tags: ["algorithms", "greedy algorithms"]
---

## Greedy Algorithms

**Definition:** The greedy method decomposes an overall problem into multiple steps. In each step, it selects the optimal solution for the _current_ state until all steps are completed. The choice made in one step does not depend on or affect subsequent steps.

**Core Property:** By consistently making **locally optimal** choices, the final result is the **globally optimal** solution.

> If a problem satisfies the core property above, it can be solved using a greedy approach.

---

#### Example: The Coin Change Problem (Minimum Coins)

**Scenario:** Assume there are three types of coins: $1$ yuan, $2$ yuan, and $5$ yuan (unlimited quantity). You need to pay a total of $M$ yuan. How should you pay to use the **fewest number of coins**?

- **Local Optimal Strategy:** To ensure the coin count is minimized, always prioritize choosing the largest denomination available for the remaining amount.
- **Result:** For this specific set of coins, adopting the local optimal strategy leads to the global optimal solution.

#### Counter-Example (When Greedy Fails)

If the coin denominations are changed to **$1, 2, 4, 5, 6$** yuan, and you need to pay **$9$** yuan:

- **Greedy Approach:** Selects $6$ first, leaving $3$. Then selects $2$, leaving $1$. Finally selects $1$.
    - Result: $6 + 2 + 1$ (**3 coins**)
- **Actual Optimal Result:**
    - Result: $5 + 4$ (**2 coins**)

> **Conclusion:** Not all locally optimal choices result in a globally optimal solution.

---

#### How to Determine if Greedy is Applicable?

To use a greedy algorithm, the problem must satisfy two properties:

1. **Optimal Substructure:** A problem has optimal substructure if an optimal solution to the problem contains within it optimal solutions to sub-problems.
2. **Greedy Choice Property:** A global optimal solution can be arrived at by making a locally optimal (greedy) choice.

#### Practical Approach

1. **Experience:** Accumulate experience by solving various types of greedy problems to recognize patterns.
2. **Counter-examples:** Try to construct counter-examples to prove that a greedy strategy does _not_ work. If you cannot find a counter-example, the greedy approach might be valid.
