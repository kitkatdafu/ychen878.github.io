---
title: "LP Duality"
date: 2023-02-28
tags: ["optimization"]
---

# Estimating LP bounds

Given an optimization problem
$$
\begin{align}
\max_{f, s} &\quad 12f + 9s \\
\st &\quad 4f + 2s \leq 4800 \\
&\quad f + s \leq 1750 \\
&\quad 0 \leq f \leq 1000 \\
&\quad 0 \leq s \leq 1500 \\
\end{align}
$$
Suppose the maximum profit is $p^\star$. How can we bound $p^\star$? The lower bound of $p^\star$ can be found by picking any feasible point (since maximization). For example,
$\{f=0, s=0\}$ is feasible. Therefore, $p^\star \geq 12f + 9s = 0$. Since any feasible point yields a lower bound of $p^\star$ and $p^\star$ itself is yielded by an feasible point, then finding the largest lower bound of $p^\star$ is equivalent to solving the LP.

The upper bound of $p^\star$ can be found using the constraints. For example, since $f$ and $s$ need to be less than $1000$ and $1500$ respectively, $p^\star \leq 12 \cdot 1000 + 9 \cdot 1500 = 25500$. We can include more constraints and have $p^\star \leq f + (4f + 2s) + 7(f + s) \leq 1000 + 4800 + 7 \cdot 1750 = 18050$. There are many different ways to combine these constraints to yield an upper bound of $p^\star$. We need to find the best way of combining these constraints so that it yields the best upper bound. To achieve this goal, we can choose 4 multipliers $\lambda_{1}, \lambda_{2}, \lambda_{3}, \lambda_{4} \geq 0$  to be the multipliers of our 4 constraints. We want the 4 multipliers to satisfy the following inequality, for any feasible $f$ and $s$,
$$
12f + 9s \leq \lambda_{1}(4f + 2s) + \lambda_{2}(f + s) + \lambda_{3}f + \lambda_{4}s.
$$
Note that we can rearrange this inequality and obtain
$$
0 \leq (4\lambda_{1} + \lambda_{2} + \lambda_{3} - 12)f + (2\lambda_{1} + \lambda_{2} + \lambda_{4} - 9)s.
$$
Since the original problem is an LP, $f$ and $s$ have to be non-negative. Hence, to satisfy the inequality above, all we need to have is to satisfy
$$
4\lambda_{1} + \lambda_{2} + \lambda_{3} - 12 \geq 0
$$
and
$$
2\lambda_{1} + \lambda_{2} + \lambda_{4} - 9 \geq 0.
$$
The $\lambda$'s that satisfy the constraints above yield an upper bound of $p^\star$
$$
p^\star \leq 4800 \lambda_{1} + 1750 \lambda_{2} + 1000 \lambda_{3} + 1500 \lambda_{4}.
$$
Finding the smallest upper bound would be yet another LP, i.e.
$$
\begin{align}
\min_{\lambda_{1}, \lambda_{2}, \lambda_{3}, \lambda_{4}} &\quad 4800 \lambda_{1} + 1750 \lambda_{2} + 1000 \lambda_{3} + 1500 \lambda_{4}. \\
\st &\quad 4f + 2s \leq 4800 \\
&\quad 4\lambda_{1} + \lambda_{2} + \lambda_{3} - 12 \geq 0 \\
&\quad 2\lambda_{1} + \lambda_{2} + \lambda_{4} - 9 \geq 0 \\
&\quad \lambda_{1}, \lambda_{2}, \lambda_{3}, \lambda_{4} \geq 0 \\
\end{align}.
$$

# Primal and Dual

The first maximization problem is called the primal problem. The second minimization problem is called the dual problem. The $\lambda$'s in the dual problem are called the dual variable, and there is a dual variable corresponding to each constraint in the primal problem. Similarly, each constraint in the dual problem corresponds to a primal variable as well. Let $p^\star$ and $d^\star$ denote the optimal for the primal and the dual respectively. Then, they should satisfy the following inequality
$$
(\text{any feasible primal point}) \leq p^\star \leq d^\star \leq (\text{any feasible dual point}).
$$
In general, a primal problem $(P)$ is stated as
$$
\begin{align}
\max_{x} &\quad c^Tx \\
\st &\quad Ax \leq b \\
&\quad x \geq 0
\end{align}
$$
and a dual problem $(D)$ is stated as
$$
\begin{align}
\min &\quad b^T\lambda \\
\st &\quad A^T\lambda \geq c \\
&\quad \lambda \geq 0
\end{align}.
$$
If $x$ and $\lambda$ are feasible points of $(P)$ and $(D)$, then
$$
c^Tx \leq p^\star \leq d^\star \leq b^T\lambda.
$$
If $p^\star$ and $d^\star$ exist and are finite, then $p^\star = d^\star$. This property is known as strong duality.

# Properties of LP Duality

1. $(P)$ and $(D)$ are both feasible and bounded, and $p^\star = d^\star$
2. $(P)$ is unbounded and $(D)$ is infeasible, $p^\star = \infty$ and $d^\star = \infty$
3. $(P)$ is infeasible and $(D)$ is unbounded, $p^\star = -\infty$ and $d^\star = -\infty$
4. $(P)$ is infeasible and $(D)$ is infeasible, $p^\star = -\infty$ and $d^\star = \infty$
5. The dual of the dual is the primal

# Duality and Sensitivity

Duality is related to the idea of sensitivity: how much each of your constraints affect the optimal cost.

# Complementary Slackness

At the optimal point, some inequality constraints become tight. Some inequality constraints may remain loose, even at optimality. These constraints have slack. Either a primal constraint is tight or its dual variable is zero. Either a dual constraint is tight or its primal variable is zero. These properties are called complementary slackness. We can use complementary slackness to check if a proposed point is optimal or not.