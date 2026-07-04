---
title: "Markov Chains and the Stationary Distribution"
date: 2025-10-01
categories: [probability]
tags: [markov, pagerank, linear-algebra]
description: "A random walk that forgets its past, an eigenvector that predicts its future — and the algorithm that made Google."
math: true
toc: true
---

A Markov chain is a system that hops between states with no memory: where it goes next depends only on where it is now, not how it got there. Astonishingly, this near-amnesia leads to perfectly predictable long-run behaviour.

<!--more-->

## The setup

A chain on states $1, \ldots, n$ is described by a **transition matrix** $P$, where $P_{ij}$ is the probability of moving from $i$ to $j$. Each row sums to 1.

If $\pi^{(t)}$ is the row vector of state probabilities at time $t$, then one step is just a matrix multiply:

$$
\pi^{(t+1)} = \pi^{(t)} P
$$

## The stationary distribution

A distribution $\pi$ is **stationary** if it doesn't change under a step:

$$
\pi P = \pi
$$

Read that carefully: $\pi$ is a **left eigenvector** of $P$ with eigenvalue 1. For an irreducible, aperiodic chain, this $\pi$ is unique, and the chain converges to it from *any* starting point:

$$
\lim_{t \to \infty} \pi^{(0)} P^t = \pi
$$

The starting state is forgotten entirely.

## PageRank is a stationary distribution

Google's original ranking models a web surfer who clicks random links. The transition matrix is built from the link graph, with a "teleport" term so the chain stays irreducible:

$$
P = d\,(\text{link matrix}) + (1-d)\frac{1}{n}\mathbf{1}\mathbf{1}^\top
$$

with damping $d \approx 0.85$. A page's rank is its stationary probability — how often the eternal random surfer lands there.

```python
import numpy as np

def pagerank(P, iters=100):
    n = P.shape[0]
    pi = np.ones(n) / n
    for _ in range(iters):
        pi = pi @ P
    return pi
```

## Why it converges

The convergence rate is governed by the **second-largest eigenvalue** $|\lambda_2|$ of $P$. The "distance" to stationarity shrinks like $|\lambda_2|^t$ — a smaller spectral gap means faster mixing.

## The takeaway

A memoryless walk has a memoryful destiny: the eigenvector of $P$ with eigenvalue 1. Find it and you know where the chain spends its time.

## Further reading

- [What Eigenvectors Actually Are]({% post_url 2025-06-15-understanding-eigenvectors %})
- [Big-O Is About Growth, Not Speed]({% post_url 2025-10-15-big-o-is-about-growth %})
