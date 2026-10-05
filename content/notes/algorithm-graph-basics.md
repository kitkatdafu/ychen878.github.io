---
title: "Graph Basics"
date: 2026-08-09
categories: ["Algorithms"]
tags: ["algorithms", "data structures", "graphs"]
---

## 1. What Is a Graph?

### Concept: From Trees to Graphs

- A **graph** can be understood as an extension and generalization of the tree structure. In fact, a tree is just a special kind of graph.
- A graph consists of a set of **vertices** and a set of **edges**. Each edge connects a pair of vertices in the graph.
- Graphs can model more complex real-world relationships, and are no longer restricted to the hierarchical relationships of a tree.

### Applications of Graphs

- **Social networks**: individuals or organizations are vertices; the social connections between them are edges.
- **Maps and navigation**: key locations (intersections, landmarks) are vertices; roads are edges.
- **Computer networks**: computers or routers are vertices; network connections are edges.

---

## 2. Key Terminology

### Undirected Graph

Edges have no direction. If there is an edge between vertices A and B, we can travel from A to B and also from B to A.

### Directed Graph

Edges have a direction and are called **arcs**. If there is an arc pointing from A to B, we can only travel from A to B, not from B to A.

### Other Important Terms

- **Weighted graph**: edges or vertices carry an associated numeric value called a **weight**. Common cases are edge weights (e.g. road length on a map) and vertex weights (e.g. a city's population).
- **Degree**: in an undirected graph, the number of edges connected to a vertex. In a directed graph, it splits into **in-degree** and **out-degree**.
- **Path**: the sequence of vertices traversed in going from one vertex to another.
- **Cycle**: a path whose start and end vertex are the same.

---

## 3. Key Terminology (continued)

### Connected Graph

In an undirected graph, if a path exists between every pair of vertices, the graph is **connected**.

> Example: a graph with components `A–B–C` (a triangle) and `D–E` is _not_ connected — it has two **connected components**.

### Strongly Connected Graph

In a directed graph, if for every pair of vertices `u` and `v` there is a path from `u` to `v` **and** a path from `v` to `u`, the graph is strongly connected.

> Example: `A → B → C → A` is strongly connected.

### Complete Graph

In an undirected graph, every pair of distinct vertices is joined by exactly one edge.

### Self-Loops and Simple Graphs

- **Self-loop**: an edge connecting a vertex to itself.
- **Multiple edges**: more than one edge between the same pair of vertices.
- **Simple graph**: a graph with no self-loops and no multiple edges. The vast majority of graphs discussed in competitive programming are simple graphs.

---

## 4. Representation (1): Adjacency Matrix

### Idea

Use a two-dimensional array (matrix) `matrix` to represent the graph. If there is an edge between vertices `i` and `j`, then `matrix[i][j]` is 1 (or the weight value); otherwise it is 0.

### Code

```python
N = 5
matrix = [[0] * N for _ in range(N)]
edges = [(0,1), (0,4), (1,2), (1,3), (1,4), (2,3), (3,4)]
for u, v in edges:
    matrix[u][v] = 1
    matrix[v][u] = 1  # undirected graph
```

### Matrix Representation

||0|1|2|3|4|
|---|---|---|---|---|---|
|**0**|0|1|0|0|1|
|**1**|1|0|1|1|1|
|**2**|0|1|0|1|0|
|**3**|0|1|1|0|1|
|**4**|1|1|0|1|0|

### Pros and Cons

- **Pros**: simple to implement; checking whether an edge exists between two vertices takes $O(1)$ time; convenient for using matrix operations to analyze graph properties (e.g. counting the number of paths).
- **Cons**: space complexity is $O(N^2)$, which is very wasteful when there are many vertices but few edges (a sparse graph); iterating over all neighbors of one vertex takes $O(N)$ time.

---

## 5. Representation (2): Adjacency List

### Idea

This is the most commonly used method in competitive programming. Use an array of lists `adj`, where `adj[i]` is a list storing all vertices adjacent to vertex `i`.

### Code

```python
N = 5
adj = [[] for _ in range(N)]
edges = [(0,1), (0,4), (1,2), (1,3), (1,4), (2,3), (3,4)]
for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)
```

### List Representation

|Vertex|Adjacent vertices|
|---|---|
|**0**|1, 4|
|**1**|0, 2, 3, 4|
|**2**|1, 3|
|**3**|1, 2, 4|
|**4**|0, 1, 3|

### Pros and Cons

- **Pros**: space complexity is $O(N + M)$ (where $M$ is the number of edges), which is very space-efficient for sparse graphs; all neighbors of a vertex can be iterated over efficiently.
- **Cons**: checking whether an edge exists between two vertices takes $O(\deg(u))$ time.

---

## 6. Adjacency List: List vs. Set

### Something to Think About

The inner structure of an adjacency list can be implemented with a **set** instead of a list — each has its own strengths and weaknesses.

### Implementation 1: Using a List

```python
# initialization
adj = [[] for _ in range(N)]
# add an edge
adj[u].append(v)
# check whether an edge exists (less efficient)
if v in adj[u]:
    ...
```

### Implementation 2: Using a Set

```python
# initialization
adj = [set() for _ in range(N)]
# add an edge (duplicates removed automatically)
adj[u].add(v)
# check whether an edge exists (efficient)
if v in adj[u]:
    ...
```

### How to Choose?

- **Advantages of the set**: checking whether an edge exists is $O(1)$; duplicate edges are handled automatically.
- **Advantages of the list**: preserves the insertion order of neighbors; iteration may be marginally faster.
- **Conclusion**: if you need frequent edge queries, or the input may contain duplicates, the **set is better**. Otherwise the list is simpler.

---

## 7. Summary: Adjacency Matrix vs. Adjacency List

|Operation|Adjacency matrix|Adjacency list|
|---|---|---|
|Space complexity|$O(N^2)$|$O(N + M)$|
|Add an edge|$O(1)$|$O(1)$|
|Check whether edge $(u, v)$ exists|$O(1)$|$O(\deg(u))$ with a list / $O(1)$ with a set|
|Iterate over all neighbors of $u$|$O(N)$|$O(\deg(u))$|

### How to Choose?

- For **dense graphs** ($M \approx N^2$), the space complexity of the adjacency matrix and adjacency list is comparable. In this case the adjacency matrix is usually simpler to implement.
- For **sparse graphs** ($M \ll N^2$), **always prefer the adjacency list** — its $O(N + M)$ space efficiency is a huge advantage.
- **Special requirements**: if the problem needs to exploit properties of matrix operations (such as counting paths), the adjacency matrix is essential.
- **First choice in contests**: the overwhelming majority of graphs in algorithm competitions are sparse, so the **adjacency list is the default choice**. When edge-existence checks are frequent, implement it with a **set**.
