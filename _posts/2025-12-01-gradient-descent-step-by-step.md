---
title: "Gradient Descent, Step by Step"
date: 2025-12-01
categories: [machine-learning]
tags: [optimization, calculus, gradient-descent]
series: "Foundations of Machine Learning"
description: "Roll downhill, but how big a step? The single algorithm behind most of modern machine learning, explained honestly."
math: true
toc: true
---

Almost every model you've heard of — linear regression, neural networks, transformers — is trained by the same idea: stand on a hilly error surface and repeatedly step downhill. That idea is gradient descent.

<!--more-->

## The update rule

To minimise a differentiable loss $L(\theta)$, repeat:

$$
\theta_{t+1} = \theta_t - \eta \, \nabla L(\theta_t)
$$

The gradient $\nabla L$ points in the direction of steepest *increase*; we step the opposite way. The **learning rate** $\eta$ sets the step size.

## Why the gradient is the steepest direction

Among all unit directions $u$, the rate of change of $L$ is the directional derivative $\nabla L \cdot u$. By Cauchy–Schwarz this is maximised when $u$ aligns with $\nabla L$. So the gradient is *literally* the steepest-ascent direction — no other choice climbs faster.

## The learning rate is everything

$$
\begin{aligned}
\eta \text{ too small} &\rightarrow \text{painfully slow convergence} \\
\eta \text{ too large} &\rightarrow \text{overshoot, oscillation, divergence}
\end{aligned}
$$

For a convex function with $L$-Lipschitz gradient, any fixed $\eta \le 1/L$ guarantees convergence. In practice we tune it or use adaptive methods.

```python
import numpy as np

def gradient_descent(grad, theta0, eta=0.1, steps=1000):
    theta = theta0
    for _ in range(steps):
        theta = theta - eta * grad(theta)
    return theta

# Minimise f(x) = (x - 3)^2, grad = 2(x - 3)
print(gradient_descent(lambda x: 2*(x - 3), 0.0))  # → ~3.0
```

## Stochastic gradient descent

Computing $\nabla L$ over millions of examples is expensive. **SGD** estimates it from a small random batch each step. The estimate is noisy but *unbiased*, and the noise even helps escape sharp minima. The tradeoff: noisier steps need a decaying learning rate to settle.

## The takeaway

Gradient descent is just "which way is down, take a step, repeat." The art is entirely in the step size and in estimating the gradient cheaply.

## Further reading

- [Backpropagation Is Just the Chain Rule]({% post_url 2026-02-01-backpropagation-is-the-chain-rule %})
- [The Bias–Variance Tradeoff, Demystified]({% post_url 2025-12-15-bias-variance-tradeoff %})
