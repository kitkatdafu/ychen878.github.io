---
title: k-means in python
date: 2021-10-19
category: notes
tags:
    - ML
keywords:
    - Clustering
    - K-means
---

# K-means
There are two major steps in the K-means algorithm. The first one is to calculate the representatives (centroids) of a given partition. The second one is to find the partition based on the representatives.


## Inputs
Suppose we have a dataset looks like this:
```python
dataset = np.array([[5, 6],
                    [6, 5],
                    [0, 1],
                    [1, 0],
                    [3, 3]])
```
Each row in this dataset matrix is an observation and each column in this matrix represents a feature. So, in this example, we have 5 points from a plane.
And we define partition in the following way:
```python
partition = [[0, 3, 4], [1, 2]]
```
Observe that `partition` has a length of 2, which implies that the $k$ for the K-means algorithm is 2. Each list in `partition` represents a cluster. Elements within each list is the corresponding index of that observation in the dataset. So, with respect to this `partition`, the first cluster has 3 elements, namely `[5, 6], [1, 0], [3, 3]`, and the second cluster contains `[6, 5]` and `[0, 1]`.

## Finding the centroids
To calculate the centroids, we need information about the dataset and about the partition. The centroid for a cluster $C$ is the average of all observations in the cluster, namely
$$ \mu = \frac{1}{|C|}\sum_{i \in C} x_i $$,
where $x_i$ is the $i^\text{th}$ observation in the dataset.

All we need to do is to calculate the mean (using `np.mean()` with `axis` set to 0) for each partition.
```python
def find_centroids(dataset: np.ndarray, partition: list) -> np.ndarray:
    """
    find the centroids of the given partition
    """
    u = []
    for indices in partition:
        if len(indices) == 0:
            u.append(np.zeros((dataset.shape[1], )))
        else:
            u.append(np.mean(dataset[indices], axis=0))
    return np.array(u)
```
Each centroid is stored in the list $u$ (which is returned as an numpy array). Note that the length of $u$ should be equivalent to $k$.

## Finding the partition
With the centroids calculated, we need to re-partition the dataset based on these (newly calculated) centroids. This process is observation-wise, which means for each observation in the dataset, we need to compare it to each of the centroids, which represent clusters in a one-to-one manner, and find to which centroid the observation is close. The observation will be assigned to the cluster that represented by the centroid.

We could use the Euclidean distance, i.e. `np.linalg.norm()`, to find the distance between an obervation to all centroids at the same time. Then, use the `np.argmin()` function to select the index of the least distance. This index will be the cluster index for this observation.
```python
def new_partition(dataset: np.ndarray, u: np.ndarray) -> list:
    """
    find the new partition beased on u
    """
    partition = [[] for _ in range(u.shape[0])]
    for i, point in enumerate(dataset):
        argmin = np.argmin(np.linalg.norm(point - u, axis=1))
        partition[argmin].append(i)
    return partition
```
## Putting everything together
K-means is an iterative algorithm. All we need to do is to put the first step and the second step in a for loop. Here, we hard code the epoch number to 3. And we hard code the initial partition. One, instead, can randomize the initial partition and run the algorithm to see which convergence has the best result. And one can check whether the loss of a new partition is improved significantly or not to determine if the algorithm should halt or not.
```python
def kmeans(dataset: np.ndarray, partition: list):
    """
    K-means algorithm, k can be inferred from the shape of partition
    """
    epoch = 0
    losses = {"epoch": [], "loss": []}

    while epoch < 3:
        epoch += 1

        u = find_centroids(dataset, partition)
        partition = new_partition(dataset, u)
    
    print("\n\nFinal Centroids:")
    print(u)
    print("Final Partition:")
    for i, indices in enumerate(partition):
        print("\tcluster #{}:".format(i + 1), {tuple(dataset[index])
                                               for index in indices})
```
