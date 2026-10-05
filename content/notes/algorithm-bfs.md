---
title: "Breadth-First Search (BFS)"
date: 2026-08-14
categories: ["Algorithms"]
tags: ["algorithms", "graphs", "traversal", "breadth-first search"]
---

## 1. What Is Breadth-First Search?

### Core idea: expand level by level

- **Breadth-first search (BFS)** is the other classic graph traversal algorithm.
- Starting from a source vertex, it first visits all of its **immediate neighbors** — these form the first level.
- Then it visits, in order, all not-yet-visited neighbors of the first-level nodes — these form the second level.
- The process resembles the **ripples** spreading out when a stone is dropped into water: it expands outward one level at a time until every reachable node has been visited.

### Key data structure: the queue

BFS makes perfect use of a queue's **first-in, first-out (FIFO)** property to guarantee level-by-level traversal order.

### DFS vs. BFS

||Strategy|Data structure|Behavior|
|---|---|---|---|
|**DFS**|Explore deep|Stack|Follow one path to the end|
|**BFS**|Expand sideways|Queue|Spread outward level by level|

---

## 2. Implementing BFS on a Graph

**Core logic: queue and marking.**

1. Create a **queue** and enqueue the starting node `start_node`.
2. Create a `visited` array and mark `start_node` as visited.
3. While the queue is not empty, repeat:
    - Pop a node `u` from the front of the queue.
    - Visit `u` (e.g. print it).
    - Iterate over all neighbors `v` of `u`:
        - If `v` has **not been visited**, mark it as visited and **enqueue** it.

```python
from collections import deque

def bfs(start_node, adj, visited):
    q = deque([start_node])
    visited[start_node] = True

    while q:
        u = q.popleft()
        print(u, end=" ")

        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                q.append(v)

# --- build the graph and start BFS ---
N = 6
adj = [[] for _ in range(N)]
edges = [(0,1), (0,2), (1,3), (1,4),
         (2,5), (3,4)]
for u, v in edges:
    adj[u].append(v); adj[v].append(u)

visited = [False] * N
# start from an arbitrary vertex, 0
bfs(0, adj, visited)
```

**Output**

```
0 1 2 3 4 5
```

> Note: a node is marked visited **at enqueue time**, not at dequeue time. This prevents the same node from being pushed into the queue more than once.

---

## 3. Walkthrough of the BFS Process

Graph: 6 vertices with edges `0-1`, `0-2`, `1-3`, `1-4`, `2-5`, `3-4`.

|Step|Action|State|
|---|---|---|
|1|`q=[0]`. Pop `0`, visit it. Mark and enqueue neighbors **1, 2**.|`visited={0,1,2}`, `q=[1,2]`|
|2|Pop `1`, visit it. Mark and enqueue neighbors **3, 4** (`0` already visited).|`visited={0,1,2,3,4}`, `q=[2,3,4]`|
|3|Pop `2`, visit it. Mark and enqueue neighbor **5** (`0` already visited).|`visited={0,1,2,3,4,5}`, `q=[3,4,5]`|
|4|Pop `3`, visit it. Neighbors `1, 4` both already visited.|`q=[4,5]`|
|5|Pop `4`, visit it. Neighbors `1, 3` both already visited.|`q=[5]`|
|6|Pop `5`, visit it. Neighbor `2` already visited.|`q=[]`|
|7|Queue is empty; traversal complete.|—|

**Visit order:** `0 1 2 3 4 5`

---

## 4. Application: Shortest Paths in an Unweighted Graph

### Core property

One of the most important applications of BFS is solving the shortest-path problem in **unweighted** graphs.

- A BFS from source `s` visits nodes exactly in order of increasing distance (number of edges) from `s`.
- The path taken when a node `v` is reached **for the first time** is necessarily a shortest path from `s` to `v`.
- This holds because BFS's level-by-level expansion guarantees that every node at distance less than `d` has already been visited before any node at level `d` is explored.

### Implementation: computing distances

```python
from collections import deque

def bfs_shortest_path(start_node, N, adj):
    dist = [-1] * N          # -1 means unreachable
    dist[start_node] = 0
    q = deque([start_node])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if dist[v] == -1:        # if v has not been visited
                dist[v] = dist[u] + 1
                q.append(v)
    return dist

# graph definition is the same as on the previous page
# start from node 0
distances = bfs_shortest_path(0, N, adj)
print(distances)
```

**Output**

```
[0, 1, 1, 2, 2, 2]
```

### Explanation

The returned list gives the shortest distance (in edges) from the source `0` to each vertex:

- `dist[0] = 0` (itself)
- `dist[1] = 1` (0→1)
- `dist[2] = 1` (0→2)
- `dist[3] = 2` (0→1→3)
- `dist[4] = 2` (0→1→4)
- `dist[5] = 2` (0→2→5)

Here the `dist` array doubles as the `visited` marker: a value of `-1` means "not yet reached."

---

## 5. Programming Exercise: 01 Matrix

### Problem

Implement a function `update_matrix(mat)` that takes a matrix `mat` of 0s and 1s and returns a new matrix of the same size in which each cell holds the distance from the corresponding element of `mat` to the nearest `0`. The distance between two adjacent elements is 1.

**Input**

```python
mat = [
  [0,0,0],
  [0,1,0],
  [1,1,1]
]
```

**Output**

```python
[
  [0,0,0],
  [0,1,0],
  [1,2,1]
]
```

### Idea: multi-source BFS

This can be seen as a shortest-path problem. Think of it in reverse: instead of having each `1` search for its nearest `0`, treat **all** the `0`s as sources, run a single BFS starting from all of them simultaneously, and compute the shortest distance over which they spread to each `1`.

### Reference solution

```python
def update_matrix(mat):
    rows, cols = len(mat), len(mat[0])
    dist = [[-1] * cols for _ in range(rows)]
    q = deque()
    for r in range(rows):
        for c in range(cols):
            if mat[r][c] == 0:
                q.append((r, c))
                dist[r][c] = 0
    dirs = [(0,1), (0,-1), (1,0), (-1,0)]
    while q:
        r, c = q.popleft()
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols \
                    and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                q.append((nr, nc))
    return dist
```
