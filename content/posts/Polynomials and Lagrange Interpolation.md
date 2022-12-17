A special class of models is polynomial:
$$
h_\theta(x) = \theta_d x^d + \theta_{d - 1}x^{d - 1}  + \cdots + \theta_1x + \theta_0.
$$
Fitting a polynomial: Lagrange interpolation produces a **perfect fit**, i.e.
$$
\begin{align*}
L(x) &= \sum^n_{i=1} y_i \ell_i(x) \\
\ell_i &= \prod_{0 \le m \le n, m \ne i} \frac{x - x_m}{x_i - x_m} \\
L(x_i) &= y_i, \forall i \in [n].
\end{align*}
$$
The advantage of Lagrange interpolation is that no training is required. All we need to do is to write down the $L$.