---
title: "What Eigenvectors Actually Are"
date: 2025-06-15
categories: [linear-algebra]
tags: [eigenvectors, eigenvalues, geometry]
series: "The Geometry of Linear Algebra"
description: "The geometric intuition that makes eigenvalues and eigenvectors obvious — not just memorised."
math: true
toc: true
---

Ask most people what an eigenvector is and they'll recite the definition: a vector $v$ such that $Av = \lambda v$ for some scalar $\lambda$.

That's correct. But it doesn't explain *why eigenvectors matter*, or why they appear everywhere from Google's PageRank algorithm to quantum mechanics.

<!--more-->



## The geometric view

A matrix $A \in \mathbb{R}^{n \times n}$ is a linear map: it takes a vector as input and produces a vector as output. In general, it rotates, scales, and shears the input.

But for special vectors — the **eigenvectors** — the matrix only *scales* them. No rotation. No shearing. Just stretching or compressing along the same line.

Formally: $v$ is an eigenvector of $A$ with eigenvalue $\lambda$ if:

$$
Av = \lambda v, \quad v \neq 0
$$

The scalar $\lambda$ tells you *how much* the vector is scaled. If $\lambda > 1$, the vector stretches. If $0 < \lambda < 1$, it shrinks. If $\lambda < 0$, it flips.

## Why this matters: the spectral decomposition

For a symmetric matrix $A$, the **Spectral Theorem** guarantees that $A$ has an orthonormal basis of eigenvectors $\{v_1, \ldots, v_n\}$ with real eigenvalues $\{\lambda_1, \ldots, \lambda_n\}$. That means:

$$
A = \sum_{i=1}^{n} \lambda_i \, v_i v_i^\top
$$

This is remarkable. It says: *every symmetric matrix is just a sum of rank-1 projections, scaled by eigenvalues*.

## Computing eigenvalues

Eigenvalues are the roots of the **characteristic polynomial**:

$$
\det(A - \lambda I) = 0
$$

For a $2 \times 2$ matrix $A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$, this gives:

$$
\lambda^2 - (a+d)\lambda + (ad - bc) = 0
$$

Notice $a + d = \text{tr}(A)$ and $ad - bc = \det(A)$. So:

$$
\lambda = \frac{\text{tr}(A) \pm \sqrt{\text{tr}(A)^2 - 4\det(A)}}{2}
$$

## A concrete example

Let $A = \begin{pmatrix} 3 & 1 \\ 0 & 2 \end{pmatrix}$.

The characteristic equation is:

$$
(3 - \lambda)(2 - \lambda) = 0 \implies \lambda_1 = 3, \quad \lambda_2 = 2
$$

For $\lambda_1 = 3$: solve $(A - 3I)v = 0$:

$$
\begin{pmatrix} 0 & 1 \\ 0 & -1 \end{pmatrix} v = 0 \implies v_1 = \begin{pmatrix} 1 \\ 0 \end{pmatrix}
$$

For $\lambda_2 = 2$: solve $(A - 2I)v = 0$:

$$
\begin{pmatrix} 1 & 1 \\ 0 & 0 \end{pmatrix} v = 0 \implies v_2 = \begin{pmatrix} -1 \\ 1 \end{pmatrix}
$$

Along $v_1 = (1, 0)^\top$, the matrix $A$ acts as multiplication by $3$. Along $v_2 = (-1, 1)^\top$, as multiplication by $2$.

## What's next

In the next post, we'll look at what happens when eigenvalues are complex — and why that corresponds to rotations in the plane. Then we'll use this intuition to understand why Google's PageRank converges.
