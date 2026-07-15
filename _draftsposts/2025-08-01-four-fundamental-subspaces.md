---
title: "The Four Fundamental Subspaces"
date: 2025-08-01
categories: [linear-algebra]
tags: [rank, null-space, geometry]
series: "The Geometry of Linear Algebra"
description: "Strang's big picture: every matrix splits two spaces into four, and the splits explain everything about solving Ax = b."
math: true
toc: true
---

Gilbert Strang calls it "the big picture of linear algebra." Every $m \times n$ matrix $A$ defines **four subspaces**, and understanding how they fit together is most of what you need to reason about linear systems.

<!--more-->

## The cast

For $A \in \mathbb{R}^{m \times n}$:

| Subspace | Lives in | Dimension |
|---|---|---|
| Column space $C(A)$ | $\mathbb{R}^m$ | $r$ |
| Null space $N(A)$ | $\mathbb{R}^n$ | $n - r$ |
| Row space $C(A^\top)$ | $\mathbb{R}^n$ | $r$ |
| Left null space $N(A^\top)$ | $\mathbb{R}^m$ | $m - r$ |

Here $r = \operatorname{rank}(A)$.

## The orthogonality that ties them together

The two subspaces inside $\mathbb{R}^n$ are **orthogonal complements**:

$$
N(A) \perp C(A^\top), \qquad N(A) \oplus C(A^\top) = \mathbb{R}^n
$$

Likewise in $\mathbb{R}^m$, the column space and left null space are orthogonal complements. This is why the dimensions add up: $r + (n - r) = n$.

## Why this solves $Ax = b$

A system $Ax = b$ has a solution **iff** $b \in C(A)$. If it does, the full solution set is:

$$
x = x_{\text{particular}} + N(A)
$$

a single particular solution plus anything in the null space. So:

- $N(A) = \{0\}$ → at most one solution (columns independent).
- $C(A) = \mathbb{R}^m$ → at least one solution for every $b$ (rows independent).
- Both → exactly one solution for every $b$ ($A$ invertible).

## The rank–nullity theorem, for free

The orthogonal split in $\mathbb{R}^n$ is exactly the **rank–nullity theorem**:

$$
\dim C(A^\top) + \dim N(A) = n \;\Longrightarrow\; \operatorname{rank}(A) + \operatorname{nullity}(A) = n
$$

It's not a separate fact to memorise — it's the dimensions of two complementary subspaces.

## The takeaway

Four subspaces, two orthogonal splits, one rank $r$. Every statement about solvability is a statement about which subspace your vector lands in.

## Further reading

- [Why Matrix Multiplication Is Defined "That Way"]({% post_url 2025-07-15-why-matrix-multiplication %})
- [The Singular Value Decomposition, Visually]({% post_url 2025-07-01-singular-value-decomposition-visually %}) — the SVD gives orthonormal bases for all four.
