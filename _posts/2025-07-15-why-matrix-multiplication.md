---
title: "Why Matrix Multiplication Is Defined \"That Way\""
date: 2025-07-15
categories: [linear-algebra]
tags: [matrices, intuition, composition]
description: "The row-times-column rule looks arbitrary until you see it's forced by one requirement: matrices compose like functions."
math: true
toc: true
---

Students meet matrix multiplication as a rule: to get entry $(i,j)$ of $AB$, dot the $i$-th row of $A$ with the $j$-th column of $B$. It feels arbitrary. Why not multiply entry-by-entry?

<!--more-->

## Matrices *are* linear maps

A matrix is not a grid of numbers — it's a **linear map** in disguise. An $m \times n$ matrix $A$ takes a vector $x \in \mathbb{R}^n$ and produces $Ax \in \mathbb{R}^m$.

Once you accept that, one demand follows: if $A$ and $B$ are maps, then $AB$ should be the map you get by **doing $B$ first, then $A$** — function composition.

## Composition forces the rule

Let $B: \mathbb{R}^p \to \mathbb{R}^n$ and $A: \mathbb{R}^n \to \mathbb{R}^m$. We want $AB$ to satisfy:

$$
(AB)x = A(Bx) \quad \text{for all } x
$$

Work out what $A(Bx)$ does to the standard basis vector $e_j$. The vector $Be_j$ is the $j$-th column of $B$. Applying $A$ to it gives a combination of $A$'s columns weighted by that column of $B$ — which is exactly the row-times-column formula:

$$
(AB)_{ij} = \sum_{k=1}^{n} A_{ik} B_{kj}
$$

The "weird" rule is the *only* definition that makes matrix multiplication agree with composition of the underlying maps.

## Why entrywise multiplication fails

Entrywise multiplication (the Hadamard product) is a perfectly good operation — but it does **not** correspond to composing maps. Under it, the identity matrix wouldn't act as an identity for composition, and $A(Bx) \neq (A \cdot B)x$. It answers a different question.

## A consequence: non-commutativity is obvious

Function composition isn't commutative — putting on socks then shoes differs from shoes then socks. So $AB \neq BA$ in general should surprise no one. The algebra is just inheriting a fact about doing things in order.

## The takeaway

Don't memorise the rule. Remember that **matrices compose like functions**, and the rule reconstructs itself every time.

## Further reading

- [What Eigenvectors Actually Are]({% post_url 2025-06-15-understanding-eigenvectors %})
- [The Four Fundamental Subspaces]({% post_url 2025-08-01-four-fundamental-subspaces %})
