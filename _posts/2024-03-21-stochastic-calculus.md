---
layout: post
title: 笔记 · 随机分析
date: 2024-03-21
description: 学不会一点
tags: 2023
categories: 笔记
toc:
  beginning: true
---

# 前言
宋飏在其著名论文*Score-Based Generative Modeling through Stochastic Differential Equations*中凭借基于SDE的框架统一了score-based generative modeling与diffusion probablistic modeling两大生成式模型范式. 理解此论文需要较好的随机分析基础, 上手难度较大, 而笔者并非数学/金融相关专业, 根本学不会一点 (笑). 笔者将尽力尝试在本笔记中整理随机分析的要点. 由于笔者学习随机分析的目的只是为了更深入地理解diffusion models, 内容将十分简略, 理解或许也会有不少偏差之处. 为写作方便, 行文将中英混杂.

本笔记主要基于以下文献拼凑而成
1. *Introduction to Stochastic Calculus with Applications, Third Edition* by Fima C. Klebaner
2. *An Introduction to Stochastic Differential Equations* by Lawrence C. Evans
3. *An Informal Introduction to Stochastic Calculus with Applications* by Ovidiu Calin
4. *[Stochastic Differential Equations and Diffusion Models by Vanilla Bug](https://www.vanillabug.com/posts/sde/#diffusion-models-as-sdes)*s

# 微积分拾遗
## Variation
The variation of a funtion of real variable $$g$$ over the interval $$[a,b]$$ is defined as

$$
V_g([a,b]) = \sup \sum_{i=1}^{n} \lvert g(t_i^n)-g(t_{i-1}^n) \rvert = \lim_{\delta_n \rightarrow 0} \sum_{i=1}^{n} \lvert g(t_i^n)-g(t_{i-1}^n) \rvert
$$

where $$\delta_n = \max_{1 \le i \le n}(t_i^n - t_{i-1}^n)$$. The supremum is taken over partitions $$a = t_0^n < t_1^n < \cdots < t_n^n = b$$.

如果$$V_g([a,b])$$是有限的, 则我们称$$g$$为a function of finite variation on $$[a,b]$$. 如果$$g$$是$$t \ge 0$$的函数, 则可将$$g$$的variation function定义为关于$$t$$的函数$$V_g(t) = V_g([0,t])$$. 

显然, $$V_g(t)$$是单调递增的. 如果对于所有的$$t$$我们都有$$V_g(t) < \infty$$, 那么我们称$$g$$ is of finite variation. 如果$$\sup_t V_g(t) < \infty$$即对所有的$$t$$满足$$V_g(t) < C$$, 其中$$C$$为常量, 那么我们称$$g$$ is of bounded variation.

直观上, $$V_g([a,b])$$可看作$$g$$的取值在$$[a,b]$$上的变化的总和. 那么我们可以预料, 如果$$g(t)$$可导, 有连续的导数$$g'(t)$$, $$g(t) = \int_0^t g'(s)ds$$且满足$$g(t) = \int_0^t \lvert g'(s) \rvert ds < \infty$$, 那么$$V_g(t) = \int_0^t \lvert g'(s) \rvert ds$$. 此时有$$g$$ is of finite variation. 相反地, 在$$[a,b]$$上有finite variation的函数在$$[a,b]$$上几乎处处可导.

## Quadratic Variation
类似地, 我们可以定义quadratic variation

$$
[g]([a,b]) = \sup \sum_{i=1}^{n}(g(t_i^n)-g(t_{i-1}^n))^2 = \lim_{\delta_n \rightarrow 0} \sum_{i=1}^{n}(g(t_i^n)-g(t_{i-1}^n))^2
$$

实际上, 可以对任意的函数$$\Phi$$定义$$\Phi$$-variation. 若取$$\Phi(u) = u^p$$, 则$$ 1 \le p < q < \infty$$时finite $$p$$-variation蕴含finite $$q$$-variation. 
如果$$g$$连续且of finite variation, 那么它的quadratic variation为$$0$$. 直观上, 当$$g$$连续且$$\delta_n \rightarrow 0$$时, variation定义式求和中的项可视为无穷小量. 如果对无穷小量求和有限, 则对其作平方得到的高阶无穷小量求和应当为$$0$$.

我们还可以定义quadratic covariation (or simply covariation)

$$
[f,g]([a,b]) = \sup \sum_{i=1}^{n}(f(t_i^n)-f(t_{i-1}^n))(g(t_i^n)-g(t_{i-1}^n)) = \lim_{\delta_n \rightarrow 0} \sum_{i=1}^{n}(f(t_i^n)-f(t_{i-1}^n))(g(t_i^n)-g(t_{i-1}^n))
$$

注意有$$[g]([a,b]) = [g,g]([a,b])$$.

如果$$f$$连续且$$g$$ is of finite variation, 那么它们的covariation为$$0$$.

Moreover, polarization identity holds for covariation $$[f,g](t) = \frac{1}{2}([f + g,f + g](t) - [f,f](t) - [g,g](t))$$, so covariation is symmetric and bilinear.

## Lipschitz and Hölder Conditions
Lipschitz and Hölder Conditions描述了连续函数的子类. 它们作为系数的条件出现在ODE与SDE的解的存在性与唯一性的结果中.

$$f$$ satisfies a Hölder condition (Hölder continuous) of order $$0 < \alpha \le 1$$ on $$[a,b]$$ uniformly if there is a constant $$K > 0$$ so that for all $$x, y \in [a,b]$$

$$
\lvert f(x) - f(y) \rvert \le K \lvert x - y \rvert^{\alpha}
$$

$$f$$ satisfies a Hölder condition (Hölder continuous) of order $$0 < \alpha \le 1$$ on $$[a,b]$$ at the point $$x$$ if there is a constant $$K > 0$$ so that for all $$y \in [a,b]$$

$$
\lvert f(x) - f(y) \rvert \le K \lvert x - y \rvert^{\alpha}
$$

A Lipschitz condition is a Hölder condition with $$\alpha = 1$$. 可以证明, 满足$$\alpha > 1$$的Hölder condition的函数必为常数.

If $$f$$ is continuously differentiable on a finite interval $$[a, b]$$, then it is Lipschitz.

显然, $$ 0 < \alpha < \beta \le \infty$$时, 一个在bounded set $$[a,b]$$上$$\beta$$阶Hölder连续的函数也是$$\alpha$$阶Hölder连续的, 且凡Hölder连续的函数也是一致连续的.

直观上, 如果一个函数在某区间上满足Hölder连续, 那么这意味着函数在该区间上的变化速率受到$$\lvert x - y \rvert^{\alpha}$$的控制, 函数图像中不会有过于陡峭的变化. 如果满足Lipschitz连续, 则函数的变化速率是有界的, 即函数图像上任意两点之间的斜率是有界的. 此时函数也是几乎处处可导的.

例如在$$[0,3]$$上定义$$g(x) = \sqrt{x}$$, 则对$$0 < \alpha \le \frac{1}{2}$$, $$g$$满足Hölder条件. 而对$$\frac{1}{2} < \alpha \le 1$$, $$g$$不满足Hölder条件.

## 一阶线性微分方程的解
一阶线性方程关于未知函数及其导数线性, 其形式为

$$
\frac{dx(t)}{dt} + g(t)x(t) = k(t)
$$

可采用integrating factor法解此类方程. 具体而言, 选取$$G'(t) = g(t)$$, 在方程两边同时乘以$$e^{G(t)}$$则有

$$
\frac{d(e^{G(t)}x(t))}{dt} = e^{G(t)}k(t)
$$

积分并整理即可解得

$$
x(t) = e^{-G(t)}\int_0^t(e^{G(s)}k(s))ds + x(0)e^{G(0) - G(t)}
$$

# 概率论拾遗

## 条件期望

考虑在概率空间$$(\Omega, \mathcal{F}, P)$$上定义的简单随机变量$$Y = \sum_{i = 1}^m a_i I_{A_i}$$, 则有

$$
Y = \begin{cases}
a_1 & \text{on } A_1 \\
a_2 & \text{on } A_2 \\
\vdots & \\
a_m & \text{on } A_m \\
\end{cases}
$$

已知$$Y$$时, 我们对另一个$$\Omega$$上的随机变量$$X$$能作出的最好的估计是什么呢？若$$Y(\omega)$$已知, 则我们能知道$$A_1, A_2, \cdots, A_m$$中哪个事件包含$$\omega$$. 那么, 我们对$$X$$能作出的最好的估计即是$$X$$在每个对应时间上的期望.

$$
E(X \vert Y) = \begin{cases}
\frac{1}{P(A_1)} \int_{A_1}XdP & \text{on } A_1 \\
\frac{1}{P(A_2)} \int_{A_2}XdP & \text{on } A_2 \\
\quad \vdots & \\
\frac{1}{P(A_m)} \int_{A_m}XdP & \text{on } A_m \\
\end{cases}
$$

由此可知$$E(X \vert Y)$$是$$\mathcal{F}$$-measurable的, 且$$\int_A XdP = \int_A E(X \vert Y)dP$$ for all $$A \in \mathcal{F}$$. 

注意到, $$E(X \vert Y)$$实际上与$$Y$$的取值无关. 因此, 我们如下定义条件期望. Let $$(\Omega, \mathcal{U}, P)$$ be a probability space and suppose $$\mathcal{V} \subseteq \mathcal{U}$$ is a $$\sigma$$-algebra. If $$X : \Omega \mapsto \mathbb{R}^n$$ is an integrable random variable, we define $$E(X \vert \mathcal{V})$$ to be any random variable on $$\Omega$$ such that $$E(X \vert \mathcal{V})$$ is $$\mathcal{V}$$-measurable and $$\int_A XdP = \int_A E(X \vert \mathcal{V})dP$$ for all $$A \in \mathcal{V}$$.

直观上, 我们也可以将条件期望$$E(X \vert \mathcal{V})$$理解为线性空间$$L^2(\Omega, \mathcal{U})$$ which consists of all real-valued, $$\mathcal{U}$$-measurable random variables $$Y$$ such that $$\Vert Y \Vert = (\int_{\Omega}Y^2dP)^{\frac{1}{2}} < \infty$$中随机变量$$X$$向子空间$$L^2(\Omega, \mathcal{V})$$的投影.

条件期望有以下重要性质
1. If $$X$$ is $$\mathcal{V}$$-measurable, then $$E(X \vert \mathcal{V}) = X \quad a.s.$$
2. If $$X$$ is $$\mathcal{V}$$-measurable and $$XY$$ is integrable, then $$E(XY \vert \mathcal{V}) = XE(Y \vert \mathcal{V}) \quad a.s.$$
3. If $$X$$ is independent of $$\mathcal{V}$$, then $$E(X \vert \mathcal{V}) = E(X) \quad a.s.$$
4. If $$\mathcal{W} \subseteq \mathcal{V}$$, we have $$E(X \vert \mathcal{W}) = E(E(X \vert \mathcal{V}) \vert \mathcal{W}) = E(E(X \vert \mathcal{W}) \vert \mathcal{V}) \quad a.s.$$

## 随机过程

A stochastic process on the probability space $$(\Omega, \mathcal{F}, P)$$ is a family of random variables $$X_t$$ parameterized by $$t \in \textbf{T}$$, where $$\textbf{T} \subset \mathbb{R}$$. 如果$$\textbf{T}$$是区间则称$$X(t)$$为连续时间随机过程. 如果$$\textbf{T}$$中元素数量可数则称$$X_t$$为离散时间随机过程.

The evolution in time of a given state of the world $$\omega \in \Omega$$ given by the function $$t \mapsto X(t, \omega)$$ is called a path or realization of $$X(t)$$.

如果$$P(X(t) = Y(t)) = 1$$ for all $$t, 0 \le t \le T$$, 则称这两个随机过程为互相的versions.

如果随机过程$$X(t)$$在某一时间的分布与其过去独立, 而只取决于当前的状态, 即满足

$$
P(X(t + s) \le y \vert \mathcal{F_t}) = P(X(t + s) \le y \vert X(t)) \quad a.s. \quad s \ge 0
$$

则称其为Markov process.

Markov processes are characterized by the transition probability function $$P(y, t, x, s) = P(X(t) \le y \vert X(s) = x)$$.

A process is called Gaussian if all its finite-dimensional distributions are multivariate normal.

## Filtration

A filtration $$\mathbb{F}$$ is the collection of $$\sigma$$-fields

$$
\mathbb{F} = {\mathcal{F}(0), \mathcal{F}(1), \cdots, \mathcal{F}(t), \cdots, \mathcal{F}(T)} \quad \mathcal{F}(t) \subset \mathcal{F}(t+1) \subset \mathcal{F}
$$

$$\mathbb{F}$$ is used to model a flow of information. $$\sigma$$-field $$\mathcal{F}_t$$包含所有截至时间$$t$$已知的信息, 即已经发生的事件及没有发生的事件. 随着时间的流逝, 观测者知道越来越多的信息, $$\mathcal{F}_t$$对样本空间$$\Omega$$作越来越精细的分割.

$$\mathcal{F}(t) = \sigma({X(s), 0 \le s \le t})$$称为随机过程$$X(t)$$的natural filtration.

A stochastic process is called adapted to filtration $$\mathbb{F}$$ if for all $$t$$, $$X(t)$$ is a random variable on $$\mathcal{F}_t$$, that is, if $$X(t)$$ is $$\mathcal{F}(t)$$-measurable.

## Martingale

Let $$X(t)$$ be a stochastic process such that $$E(\lvert X(t) \rvert) < \infty$$ for all $$t \ge 0$$. If

$$
X(s) = E(X(t) \vert \mathcal{U}(s)) \quad a.s. \quad t \ge s \ge 0
$$

then $$X(t)$$ is called a martingale.

# Brownian Motion

## 定义
Brownian motion (alse known as Wiener process)$$B(t), t \ge 0$$是满足以下条件的随机过程.

1. $$B(t) - B(s)$$ is $$N(0,t-s)$$ for all $$t \ge s \ge 0$$.
2. For all times $$0 < t_1 < t_2 < \cdots < t_n$$, $$B(t_1), B(t_2)-B(t_1), \cdots, B(t_n) - B(t_{n-1})$$ are independent increments.
3. $$B(t)$$ is continuous in $$t$$.

可容易地将定义推广到高维的情形. 向量的每一维是互相独立的一维Brownian motion.

直观上, Brownian motion可看作微扰$$dB = N(0, dt)$$的和.

## 基本性质

1. 由$$t \ge s \ge 0$$时$$E(B(t) - B(s)) = 0$$, 且$$Var(B(t) - B(s)) = t - s$$可知, $$E((B(t) - B(s))^2) = t - s$$.
2. $$Cov(B(s),B(t)) = E(B(s)B(t)) = \min(s,t)$$.
  - 证明: $$t \ge s \ge 0$$时有$$Cov(B(s),B(t)) = E(B(s) - B(0))E(B(t) - B(s)) + E(B^2(s)) = s$$.
3. 显然, Brownian motion是一个martingale.
4. $$B(t)^2 - t$$也是一个martingale.
  - 证明: 对任意的$$t, s \ge 0$$, 有$$\begin{align*}E(B^2(t + s) - (t + s) \vert \mathcal{F(t)}) & = B^2(t) + 2E(B(t)(B(t + s) - B(t)) \vert \mathcal{F(t)}) + E((B(t + s) - B(t))^2 \vert \mathcal{F(t)}) - (t + s) \\ & = B^2(t) - t \end{align*}$$
5. Brownian motion具有Markov property.
6. 若Brownian motion $$B_1(t)$$ 与 $$B_2(t)$$独立, 则其covariation为$$0$$.
7. A Brownian motion started at $$0$$ is a Gaussian process with $$0$$ mean function, and covariance function $$\min(t, s)$$. Conversely, a Gaussian process with $$0$$ mean function and covariance function $$\min(t, s)$$ is a Brownian function.

## 路径性质

1. Has quadratic variation $$[B,B](t) = [B,B]([0,t]) = t$$.
  - 证明思路: 先对定义式中的极限取期望, 再证明该极限almost surely收敛到该期望(同时也均方收敛).
  - 这意味着$$dB(t)^2 = dt$$.
2. Is uniformly Hölder continuous for each order $$0 < \alpha < \frac{1}{2}$$, but is nowhere Hölder continuous with any order $$\alpha > \frac{1}{2}$$.
3. 处处不可导.
  - $$\frac{\Delta B(t)}{\Delta t} \rightarrow \infty$$ as $$\Delta t \rightarrow 0$$. 
4. 在任意小的区间上有infinite variation.
  - 如果在某一区间上有finite variation, 则在该区间上几乎处处可导, 矛盾.
5. 在任意小的区间上都不单调.
  - 如果在某一区间上单调, 则在该区间上有finite variation, 矛盾.

# 随机积分

## Motivation

为了进一步研究随机微分方程等问题, 我们希望对随机过程$$G(t)$$定义随机积分$$\int_0^T G(t)dB(t)$$.

在此给出两个理解随机积分的intuition. 物理上, Riemann integral $$\int_a^b F(x)dx$$表示力$$F$$在位置$$x = a$$与$$x = b$$间所做的功, $$F(x)dx$$表示$$F$$在无穷小的位移中做的功. 相似地, $$F(t)dB(t)$$表示$$F$$在无穷小的Brownian jump中所做的功, 而将其累积得到的$$\int_0^T F(t)dB(t)$$即代表$$T$$时刻$$F$$在由Brownian motion建模的运动轨迹中所做的功. 金融上, 将$$F(t)$$看作我们持有的股票数量, 将$$dB$$看作价格的变化, 则$$\int_0^T F(t)dB(t)$$即代表$$T$$时刻我们持有股票的收益.

对于Brownian motion $$B(t)$$, 若$$F(t)$$与任意未来的increment $$B(s) - B(t)$$, 其中$$s > t$$独立, 则称$$F(t)$$为nonanticipating process.

## Itô Integral

### 定义

考虑$$0 \le a < b$$, 设$$F(t) = f(B(t), t)$$满足条件
1. $$E(\int_a^b F^2(t)dt) < \infty$$.
2. 对于任意$$\omega \in \Omega$$, $$t \mapsto F(t, \omega)$$在$$[a,b]$$上连续.
3. $$F(t)$$是$$[a,b]$$上的nonanticipating process.

或是一个continuous adapted process, 则存在其Itô integral, 定义为$$S_n = \sum_{i=0}^{n-1} F(t_i^n)(B(t_{i+1}^n) - B(t_i^n))$$的均方极限 $$\text{ms-lim}_{\delta_n \rightarrow 0} S_n = \int_a^b F(t)dB(t)$$, 即$$\lim_{\delta_n \rightarrow 0} E((S_n - \int_a^b F(t)dB(t))^2) = 0$$.

在Riemann integral中, Riemann sum的极限与中间点的选取无关. 然而可以证明, 对于随机积分, Riemann sum的极限与中间点的选取有关. 由于Itô integral考虑的是nonanticipating process, 故一致地选取区间的左端点作为中间点, 以使$$F(t_i)$$与$$B(t_{i+1}) - B(t_i)$$独立. 若选取中点, 则为Stratonovich integral. 

让我们先来看看一些基本的结果. 当$$F(t) = C$$为常数时, 不难证明$$\int_a^b CdB(t) = C(B(b) - B(a))$$. 当$$F(t) = B(t)$$时

$$
\begin{align*}
S_n & = \sum_{i=0}^{n-1} B(t_i^n)(B(t_{i+1}^n) - B(t_i^n)) \\
& = \frac{1}{2} \sum_{i=0}^{n-1} (B^2(t_{n+1}^n) - B^2(t_i^n)) - \frac{1}{2} \sum_{i=0}^{n-1} (B(t_{i+1}^n) - B(t_i^n))^2 \\
& = \frac{1}{2}(B^2(b) - B^2(a)) - \frac{1}{2} \sum_{i=0}^{n-1} (B(t_{i+1}^n) - B(t_i^n))^2
\end{align*}
$$

由Brownian motion的quadratic variation知第二个求和均方收敛到$$b - a$$, 故

$$
\int_a^b B(t)dB(t) = \text{ms-lim}_{\delta_n \rightarrow 0} S_n = \frac{1}{2}(B^2(b) - B^2(a)) - \frac{1}{2}(b - a)
$$

### 性质

Itô integral具有以下性质

1. $$ \int_a^b (\alpha G(t) + \beta H(t)) dB(t) = \alpha \int_a^b G(t)dB(t) + \beta \int_a^b H(t)dB(t)$$.
2. $$ E(\int_a^b G(t)dB(t)) = 0 $$.
  - 证明思路: 由于$$F(t_i)$$与$$B(t_{i+1}) - B(t_i)$$独立, <br>$$\begin{align*}E(S_n) & = \sum_{i=0}^{n-1} E(G(t_i^n)(B(t_{i+1}^n) - B(t_i^n))) \\ & = \sum_{i=0}^{n-1} E(G(t_i^n))E(B(t_{i+1}^n) - B(t_i^n)) \\ & = 0 \end{align*}$$<br>则可进一步证明Itô integral的期望为$$0$$.
3. $$ E((\int_a^b G(t)dB(t))^2) = E(\int_a^b G(t)^2 dt) $$.
  - 证明思路: <br>$$\begin{align*} E(S_n^2) & = E((\sum_{i=0}^{n-1} G(t_i^n)B(t_{i+1}^n) - B(t_i^n))^2) \\ & = \sum_{i=0}^{n-1} E(G^2(t_i^n))E((B(t_{i+1}^n) - B(t_i^n))^2) + 2\sum_{i \ne j} E(G(t_i))E(B(t_{i+1}^n) - B(t_i^n))E(G(t_j))E(B(t_{j+1}^n) - B(t_j^n)) \\ & = \sum_{i=0}^{n-1} E(G^2(t_i^n))(t_{i+1} - t_i) \\ & = E(\sum_{i=0}^{n-1} G^2(t_i^n)(t_{i+1} - t_i))\end{align*}$$<br>则可进一步证明该等式.
4. $$ E(\int_a^b G(t)dB(t) \int_a^b H(t)dB(t)) = E(\int_a^b G(t)H(t)dt)$$.
  - 证明思路: 记$$I_1 = \int_a^b G(t)dB(t)$$, $$I_2 = \int_a^b H(t)dB(t)$$, 则由$$I_1 I_2 = (I_1 + I_2)^2/2 - I_1^2/2 - I_2^2/2$$及上一性质可证明该等式.

# 随机微分

## 基本规则

1. $$d(cX(t)) = cdX(t)$$.
2. $$d(X(t) + Y(t)) = dX(t) + dY(t)$$.
3. $$d(X(t) - Y(t)) = dX(t) - dY(t)$$.
4. $$d(X(t)Y(t)) = X(t)dY(t) + Y(t)dX(t) + dX(t)dY(t)$$.
  - 当$$dX(t) = F_1(t)dt + G_1(t)dB(t)$$, $$Y(t) = F_2(t)dt + G_2(t)dt$$时, $$d(X(t)Y(t)) = X(t)dY(t) + Y(t)dX(t) + G_1(t)G_2(t)dt$$.
5. $$d(\frac{X(t)}{Y(t)}) = \frac{Y(t)dX(t) - X(t)dY(t) - dX(t)dY(t)}{Y^2(t)} + \frac{X(t)}{Y^3(t)}(dY(t))^2$$.

## Itô Processes

An Itô process has the form

$$
X(t) = X(0) + \int_0^t \mu(s)ds + \int_0^t \sigma(s)dB(s) \quad 0 \le t \le T
$$

where $$X(0)$$ is $$\mathcal{F}(0)$$-measurable and processes $$\mu(t)$$ and $$\sigma(t)$$ are $$\mathcal{F}(t)$$-adapted, such that $$\int_0^T \lvert \mu(t) \rvert dt < \infty$$ and $$\int_0^T \sigma^2(t) dt < \infty$$.

It is said that the process $$X(t)$$ has the stochastic differential on $$[0, T]$$, $$dX(t) = \mu(t)dt + \sigma(t)dB(t)$$.

Note that $$\mu(t)$$ and $$\sigma(t)$$ may depend on $$X(t)$$ or $$B(t)$$ as well, or even the whole past path of $$B(s), s \le t$$.

Itô process的quadratic variation为$$[Y](t) = \int_0^t \sigma^2(s)ds$$. 如果$$X(t)$$, $$Y(t)$$均为Itô process而$$X(t)$$ is of finite variation, 则$$[X, Y](t) = 0$$.

## Itô's Formula

若随机过程$$X(t)$$有stochastic differential $$dX(t) = \mu(t)dt + \sigma(t)dB(t)$$, 设$$F(t) = f(X(t))$$, 其中$$f(x) \in C^2$$, 则

$$
dF(t) = (\mu(t)f'(X(t)) + \frac{\sigma^2(t)}{2}f''(X(t)))dt + \sigma(t)f'(X(t))dB(t)
$$

证明思路:

$$
\begin{align*}
(dX(t))^2 & = (\mu(t)dt + \sigma(t)dB(t))^2 \\
& = \mu^2(t)dt^2 + 2\mu(t)\sigma(t)dB(t)dt + \sigma^2(t)dB^2(t) \\
& = \sigma^2(t)dt
\end{align*}
$$

代入Taylor expansion得到

$$
\begin{align*}
dF(t) & = f'(X(t))dX(t) + \frac{1}{2}f''(X(t))(dX(t))^2 \\
& = (\mu(t)f'(X(t)) + \frac{\sigma^2(t)}{2}f''(X(t)))dt + \sigma(t)f'(X(t))dB(t)
\end{align*}
$$

由于$$(dB(t))^2 = dt$$并非高阶无穷小, 因此得到了与确定的情形不同的结论.

由此可得到推论$$F(t) = f(B(t))$$时, $$dF(t) = \frac{1}{2}f''(B(t))dt + f'(B(t))dB(t)$$. 特别地,

1. $$f(x) = x^{\alpha}$$时$$d(B^{\alpha}(t)) = \frac{1}{2}\alpha (\alpha - 1)B^{\alpha - 2}(t)dt + \alpha B^{\alpha - 1}(t)dB(t)$$.
2. $$f(x) = e^{kx}$$时$$d(e^{kB(t)}) = ke^{kB(t)}dB(t) + \frac{1}{2}k^2 e^{kB(t)}dt$$.
3. $$f(x) = sin(x)$$时$$d(sin(B(t))) = cos(B(t))dt - \frac{1}{2} sin(B(t))dt$$.

更一般地, 若随机过程$$X(t)$$满足$$dX(t) = \mu(B(t), t)dt + \sigma(B(t), t)dB(t)$$, 且$$f(x, t) \in C^2$$ is time dependent, 则

$$
dF(t) = (\partial_t f(X(t), t) + \mu(B(t), t)\partial_x f(X(t), t) + \frac{\sigma(B(t), t)}{2} \partial^2_x f(B(t), t))dt + \sigma(B(t), t) \partial_x f(X(t), t)dB(t)
$$

## Itô Diffusion

A process $$\boldsymbol{X}(t) = (X^i(t)) \in \mathbb{R}^n$$ satisfying the relation

$$
d\boldsymbol{X}(t) = \boldsymbol{b}(\boldsymbol{X}(t), t)dt + \sigma(\boldsymbol{X}(t), t)d\boldsymbol{B}(t)
$$

is called an Itô diffusion. 其中$$\boldsymbol{B}(t)$$为$$d$$维的Browinian motion, $$\sigma(\boldsymbol{X}(t), t)$$为$$n \times d$$的矩阵. It models the position of a small particle that moves under the influence of a drift force $$b(X(t), t)$$, and is subject to random deviations.

设$$F(t) = f(x_1, \cdots, x_n, t)$$, 其中$$f(x_1, \cdots, x_n, t) \in C^2$$, 则

$$
dF(t) = \partial_t f(X_1(t), \cdots, X_n(t), t) + \sum_{i = 1}^n \partial_{x_i} f(X_1(t), \cdots, X_n(t), t)dX_i(t) + \frac{1}{2}\sum_{i = 1}^n \sum_{j = 1}^n \partial_{x_i} \partial_{x_j} f(X_1(t), \cdots, X_n(t), t) d[X_i, X_j](t)
$$

其中$$d[X_i, X_j](t) = dX_i(t)dX_j(t) = \sigma_i(t)\sigma_j(t) = a_{ij}(t)dt$$, for $$i,j = 1,\cdots,n$$. $$a(t) = (a_{ij}(t)) = \sigma(X(t), t) \sigma(X(t), t)^T$$称为diffusion matrix.

# 随机微分方程

## From ODE to SDE

如果$$x(t)$$是一个在$$t \ge 0$$上定义的可导函数, $$\mu(x, t)$$是$$x$$和$$t$$的函数, 且对任意的$$0 \le t \le T$$满足以下条件

$$
\frac{dx(t)}{dt} = x'(t) = \mu(x(t), t) \quad \text{and} \quad x(0) = x_0
$$

则$$x(t)$$是以$$x_0$$为初值条件的ODE的解. 通常我们额外要求$$x'(t)$$是连续的. SDEs arise, when the coefficients of ODEs are perturbed by white noise. 我们定义white noise为Brownian motion的导数. 则有$$\int_0^T \sigma(X(t), t)\xi(t)dt = \int_0^T \sigma(X(t), t)dB(t)$$. 

## White Noise

我们先小小地离题一下, 以更详细地介绍white noise. 我们已经知道Brownian motion是处处不可导的, 因此严格意义上white noise并不存在. 不过我们有heuristic formula $$E(\xi(t)\xi(s)) = \delta_0(s - t)$$. 设$$h > 0$$, 固定$$t > 0$$, 设

$$
\begin{align*} \phi_h(s) & = E((\frac{B(t + h) - B(t)}{h})(\frac{B(s + h) - B(s)}{h})) \\
& = \frac{1}{h^2}(E(B(t + h)B(s + h)) - E(B(t + h)B(s)) - E(B(t)B(s + h)) + E(B(t)B(s))) \\
& = \frac{1}{h^2}(\min(t + h, s + h) - \min(t + h, s) - \min(h, s + h) + \min(t, s))
\end{align*}
$$

则$$h \rightarrow 0$$时, 对$$s \ne t$$, 有$$\phi_h(s) \rightarrow 0$$. 然而$$\phi_h(s) \ge 0$$且$$\int \phi_h(s)ds = 1$$, 故可认为$$\phi_h(s) \rightarrow \delta_0(s - t)$$. 此外, 我们期待$$\phi_h(s) \rightarrow E(\xi(t)\xi(s))$$, 故可以不严谨地认为上述heuristic formula成立.

如果$$X(t)$$是对所有$$t \ge 0$$满足$$E(X^2(t)) < \infty$$的随机过程, 则定义$$r(t, s) = E(X(t)X(s))$$为$$X(t)$$的autocorrelation function, 其中$$t, s \ge 0$$. If $$r(t, s) = f(t-s)$$ for some function $$f: \mathbb{R} \mapsto \mathbb{R}$$ and if $$E(X(t)) = E(X(s))$$ for all $$t, s \ge 0$$, then $$X(t)$$ is called stationary in the wide sense. A white noise process is, at least at the formal level, wide sense stationary. 定义autocorrelation funtion的Fourier transform为$$X(t)$$的spectral density, 则对于white noise, 其spectral density在各个频率上都相等. 就像所有颜色的光平均混合得到白光一样.

## 定义

An equation of the form

$$
dX(t) = \mu(X(t), t)dt + \sigma(X(t), t)dB(t)
$$

where functions $$\mu(x, t)$$ and $$\sigma(x, t)$$ are given and $$X(t)$$ is the unknown process, is called a stochastic differential equation driven by Brownian motion. The functions $$\mu(x, t)$$ and $$\sigma(x, t)$$ are called respectively the drift and the diffusion coefficient.

物理上, 可将$$X(t)$$看作时间$$t$$时微粒在一个方向上从初始位置开始的位移, 将$$\mu(x, t)$$看作液体时间$$t$$时在位置$$x$$的速度, 将$$\sigma(x, t)$$看作温度时间$$t$$时在位置$$x$$的影响.

这种形式的方程又称为diffusion-type SDEs. 更一般的SDE的形式为$$dX(t) = \mu(t)dt + \sigma(t)dB(t)$$, where $$\mu(t)$$ and $$\sigma(t)$$ can depend on $$t$$ and the whole past of the processes $$X(t)$$ and $$B(t)$$ ($$X(s),B(s),s \le t$$), that is, $$\mu(t) = \mu((X(s), s \le t),t), \sigma(t) = \sigma((X(s), s \le t), t)$$. 对$$\mu(t)$$和$$\sigma(t)$$唯一的限制是它们必须是adapted processes, with respective integrals defined. 我们接下来的讨论主要聚焦于diffusion-type SDEs.

A process $$X(t)$$ is called a strong solution of the SDE if for all $$t > 0$$ the integrals $$\int_0^t \mu(X(s), s)ds$$ and $$\int_0^t\sigma(X(s), s)dB(s)$$ exist, with the second being an Itô integral, and

$$
X(t) = X(0) + \int_0^t \mu(X(s), s)ds + \int_0^t\sigma(X(s), s)dB(s)
$$

A strong solution is some function(functional) $$F(t, (B(s), s \le t))$$ of the given Brownian motion.

SDE的解具有Markov property.

## Stochastic Exponential and Logarithm

令$$X(T)$$有stochastic differential, 且$$U(t)$$满足$$dU(t) = U(t)dX(t)$$且$$U(0) = 1$$, 则$$U(t)$$称为$$X(t)$$的stochastic exponential, 记为$$\mathcal{E}(X)$$. 对于Itô processes, 则有

$$
U(t) = \exp(X(t) - X(0) - \frac{1}{2}[X, X](t))
$$

令$$U(t)$$有stochastic differential且取值不为$$0$$, 则其stochastic logarithm满足$$dX(t) = \frac{dU(t)}{U(t)}$$且$$X(0) = 0$$. 可解得

$$
X(t) = \mathcal{L}(U)(t) = \ln(\frac{U(t)}{U(0)}) + \int_0^t \frac{d[U, U](s)}{2U^2(s)}
$$

## 线性SDE的解

Linear SDEs form a class of SDEs that can be solved explicitly. Consider a general linear SDE in one dimension

$$
dX(t) = (\alpha(t) + \beta(t)X(t))dt + (\gamma(t) + \delta(t)X(t))dB(t)
$$

where functions $$\alpha, \beta, \gamma, \delta$$ are given adapted processes and are continuous functions of $$t$$.

### Stochastic Exponential SDEs

当$$\alpha(t) = 0$$且$$\gamma(t) = 0$$时, 方程转化为

$$
dX(t) = \beta(t)X(t)dt + \delta(t)X(t)dB(t)
$$

具有$$dX(t) = X(t)dY(t)$$的形式, 其中$$dY(t) = \beta(t)dt + \delta(t)dB(t)$$, 则$$X(t)$$是$$Y(t)$$的stochastic differential. 故有

$$
\begin{align*}
X(t) & = X(0)\exp(Y(t) - Y(0) - \frac{1}{2}[Y,Y](t)) \\
& = U(0)\exp(\int_0^t \beta(s)ds + \int_0^t \delta(s)ds - \frac{1}{2}\int_0^t \delta^2(s)ds) \\
& = U(0)\exp(\int_0^t (\beta(s) - \frac{1}{2}\delta^2(s))ds + \int_0^t \delta(s)ds)
\end{align*}
$$

### General Linear SDEs

为解一般形式的线性SDE, 考虑$$X(t) = U(t)V(t)$$形式的解, 其中

$$
dU(t) = \beta(t)U(t)dt + \delta(t)U(t)dB(t)
$$

且

$$
dV(t) = a(t)dt + b(t)dB(t)
$$

设$$U(0) = 1$$且$$V(0) = X(0)$$, 则由stochastic exponential SDE的情形可给出$$U(t)$$. 恰当地选取$$a(t)$$和$$b(t)$$可使$$X(t) = U(t)V(t)$$成立

$$
b(t)U(t) = \gamma(t) \quad \text{and} \quad a(t)U(t) = \alpha(t) - \delta(t)\gamma(t)
$$

进一步解得

$$
X(t) = U(t)(X(0) + \int_0^t \frac{\alpha(s) - \delta(s)\gamma(s)}{U(s)}ds + \int_0^t \frac{\gamma(s)}{U(s)}dB(s))
$$

### Langevin-Type SDE

令$$X(t)$$满足

$$
dX(t) = a(t)X(t)dt + dB(t)
$$

其中$$a(t)$$是给定的连续adapted process. 当$$a(t) = -\alpha$$时, 该方程为Langevin equation. 应用一般公式可解得

$$
X(t) = e^{-\int_0^t a(s)ds} (X(0) + \int_0^t e^{-\int_0^u a(s)ds}dB(u))
$$

### Brownian Bridge

The Brownian Bridge, or pinned Brownian motion, is a solution to the following SDE:

$$
dX(t) = \frac{b - X(t)}{T - t}dt + dB(t)
$$

This process is a transformed Brownian motion with fixed values at each end of the interval $$[0, T], X(0) = a$$ and $$X(T) = b$$. 应用一般公式可解得

$$
X(t) = a(1 - \frac{t}{T}) + b\frac{t}{T} + (T - t)\int_0^t \frac{1}{T - s} dB(s)
$$

## Existence and Uniqueness of Strong Solutions

令$$X(t)$$满足$$dX(t) = \mu(X(t), t)dt + \sigma(X(t), t)dB(t)$$, 若满足以下条件

1. Coefficients are locally Lipschitz in $$x$$ uniformly in $$t$$, that is, for every $$T$$ and $$N$$ there is a constant $$K$$ depending only on $$T$$ and $$N$$, such that for all $$\lvert x \rvert, \lvert y \rvert \le N$$ and all $$0 \le t \le T$$, $$\lvert \mu(x,t) - \mu(y, t) \rvert + \lvert \sigma(x, t) - \sigma(y, t) \rvert < K \lvert x - y \rvert$$.
2. Coefficients satisfy the linear growth condition $$\lvert \mu(x, t) \rvert + \lvert \sigma(x, t) \rvert \le K(1 + \lvert x \rvert)$$.
3. $$X(0)$$ is independent of $$(B(t), 0 \le t \le T)$$, and $$E(X^2(0)) < \infty$$.

那么该SDE存在一个唯一的strong solution $$X(t)$$. $$X(t)$$有连续的路径, 且$$E(\sup_{0 \le t \le T}X^2(t)) < C(1 + E(X^2(0)))$$. 其中常数$$C$$的取值仅依赖于$$K$$和$$T$$.

若对$$\lvert x \rvert, \lvert y \rvert \le N$$和$$0 \le t \le T$$, $$\partial_x G(x, t)$$和$$\partial_x H(x, t)$$有界, 则所要求的Lipschitz条件成立. 实际上只需要导数连续.

## Weak Solutions to SDEs

Weak solutions的概念允许我们在strong solutions不存在的时候赋予SDE意义. Weak solutions are solutions in distribution, they can be realized on some other probability space, and they exist under less stringent conditions on the coefficients of the SDE.

If there exists a probability space with a filtration, a Brownian motion $$\hat{B}(t)$$, and a process $$\hat{X}(t)$$ adapted to that filtration, such that $$\hat{X}(0)$$ has the given distribution, for all $$t$$ the integrals below are defined, and $$\hat{X}(t)$$ satisfies

$$
\hat{X}(t) = \hat{X}(0) + \int_0^t \mu(\hat{X}(s), s)ds + \int_0^t \sigma(\hat{X}(s), s)d\hat{B}(s)
$$

then $$\hat{X}(t)$$ is called a weak solution to the SDE $$dX(t) = \mu(X(t), t)dt + \sigma(X(t), t)dB(t)$$.

A weak solution is called unique if any two solutions(possible on different probability spaces) with the same distributions have the same finite dimensional distributions.

Strong solution与weak solution之间主要的区别在于, 对于strong solution我们被给定了一个Brownian motion和概率空间, 而对于weak solution我们可以自由地选择Brownian motion和概率空间.

## Backward and Forward Equations

In many applications, the importance of diffusions lies in their connection to PDEs, and often diffusions are specified by a PDE called the Fokker-Planck equation. Although PDEs are hard to solve in closed form, they can be easily solved numerically. We can then obtain the transition function that determines the weak solution to SDEs.

Define the differential operator $$L_s, 0 \le s \le T$$ by

$$
L_sf(x, s) = (L_sf)(x, s) = \frac{1}{2} \sigma^2(x, s)\partial_x^2 f(x, s) + \mu(x, s)\partial_x f(x, s)
$$

The operator $$L_s$$ acts on twice continuously differentiable in $$x$$ functions $$f(x, s)$$.

A fundamental solution of the PDE

$$
\partial_s u(x, s) + L_su(x, s) = 0
$$

is a non-negative function $$p(y, t, x, s)$$ with the following properties

1. It is jointly continuous in $$y, t, x, s$$, twice continuously differentiable in $$x$$ and satisfies the above equation with respect to $$s$$ and $$x$$.
2. For any bounded continuous function $$g(x)$$ on $$\mathbb{R}$$, and any $$t > 0$$, $$u(x, s) = \int_{\mathbb{R}} g(y)p(y, t, x, s)dy$$ is bounded, satisfies the above equation and $$lim_{s \uparrow t}u(x, s) = g(x)$$.

The above equation is a PDE in the backward variables $$(x, s)$$ of the transition function and is therefore called Kolmogorov's backward equation.

Suppose that $$\sigma(x, t)$$ and $$\mu(x, t)$$ are bounded and continuous functions such that

1. $$\sigma^2(x, t) \ge c > 0$$.
2. $$\mu(x, t)$$ and $$\sigma^2(x, t)$$ satisfy a Hölder condition with respect to $$x$$ and $$t$$, that is, for all $$x, y \in \mathbb{R}$$ and $$s, t > 0$$, $$\lvert \mu(y, t) - \mu(x, s)\rvert + \lvert \sigma^2(y, t) - \sigma^2(x, s)\rvert \le K(\lvert y - x \rvert^{\alpha} + \lvert t - s \rvert ^ {\alpha})$$.

Then the PDE has a fundamental solution, which is unique and strictly positive.

If in addition $$\mu(x, t)$$ and $$\sigma(x, t)$$ have two partial derivatives with respect to $$x$$, which are bounded and satisfy a Hölder condition with respect to $$x$$, then $$p(y, t, x, s)$$ as a function in $$y$$ and $$t$$ satisfy the PDE

$$
-\partial_t p(y, t, x, s) + \frac{1}{2} \partial^2_y (\sigma^2(y, t)p(y, t, x, s)) - \partial_y(\mu(y, t)p(y, t, x, s)) = 0 
$$

This equation is in the forward variables $$(y, t)$$ and is therefore called the Kolmogorov's forward equation, also known as Fokker-Planck equation or diffusion equation.

The function $$P(y, t, x, s) = \int_{-\infty}^y p(u, t, x, s)du$$ uniquely defines a transition probability function. Moreover, this function has the property that for any bounded function $$f(x, t)$$ twice continuously differentiable in $$x$$ and once continuously differentiable in $$t$$

$$
\int_{\mathbb{R}} f(y, t)P(dt, t, x, s) - f(x, s) = \int_s^t \int_{\mathbb{R}} (\partial_u + L_u)f(y, u)P(dy, u, x, s)du \quad 0 \le s < t, x \in \mathbb{R}
$$

The transition function $$P(y, t, x, s)$$ defines uniquely a Markov process $$X(t)$$, that is, $$P(y, t, x, s) = P(X(t) \le y \vert X(s) = x)$$, for all $$x, y$$ and $$0 \le s \le t$$. The process $$X(t)$$ is called a diffusion, the differential operator $$L_s$$ is called its generator. The above property implies that $$X(t)$$ satisfies the SDE $$dX(t) = \mu(X(t), t)dt + \sigma(X(t), t)dB(t)$$.

# From SDEs to Diffusion Models

## 逆转时光

要实现「生成」, 我们希望能描述the reversal of the diffusion process, 即

## Diffusion Models as SDEs