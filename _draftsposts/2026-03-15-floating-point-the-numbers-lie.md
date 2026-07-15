---
title: "Floating Point: The Numbers Lie"
date: 2026-03-15
categories: [computing]
tags: [ieee754, numerics, precision]
description: "Why 0.1 + 0.2 ≠ 0.3, and what every programmer should know about the numbers their machine actually stores."
math: true
toc: true
---

Open a Python prompt and type `0.1 + 0.2`. You get `0.30000000000000004`. This isn't a bug — it's a direct consequence of how computers represent real numbers, and it has bitten everyone from game developers to bankers.

<!--more-->

## Finite bits, infinite reals

A 64-bit `double` has 64 bits to represent *uncountably many* real numbers. Something must give. The IEEE 754 standard stores numbers in the form:

$$
x = (-1)^s \times 1.m \times 2^{e}
$$

with a sign bit $s$, a 52-bit mantissa $m$, and an 11-bit exponent $e$. Only numbers expressible this way exist exactly; everything else is rounded to the nearest representable value.

## Why 0.1 is doomed

$0.1$ in binary is a *repeating* fraction, like $1/3$ in decimal:

$$
0.1_{10} = 0.0001100110011\ldots_2
$$

It can't be stored exactly in finite bits. The machine keeps the closest 64-bit value, which is slightly more than $0.1$. Add two such errors and the discrepancy becomes visible.

```python
from decimal import Decimal
print(Decimal(0.1))  # 0.1000000000000000055511151231257827021181583404541015625
```

## Machine epsilon

The granularity of the representation is **machine epsilon**, the gap between 1.0 and the next representable number:

$$
\epsilon_{\text{machine}} = 2^{-52} \approx 2.22 \times 10^{-16}
$$

Relative rounding error per operation is bounded by $\epsilon_{\text{machine}}/2$. The danger is *accumulation* — and catastrophic cancellation, where subtracting two nearly equal numbers wipes out significant digits.

## Practical rules

- **Never test floats for equality.** Use a tolerance: `abs(a - b) < 1e-9`.
- **Don't represent money as floats.** Use integers (cents) or a decimal type.
- **Sum carefully.** Adding many small numbers to a large running total loses precision; algorithms like Kahan summation fix it.
- **Mind the order.** Floating-point addition isn't associative: $(a + b) + c \neq a + (b + c)$ in general.

## The takeaway

Floating-point numbers are a lossy compression of the reals. They're astonishingly useful, but they lie in the last digits — and knowing *where* they lie is the difference between robust and fragile numerical code.

## Further reading

- [Taylor Series: Approximating Anything]({% post_url 2026-03-01-taylor-series-approximating-anything %})
- [Vectorization: Why NumPy Is Fast]({% post_url 2026-04-01-vectorization-why-numpy-is-fast %})
