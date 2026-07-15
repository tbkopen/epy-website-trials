---
title: "The Bias–Variance Tradeoff, Demystified"
date: 2025-12-15
categories: [machine-learning]
tags: [generalization, overfitting]
series: "Foundations of Machine Learning"
description: "Why a more powerful model can predict worse — decomposed into the two errors every model must balance."
math: true
toc: true
---

A more flexible model fits the training data better. So why does it often predict *worse* on new data? The bias–variance decomposition gives the precise answer.

<!--more-->

## The decomposition

For squared-error loss, the expected test error of a model at a point decomposes exactly into three terms:

$$
\mathbb{E}\big[(y - \hat{f}(x))^2\big] = \underbrace{\big(\text{Bias}[\hat f(x)]\big)^2}_{\text{systematic error}} + \underbrace{\text{Var}[\hat f(x)]}_{\text{sensitivity to data}} + \underbrace{\sigma^2}_{\text{irreducible noise}}
$$

You cannot beat $\sigma^2$. The game is balancing the other two.

## What each term means

- **Bias** — error from wrong assumptions. A straight line fitting a curve has high bias; it's *systematically* off no matter the data.
- **Variance** — error from sensitivity to the particular training set. A degree-15 polynomial wiggles wildly to chase noise; retrain on new data and it changes drastically.

## The tradeoff

| Model complexity | Bias | Variance |
|---|---|---|
| Too simple (underfit) | High | Low |
| Just right | Low | Low |
| Too complex (overfit) | Low | High |

Total error is U-shaped in complexity: it falls as bias drops, then rises as variance explodes. The minimum is the sweet spot.

## How to move along the curve

- **Reduce variance:** more data, regularisation ($L_1/L_2$), simpler models, ensembling/bagging.
- **Reduce bias:** richer model class, more features, boosting.

Regularisation is the cleanest lever: adding $\lambda \|\theta\|^2$ to the loss trades a little bias for a large drop in variance.

```python
# Ridge regression: the lambda term buys variance reduction
# theta = (XᵀX + λI)⁻¹ Xᵀ y
import numpy as np
def ridge(X, y, lam):
    n = X.shape[1]
    return np.linalg.solve(X.T @ X + lam*np.eye(n), X.T @ y)
```

## A modern caveat

Very large neural networks seem to violate this story — they have enormous capacity yet generalise well ("double descent"). The classical tradeoff still holds *within a regime*; the frontier of why over-parameterised models work is active research.

## The takeaway

Test error = bias² + variance + noise. Powerful models fail by variance, not bias. Most of practical ML is variance reduction in disguise.

## Further reading

- [Concentration Inequalities You Should Know]({% post_url 2025-09-15-concentration-inequalities %})
- [Gradient Descent, Step by Step]({% post_url 2025-12-01-gradient-descent-step-by-step %})
