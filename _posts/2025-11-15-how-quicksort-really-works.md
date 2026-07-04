---
title: "How Quicksort Really Works (and When It Doesn't)"
date: 2025-11-15
categories: [algorithms]
tags: [sorting, analysis, recursion]
series: "Algorithms, Honestly"
description: "The average-case star of sorting hides a quadratic worst case. Here's the probability that explains both."
math: true
toc: true
---

Quicksort is the default sorting algorithm in countless libraries, yet its worst case is a dismal $O(n^2)$. Understanding *why it's fast anyway* is a lesson in average-case analysis.

<!--more-->

## The algorithm

Pick a **pivot**, partition the array into elements less than and greater than it, then recursively sort each side.

```python
def quicksort(a):
    if len(a) <= 1:
        return a
    pivot = a[len(a) // 2]
    less = [x for x in a if x < pivot]
    equal = [x for x in a if x == pivot]
    greater = [x for x in a if x > pivot]
    return quicksort(less) + equal + quicksort(greater)
```

## Why the average case is $O(n\log n)$

Partitioning costs $O(n)$. The question is how many levels of recursion there are. With a random pivot, each partition splits the array into two parts whose expected sizes are balanced enough that the expected recursion depth is $O(\log n)$.

The expected number of comparisons satisfies:

$$
\mathbb{E}[C_n] = (n-1) + \frac{1}{n}\sum_{i=1}^{n} \big(\mathbb{E}[C_{i-1}] + \mathbb{E}[C_{n-i}]\big)
$$

which solves to $\mathbb{E}[C_n] \approx 2n \ln n \approx 1.39\, n \log_2 n$. That's $O(n \log n)$ with a small constant.

## Why the worst case is $O(n^2)$

If the pivot is always the smallest (or largest) element — e.g. picking the first element of an already-sorted array — each partition removes just one element. The recursion depth becomes $n$, giving:

$$
\sum_{k=1}^{n} (k - 1) = \frac{n(n-1)}{2} = O(n^2)
$$

## How real implementations avoid it

- **Randomised pivots** make adversarial inputs vanishingly unlikely.
- **Median-of-three** pivots resist sorted and reverse-sorted inputs.
- **Introsort** (used in C++'s `std::sort`) starts with quicksort and *switches to heapsort* once recursion depth exceeds $O(\log n)$, guaranteeing $O(n\log n)$ worst case.

## The takeaway

Quicksort's speed is a probabilistic promise, not a guarantee. Randomisation turns a fragile $O(n^2)$ algorithm into a robust $O(n\log n)$ one — a recurring theme in algorithm design.

## Further reading

- [Big-O Is About Growth, Not Speed]({% post_url 2025-10-15-big-o-is-about-growth %})
- [Dynamic Programming: The Two Questions]({% post_url 2025-11-01-dynamic-programming-two-questions %})
