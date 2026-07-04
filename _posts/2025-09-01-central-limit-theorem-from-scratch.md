---
title: "The Central Limit Theorem from Scratch"
date: 2025-09-01
categories: [probability]
tags: [clt, distributions, intuition]
series: "Probability for the Working Scientist"
description: "Why sums of almost anything become Gaussian — and what the theorem does and doesn't promise."
math: true
toc: true
---

The central limit theorem is the reason the bell curve is everywhere. Heights, measurement errors, sample means — all approximately Gaussian. But *why*?

<!--more-->

## The statement

Let $X_1, X_2, \ldots$ be i.i.d. with mean $\mu$ and finite variance $\sigma^2$. Define the standardised sum:

$$
Z_n = \frac{\sum_{i=1}^n X_i - n\mu}{\sigma \sqrt{n}}
$$

Then as $n \to \infty$:

$$
Z_n \xrightarrow{d} \mathcal{N}(0, 1)
$$

The distribution of the *original* variables barely matters — uniform, exponential, a weird bimodal thing — the standardised sum converges to the same standard normal.

## Why $\sqrt{n}$, not $n$

The sum's variance grows like $n\sigma^2$, so its standard deviation grows like $\sigma\sqrt{n}$. To get a stable limiting shape you must divide by $\sqrt{n}$. Divide by $n$ and you get the law of large numbers (a point mass at $\mu$); divide by $\sqrt{n}$ and you see the *fluctuations*, which are Gaussian.

## A two-line demonstration

```python
import numpy as np
# Sum of uniform variables — nothing Gaussian about the source
sums = np.random.rand(100_000, 30).sum(axis=1)
z = (sums - 30*0.5) / (np.sqrt(30) * np.sqrt(1/12))
# z is now ~ N(0,1): mean ~0, std ~1, bell-shaped
print(z.mean(), z.std())
```

Even with $n = 30$ uniforms, the histogram of $z$ is visually indistinguishable from a bell curve.

## What it does *not* promise

- **Not** that everything is Gaussian — only *sums of many independent, finite-variance* contributions.
- **Nothing** about the tails at finite $n$. Convergence is fastest near the centre; rare events can be badly mis-estimated.
- It fails for heavy-tailed sources with infinite variance (e.g. Cauchy) — there the stable limit is *not* Gaussian.

## The takeaway

The CLT explains the bell curve's ubiquity: whenever an outcome is a sum of many small independent pieces, the Gaussian appears — regardless of the pieces' own shapes.

## Further reading

- [Bayes' Theorem as a Change of Belief]({% post_url 2025-08-15-bayes-theorem-change-of-belief %})
- [Concentration Inequalities You Should Know]({% post_url 2025-09-15-concentration-inequalities %})
