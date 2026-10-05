---
title: "Depth-First Search on Graphs"
date: 2026-08-09
categories: ["Algorithms"]
tags: ["algorithms", "graphs", "traversal", "depth-first search"]
---

## 1. DFS: From Trees to Graphs

### Core idea recap: follow one path to the end

The core idea of depth-first search (DFS) — _explore a branch as deeply as possible, then backtrack when you hit a dead end_ — carries over to graphs unchanged.

### The new challenge: cycles

- **Trees are acyclic.** We move from a parent node to its children and never "walk back" to the parent. (For unrooted trees, this is avoided by passing the parent node as a parameter.)
- **General graphs contain cycles.** If we travel from `u` to `v`, `v` may well reach back to `u` along some other path.
- If this is not handled, DFS will fall into an **infinite loop** when it hits a cycle, causing a stack overflow.

### The solution: mark visited nodes

We need an auxiliary data structure — typically a boolean array `visited` — to record which nodes have already been visited. Before visiting a new node, check whether it has been visited already.

---

## 2. Implementation (1): Connected Graphs

**Core logic: mark, then recurse.** When visiting a node, first mark it as visited, then recursively visit all of its unvisited neighbors.

```python
# adj:     adjacency list
# visited: array recording whether a node has been visited
def dfs(u, adj, visited):
    visited[u] = True
    print(u, end=" ")   # visit the current node

    for v in adj[u]:
        if not visited[v]:
            dfs(v, adj, visited)

# --- build the graph and start DFS ---
N = 6
adj = [[] for _ in range(N)]
edges = [(0,1), (0,2), (1,3), (1,4),
         (2,4), (3,5), (4,5)]
for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)

visited = [False] * N
# start from an arbitrary vertex, 0
dfs(0, adj, visited)
```

**Output**

```
0 1 3 5 4 2
```

### Problem: what if the graph is disconnected?

The code above starts at vertex `0` and therefore only visits vertices connected to `0`. Any vertex not connected to `0` will never be reached.

---

## 3. Implementation (2): The General Case

**Solution: try every vertex as a starting point.** Unlike a tree, a graph may not be **connected**. A DFS from a single vertex may fail to reach every vertex, so we need an outer loop to guarantee that every connected component is visited.

```python
# the dfs function is the same as on the previous page...
def dfs(u, adj, visited):
    # ... (implementation omitted)
    pass

# --- build a disconnected graph and start DFS ---
N = 6                                   # 6 vertices
adj = [[] for _ in range(N)]
edges = [(0,1), (1,2)]                  # component 1: 0-1-2
edges.extend([(3,4), (4,5)])            # component 2: 3-4-5
for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)

visited = [False] * N
# there may be several connected components, so iterate over all vertices
for i in range(N):
    if not visited[i]:
        # a new connected component has been found
        dfs(i, adj, visited)
        print()                         # newline per component
```

**Output**

```
0 1 2
3 4 5
```

**Key code**

```python
for i in range(N):
    if not visited[i]:
        dfs(i, ...)
```

This loop guarantees that even if the graph consists of several disconnected parts, each part is traversed exactly once and completely.

---

## 4. Walkthrough of the DFS Process

The traced graph has 6 vertices with edges `0-1`, `0-2`, `1-3`, `1-4`, `3-4`, `2-5`.

|Step|Action|
|---|---|
|1|Start at `0`, `visited[0]=T`. Visit `0`. Neighbors **1, 2** unvisited.|
|2|`dfs(1)`. `visited[1]=T`. Visit `1`. Neighbors **3, 4** unvisited.|
|3|`dfs(3)`. `visited[3]=T`. Visit `3`. Neighbor **4** unvisited (`1` already visited).|
|4|`dfs(4)`. `visited[4]=T`. Visit `4`. Neighbors **1, 3** both visited → backtrack.|
|5|Backtrack `4 → 3 → 1`. At `1`, check neighbor `4`: already visited. Keep backtracking → `0`. `0`'s neighbor **2** is unvisited.|
|6|`dfs(2)`. `visited[2]=T`. Visit `2`. Neighbor **5** unvisited.|
|7|`dfs(5)`. `visited[5]=T`. Visit `5`. Neighbor `2` already visited → backtrack.|
|8|Backtrack level by level (`5 → 2 → 0`); traversal complete.|

**Visit order:** `0 → 1 → 3 → 4 → 2 → 5`

> Note: this walkthrough uses a slightly different edge set than the code in section 2, which is why the printed order there (`0 1 3 5 4 2`) differs.

---

## 5. Application (1): Counting Connected Components

### Concept

In an undirected graph, if vertex `v` is reachable from vertex `u`, then `u` and `v` are said to be **connected**. A **connected component** is a maximal connected subgraph.

**Example.** With edges `0-1`, `0-2`, `1-2`, `3-4`, and an isolated vertex `5`, the graph has **3 connected components**: `{0,1,2}`, `{3,4}`, `{5}`.

### Idea and implementation

Use DFS to find all connected components. Iterate over every vertex; if the current vertex has not been visited, a new connected component has been discovered — increment the counter, then run one complete DFS from that vertex to mark every vertex in its component as visited.

```python
def count_components(N, adj):
    visited = [False] * N
    count = 0
    for i in range(N):
        if not visited[i]:
            count += 1
            dfs(i, adj, visited)
    return count
```

---

## 6. Application (2): Detecting a Cycle

### Idea (undirected graphs)

During a DFS on an undirected graph, if we move from the current vertex `u` to a neighbor `v` that has **already been visited** and `v` is **not `u`'s parent** (the node that brought us to `u`), then we have found a cycle.

```python
# u: current node, p: u's parent
def dfs(u, p, adj, visited):
    visited[u] = True
    for v in adj[u]:
        if v == p:          # neighbor is the parent — skip
            continue
        if visited[v]:      # reached a visited, non-parent node
            return True
        if dfs(v, u, adj, visited):   # recurse into unvisited neighbors
            return True
    return False

def check_cycle(N, adj):
    visited = [False] * N
    for i in range(N):
        if not visited[i]:
            # -1 means the starting node has no parent
            if dfs(i, -1, adj, visited):
                return True
    return False
```

### Execution trace

Graph: triangle `0-1`, `1-2`, `0-2`. DFS from `0`:

1. `dfs(0, -1)`: visit `1`
2. `dfs(1, 0)`: visit `2`
3. Among `2`'s neighbors, find `0`; `0` is already visited and `0` is not `2`'s parent (`2`'s parent is `1`)
4. **Cycle found!**
