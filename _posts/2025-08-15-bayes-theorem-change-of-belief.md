---
title: "Bayes' Theorem as a Change of Belief"
date: 2025-08-15
categories: [probability]
tags: [bayes, inference, intuition]
series: "Probability for the Working Scientist"
description: "Bayes' theorem isn't a formula to plug into — it's the arithmetic of updating what you believe when evidence arrives."
math: true
toc: true
---

Most people can state Bayes' theorem and still not *feel* it. The formula is short; the intuition is shorter: **evidence reshapes belief in proportion to how well each hypothesis predicted it.**

<!--more-->

## The formula

$$
P(H \mid E) = \frac{P(E \mid H)\, P(H)}{P(E)}
$$

Read it as a transformation of your **prior** $P(H)$ into a **posterior** $P(H \mid E)$, scaled by the **likelihood** $P(E \mid H)$ and normalised by the **evidence** $P(E)$.

## The medical-test trap

A test is 99% accurate. You test positive for a disease that affects 1 in 1000 people. What's the chance you have it?

Most say 99%. The real answer is about **9%**. Let $H$ = "has disease," $E$ = "positive test."

$$
P(H \mid E) = \frac{0.99 \times 0.001}{0.99 \times 0.001 + 0.01 \times 0.999} \approx 0.090
$$

The rare prior dominates. A 99%-accurate test still produces ten false positives for every true positive when the disease is one-in-a-thousand.

```python
def posterior(sensitivity, specificity, prior):
    p_e = sensitivity * prior + (1 - specificity) * (1 - prior)
    return sensitivity * prior / p_e

print(posterior(0.99, 0.99, 0.001))  # 0.0902...
```

## Odds form: where the intuition lives

Divide Bayes' theorem for $H$ by the same for $\neg H$ and the awkward $P(E)$ cancels:

$$
\underbrace{\frac{P(H \mid E)}{P(\neg H \mid E)}}_{\text{posterior odds}}
= \underbrace{\frac{P(H)}{P(\neg H)}}_{\text{prior odds}} \times \underbrace{\frac{P(E \mid H)}{P(E \mid \neg H)}}_{\text{likelihood ratio}}
$$

**Posterior odds = prior odds × likelihood ratio.** Each new piece of independent evidence just multiplies the odds by its likelihood ratio. That's the whole machine.

## The takeaway

Bayes' theorem is not about memorising $P(E)$ in the denominator. It's: start with prior odds, multiply by how strongly the evidence distinguishes your hypotheses, get posterior odds.

## Further reading

- [Concentration Inequalities You Should Know]({% post_url 2025-09-15-concentration-inequalities %})
- E.T. Jaynes, *Probability Theory: The Logic of Science*.
