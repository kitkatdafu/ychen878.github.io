---
category: notes
date: 2022-12-06
keywords:
- analysis
tags:
- math
title: Some useful lemmas
---

# Completeness

## 1.1 $-\sup -A = \inf A$

Let $\alpha = \sup -A$. Then, by definition, $\alpha \ge -a, \forall a \in A$. Therefore, $-\alpha \le a, \forall a \in A$. Hence, $-\alpha$ is a lower bound of $A$. Hence, $-\alpha = - \sup -A \le \inf A$.

Let $\beta = \inf A$. Then, by definition, $\beta \le a, \forall a \in A$. Therefore, $-\beta \ge -a, \forall a \in B$. Hence, $-\beta$ is an upper bound of $-A$. Hence, $-\beta = -\inf A \ge \sup -A \Leftrightarrow \inf A \le -\sup -A$.

Hence, $-\sup -A = \inf A$.

## 1.2 $\sup cA = c \cdot \sup A$ if $c > 0$.

Let $\alpha = \sup A$. By definition, $\alpha \ge a, \forall a \in A$. Since $c > 0$, $c\alpha \ge ca, \forall a \in A$. By definition, $cA = \{ca : \forall a \in A\}$. Hence, $c\alpha \ge b, \forall b \in cA$. So $c \cdot \alpha$ is an upper bound of $cA$.

Suppose $c \cdot \alpha$ is not a least upper bound of $cA$, then there must exists an another upper bound $u$ of $cA$ such that $u < c \cdot \alpha$, so $\frac{u}{c} < \alpha$. Since $\alpha$ is a least upper bound of $A$, there must exists an $a \in A$ such that $\frac{u}{c} < a$. Hence, $u < ca$, a contradiction that $u$ is an upper bound of $cA$.

So, $\sup cA = c \cdot \sup A$ if $c > 0$.

## 1.3 $\inf cA = c \cdot \inf A$ if $c > 0$

Let $\beta = \inf A$. By definition, $\beta \le a, \forall a \in A$. Since $c > 0$, $c\beta \le ca, \forall a \in A$. By definition, $cA = \{ca : \forall a \in A\}$. Hence, $c\beta \le b, \forall b \in cA$. So $c \cdot \beta$ is an lower bound of $cA$.

Suppose $c \cdot \beta$ is not a lower bound for $cA$, then there must be another lower bound $l$ such that $l > c \cdot \beta$. So, $\frac{l}{c} < \beta$. Since $\beta$ is the greater lower bound of $A$, there must exists an element $a \in A$ such that $a < \frac{l}{c}$. Hence, $ac < l$, a contradiction that $l$ is an lower bound of $cA$.

So, $\inf cA = c \cdot A$ if $c > 0$.

## 1.4 $\inf \{f(x) + g(x) : x \in S\} \ge \inf \{f(x) : x \in S\} = \inf \{g(x) : x \in S\}$

Let $a = \inf \{f(x) : x \in S\}$ and $b = \inf \{g(x) : x \in S\}$. By definition, $a \le f(x)$ for all $x \in S$ and $b \le g(x)$ for all $x \in S$. Therefore, $a + b \le f(x_{1}) + g(x_{2})$ for all $(x_{1}, x_{2}) \in S \times S$. This means that $a + b \le f(x) + g(x), \forall x \in S$. So, $a + b$ is a lower bound of $\{f(x) + g(x) : x \in S\}$. It should be no greater than the greatest lower bound.

# Integration

## $M(cf, [t_{k-1}, t_k]) = c \cdot M(f, [t_{k-1}, t_k])$

$$\begin{align*}
M(cf, [t_{k-1}, t_k]) &= \sup \{cf(x) : x \in [t_{k-1}, t_k]\}\\\\\\
&= c \cdot \sup \{f(x) : x \in [t_{k-1}, t_k]\}, \quad \text{by Lemma 1.2},\\\\\\
&= c \cdot M(f, [t_{k-1}, t_k])
\end{align*}$$
