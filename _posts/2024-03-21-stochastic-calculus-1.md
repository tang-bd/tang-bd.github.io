---
layout: post
title: 笔记 · 随机分析 · 基础
date: 2024-03-21
description: 学不会一点
tags: 2023
categories: 笔记
toc:
  beginning: true
---

# 前言
宋飏在其著名论文*Score-Based Generative Modeling through Stochastic Differential Equations*中凭借基于SDE的框架统一了score-based generative modeling与diffusion probablistic modeling两大生成式模型范式. 理解此论文需要较好的随机分析基础, 上手难度较大, 而笔者并非数学/金融相关专业, 根本学不会一点 (笑). 笔者将尽力尝试在本系列笔记中整理随机分析的要点. 由于笔者学习随机分析的目的只是为了更深入地理解diffusion models, 内容将十分简略, 理解或许也会有不少偏差之处. 为写作方便, 行文将中英混杂.

本系列笔记在很大程度上参考了以下资料
1. *Introduction to Stochastic Calculus with Applications, Third Edition* by Fima C. Klebaner
2. *An Introduction to Stochastic Differential Equations* by Lawrence C. Evans
3. *An Informal Introduction to Stochastic Calculus with Applications* by Ovidiu Calin

本笔记将介绍一些微积分/概率论中的知识. 随机分析中经常涉及这些知识, 但面向工科专业开设的微积分/概率论课程一般很少讲解.

# 微积分拾遗
## Variation
The variation of a funtion of real variable $$g$$ over the interval $$[a,b]$$ is defined as

\begin{equation}
V_g([a,b]) = \sup \sum_{i=1}^{n} \lvert g(t_i^n)-g(t_{i-1}^n) \rvert = \lim_{\delta_n \rightarrow 0} \sum_{i=1}^{n} \lvert g(t_i^n)-g(t_{i-1}^n) \rvert
\end{equation}

where $$\delta_n = \max_{1 \le i \le n}(t_i^n - t_{i-1}^n)$$. The supremum is taken over partitions $$a = t_0^n < t_1^n < \cdots < t_n^n = b$$.

如果$$V_g([a,b])$$是有限的, 则我们称$$g$$为a function of finite variation on $$[a,b]$$. 如果$$g$$是$$t \ge 0$$的函数, 则可将$$g$$的variation function定义为关于$$t$$的函数$$V_g(t) = V_g([0,t])$$. 

显然, $$V_g(t)$$是单调递增的. 如果对于所有的$$t$$我们都有$$V_g(t) < \infty$$, 那么我们称$$g$$ is of finite variation. 如果$$\sup_t V_g(t) < \infty$$即对所有的$$t$$满足$$V_g(t) < C$$, 其中$$C$$为常量, 那么我们称$$g$$ is of bounded variation.

直观上, $$V_g([a,b])$$可看作$$g$$的取值在$$[a,b]$$上的变化的总和. 那么我们可以预料, 如果$$g(t)$$可导, 有连续的导数$$g'(t)$$, $$g(t) = \int_0^t g'(s)ds$$且满足$$g(t) = \int_0^t \lvert g'(s) \rvert ds < \infty$$, 那么$$V_g(t) = \int_0^t \lvert g'(s) \rvert ds$$. 此时有$$g$$ is of finite variation. 相反地, 在$$[a,b]$$上有finite variation的函数在$$[a,b]$$上几乎处处可导.

## Quadratic Variation
类似地, 我们可以定义quadratic variation

\begin{equation}
\[g\]([a,b]) = \sup \sum_{i=1}^{n}(g(t_i^n)-g(t_{i-1}^n))^2 = \lim_{\delta_n \rightarrow 0} \sum_{i=1}^{n}(g(t_i^n)-g(t_{i-1}^n))^2
\end{equation}

实际上, 可以对任意的函数$$\Phi$$定义$$\Phi$$-variation. 若取$$\Phi(u) = u^p$$, 则$$ 1 \le p < q < \infty$$时finite $$p$$-variation蕴含finite $$q$$-variation. 
如果$$g$$连续且of finite variation, 那么它的quadratic variation为$$0$$. 直观上, 当$$g$$连续且$$\delta_n \rightarrow 0$$时, variation定义式求和中的项可视为无穷小量. 如果对无穷小量求和有限, 则对其作平方得到的高阶无穷小量求和应当为$$0$$.

我们还可以定义quadratic covariation (or simply covariation)

\begin{equation}
\[f,g\]([a,b]) = \sup \sum_{i=1}^{n}(f(t_i^n)-f(t_{i-1}^n))(g(t_i^n)-g(t_{i-1}^n)) = \lim_{\delta_n \rightarrow 0} \sum_{i=1}^{n}(f(t_i^n)-f(t_{i-1}^n))(g(t_i^n)-g(t_{i-1}^n))
\end{equation}

如果$$f$$连续且$$g$$ is of finite variation, 那么它们的covariation为$$0$$.

Moreover, polarization identity holds for covariation $$[f,g](t) = \frac{1}{2}([f + g,f + g](t) - [f,f](t) - [g,g](t))$$, so covariation is symmetric and bilinear.

## Lipschitz and Hölder Conditions
Lipschitz and Hölder Conditions描述了连续函数的子类. 它们作为系数的条件出现在ODE与SDE的解的存在性与唯一性的结果中.

$$f$$ satisfies a Hölder condition (Hölder continuous) of order $$0 < \alpha \le 1$$ on $$[a,b]$$ if there is a constant $$K > 0$$ so that for all $$x, y \in [a,b]$$

\begin{equation}
\lvert f(x) - f(y) \rvert \le K \lvert x - y \rvert^{\alpha}
\end{equation}

A Lipschitz condition is a Hölder condition with $$\alpha = 1$$. 可以证明, 当Hölder condition中$$\alpha > 1$$时满足条件的函数必为常数.

显然, $$ 0 < \alpha < \beta \le \infty$$时, 一个在bounded set $$[a,b]$$上$$\beta$$阶Hölder连续的函数也是$$\alpha$$阶Hölder连续的, 且凡Hölder连续的函数也是一致连续的.

直观上, 如果一个函数在某区间上满足Hölder连续, 那么这意味着函数在该区间上的变化速率受到$$\lvert x - y \rvert^{\alpha}$$的控制, 函数图像中不会有过于陡峭的变化. 如果满足Lipschitz连续, 则函数的变化速率是有界的, 即函数图像上任意两点之间的斜率是有界的,. 此时函数也是几乎处处可导的.

例如在$$[0,3]$$上定义$$g(x) = \sqrt{x}$$, 则对$$0 < \alpha \le \frac{1}{2}$$, $$g$$满足Hölder条件, 而对$$\frac{1}{2} < \alpha \le 1$$, $$g$$不满足Hölder条件.

## 一阶线性微分方程的解
一阶线性方程定义为关于未知函数及其导数线性, 其形式为

\begin{equation}
\frac{dx(t)}{dt} + g(t)x(t) = k(t)
\end{equation}

可采用integrating factor法解此类方程. 具体而言, 选取$$G'(t) = g(t)$$, 在方程两边同时乘以$$e^{G(t)}$$则有

\begin{equation}
\frac{d(e^{G(t)}x(t))}{dt} = e^{G(t)}k(t)
\end{equation}

积分并整理即可解得

\begin{equation}
x(t) = e^{-G(t)}\int_0^t(e^{G(s)}k(s))ds + x(0)e^{G(0) - G(t)}
\end{equation}

# 概率论拾遗

## 条件期望

考虑在概率空间$$(\Omega, \mathcal{F}, P)$$上定义的简单随机变量$$Y = \sum_{i = 1}^m a_i I_{A_i}$$, 则有

$$
Y = \begain{cases}
a_1 & \text{on} A_1 \\
a_2 & \text{on} A_2 \\
\vdots & \\
a_m & \text{on} A_m \\
\end{cases}
$$

已知$$Y$$时, 我们对另一个$$\Omega$$上的随机变量$$X$$能作出的最好的估计是什么呢？若$$Y(\omega)$$已知, 则我们能知道$$A_1, A_2, \cdots, A_m$$中哪个事件包含$$\omega$$. 那么, 我们对$$X$$能作出的最好的估计即是$$X$$在每个对应时间上的期望.

$$
E(X \vert Y) = \begain{cases}
\frac{1}{P(A_1)} \int_{A_1}XdP & \text{on} A_1 \\
\frac{1}{P(A_2)} \int_{A_2}XdP & \text{on} A_2 \\
\vdots & \\
\frac{1}{P(A_m)} \int_{A_m}XdP & \text{on} A_m \\
\end{cases}
$$

由此可知$$E(X \vert Y)$$是$$\mathcal{F}$$-measurable的, 且$$\int_A XdP = \int_A E(X \vert Y)dP$$ for all $$A \in \mathcal{F}$$. 注意到, $$E(X \vert Y)$$实际上与$$Y$$的取值无关. 因此, 我们如下定义条件期望. Let $$(\Omega, \mathcal{U}, P)$$ be a probability space and suppose $$\mathcal{V} \subseteq \mathcal{U}$$ is a $$\sigma$$-algebra. If $$X : \Omega \mapsto \mathbb{R}^n$$ is an integrable random variable, we define $$E(X \vert \mathcal{V})$$ to be any random variable on $$\Omega$$ such that $$E(X \vert \mathcal{V})$$ is $$\mathcal{V}$$-measurable and $$\int_A XdP = \int_A E(X \vert \mathcal{V})dP$$ for all $$A \in \mathcal{V}$$.

直观上, 也可以将条件期望理解为线性空间$$L^2(\Omega, \mathcal{U})$$ which consists of all real-valued, $$\mathcal{U}$$-measurable random variables $$Y$$ such that $$\Vert Y \Vert = (\int_{\Omega}Y^2dP)^{\frac{1}{2}} < \infty$$中随机变量$$X$$向子空间$$L^2(\Omega, \mathcal{V})$$的投影.

条件期望有以下重要性质
1. If $$X$$ is $$\mathcal{V}$$-measurable, then $$E(X \vert \mathcal{V}) = X \quad a.s.$$
2. If $$X$$ is $$\mathcal{V}$$-measurable and $$XY$$ is integrable, then $$E(XY \vert \mathcal{V}) = $XE(Y \vert \mathcal{V}) \quad a.s.$$
3. If $$X$$ is independent of $$\mathcal{V}$$, then $$E(X \vert \mathcal{V}) = E(X) \quad a.s.$$
4. If $$\mathcal{W} \subseteq \mathcal{V}$$, we have $$E(X \vert \mathcal{W}) = E(E(X \vert \mathcal{V}) \vert \mathcal{W}) = E(E(X \vert \mathcal{W}) \vert \mathcal{V}) \quad a.s.$$

## 随机过程

A stochastic process on the probability space $$(\Omega, \mathcal{F}, P)$$ is a family of random variables $$X_t$$ parameterized by $$t \in \textbf{T}$$, where $$\textbf{T} \subset \mathbb{R}$$. 如果$$\textbf{T}$$是区间则称$$X(t)$$为连续时间随机过程. 如果$$\textbf{T}$$中的元素是可数的则称$$X_t$$为离散时间随机过程.

The evolution in time of a given state of the world $$\omega \in \Omega$$ given by the function $$t \mapsto X(t, \omega)$$ is called a path or realization of $$X(t)$$.

## Filtration

A filtration $$\mathbb{F}$$ is the collection of $$\sigma$$-fields

$$
\mathbb{F} = {\mathcal{F}_0, \mathcal{F}_1, \cdots, \mathcal{F}_t, \cdots, \mathcal{F}_T} \quad \mathcal{F}_t \subset \mathcal{F}_{t+1} \subset \mathcal{F}
$$

$$\mathbb{F}$$ is used to model a flow of information. $$\sigma$$-field $$\mathcal{F}_t$$包含所有截至时间$$t$$已知的信息, 即已经发生的事件及没有发生的事件. 随着时间的流逝, 观测者知道越来越多的信息, $$\mathcal{F}_t$$对样本空间$$\Omega$$作越来越精细的分割.

$$\mathcal{F}_t = \sigma({X_s, 0 \le s \le t})$$称为随机过程$$X_t$$的natural filtration.

A stochastic process is called adapted to filtration $$\mathbb{F}$$ if for all $$t$$, $$X(t)$$ is a random variable on $$\mathcal{F}_t$$, that is, if $$X(t)$$ is $$\mathcal{F}_t$$-measurable.

## Martingale

Let $$X(t)$$ be a stochastic process such that $$E(\lvert X(t) \rvert) < \infty$$ for all $$t \ge 0$$. If

\begin{equation}
X(s) = E(X(t) \vert \mathcal{U}(s)) \quad a.s. \quad t \ge s \ge 0
\end{equation}

then $$X(t)$$ is called a martingale.