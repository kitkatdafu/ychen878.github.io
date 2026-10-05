---
title: "Tree Basics"
date: 2026-04-13
categories: ["Algorithms"]
tags: ["algorithms", "data structures", "trees"]
---

## What is a Tree?

### Concept: A Non-Linear Hierarchical Structure

- **Tree** is an abstract data type used to simulate data with **hierarchical relationships**. It consists of _n_ (_n_ ≥ 0) finite nodes.
- It is a **non-linear** data structure, in contrast to the linear structures we studied earlier such as lists, stacks, and queues.
- In a tree structure, there is a special node called the **Root**. The remaining nodes can be divided into _m_ (_m_ ≥ 0) disjoint sets _T₁, T₂, ..., Tₘ_, each of which is itself a tree, referred to as a **Subtree** of the root.

### Real-Life Examples

- **Book table of contents**: The book is the root node, chapters are intermediate nodes, and sections are leaf nodes.
- **File system**: The root directory is the root node, subdirectories at each level are intermediate nodes, and files are leaf nodes.

---

## Key Terminology

_(Based on the tree diagram with nodes A, B, C, D, E, F, G, H, I, K)_

- **Root**: The topmost node of the tree (A).
- **Child**: The direct successor of a node (B, C, D are children of A).
- **Parent**: The direct predecessor of a node (A is the parent of B, C, D).
- **Sibling**: Nodes that share the same parent (B, C, D are siblings of each other).
- **Leaf**: A node with no children (E, K, C, G, H, I).
- **Internal Node**: A non-leaf node (A, B, F, D).
- **Degree**: The number of subtrees a node has (A has degree 3).
- **Depth**: The path length from the root to a given node (depth of F is 2).
- **Height**: The maximum depth among all nodes in the tree.

---

## Rooted Tree vs. Unrooted Tree

### Rooted Tree

- All concepts discussed previously — parent, child, depth, etc. — are based on **rooted trees**.
- A rooted tree has an explicitly designated **root node**, which establishes the hierarchical structure and direction of the entire tree.
- In a problem, if the input directly provides directed "parent–child" relationships, then it describes a rooted tree.

### Unrooted Tree

- In algorithm competitions, problems often provide only a set of "edges" connecting nodes without specifying a root. This describes an **unrooted tree**.
- An unrooted tree is a **connected acyclic graph**. It has no inherent hierarchical direction.
- We can choose **any node as the root** to convert an unrooted tree into a rooted tree for processing. Different choices of root produce structurally different rooted trees.

---

## Properties of Trees

### A Tree with N Nodes Has the Following Properties

- **Edges**: A tree has exactly _N_ − 1 edges. This is a key characteristic that distinguishes trees from general graphs.
- **Connectivity**: There is exactly **one** unique simple path between any two nodes in a tree.
- **Acyclicity**: A tree contains no cycles.
- **Corollaries**:
    - Adding any one edge to a tree will necessarily create a cycle.
    - Removing any one edge from a tree will necessarily split it into two disconnected trees.
- In graph theory, a graph with _N_ nodes is a tree if and only if any **two** of the following three conditions hold:
    - The graph is connected.
    - The graph is acyclic.
    - The graph has _N_ − 1 edges.

---

## Special Trees — Binary Tree

### Definition

A **Binary Tree** is a special type of tree where each node has **at most two children**, referred to as the **Left Child** and the **Right Child**.

- The positions of the two children are **ordered** and cannot be swapped arbitrarily.
- A node may have only a left child, or only a right child.

### Full Binary Tree

Every non-leaf node has exactly **degree 2** (i.e., exactly two children).

```
        1
       / \
      2   3
     / \ / \
    4  5 6  7
```

### Complete Binary Tree

Every level, except possibly the last, is completely filled. All nodes in the last level are **as far left as possible**.

```
        1
       / \
      2   3
     /\ /
    4 5 6
```

> Note: The **heap** data structure we studied previously is a type of complete binary tree.

---

## Representation (1) — Node Class (Object-Oriented)

### Concept

The most intuitive approach is to define a `TreeNode` class. Each object represents a node, containing the node's value and a list of references to all its child nodes.

### Code Implementation

```python
# Define tree node
class TreeNode:
    def __init__(self, val, children=None):
        self.val = val
        if children is None:
            self.children = []
        else:
            self.children = children

root = TreeNode('A', [        # Manually construct a tree:
    TreeNode('B', [           #         A
        TreeNode('E'),        #       / | \
        TreeNode('F')         #      B  C  D
    ]),                       #     / \
    TreeNode('C'),            #    E   F
    TreeNode('D')
])

print(f"Root's value: {root.val}")
print(f"Number of children: {len(root.children)}")
print(f"First child's value: {root.children[0].val}")
```

### Output

```
Root's value: A
Number of children: 3
First child's value: B
```

### Pros and Cons

- **Pros**: Clear structure; very well-suited to object-oriented thinking.
- **Cons**: Not flexible enough for scenarios requiring frequent structural modifications or graph-based applications; not commonly used in the standard input format of algorithm competitions.

---

## Representation (2) — Adjacency List

### Concept

This is the **most commonly used** representation in graph theory and algorithm competitions. We use a dictionary or an array of lists to store the tree's structure. This method can flexibly represent both rooted and unrooted trees.

### Rooted Tree

```python
# Input as (parent, child) pairs
N = 6
edges = [(0, 1), (0, 2), (1, 3), (1, 4), (2, 5)]
tree = [[] for _ in range(N)]
for parent, child in edges:
    tree[parent].append(child)

# Print results
for i in range(N):
    print(f"Node {i} children: {tree[i]}")
```

**Output:**

```
Node 0 children: [1, 2]
Node 1 children: [3, 4]
Node 2 children: [5]
Node 3 children: []
Node 4 children: []
Node 5 children: []
```

### Unrooted Tree

```python
# Input as undirected edges
N = 6
edges = [(0, 1), (0, 2), (1, 3), (1, 4), (2, 5)]
adj = [[] for _ in range(N)]
for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)

# Print results
for i in range(N):
    print(f"Node {i} neighbors: {adj[i]}")
```

**Output:**

```
Node 0 neighbors: [1, 2]
Node 1 neighbors: [0, 3, 4]
Node 2 neighbors: [0, 5]
Node 3 neighbors: [1]
Node 4 neighbors: [1]
Node 5 neighbors: [2]
```

---

## Representation (3) — Parent Pointer

### Concept

This method is specifically used for rooted trees. It uses an array `parent` to store the parent of each node. Specifically, `parent[i]` holds the index of node `i`'s parent node. For the root node, a special value (e.g., -1) is used to indicate it has no parent.

### Code Implementation

```python
# Assume N nodes, numbered 0 to N-1
N = 6
# parent[i] stores the parent of node i
# Assume root is 0, its parent is -1
parent = [-1] * N
# edges describe parent-child relationships
edges = [(0, 1), (0, 2), (1, 3), (1, 4), (2, 5)]

for p, c in edges:
    parent[c] = p

# Print each node's parent
for i in range(N):
    print(f"Node {i}'s parent: {parent[i]}")
```

### Output

```
Node 0's parent: -1
Node 1's parent: 0
Node 2's parent: 0
Node 3's parent: 1
Node 4's parent: 1
Node 5's parent: 2
```

### Pros and Cons

- **Pros**: Quickly find the parent of any node; well-suited for algorithms that need to trace upward (e.g., Union-Find / Disjoint Set Union).
- **Cons**: Cannot directly find all children of a node; requires traversing the entire array.
