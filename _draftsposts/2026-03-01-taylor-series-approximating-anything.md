---
title: "Taylor Series: Approximating Anything"
date: 2026-03-01
categories: [analysis]
tags: [series, calculus, approximation]
description: "How a calculator computes sine, and why a polynomial can stand in for almost any smooth function."
math: true
toc: true
---

Your calculator doesn't "know" $\sin(0.7)$. It computes it — by adding up a polynomial. Taylor series are how we replace hard functions with the only functions computers truly love: polynomials.

<!--more-->

## The idea

Near a point $a$, a smooth function is well approximated by matching its value and derivatives with a polynomial:

$$
f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x - a)^n
$$

The $n$-th term forces the polynomial's $n$-th derivative to agree with $f$ at $a$. Match enough derivatives and the polynomial hugs the curve over a useful range.

## The famous expansions (around $a = 0$)

$$
e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!}, \qquad
\sin x = \sum_{n=0}^{\infty} \frac{(-1)^n x^{2n+1}}{(2n+1)!}, \qquad
\cos x = \sum_{n=0}^{\infty} \frac{(-1)^n x^{2n}}{(2n)!}
$$

Three of the most important functions in mathematics, each just a list of coefficients.

## Truncation and error

In practice you stop after $N$ terms. The **Lagrange remainder** bounds the error:

$$
R_N(x) = \frac{f^{(N+1)}(\xi)}{(N+1)!}(x - a)^{N+1}
$$

for some $\xi$ between $a$ and $x$. The factorial in the denominator is why few terms suffice near $a$: the error shrinks fast.

```python
import math

def sin_taylor(x, terms=10):
    total = 0.0
    for n in range(terms):
        total += (-1)**n * x**(2*n + 1) / math.factorial(2*n + 1)
    return total

print(sin_taylor(0.7), math.sin(0.7))  # agree to ~10 digits
```

## Where it breaks

- **Far from $a$:** accuracy degrades; $\sin x$'s series needs many terms for large $x$ (real libraries first reduce $x$ modulo $2\pi$).
- **Limited radius of convergence:** $\frac{1}{1-x} = \sum x^n$ only converges for $|x| < 1$, even though the function is fine at $x = 2$.
- **Smooth but not analytic:** some functions have a valid Taylor series that converges to the *wrong* value.

## The takeaway

Taylor series turn calculus into arithmetic: match derivatives at a point, add a few terms, and a polynomial does the work of a transcendental function — with an error you can bound.

## Further reading

- [The ε–δ Definition, Finally Intuitive]({% post_url 2026-02-15-epsilon-delta-finally-intuitive %})
- [Floating Point: The Numbers Lie]({% post_url 2026-03-15-floating-point-the-numbers-lie %})
