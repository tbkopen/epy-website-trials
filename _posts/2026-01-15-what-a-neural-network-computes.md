---
title: "What a Neural Network Is Actually Computing"
date: 2026-01-15
categories: [machine-learning]
tags: [deep-learning, functions, neural-networks]
series: "Foundations of Machine Learning"
description: "Strip away the biology metaphors and a neural network is a stack of linear maps with bends in between."
math: true
toc: true
---

"Neurons," "activations," "firing" — the biological language obscures what a neural network really is: a **parameterised function** built by alternating linear maps with simple non-linear bends.

<!--more-->

## One layer

A single layer takes input $x$, applies a linear map, and bends the result with a non-linear function $\phi$:

$$
h = \phi(Wx + b)
$$

$W$ and $b$ are learned. Without $\phi$, stacking layers would collapse into a single linear map (a product of matrices is just another matrix). The non-linearity is what buys expressive power.

## The whole network

A network is just function composition — layers applied in sequence:

$$
f(x) = \phi_L\big(W_L \, \phi_{L-1}(\cdots \phi_1(W_1 x + b_1) \cdots) + b_L\big)
$$

That's the entire object. Everything else — convolution, attention, normalisation — is a special structure imposed on the $W$'s.

## Why non-linearity matters

The most common bend is the **ReLU**:

$$
\phi(z) = \max(0, z)
$$

Each ReLU unit splits its input space with a hyperplane: zero on one side, linear on the other. Stack many and you tile input space into a vast number of regions, each with its own linear behaviour — a piecewise-linear function flexible enough to approximate almost anything.

## The universal approximation theorem

A network with even a single hidden layer can approximate any continuous function on a bounded domain to arbitrary accuracy, given enough units:

$$
\forall \epsilon > 0, \; \exists\, \text{network } f \text{ s.t. } \sup_{x \in K} |f(x) - g(x)| < \epsilon
$$

It guarantees *existence*, not that training will find it, nor that the network will be small. Depth, in practice, buys efficiency the theorem doesn't promise.

```python
import numpy as np

def relu(z):
    return np.maximum(0, z)

def forward(x, weights):
    h = x
    for W, b in weights[:-1]:
        h = relu(W @ h + b)
    W, b = weights[-1]
    return W @ h + b   # linear output layer
```

## The takeaway

A neural network is a tall composition of "multiply by a matrix, then bend." Learning means choosing the matrices so the composition matches your data.

## Further reading

- [Why Matrix Multiplication Is Defined "That Way"]({% post_url 2025-07-15-why-matrix-multiplication %})
- [Backpropagation Is Just the Chain Rule]({% post_url 2026-02-01-backpropagation-is-the-chain-rule %})
