---
title: "Big-O Is About Growth, Not Speed"
date: 2025-10-15
categories: [algorithms]
tags: [complexity, intuition]
series: "Algorithms, Honestly"
description: "Big-O doesn't tell you which algorithm is faster today. It tells you which one survives when the input grows."
math: true
toc: true
---

The most common misconception about Big-O notation is that it measures speed. It doesn't. It measures **how cost scales as input grows** — and those are very different things.

<!--more-->

## The definition

We say $f(n) = O(g(n))$ if there exist constants $c > 0$ and $n_0$ such that:

$$
f(n) \leq c \cdot g(n) \quad \text{for all } n \geq n_0
$$

Notice what's thrown away: constant factors ($c$) and small inputs (anything below $n_0$). Big-O deliberately ignores them.

## Why constants are dropped

An $O(n)$ algorithm with a huge constant can be *slower* than an $O(n^2)$ one for small $n$. Big-O says nothing about that regime. It promises only that **eventually**, as $n$ grows, the lower-order class wins:

| $n$ | $100n$ | $n^2$ | Winner |
|---|---|---|---|
| 10 | 1,000 | 100 | $n^2$ |
| 100 | 10,000 | 10,000 | tie |
| 1,000 | 100,000 | 1,000,000 | $100n$ |

The crossover is the point of the whole notation: scaling beats constants in the limit.

## The hierarchy that matters

$$
O(1) \subset O(\log n) \subset O(n) \subset O(n \log n) \subset O(n^2) \subset O(2^n)
$$

Jumping a class is usually worth far more than tuning constants within one. Replacing an $O(n^2)$ algorithm with $O(n \log n)$ helps at scale in a way no micro-optimisation can.

## When Big-O lies to you

- **Small, fixed inputs.** If $n$ never exceeds 50, the constant *is* the story.
- **Cache effects.** A "worse" $O(n^2)$ that streams memory linearly can beat an $O(n \log n)$ that thrashes cache.
- **Worst vs average case.** Quicksort is $O(n^2)$ worst-case but $O(n\log n)$ on average — and wins in practice.

## The takeaway

Big-O is a statement about the *shape* of a curve, not its height. Use it to choose algorithms for growth, then measure to choose for speed.

## Further reading

- [Dynamic Programming: The Two Questions]({% post_url 2025-11-01-dynamic-programming-two-questions %})
- [How Quicksort Really Works]({% post_url 2025-11-15-how-quicksort-really-works %})
