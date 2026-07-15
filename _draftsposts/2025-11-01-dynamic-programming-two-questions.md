---
title: "Dynamic Programming: The Two Questions"
date: 2025-11-01
categories: [algorithms]
tags: [dp, recursion, optimization]
series: "Algorithms, Honestly"
description: "Every dynamic programming problem reduces to answering two questions. Get them right and the code writes itself."
math: true
toc: true
---

Dynamic programming intimidates people because it's taught as a bag of tricks. It isn't. Every DP problem is solved by answering exactly **two questions**.

<!--more-->

## The two questions

1. **What is the state?** What minimal information describes a subproblem?
2. **What is the recurrence?** How does the answer for a state depend on smaller states?

Answer these and the table, the base cases, and the loop order all follow mechanically.

## Worked example: Fibonacci

- **State:** $F(n)$ — the $n$-th Fibonacci number.
- **Recurrence:** $F(n) = F(n-1) + F(n-2)$, with $F(0)=0,\ F(1)=1$.

Naive recursion is $O(2^n)$ because it recomputes the same states exponentially often. Memoising collapses it to $O(n)$:

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)
```

## Worked example: edit distance

- **State:** $d(i, j)$ — the edit distance between the first $i$ characters of $A$ and first $j$ of $B$.
- **Recurrence:**

$$
d(i,j) = \begin{cases}
d(i-1, j-1) & \text{if } A_i = B_j \\
1 + \min\{\, d(i-1,j),\ d(i,j-1),\ d(i-1,j-1) \,\} & \text{otherwise}
\end{cases}
$$

The three options are delete, insert, and substitute. Once the recurrence is written, the implementation is a double loop over an $(m+1)\times(n+1)$ table.

## Why it works: optimal substructure

DP applies when an optimal solution is built from optimal solutions to subproblems (**optimal substructure**) and those subproblems recur (**overlapping subproblems**). Memoisation exploits the overlap; the recurrence exploits the substructure.

## The takeaway

Stop hunting for tricks. Ask: *what's the state, what's the recurrence?* Everything else is bookkeeping.

## Further reading

- [Big-O Is About Growth, Not Speed]({% post_url 2025-10-15-big-o-is-about-growth %})
- [How Quicksort Really Works]({% post_url 2025-11-15-how-quicksort-really-works %})
