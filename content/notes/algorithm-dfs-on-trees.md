---
title: "Depth-First Search on Trees"
date: 2026-04-13
categories: ["Algorithms"]
tags: ["algorithms", "trees", "traversal", "depth-first search"]
---

## What is Depth-First Search?

### Concept: Go All the Way Down One Path

- **Depth-First Search (DFS)** is an algorithm for traversing or searching trees or graphs.
- Its core idea is: starting from the root node, explore each branch as deeply as possible.
- When exploring along a path and all children of a node have been visited, the algorithm **backtracks** to that node's parent and continues exploring any unvisited children.
- This process is typically implemented using **recursion**, which naturally uses the function call stack to handle the "going deeper" and "backtracking" phases.

### Traversal Order

The order in which DFS visits nodes is closely tied to the order of recursive calls. It always completes the full exploration of one subtree before moving on to the next sibling subtree.

---

## DFS Implementation: Rooted Tree vs. Unrooted Tree

### Rooted Tree

For a rooted tree, edge directions are fixed (from parent to child), so starting from the root we simply recurse into each node's children.

**Code Implementation:**

```python
# tree[i] stores the children of node i
def dfs_rooted(u, tree):
    print(u, end=" ")  # Visit and print current node
    for v in tree[u]:
        dfs_rooted(v, tree)

# --- Build directed adjacency list ---
N = 6
edges = [(0, 1), (0, 2), (1, 3), (1, 4), (2, 5)]
tree = [[] for _ in range(N)]
for p, c in edges:
    tree[p].append(c)
# Start DFS from root node 0
dfs_rooted(0, tree)
```

**Output:**

```
0 1 3 4 2 5
```

### Unrooted Tree

For an unrooted tree (treated as an undirected graph), we need an extra mechanism to prevent "going back the way we came" during traversal. The common approach is to track each node's visited status, or to pass the parent node into the recursive call.

**Code Implementation (tracking parent):**

```python
# adj[i] stores all neighbors of node i
def dfs_unrooted(u, p, adj):
    print(u, end=" ")  # Visit and print current node
    for v in adj[u]:
        if v != p:  # If neighbor v is not where we came from
            dfs_unrooted(v, u, adj)

# --- Build undirected adjacency list ---
N = 6
edges = [(0, 1), (0, 2), (1, 3), (1, 4), (2, 5)]
adj = [[] for _ in range(N)]
for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)
# Start DFS from node 0, initially no parent (-1)
dfs_unrooted(0, -1, adj)
```

**Output:**

```
0 1 3 4 2 5
```

---

## DFS Process Illustrated

The following steps trace the DFS execution on this tree:

```
        0
       / \
      1   2
     / \   \
    3   4   5
```

|Step|Call|Action|
|---|---|---|
|1|`dfs(0)`|Visit node 0 (orange), recurse into child 1|
|2|`dfs(1)`|Visit node 1 (orange), node 0 marked done (green), recurse into child 3|
|3|`dfs(3)`|Visit node 3 (orange), nodes 0 & 1 marked done|
|4|`dfs(4)`|Node 3 complete, backtrack to 1, visit node 4 (orange)|
|5|`dfs(2)`|Subtree of 1 complete, backtrack to 0, visit node 2 (orange)|
|6|`dfs(5)`|Visit node 5 (orange), node 2 marked done|
|7|—|Traversal complete — all nodes green|

**Final traversal order: 0 → 1 → 3 → 4 → 2 → 5**

---

## Binary Tree Traversal: Pre-order, In-order, and Post-order

### Based on When the Root Node is Visited

For binary trees, DFS can be classified into three classic traversal orders based on the visit sequence of the root, left subtree, and right subtree. Assume the DFS function signature is `dfs(node)`:

### Pre-order Traversal (Root → Left → Right)

```python
def preorder(node):
    if node is None: return
    print(node.val)
    preorder(node.left)
    preorder(node.right)
```

### In-order Traversal (Left → Root → Right)

```python
def inorder(node):
    if node is None: return
    inorder(node.left)
    print(node.val)
    inorder(node.right)
```

### Post-order Traversal (Left → Right → Root)

```python
def postorder(node):
    if node is None: return
    postorder(node.left)
    postorder(node.right)
    print(node.val)
```

### Example

For the following binary tree:

```
        A
       / \
      B   C
     / \   \
    D   E   F
```

The three traversal sequences are:

|Traversal|Order|
|---|---|
|Pre-order|A, B, D, E, C, F|
|In-order|D, B, E, A, F, C|
|Post-order|D, E, B, F, C, A|

---

## DFS Application: Using Return Values for Aggregation

### Core Idea: Passing Information Bottom-Up

DFS is not just for "walking through" all nodes. Its greater power lies in the recursive function's ability to **return information bottom-up**, allowing us to compute and aggregate various properties of the entire tree.

### Application: Finding the Maximum Height of a Tree

The function `dfs_height(u)` returns the height of the subtree rooted at node `u`.

Its recurrence relation is defined as: the maximum height of a node equals the maximum height among all its children's subtrees, plus one.

**Recurrence Relation:**

$$
\operatorname{height}(u) = 1 + \max_{v \in \operatorname{children}(u)} \operatorname{height}(v)
$$

For leaf nodes, the height is 0.

**Code Implementation:**

```python
def get_max_height(u, tree):
    # Base case: leaf node has height 0
    if not tree[u]:
        return 0

    max_child_height = -1
    # Recursively compute height of all child subtrees
    for v in tree[u]:
        max_child_height = max(max_child_height,
                               get_max_height(v, tree))

    # Return the tallest child subtree height + 1
    return 1 + max_child_height
```
