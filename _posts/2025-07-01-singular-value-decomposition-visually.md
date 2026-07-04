---
title: "The Singular Value Decomposition, Visually"
date: 2025-07-01
categories: [linear-algebra]
tags: [svd, geometry, pca]
series: "The Geometry of Linear Algebra"
description: "Every matrix is a rotation, a scaling, and another rotation. That's the whole story of the SVD."
math: true
toc: true
---

The singular value decomposition is often introduced as a wall of formulas. But geometrically it says something simple and beautiful: **every linear map is a rotation, followed by a scaling along axes, followed by another rotation.**

<!--more-->

## The statement

For any real matrix $A \in \mathbb{R}^{m \times n}$, there exist orthogonal matrices $U$ and $V$ and a diagonal matrix $\Sigma$ with non-negative entries such that:

$$
A = U \Sigma V^\top
$$

- $V^\top$ rotates (or reflects) the input space.
- $\Sigma$ scales each axis by a **singular value** $\sigma_i \geq 0$.
- $U$ rotates into the output space.

That's it. No matter how complicated $A$ looks, it does these three things in sequence.

## Why the unit circle becomes an ellipse

Take the unit circle in $\mathbb{R}^2$ and apply $A$. The image is always an ellipse. The SVD tells you exactly which one:

- The **axes** of the ellipse point along the columns of $U$.
- The **lengths** of the semi-axes are the singular values $\sigma_1 \geq \sigma_2 \geq 0$.

So the singular values measure *how much the map stretches space* in each principal direction.

## Connection to eigenvalues

The singular values of $A$ are the square roots of the eigenvalues of $A^\top A$:

$$
\sigma_i = \sqrt{\lambda_i(A^\top A)}
$$

Because $A^\top A$ is symmetric and positive semi-definite, those eigenvalues are real and non-negative — which is exactly what we need for $\Sigma$.

## Low-rank approximation

Here's where the SVD earns its keep. Keep only the largest $k$ singular values and you get the **best rank-$k$ approximation** of $A$ in both the Frobenius and spectral norms (the Eckart–Young theorem):

$$
A_k = \sum_{i=1}^{k} \sigma_i \, u_i v_i^\top
$$

This is the engine behind image compression, latent semantic analysis, and PCA.

```python
import numpy as np

A = np.random.randn(100, 50)
U, s, Vt = np.linalg.svd(A, full_matrices=False)

# Rank-10 approximation
k = 10
A_k = (U[:, :k] * s[:k]) @ Vt[:k]
error = np.linalg.norm(A - A_k) / np.linalg.norm(A)
print(f"Relative error with rank {k}: {error:.3f}")
```

## The takeaway

When you next see $A = U\Sigma V^\top$, picture the unit circle turning into an ellipse. The rest is bookkeeping.

## Further reading

- [What Eigenvectors Actually Are]({% post_url 2025-06-15-understanding-eigenvectors %}) — the symmetric-matrix special case.
- Strang, *Introduction to Linear Algebra*, chapter on the SVD.
