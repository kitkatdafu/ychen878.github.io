---
category: notes
date: 2022-10-08
tags:
- ml
title: Clustering
---

In unsupervised learning, there are no labels associated with features. Generally speaking, the ultimate goal of unsupervised learning is to find patterns and structures that help us to better understand data. Sometimes, we also use unsupervised learning to model a distribution. But we generally will not make predictions.

There are 3 types of clustering
1. Partitional (centroid, graph-theoretic, spectral)
1. Hierarchical (agglomerative, divisive)
2. Bayesian (decision-based, non-parametric)

## Partitional Clustering

### $k$-means

$k$-means is a type of partitional centroid-based clustering algorithm. The algorithm is described as follows:
1. Randomly pick $k$ cluster centers;
2. Find the closest center for each point;
3. Update cluster centers by computing centroids;
4. While not converging, jump to step 2.

### Graph-based

Let $G = (V, E)$ has vertex set $V$ and edge set $E$. Each $e \in E$ can be weighted or unweighted, and it encodes the similarity between data points. 

If each vertex represents a data point, then finding a clustering amongst these points is isomorphic to partition $V$ into $V_1$ and $V_2$ (when $k = 2$). The partition of $V$ implies that we need to split the graph. We can define an objective function to determine the best way to split the edges of a graph. Then, we can optimize the objective function in order to find the optimal partition. Consider the objective function to be $\text{Cut}(V_1, V_2) = \sum_{i \in V_1, j \in V_2} w_{ij}$, then we would like to have split $V$ so that the $\text{Cut}$ is minimized. Of course, such a greedy approach could lead to a less ideal solution: $|V_1| << |V_2| (|V_2| = |V| - 1)$. We want to balance the cardinality of $V_1$ and $V_2$. A way to balance it is to use "balanced" cut like:
$$
\text{Ratio Cut}(V_1, V_2) = \frac{\text{Cut}(V_1, V_2)}{|V_1|} + \frac{\text{Cut}(V_1, V_2)}{|V_2|},
$$
or
$$
\text{Normalized Cut}(V_1, V_2) = \frac{\text{Cut}(V_1, V_2)}{\sum_{i \in V_1} d_i} + \frac{\text{Cut}(V_1, V_2)}{\sum_{j \in V_2} d_j},
$$
where $d_i = \sum_j w_{ij}$.

#### Spectral Clustering

We start with a similarity/adjacency matrix, $A$, of a graph $G$. Let $D$ be diagonal matrix $D$ such that the i-$th$ diagonal entry is $\sum^n_{k=1} w_{ik}$. Define graph Laplacian matrix $L = D - A$. $L$ has the 2 following properties:
1. L is symmetric
2. L is positive semi-definite
The second properties implies that all eigenvalues of $L$ are non-negative. Then, compute the $k$ smallest eigenvectors and stack them as columns into a matrix $V$. Finally, we run $k$-means on the rows of $V$ to obtain the clustering result.


## Hierarchical Clustering

The basic idea of hierarchical clustering is to build hierarchy amongst the data points, i.e. to form an arrangement of these points from specific to general. The advantage of such an algorithm is that there is no need for $k$, the number of clusters. The output of this algorithm is a binary tree. There are two types of hierarchical clustering, which are described as follows:
1. Agglomerative clustering: A buttom-up approach, which initially treats each data point as its own singleton cluster and progressively merge clusters.
2. Divisive: A top-down approach, which initially treats all points as in a single cluster and progressively split clusters.

### Agglomerative Clustering

1. Every point is in its own cluster;
2. For all pair of clusters, select the closest pair and merge them;
3. Repeat step 2 until there is only 1 cluster left.

In step 2, we need to calculate the distance between all pairs of clusters in order to select the closest one to merge. There are 3 ways to define the distance between two clusters $A$ and $B$:
1. single-linkage: $d(A, B) = \min_{x_1 \in A, x_2 \in B} d(x_1, x_2)$;
2. complete-linkage: $d(A, B) = \max_{x_1 \in A, x_2 \in B} d(x_1, x_2)$;
3. average-linkage: $d(A, B) = \frac{1}{|A| |B|}\sum_{x_1 \in A, x_2 \in B} d(x_1 , x_2)$.
