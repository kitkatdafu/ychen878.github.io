---
title: Mixture Model of Gaussian Copulas
date: 2022-02-23
category: notes
tags:
    - ML
keywords:
    - Clustering
---
# Notes on Mixture Model of Gaussian Copulas
Marbac, Matthieu, Christophe Biernacki, and Vincent Vandewalle. "Model-based clustering of Gaussian copulas for mixed data." _Communications in Statistics-Theory and Methods_ 46.23 (2017): 11635-11656.
## Notation
$J_n := \{1, 2, 3, \dots, n\}$
$\mathcal{N}_e(0, \Gamma) :=$ An $e\text{-variate}$ Gaussian distribution centered at 0 with a correlation/covariance matrix $\Gamma$.
## Description of the data point
Let $x \in \mathbb{R}^C \times \mathcal{X}$ be an observation or a data point in the data set. Alternatively, we could consider an observation as a tuple of two sorts, i.e.
$$
x = (x^C, x^D)
$$
where $x^C \in \mathbb{R}^C$ and $x^D \in \mathcal{X}$.  The first element of this component, $x^C$, is a vector consists of $C$ continuous variables and the second element, $x^D$, is a vector where each element is a discrete variable defied on the space $\mathcal{X}$. Here, discrete variables can be integer, ordinal, or binary. Let $e = C + D$ be the total number of elements of $x$.
Let $x^j$ denote the $j\text{th}$ element in $x$. If $x^j$ is of type ordinal with $m_j$ levels, then it uses numeric coding $\{1, \dots, m_j\}$. 
## Finite Mixture Model
Let $M(\theta)$ be a finite mixture model with $g$ components, where $\theta = (\pi, \alpha)$ parametrizes the model and $g$ is a hyperparameter. The $j\text{th}$ element of $\pi$ and $\alpha$, namely, $\pi_j$ and $\alpha_j$, are the parameters for the $j\text{th}$ component of the $g$  components in the model.

An observation $x$ is assumed to be from $M(\theta)$ with the following probability distribution function (pdf)
$$
p(x | \theta) = \sum^g_{k=1} \pi_k p(x | \alpha_k).
$$
## Component Modeled by a Gaussian Copula
Each of the $g$ component described in the previous section follows a Gaussian copula. From the pdf of the model, we can see that the pdf for the $k\text{th}$ component is
$$
p(x | \alpha_k)
$$
and $\alpha_k = (\Gamma_k, \beta_k)$ is the parameter for this component, i.e. for this Gaussian copula. $\Gamma_k$ is the correlation matrix of size $e \times e$. and  $\beta_k = (\beta_{k1}, \dots, \beta_{ke})$ are the parameters for each univariate marginal distribution of this component (Gaussian copula). With $\alpha_k$, we can write the cumulative distribution function (cdf) of component $k$ as
$$
P(x | \alpha_k) = \Phi_e(\Phi^{-1}_1(u^1_k), \dots, \Phi^{-1}_1(u^e_k) | 0, \Gamma_k)
$$
where $u^j_k = P(x^j | \beta_{kj})$ is the value of the cdf of the univariate marginal distribution of variable $j$ (the $j\text{th}$ feature) for component $k$ evaluated at $x^j$. $\Phi_e(\cdot | 0, \Gamma_k)$ is a $e\text{-variate}$ Gaussian distribution centered at the original with correlation matrix $\Gamma_k$. $\Phi^{-1}_1(\cdot)$ is the inverse cdf of the standard univariate Gaussian $\mathcal{N}(0, 1)$.
### Sampling
Suppose we want to draw a sample $x$ from the model $M(\theta)$, we first need to decide from which the to-be-drawn sample $x$ should come. Let $z \sim M_g(\pi_1, \dots, \pi_g)$  be the first latent variable that indicates the origin component of $x$. We use a multinomial distribution with parameters $\pi_j, \forall j \in J_g$ because these values naturally signifies the importance or the weight of each component. The target space of $z$ is equivalent to $J_g$.
Second, with $z$ determined, we have the component determined. Observe the distribution (cdf) of the component given $z=k$,
$$
P(x | \alpha_{k=z}) = \Phi_e(\Phi^{-1}_1(u^1_{k=z}), \dots, \Phi^{-1}_1(u^e_{k=z}) | 0, \Gamma_{k=z})
$$
$$
P(x | \alpha_{k=z}) = \Phi_e(\Phi^{-1}_1(P(x^1 | \beta_{(k=z)1})), \dots, \Phi^{-1}_1(P(x^e|\beta_{(k=z)e})) | 0, \Gamma_k).
$$

Each element of $y$ depends on the value of $x$. Since we want to sample $x$, we can drawn a value $y$ from $\mathcal{N}_e(0, \Gamma_{k=z})$ and then "reverse engineer" $x$. Formally speaking, the value of $y$ depends on the value of the latent variable $z$. Hence, we have:
$$
y | z=k \sim \mathcal{N}_e(0, \Gamma_k)
$$
From the cdf of the Gaussian copula, we know that $y_j$, the $j\text{th}$ element of $y$, is equivalent to $\Phi^{-1}_1(P(x^j | \beta_{(kj}))$. If we consider $y_j$ as a function of $x^j$, i.e.
$$
f(x^j) = \Phi^{-1}_1(P(x^j | \beta_{(kj)})),
$$
then we can reverse engineer $x^j$ by finding the inverse of $f$, which is
$$
\begin{align*}
f(x^j) &= \Phi^{-1}_1(P(x^j | \beta_{(kj)})) \\
\Phi_1(f(x^j)) &= \Phi(\Phi^{-1}_1(P(x^j | \beta_{(kj)}))) \\
\Phi_1(f(x^j)) &= P(x^j | \beta_{(kj)}) \\
P^{-1}(\Phi_1(f(x^j)) \beta_{kj}) &= P^{-1}(P(x^j | \beta_{(kj)}) | \beta_{kj}) \\
P^{-1}(\Phi_1(f(x^j)) | \beta_{kj}) &= x^j.
\end{align*}
$$
Hence,
$$
x^j = P^{-1}(\Phi_1(f(x^j)) | \beta_{kj}), \forall j \in J_e.
$$n
