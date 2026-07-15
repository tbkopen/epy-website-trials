---
title: "Concentration Inequalities You Should Know"
date: 2025-09-15
categories: [probability]
tags: [hoeffding, chebyshev, bounds]
series: "Probability for the Working Scientist"
description: "Markov, Chebyshev, Hoeffding — a ladder of tools for bounding how far a random variable strays from its mean."
math: true
toc: true
---

How likely is a random quantity to land far from its average? Concentration inequalities answer this *without knowing the full distribution* — you trade exactness for guarantees that always hold.

<!--more-->

## Markov: the foundation

For a non-negative random variable $X$ and any $a > 0$:

$$
P(X \geq a) \leq \frac{\mathbb{E}[X]}{a}
$$

Crude but universal. Everything below is built from it.

## Chebyshev: using the variance

Apply Markov to $(X - \mu)^2$ and you bound deviations in terms of variance $\sigma^2$:

$$
P(|X - \mu| \geq k\sigma) \leq \frac{1}{k^2}
$$

At least 75% of any distribution's mass lies within two standard deviations; at least 89% within three. Always — no normality assumed.

## Hoeffding: exponential bounds for sums

This is the one that powers machine-learning theory. For independent $X_i \in [a_i, b_i]$ with sum $S_n$:

$$
P\!\left(|S_n - \mathbb{E}[S_n]| \geq t\right) \leq 2 \exp\!\left(\frac{-2t^2}{\sum_i (b_i - a_i)^2}\right)
$$

The bound decays *exponentially* in $t^2$ — far stronger than Chebyshev's $1/k^2$. For $n$ bounded i.i.d. variables, the sample mean is within $\epsilon$ of the true mean with probability at least $1 - 2e^{-2n\epsilon^2}$.

## Why ML cares

Hoeffding tells you how many samples guarantee a reliable estimate. Want the empirical mean within $0.01$ of the truth with 99% confidence for variables in $[0,1]$?

$$
2e^{-2n(0.01)^2} \leq 0.01 \;\Longrightarrow\; n \geq \frac{\ln(200)}{2 \cdot 10^{-4}} \approx 26{,}500
$$

```python
import math
def hoeffding_n(eps, delta):
    return math.ceil(math.log(2/delta) / (2*eps**2))
print(hoeffding_n(0.01, 0.01))  # 26492
```

## The takeaway

Three rungs of a ladder: Markov needs only non-negativity, Chebyshev adds variance, Hoeffding adds boundedness and independence to buy exponential decay.

## Further reading

- [The Central Limit Theorem from Scratch]({% post_url 2025-09-01-central-limit-theorem-from-scratch %})
- [The Bias–Variance Tradeoff, Demystified]({% post_url 2025-12-15-bias-variance-tradeoff %})
