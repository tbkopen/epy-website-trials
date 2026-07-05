---
title: "Backpropagation Is Just the Chain Rule"
date: 2026-02-01
categories: [machine-learning]
tags: [autodiff, calculus, neural-networks]
series: "Foundations of Machine Learning"
description: "The algorithm that trains every deep network is high-school calculus applied with one clever bit of bookkeeping."
math: true
toc: true
pinned: true
---

Backpropagation has a reputation for being hard. It isn't. It's the **chain rule** from calculus, plus one insight about the *order* in which to apply it.

<!--more-->

## The chain rule, refresher

If $z = f(y)$ and $y = g(x)$, then:

$$
\frac{dz}{dx} = \frac{dz}{dy} \cdot \frac{dy}{dx}
$$

Derivatives multiply along a chain of dependencies. A neural network is a long chain, so its gradient is a long product.

## Forward vs reverse

Consider a scalar loss $L$ depending on parameters through many layers. You could compute derivatives **forward** (input to output) or **backward** (output to input). For a function with many inputs and one output — exactly the shape of a loss — reverse mode is dramatically cheaper.

The reason: reverse mode computes the gradient with respect to *all* parameters in a single backward pass, reusing shared sub-expressions. Forward mode would repeat that work once per parameter.

## The two passes

**Forward pass** — compute and cache each layer's output:

$$
a^{(l)} = \phi(z^{(l)}), \qquad z^{(l)} = W^{(l)} a^{(l-1)} + b^{(l)}
$$

**Backward pass** — propagate the error signal $\delta^{(l)} = \partial L / \partial z^{(l)}$ from the last layer down:

$$
\delta^{(l)} = \big((W^{(l+1)})^\top \delta^{(l+1)}\big) \odot \phi'(z^{(l)})
$$

Then each weight gradient is an outer product of cached quantities:

$$
\frac{\partial L}{\partial W^{(l)}} = \delta^{(l)} (a^{(l-1)})^\top
$$

## Why caching matters

The forward pass stores the activations $a^{(l)}$ precisely because the backward pass needs them. This is the memory–compute tradeoff at the heart of training: you trade memory (storing activations) for not recomputing them.

```python
# Sketch: backward through one linear+ReLU layer
def backward(delta_next, W_next, z, a_prev):
    delta = (W_next.T @ delta_next) * (z > 0)   # ReLU'(z)
    dW = delta @ a_prev.T
    db = delta
    return delta, dW, db
```

## The takeaway

Backpropagation = chain rule + reverse-mode bookkeeping + caching the forward pass. Modern autodiff frameworks just automate exactly this.

## Further reading

- [What a Neural Network Is Actually Computing]({% post_url 2026-01-15-what-a-neural-network-computes %})
- [Gradient Descent, Step by Step]({% post_url 2025-12-01-gradient-descent-step-by-step %})
