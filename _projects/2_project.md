---
layout: page
title: Solver tuning for CPLEX
description: Beginner's guide on how to effectively make your optimization solver a pro
img: assets/img/cplex/cplex_logo.jpg
importance: 2
category: Work
---

[IBM ILOG CPLEX](https://www.ibm.com/products/ilog-cplex-optimization-studio) is one of the most powerful commercial solvers in the world widely used in industry and academia. <span>Can you see this text?</span> However, as we all know, <span class="tooltip">hover over me</span> MIP problems could be extremely hard to solve especially when the problem size goes wild or the problem falls into some specific structures like near-singular constraint space. In these cases, using particular solver options (often referred as <b>solver tuning</b>) could yield surprisingly efficient solution processes. This project offers a fundamental guidance for beginners facing excessively long solution times in CPLEX. The tuning procedures are also applicable to other solvers, such as FICO-Xpress and Gurobi, as they typically share similar solver options. (arguably Gurobi might have the best performance, but still case dependent).

## General Rule of Thumb

To be clear at the beginning, like all the tuning procedures, the ways provided in this guide is very **subjective**. All the solvers in fact largely depend on many sophisticated heuristics to initialize the algorithm or 

### Step 1. Observe the Optimization Log
