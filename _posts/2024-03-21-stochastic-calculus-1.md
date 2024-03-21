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
宋飏博士在其著名论文*Score-Based Generative Modeling through Stochastic Differential Equations*中凭借基于SDE的框架统一了score-based generative modeling与diffusion probablistic modeling两大生成式模型. 理解此论文需要较好的随机分析基础，上手难度较大，而笔者并非数学/金融相关专业，根本学不会一点 (笑). 笔者将尽力尝试在本系列笔记中整理随机分析的要点. 由于笔者学习随机分析的目的只是为了更深入地理解diffusion models，内容将比较简略，理解或许也有偏差之处. 为了写作方便，行文将中英混杂.

本系列笔记的主要参考资料为
- *Introduction to Stochastic Calculus with Applications, Third Edition* by Fima C. Klebaner
- *An Introduction to Stochastic Differential Equations* by Lawrence C. Evans
- *An Informal Introduction to Stochastic Calculus with Applications* by Ovidiu Calin

本笔记将介绍一些微积分/概率论中的知识. 随机分析中经常涉及这些知识，但面向工科专业开设的微积分/概率论课程一般很少讲解.

# 微积分拾遗
## Variation
The variation of a funtion of real variable $$g$$ over the interval $$[a,b]$$ is defined as

\begin{equation}
V_g([a,b]) = \sup \sum_{i=1}^{n} \lvert g(t_i^n)-g(t_{i-1}^n) \rvert = \lim_{\delta_n \rightarrow 0} \sum_{i=1}^{n} \lvert g(t_i^n)-g(t_{i-1}^n) \rvert
\end{equation}

where $$\delta_n = \max_{1 \le i \le n}(t_i^n - t_{i-1}^n)$$. The supremum is taken over partitions $$a = t_0^n < t_1^n < \cdots < t_n^n = b$$.

如果$$V_g([a,b])$$是有限的，则我们称$$g$$为a function of finite variation on $$[a,b]$$. 如果$$g$$是$$t \ge 0$$的函数，则可将$$g$$的variation function定义为关于$$t$$的函数$$V_g(t) = V_g([0,t])$$. 

显然，$$V_g(t)$$是单调递增的. 如果对于所有的$$t$$我们都有$$V_g(t) < \infty$$，那么我们称$$g$$ is of finite variation. 如果$$\sup_t V_g(t) < \infty$$即对所有的$$t$$满足$$V_g(t) < C$$，其中$$C$$为常量, 那么我们称$$g$$ is of bounded variation.

直观地，$$V_g([a,b])$$可看作$$g$$的取值在$$[a,b]$$上的变化的总和. 那么我们可以预料，如果$$g(t)$$可导，有连续的导数$$g'(t)$$，$$g(t) = \int_0^t g'(s)ds$$且满足$$g(t) = \int_0^t \lvert g'(s) \rvert ds < \infty$$，那么$$V_g(t) = \int_0^t \lvert g'(s) \rvert ds$$. 此时有$$g$$ is of finite variation.

## Quadratic Variation
类似地，我们可以定义quadratic variation

\begin{equation}
\[g\]([a,b]) = \sup \sum_{i=1}^{n}(g(t_i^n)-g(t_{i-1}^n))^2 = \lim_{\delta_n \rightarrow 0} \sum_{i=1}^{n}(g(t_i^n)-g(t_{i-1}^n))^2
\end{equation}

实际上，可以对任意的函数$$\Phi$$定义$$\Phi$$-variation. 若取$$\Phi(u) = u^p$$，则$$ 1 \le p < q < \infty$$时finite $$p$$-variation蕴含finite $$q$$-variation. 
如果$$g$$连续且of finite variation，那么它的quadratic variation为$$0$$. 直观地来看，当$$g$$连续且$$\delta_n \rightarrow 0$$时，求和中的项可视为无穷小量. 如果对无穷小量求和有限，则对其作平方得到的高阶无穷小量求和应当为$$0$$.

我们还可以定义quadratic covariation (or simply covariation)

\begin{equation}
\[f,g\]([a,b]) = \sup \sum_{i=1}^{n}(f(t_i^n)-f(t_{i-1}^n))(g(t_i^n)-g(t_{i-1}^n)) = \lim_{\delta_n \rightarrow 0} \sum_{i=1}^{n}(f(t_i^n)-f(t_{i-1}^n))(g(t_i^n)-g(t_{i-1}^n))
\end{equation}

如果$$f$$连续且$$g$$ is of finite variation，那么它们的covariation为$$0$$.

Moreover, polarization identity holds for covariation $$[f,g](t) = \frac{1}{2}([f + g,f + g](t) - [f,f](t) - [g,g](t))$$, so covariation is symmetric and bilinear.

## Stieltjes Integral
The Stieltjes integral of $$f$$ with respect to a monotone function $$g$$ over an interval $$[a,b]$$ is defined as

\begin{equation}
\int_a^b fdg = \int_a^b f(t)dg(t) = lim_{\delta_n \rightarrow 0} \sum_{i=1}^n f(\xi_i^n)(g(t_i^n) - g(_{i - 1}^n))
\end{equation}

where $$a = t_0^n < t_1^n < \cdots < t_n^n = b$$, $$\delta_n = \max_{1 \le i \le n}(t_i^n - t_{i-1}^n)$$ and $$t_{i - 1}^n \le \xi_i^n \le t_i^n$$.

## Lipschitz and Hölder Conditions

## 一阶线性微分方程的解

# 概率论拾遗