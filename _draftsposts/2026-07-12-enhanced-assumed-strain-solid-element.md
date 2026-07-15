---
layout: post
title: "The Enhanced Assumed Strain Solid Element, Derived in Full"
date: 2026-07-12
categories: [computing]
tags: [finite-element-method, computational-mechanics, solid-mechanics]
description: "A complete finite element formulation of a 3D 8-node solid element with enhanced assumed strains — from the balance of momentum and the weak form, through the shape functions, B-operator, Jacobian and enhanced-strain transformation, to the condensed element stiffness matrix."
image: /assets/images/posts/2026-07-12-enhanced-assumed-strain-cover.svg
image_alt: "Isometric 8-node hexahedral finite element showing corner nodes 1 to 8, the 2x2x2 Gauss integration points, and the natural coordinate axes xi, eta, zeta."
math: true
toc: true
---

The 8-node hexahedron is the workhorse of solid finite element analysis, but in its raw trilinear form it *locks*: far too stiff in bending, and hopeless as the material approaches incompressibility. The **Enhanced Assumed Strain** (EAS) method, introduced by Simo and Rifai, cures this by adding a handful of element-local strain modes that are condensed away before assembly — so the element still has only its eight corner nodes, but behaves far better.

This post derives the whole thing, end to end: from the governing equations to the final, condensed element stiffness matrix.

<!--more-->

## The strong form

We work in small-strain linear elastostatics on a body occupying the domain $$\Omega \subset \mathbb{R}^3$$ with boundary $$\Gamma = \Gamma_u \cup \Gamma_t$$. The three governing statements are the **balance of linear momentum**, the **strain–displacement** relation, and the **constitutive law**:

$$
\nabla \cdot \boldsymbol{\sigma} + \mathbf{b} = \mathbf{0} \quad \text{in } \Omega,
$$

$$
\boldsymbol{\varepsilon} = \nabla^{s} \mathbf{u} = \tfrac{1}{2}\!\left(\nabla \mathbf{u} + \nabla \mathbf{u}^{\mathsf T}\right),
\qquad
\boldsymbol{\sigma} = \mathbb{C}\,\boldsymbol{\varepsilon},
$$

subject to the boundary conditions

$$
\mathbf{u} = \bar{\mathbf{u}} \ \text{ on } \Gamma_u,
\qquad
\boldsymbol{\sigma}\cdot\mathbf{n} = \bar{\mathbf{t}} \ \text{ on } \Gamma_t.
$$

Here $$\mathbf{u}$$ is the displacement, $$\boldsymbol{\sigma}$$ the Cauchy stress, $$\mathbf{b}$$ the body force, and $$\mathbb{C}$$ the fourth-order elasticity tensor.

Throughout we use **Voigt notation**, collecting the symmetric stress and strain tensors into six-vectors,

$$
\boldsymbol{\sigma} = \big[\sigma_{11},\,\sigma_{22},\,\sigma_{33},\,\sigma_{12},\,\sigma_{23},\,\sigma_{31}\big]^{\mathsf T},
\qquad
\boldsymbol{\varepsilon} = \big[\varepsilon_{11},\,\varepsilon_{22},\,\varepsilon_{33},\,\gamma_{12},\,\gamma_{23},\,\gamma_{31}\big]^{\mathsf T},
$$

with engineering shear strains $$\gamma_{ij} = 2\varepsilon_{ij}$$, so that $$\boldsymbol{\sigma} = \mathbf{C}\,\boldsymbol{\varepsilon}$$ with the $$6\times 6$$ material matrix $$\mathbf{C}$$.

## The weak form

Multiplying the momentum balance by an admissible virtual displacement $$\delta\mathbf{u}$$ (with $$\delta\mathbf{u} = \mathbf{0}$$ on $$\Gamma_u$$), integrating over $$\Omega$$, and applying the divergence theorem gives the **principle of virtual work**: find $$\mathbf{u}$$ such that

$$
\int_\Omega \delta\boldsymbol{\varepsilon}^{\mathsf T}\boldsymbol{\sigma}\,\mathrm{d}\Omega
=
\int_\Omega \delta\mathbf{u}^{\mathsf T}\mathbf{b}\,\mathrm{d}\Omega
+
\int_{\Gamma_t} \delta\mathbf{u}^{\mathsf T}\bar{\mathbf{t}}\,\mathrm{d}\Gamma
\qquad \forall\,\delta\mathbf{u},
$$

with $$\delta\boldsymbol{\varepsilon} = \nabla^{s}\delta\mathbf{u}$$. The right-hand side is the external virtual work; call it $$\delta W_{\text{ext}}$$.

### Why the trilinear hex locks

Discretising this single-field statement directly with trilinear shape functions gives the standard displacement element. Its strain field is limited to what the trilinear displacement can produce, and that space is too poor in two important regimes:

- **Volumetric locking** — as $$\nu \to 1/2$$, the element cannot represent isochoric deformation without spurious pressure, so it stiffens dramatically.
- **Shear locking** — under bending, the trilinear field manufactures parasitic shear strains that soak up energy that should have gone into bending.

EAS attacks both by *enriching the strain field itself*, independently of the displacement.

## The Hu–Washizu three-field principle

The starting point is the **Hu–Washizu** functional, which treats displacement $$\mathbf{u}$$, strain $$\boldsymbol{\varepsilon}$$, and stress $$\boldsymbol{\sigma}$$ as independent fields:

$$
\Pi_{\text{HW}}(\mathbf{u},\boldsymbol{\varepsilon},\boldsymbol{\sigma})
=
\int_\Omega \Big[\, \tfrac{1}{2}\,\boldsymbol{\varepsilon}^{\mathsf T}\mathbf{C}\,\boldsymbol{\varepsilon}
\;-\; \boldsymbol{\sigma}^{\mathsf T}\!\big(\boldsymbol{\varepsilon} - \nabla^{s}\mathbf{u}\big) \Big]\,\mathrm{d}\Omega
\;-\; W_{\text{ext}}(\mathbf{u}).
$$

Its stationarity conditions recover, in turn, the constitutive law, compatibility ($$\boldsymbol{\varepsilon} = \nabla^{s}\mathbf{u}$$), and equilibrium.

## The enhanced assumed strain split

The EAS idea is to additively split the independent strain into a **compatible** part coming from the displacement and an **enhanced** part $$\tilde{\boldsymbol{\varepsilon}}$$ that is a genuinely new field:

$$
\boldsymbol{\varepsilon} = \underbrace{\nabla^{s}\mathbf{u}}_{\text{compatible}} \;+\; \tilde{\boldsymbol{\varepsilon}}.
$$

Substituting into $$\Pi_{\text{HW}}$$, the $$\boldsymbol{\sigma}^{\mathsf T}(\boldsymbol{\varepsilon}-\nabla^{s}\mathbf{u})$$ term becomes $$\boldsymbol{\sigma}^{\mathsf T}\tilde{\boldsymbol{\varepsilon}}$$:

$$
\Pi(\mathbf{u},\tilde{\boldsymbol{\varepsilon}},\boldsymbol{\sigma})
=
\int_\Omega \Big[\, \tfrac{1}{2}\big(\nabla^{s}\mathbf{u} + \tilde{\boldsymbol{\varepsilon}}\big)^{\mathsf T}\mathbf{C}\big(\nabla^{s}\mathbf{u} + \tilde{\boldsymbol{\varepsilon}}\big)
\;-\; \boldsymbol{\sigma}^{\mathsf T}\tilde{\boldsymbol{\varepsilon}} \Big]\,\mathrm{d}\Omega
\;-\; W_{\text{ext}}.
$$

Taking variations with respect to each field:

$$
\delta\mathbf{u}: \quad \int_\Omega (\nabla^{s}\delta\mathbf{u})^{\mathsf T}\,\mathbf{C}\big(\nabla^{s}\mathbf{u}+\tilde{\boldsymbol{\varepsilon}}\big)\,\mathrm{d}\Omega = \delta W_{\text{ext}},
$$

$$
\delta\tilde{\boldsymbol{\varepsilon}}: \quad \int_\Omega \delta\tilde{\boldsymbol{\varepsilon}}^{\mathsf T}\Big[\mathbf{C}\big(\nabla^{s}\mathbf{u}+\tilde{\boldsymbol{\varepsilon}}\big) - \boldsymbol{\sigma}\Big]\,\mathrm{d}\Omega = 0,
$$

$$
\delta\boldsymbol{\sigma}: \quad \int_\Omega \delta\boldsymbol{\sigma}^{\mathsf T}\,\tilde{\boldsymbol{\varepsilon}}\,\mathrm{d}\Omega = 0.
$$

The decisive step is the **orthogonality assumption**: choose the enhanced-strain space and the stress space to be $$L^2$$-orthogonal,

$$
\int_\Omega \delta\boldsymbol{\sigma}^{\mathsf T}\,\tilde{\boldsymbol{\varepsilon}}\,\mathrm{d}\Omega = 0
\quad \text{for all admissible } \boldsymbol{\sigma},\ \tilde{\boldsymbol{\varepsilon}}.
$$

This makes the $$\delta\boldsymbol{\sigma}$$ equation vanish identically, and it kills the $$\boldsymbol{\sigma}$$ term in the $$\delta\tilde{\boldsymbol{\varepsilon}}$$ equation. The independent stress **drops out entirely**, leaving a compact two-field problem in $$(\mathbf{u},\tilde{\boldsymbol{\varepsilon}})$$:

$$
\int_\Omega (\nabla^{s}\delta\mathbf{u})^{\mathsf T}\,\mathbf{C}\big(\nabla^{s}\mathbf{u}+\tilde{\boldsymbol{\varepsilon}}\big)\,\mathrm{d}\Omega = \delta W_{\text{ext}},
$$

$$
\int_\Omega \delta\tilde{\boldsymbol{\varepsilon}}^{\mathsf T}\,\mathbf{C}\big(\nabla^{s}\mathbf{u}+\tilde{\boldsymbol{\varepsilon}}\big)\,\mathrm{d}\Omega = 0.
$$

We will see below that, on the discrete level, the orthogonality condition becomes a simple integral constraint on the enhanced modes that guarantees the **patch test**.

## Discretisation: geometry, displacement, and the B-operator

Consider a single 8-node hexahedral element mapped from the bi-unit reference cube $$\square = [-1,1]^3$$ with natural coordinates $$\boldsymbol{\xi}=(\xi,\eta,\zeta)$$. The **trilinear shape functions** are

$$
N_I(\xi,\eta,\zeta) = \tfrac{1}{8}\big(1+\xi_I\,\xi\big)\big(1+\eta_I\,\eta\big)\big(1+\zeta_I\,\zeta\big),
\qquad I = 1,\dots,8,
$$

where $$(\xi_I,\eta_I,\zeta_I)\in\{-1,+1\}^3$$ are the corner coordinates. Geometry and displacement use the same functions (isoparametric):

$$
\mathbf{x} = \sum_{I=1}^{8} N_I\,\mathbf{x}_I,
\qquad
\mathbf{u}^h = \sum_{I=1}^{8} N_I\,\mathbf{d}_I = \mathbf{N}\,\mathbf{d},
$$

with $$\mathbf{d} = [\mathbf{d}_1;\dots;\mathbf{d}_8]\in\mathbb{R}^{24}$$ the nodal displacement vector.

### The Jacobian

Shape-function derivatives are naturally computed in the reference frame, so we need the **Jacobian** of the isoparametric map:

$$
\mathbf{J} = \frac{\partial \mathbf{x}}{\partial \boldsymbol{\xi}}
= \sum_{I=1}^{8} \mathbf{x}_I \,\frac{\partial N_I}{\partial \boldsymbol{\xi}}^{\!\mathsf T},
\qquad
J_{ij} = \frac{\partial x_i}{\partial \xi_j}.
$$

Cartesian derivatives then follow from the chain rule, and the volume element carries the determinant:

$$
\frac{\partial N_I}{\partial \mathbf{x}} = \mathbf{J}^{-1}\frac{\partial N_I}{\partial \boldsymbol{\xi}},
\qquad
\mathrm{d}\Omega = \det\mathbf{J}\;\mathrm{d}\xi\,\mathrm{d}\eta\,\mathrm{d}\zeta.
$$

### The strain–displacement operator

The compatible strain is $$\nabla^{s}\mathbf{u}^h = \mathbf{B}\,\mathbf{d}$$, where the $$6\times 24$$ operator $$\mathbf{B} = [\mathbf{B}_1,\dots,\mathbf{B}_8]$$ is assembled from nodal blocks built out of the Cartesian derivatives $$N_{I,x}=\partial N_I/\partial x$$, etc.:

$$
\mathbf{B}_I =
\begin{bmatrix}
N_{I,x} & 0 & 0 \\
0 & N_{I,y} & 0 \\
0 & 0 & N_{I,z} \\
N_{I,y} & N_{I,x} & 0 \\
0 & N_{I,z} & N_{I,y} \\
N_{I,z} & 0 & N_{I,x}
\end{bmatrix}.
$$

## The enhanced strain field

The enhanced strain is interpolated element-locally through a set of internal parameters $$\boldsymbol{\alpha}$$:

$$
\tilde{\boldsymbol{\varepsilon}}^h = \mathbf{G}(\boldsymbol{\xi})\,\boldsymbol{\alpha}.
$$

The parameters $$\boldsymbol{\alpha}$$ belong to the element alone — they are never shared between elements and never assembled — which is exactly what makes their **static condensation** possible.

### Enhanced modes in the natural frame

We first prescribe the modes in the reference frame, as a matrix $$\hat{\mathbf{G}}(\boldsymbol{\xi})$$ of low-order monomials. The classic 9-parameter set (**EAS-9**) enriches each normal strain with its conjugate coordinate and each shear strain with the two in-plane coordinates:

$$
\hat{\mathbf{G}}(\boldsymbol{\xi}) =
\begin{bmatrix}
\xi & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & \eta & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & \zeta & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & \xi & \eta & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & \eta & \zeta & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & \zeta & \xi
\end{bmatrix}.
$$

The three normal-strain modes cure volumetric and Poisson locking; the six shear modes address shear locking. Richer variants (EAS-21, EAS-30) add bilinear terms to stay robust on distorted meshes, but the construction below is identical — only the number of columns of $$\hat{\mathbf{G}}$$ changes.

### Transforming to the physical frame

The modes above live in the natural frame; they must be mapped to Cartesian strains. Since the enhanced strain is a (covariant) tensor, its natural and Cartesian Voigt representations are related by a $$6\times 6$$ transformation $$\mathbf{T}(\mathbf{J})$$ that encodes the tensor congruence $$\mathbf{E}_{\text{nat}} = \mathbf{J}^{\mathsf T}\mathbf{E}_{\text{cart}}\,\mathbf{J}$$. Writing $$a_{ij}=J_{ij}$$ and using **tensor** shear components in the strain vector, the transformation $$\boldsymbol{\varepsilon}_{\text{nat}} = \mathbf{T}(\mathbf{J})\,\boldsymbol{\varepsilon}_{\text{cart}}$$ is

$$
\mathbf{T} =
\begin{bmatrix}
a_{11}^2 & a_{21}^2 & a_{31}^2 & 2a_{11}a_{21} & 2a_{21}a_{31} & 2a_{31}a_{11}\\
a_{12}^2 & a_{22}^2 & a_{32}^2 & 2a_{12}a_{22} & 2a_{22}a_{32} & 2a_{32}a_{12}\\
a_{13}^2 & a_{23}^2 & a_{33}^2 & 2a_{13}a_{23} & 2a_{23}a_{33} & 2a_{33}a_{13}\\
a_{11}a_{12} & a_{21}a_{22} & a_{31}a_{32} & a_{11}a_{22}{+}a_{21}a_{12} & a_{21}a_{32}{+}a_{31}a_{22} & a_{31}a_{12}{+}a_{11}a_{32}\\
a_{12}a_{13} & a_{22}a_{23} & a_{32}a_{33} & a_{12}a_{23}{+}a_{22}a_{13} & a_{22}a_{33}{+}a_{32}a_{23} & a_{32}a_{13}{+}a_{12}a_{33}\\
a_{13}a_{11} & a_{23}a_{21} & a_{33}a_{31} & a_{13}a_{21}{+}a_{23}a_{11} & a_{23}a_{31}{+}a_{33}a_{21} & a_{33}a_{11}{+}a_{13}a_{31}
\end{bmatrix}.
$$

Two ingredients complete the definition of $$\mathbf{G}$$. First, following Simo and Rifai, the transformation is **frozen at the element centroid** $$\boldsymbol{\xi}=\mathbf{0}$$, using $$\mathbf{J}_0 = \mathbf{J}(\mathbf{0})$$ and $$\mathbf{T}_0 = \mathbf{T}(\mathbf{J}_0)$$ — this keeps the operator constant and preserves objectivity. Second, a determinant scaling $$\det\mathbf{J}_0/\det\mathbf{J}(\boldsymbol{\xi})$$ is included so that the patch test is satisfied (shown next):

$$
\boxed{\;\mathbf{G}(\boldsymbol{\xi}) = \frac{\det\mathbf{J}_0}{\det\mathbf{J}(\boldsymbol{\xi})}\,\mathbf{T}_0^{-1}\,\hat{\mathbf{G}}(\boldsymbol{\xi}).\;}
$$

(Texts that adopt engineering-shear Voigt vectors and define $$\mathbf{T}_0$$ in the reverse direction write this same operator as $$\mathbf{T}_0^{-\mathsf T}$$; the object is identical, only the bookkeeping convention differs.)

### The patch test / orthogonality condition

The discrete counterpart of the stress–strain orthogonality is that the enhanced strains must be orthogonal to **constant** stresses over each element, i.e.

$$
\int_{\Omega_e} \mathbf{G}\,\mathrm{d}\Omega = \mathbf{0}.
$$

The determinant scaling makes this immediate. Because $$\mathrm{d}\Omega = \det\mathbf{J}\,\mathrm{d}\square$$, the variable determinant cancels:

$$
\int_{\Omega_e}\mathbf{G}\,\mathrm{d}\Omega
= \det\mathbf{J}_0\,\mathbf{T}_0^{-1}\!\int_{\square}\hat{\mathbf{G}}(\boldsymbol{\xi})\,\mathrm{d}\square
= \mathbf{0},
$$

since every entry of $$\hat{\mathbf{G}}$$ is an odd monomial ($$\xi$$, $$\eta$$, or $$\zeta$$) whose integral over the symmetric cube $$[-1,1]^3$$ vanishes. This is precisely why the enhanced modes are chosen as odd functions — it is what lets an EAS element pass the constant-stress patch test, a necessary condition for convergence.

## The discrete two-field system

Insert $$\nabla^{s}\mathbf{u}^h = \mathbf{B}\mathbf{d}$$ and $$\tilde{\boldsymbol{\varepsilon}}^h = \mathbf{G}\boldsymbol{\alpha}$$ into the two-field weak form. With $$\delta\mathbf{d}$$ and $$\delta\boldsymbol{\alpha}$$ arbitrary,

$$
\int_{\Omega_e} \mathbf{B}^{\mathsf T}\mathbf{C}\,\big(\mathbf{B}\mathbf{d} + \mathbf{G}\boldsymbol{\alpha}\big)\,\mathrm{d}\Omega = \mathbf{f}_{\text{ext}},
$$

$$
\int_{\Omega_e} \mathbf{G}^{\mathsf T}\mathbf{C}\,\big(\mathbf{B}\mathbf{d} + \mathbf{G}\boldsymbol{\alpha}\big)\,\mathrm{d}\Omega = \mathbf{0}.
$$

Defining the element sub-matrices

$$
\mathbf{K}_{dd} = \int_{\Omega_e}\mathbf{B}^{\mathsf T}\mathbf{C}\,\mathbf{B}\,\mathrm{d}\Omega,
\quad
\mathbf{K}_{d\alpha} = \int_{\Omega_e}\mathbf{B}^{\mathsf T}\mathbf{C}\,\mathbf{G}\,\mathrm{d}\Omega,
\quad
\mathbf{K}_{\alpha\alpha} = \int_{\Omega_e}\mathbf{G}^{\mathsf T}\mathbf{C}\,\mathbf{G}\,\mathrm{d}\Omega,
$$

with $$\mathbf{K}_{\alpha d} = \mathbf{K}_{d\alpha}^{\mathsf T}$$, the element system is the coupled block problem

$$
\begin{bmatrix}
\mathbf{K}_{dd} & \mathbf{K}_{d\alpha} \\[2pt]
\mathbf{K}_{d\alpha}^{\mathsf T} & \mathbf{K}_{\alpha\alpha}
\end{bmatrix}
\begin{bmatrix}
\mathbf{d} \\[2pt] \boldsymbol{\alpha}
\end{bmatrix}
=
\begin{bmatrix}
\mathbf{f}_{\text{ext}} \\[2pt] \mathbf{0}
\end{bmatrix}.
$$

## Static condensation → the element stiffness

The second block equation has no external forcing (enhanced modes do no external work), so $$\boldsymbol{\alpha}$$ can be solved for element-locally:

$$
\boldsymbol{\alpha} = -\,\mathbf{K}_{\alpha\alpha}^{-1}\,\mathbf{K}_{d\alpha}^{\mathsf T}\,\mathbf{d}.
$$

Substituting back into the first block gives a system in the nodal displacements alone, with the **condensed element stiffness matrix**

$$
\boxed{\;\mathbf{K}_e = \mathbf{K}_{dd} - \mathbf{K}_{d\alpha}\,\mathbf{K}_{\alpha\alpha}^{-1}\,\mathbf{K}_{d\alpha}^{\mathsf T},
\qquad
\mathbf{K}_e\,\mathbf{d} = \mathbf{f}_{\text{ext}}.\;}
$$

$$\mathbf{K}_e$$ has exactly the same $$24\times 24$$ size and connectivity as the plain displacement element — assembly, boundary conditions, and solvers are all unchanged. The enhancement is invisible outside the element routine; its only cost is a small local solve of the $$n_\alpha\times n_\alpha$$ system $$\mathbf{K}_{\alpha\alpha}$$ (here $$9\times 9$$).

In a **nonlinear** setting one stores $$\boldsymbol{\alpha}$$ per element and updates it in the local Newton loop; the condensation formula for the consistent tangent is identical in structure, with $$\mathbf{C}$$ replaced by the material tangent and the residual carried alongside.

## Numerical integration and the element algorithm

Every integral is evaluated with $$2\times 2\times 2$$ Gauss quadrature (points $$\boldsymbol{\xi}_g$$, weights $$w_g$$). Using $$\mathrm{d}\Omega = \det\mathbf{J}\,\mathrm{d}\square$$ and the definition of $$\mathbf{G}$$, the determinant scaling cancels cleanly inside the coupling and enhanced blocks:

$$
\mathbf{K}_{dd} = \sum_g w_g\,\det\mathbf{J}_g\,\mathbf{B}_g^{\mathsf T}\mathbf{C}\,\mathbf{B}_g,
$$

$$
\mathbf{K}_{d\alpha} = \sum_g w_g\,\det\mathbf{J}_0\,\mathbf{B}_g^{\mathsf T}\mathbf{C}\,\mathbf{T}_0^{-1}\hat{\mathbf{G}}_g,
$$

$$
\mathbf{K}_{\alpha\alpha} = \sum_g w_g\,\frac{(\det\mathbf{J}_0)^2}{\det\mathbf{J}_g}\,\hat{\mathbf{G}}_g^{\mathsf T}\,\mathbf{T}_0^{-\mathsf T}\mathbf{C}\,\mathbf{T}_0^{-1}\hat{\mathbf{G}}_g.
$$

Putting it together, the element routine is:

1. Compute the centroid Jacobian $$\mathbf{J}_0=\mathbf{J}(\mathbf{0})$$, its determinant $$\det\mathbf{J}_0$$, the transformation $$\mathbf{T}_0$$, and $$\mathbf{T}_0^{-1}$$.
2. Initialise $$\mathbf{K}_{dd},\mathbf{K}_{d\alpha},\mathbf{K}_{\alpha\alpha}$$ to zero, then loop over Gauss points $$\boldsymbol{\xi}_g$$:
   - evaluate $$\partial N_I/\partial\boldsymbol{\xi}$$, form $$\mathbf{J}_g$$, $$\det\mathbf{J}_g$$, $$\mathbf{J}_g^{-1}$$, and the Cartesian derivatives;
   - assemble $$\mathbf{B}_g$$ and evaluate the natural modes $$\hat{\mathbf{G}}_g = \hat{\mathbf{G}}(\boldsymbol{\xi}_g)$$;
   - accumulate the three sub-matrices with the expressions above.
3. Condense: $$\mathbf{K}_e = \mathbf{K}_{dd} - \mathbf{K}_{d\alpha}\,\mathbf{K}_{\alpha\alpha}^{-1}\,\mathbf{K}_{d\alpha}^{\mathsf T}$$.
4. Return $$\mathbf{K}_e$$ (and, if nonlinear, the stored $$\boldsymbol{\alpha}$$ and internal force) for assembly.

## The takeaway

The enhanced assumed strain element is a small idea with a large payoff. Start from the three-field Hu–Washizu principle, split the strain into a compatible and an enhanced part, and impose stress–strain orthogonality so the stress field disappears. What remains is a two-field problem whose enhanced parameters are element-local and therefore condensable. The centroid-frozen transformation with its determinant scaling is exactly what makes the enhanced modes orthogonal to constant stress — the patch test — and the final condensed matrix drops straight into a standard displacement code.

The result is an 8-node brick that bends properly and survives near-incompressibility, at the price of one small local solve per element.
