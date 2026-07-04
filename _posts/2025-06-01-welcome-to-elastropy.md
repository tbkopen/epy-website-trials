---
title: "Welcome to Elastropy"
date: 2025-06-01
categories: [meta]
tags: [introduction]
description: "Why I started writing here, and what you can expect."
math: true
toc: true
---

Every good blog post about starting a blog is secretly a contract with the reader. Here's mine.

<!--more-->

## What this site is about

Elastropy is a place for writing that takes mathematics seriously without losing sight of why it matters. The posts here will mostly be about:

- **Linear algebra** — the geometry hiding inside matrices and why it matters for computing
- **Probability and statistics** — rigorous foundations, not just recipes
- **Algorithms** — what makes them correct and what makes them fast
- **Machine learning** — the mathematical scaffolding most introductions skip

## A taste of what's coming

Here's a small example to set the tone. Consider the **Cauchy-Schwarz inequality**:

$$
\langle u, v \rangle^2 \leq \langle u, u \rangle \cdot \langle v, v \rangle
$$

Or equivalently, for vectors in $\mathbb{R}^n$:

$$
\left(\sum_{i=1}^{n} u_i v_i\right)^2 \leq \left(\sum_{i=1}^{n} u_i^2\right)\left(\sum_{i=1}^{n} v_i^2\right)
$$

Most proofs show you *that* it's true. What I'll try to do is show you *why* it's true in a way that makes it obvious in hindsight — so obvious you feel like you could have discovered it yourself.

That's the goal here.

## The courses

Alongside the blog, I'm building structured courses for people who want to go deeper with the support of exercises, worked solutions, and a clear progression. If you want to know when they launch, [subscribe](/newsletter/).

## Let's get started

Thanks for being here. The best place to start is the [blog index](/blog/) — or, if you want to skip straight to something substantial, check the [courses page](/courses/).
