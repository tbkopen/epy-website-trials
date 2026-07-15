---
title: "New PINNs Tutorial Published: Inverse Modeling of 2D Incompressible Navier–Stokes Equations (Full PyTorch Implementation)"
date: 2026-01-15
categories: [pinns-masterclass]
tags: [pinns-masterclass, new-tutorial-added]
description: "👉 Existing students can access this tutorial anytime from their course dashboard."
math: true
toc: true
show-authors: true
author: "Elastropy Team"
author_bio: "Updates, notes, and tutorials from the Elastropy team."
---

> 👉 **Existing students can access this tutorial anytime from their course dashboard.**

<br>

We just added a **fresh, implementation-first tutorial** to my PINNs course — and this one is special.

In this tutorial, we solve an **inverse problem for the 2D incompressible Navier–Stokes equations** using a real CFD dataset (**cylinder wake flow**). We intentionally **keep only sparse velocity observations** and ask a PINN to reconstruct the full flow physics: <!--more-->

* learn the fields **(u, v, p)**
* and **identify unknown physical coefficients** **(C1, C2)** directly from data + equations

If you’ve ever wondered whether PINNs can *actually* infer physics hidden inside CFD data — this notebook is built to verify that, end-to-end.

### What you’ll learn (the practical stuff)

This tutorial is structured like a real engineering workflow, not a demo:

**1) Dataset → training pool (properly)**

* Load the `.mat` cylinder wake dataset and validate shapes
* Select target time snapshots cleanly
* Plot reference **u, v, p** on an **unstructured grid** (so you can see the “truth” before training)

**2) Collocation points: where physics is enforced**

* Construct physics collocation points in **space-time**
* Understand how the PINN “sees” the PDE without being handed full fields everywhere

**3) The inverse PINN model (PyTorch)**

* Build an MLP that outputs **(u, v, p)**
* Define Navier–Stokes residuals using autodiff:

  * continuity + x-momentum + y-momentum
* Make **C1 and C2 trainable parameters** and learn them during training

**4) Training + validation**

* Two-stage Adam training (practical, stable)
* Track separate **data loss vs physics loss**
* Compare the learned solution against the reference CFD fields

### A key concept covered clearly: pressure gauge freedom

The notebook also explains why pressure is only identifiable **up to an additive constant** (i.e., (p + C) is equally valid), and what that means when comparing PINN pressure with CFD pressure.

If you’re already in the course, you can jump into the notebook now and run it as-is.
If you’re serious about PINNs, this tutorial will feel like a proper bridge into research-grade problems.




## This content is available in ...

For readers who want to understand **how PINNs are formulated in practice for the incompressible Navier–Stokes equations** — including **learning unknown flow parameters**, **coupling velocity and pressure losses**, **scaling momentum vs continuity residuals**, and why **incorrect physical coefficients can still produce low Navier–Stokes residuals** — a hands-on walkthrough is available as part of the ***PINNs Masterclass***.

[Learn More →](https://exly.co/PvxFUL)

> We’ve published a public **Content Delivery Timeline** that shows what topics we’re actively considering, working on, and planning to deliver.
> The list is curated from real signals — YouTube comments, messages/DMs, corporate training inputs, tech trends, and recurring practical pain points.
> You can **register your interest** on the listed topics to help us decide what to take up sooner. Every topic is tracked to a clear outcome: **published, rescoped, or discontinued**.
> 👉 **View the timeline and register your interest here:** [[link]](https://blog.elastropy.com/delivery-timeline/)
