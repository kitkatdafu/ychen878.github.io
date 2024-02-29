# Matrix norms

Given a matrix $X \in \mathbb{R}^{m \times n}$, $\sigma_{i}(X)$ denotes the $i$-th largest singular value of $X$ and is equal to the square root of the $i$-th largest eigenvalue of $XX'$. The rank of $X$, denoted as $\mathrm{rank}(X) = r$ is the number of non-zero singular values.

## Inner Product

Given $X, Y \in \mathbb{R}^{m \times n}$, the inner product between $X$ and $Y$, denoted by $\langle X, Y\rangle$, is defined as
$$
\langle X, Y \rangle := \mathrm{Tr}(X'Y) = \sum_{i=1}^m \sum_{j=1}^n X_{ij}Y_{ij} = \mathrm{Tr}(Y'X).
$$

## Frobenius Norm

The norm associated with the inner product is called Frobenius norm:
$$
\norm{X}_{F} := \sqrt{ \langle X, X \rangle } = \sqrt{ \mathrm{Tr}(X'X) } = \sqrt{  \sum_{i=1}^m \sum_{j=1}^n X^2_{ij} }.
$$
The Frobenius norm of a matrix $X$ is also equal to the square root of the sum of the squares of the singular values of $X$:
$$
\begin{align}
\norm{X}_{F} &= \sqrt{ \mathrm{Tr}(X'X) } \\
&= \sqrt{ Tr(UDV'VD'U) }  \\
&= \sqrt{ \mathrm{Tr}(UDD'U') }  \\
&= \sqrt{ \mathrm{Tr}(DD'U'U) }  \\
&= \norm{D}_{F} \\
&= \sqrt{ \sum_{i=1}^r \sum_{j=1}^r D_{ij}^2} \\
&= \sqrt{ \sum_{i=1}^r \sigma_{i}(X)^2}.
\end{align}
$$

## Operator Norm, Induced 2-norm, Spectral Norm

The operator norm of a matrix is the largest singular value
$$
\norm{X} := \sigma_{1}(X).
$$

## Nuclear Norm

The nuclear norm of a matrix is the sum of its singular values:
$$
\norm{X}_{*} := \sum_{i=1}^r \sigma_{i}(X).
$$

# Dual Norms

For any given norm $\norm{}_{?}$ in an inner product space, there exists a dual norm $\norm{}_{d}$ defined as
$$
\norm{X}_{d} := \sup \{ \mathrm{Tr}(X'Y) : \norm{Y} \leq 1 \}.
$$
Moreover, the dual norm of the operator norm/induced 2-norm/spectral norm is the nuclear norm. That is,
$$
\norm{X}_{*} = \sup \{ \mathrm{Tr}(X'Y) : \norm{Y} \leq 1\}.
$$
### Proof

We first use the fact that given a matrix $X \in \mathbb{R}^{m \times n}$ and $t > 0$,
$$
\norm{X} \leq t \iff t^2I_{m} - XX' \succeq 0.
$$
This is because
$$
\norm{X}^2 \leq t^2 \iff \sigma_{1}(X)^2 = \lambda_{1}(XX') \leq t^2 \iff 0 \leq \lambda_{i}(XX') \leq t^2 \iff t^2I_{m} - XX' \succeq 0.
$$
Using Schur's complement,
$$
\norm{X} \leq t \iff t^2I_{m} - XX' \succeq 0 \iff \begin{bmatrix}
tI_{m} & X \\
X' & tI_{n}
\end{bmatrix} \succeq 0.
$$
This mean that we find the value of $\norm{X}$ via optimization (SDP):
$$
\norm{X} = \inf \{ t : \begin{bmatrix}
tI_{m} & X \\
X' & tI_{n} 
\end{bmatrix} \succeq 0 \}.
$$
We can rewrite the definition of dual norm
$$
\norm{X}_{d} := \sup \{ \mathrm{Tr}(X'Y) : \norm{Y} \leq 1\}
$$
as
$$
\begin{align}
\norm{X}_{d} := \sup_{Y} &\quad \mathrm{Tr}(X'Y) \\
\mathrm{s.t.} &\quad \norm{Y} \leq 1.
\end{align}
$$
Now, let $X = UDV'$ be the singular value decomposition of  $X$ whose rank is $r$. By definition
$$
U \in \mathbb{R}^{m \times r}, D \in \mathbb{R}^{r \times r}, V \in \mathbb{R}^{n \times r}.
$$
Let $Y := UV'$. Then, 
$$
\norm{Y} = \norm{UV'} = \norm{U I_{r} V'} = 1
$$
and
$$
\mathrm{Tr}(XY') = \mathrm{Tr}(UDV'VU') = \mathrm{Tr}(UDU') = \mathrm{Tr}(D) = \norm{X}_{*}.
$$
This means that $Y := UV'$ is feasible for the optimization model above. If $Y := UV'$ is the optimal solution, then $\norm{X}_{d} = \norm{X}_{*}$. If $Y := UV'$ is not the optimal solution, then there exist other $Y$ such that $\mathrm{Tr}(X'Y) > \norm{X}_{*}$. Hence,
$$
\norm{X}_d \geq \norm{X}_{*}.
$$
We now need to show that
$$
\norm{X}_{d} \leq \norm{X}_{*}.
$$
We first re-write the definition of dual form into a semi-definite program:
$$
\begin{align}
\norm{X}_{d} := \sup_{Y} &\quad \mathrm{Tr}(X'Y) \\
\mathrm{s.t.} &\quad \begin{bmatrix}
I_{m} & X \\
X' & I_{n}
\end{bmatrix} \succeq 0.
\end{align}
$$
The following program is the dual of the semi-definite program above:
$$
\begin{align}
\inf_{W_{1}, W_{2}} &\quad\frac{1}{2} (\mathrm{Tr}(W_{1}) + \mathrm{Tr}(W_{2})) \\ \\
\mathrm{s.t.} &\quad \begin{bmatrix}
W_{1} & X \\
X' & W_{2}
\end{bmatrix} \succeq 0.
\end{align}
$$
If $W_{1} := UDU'$ and $W_{2} := VDV'$. Then,  $(W_{1}, W_{2})$ is feasible for the dual, since
$$
\begin{bmatrix}
W_{1} & X \\
X' & W_{2}
\end{bmatrix} = \begin{bmatrix}
U \\
V
\end{bmatrix} D \begin{bmatrix}
U \\
V
\end{bmatrix}' \succeq 0.
$$
Moreover,
$$
\mathrm{Tr}(W_{1}) = \mathrm{Tr}(W_{2}) = \mathrm{Tr}(D).
$$
Thus, the objective is
$$
\frac{1}{2}(\mathrm{Tr}(D) + \mathrm{Tr}(D)) = \mathrm{Tr}(D) = \norm{X}_{*}.
$$
Weather or not $(X, W_{1}, X_{2})$ is the optimal solution, we showed that
$$
\norm{X}_{*} \geq \norm{X}_{d}.
$$
Hence,
$$
\norm{X}_{*} = \norm{X}_{d}.
$$
This result shows that we can compute the nuclear norm via SDP.

# References

```
Recht, Benjamin, Maryam Fazel, and Pablo A. Parrilo. "Guaranteed minimum-rank solutions of linear matrix equations via nuclear norm minimization." _SIAM review_ 52.3 (2010): 471-501.
```