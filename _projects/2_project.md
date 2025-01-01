---
layout: page
title: Solver tuning for CPLEX
description: Beginner's guide on how to effectively make your optimization solver a pro
img: assets/img/cplex/cplex_logo.jpg
importance: 2
category: Work
---

[IBM ILOG CPLEX](https://www.ibm.com/products/ilog-cplex-optimization-studio) is one of the most powerful commercial solvers in the world widely used in industry and academia. <span>Can you see this text?</span> However, as we all know, 
<a
  href="#"
  data-toggle="tooltip"
  title=""
  data-original-title="Custom tooltip content"
>
  Hover over this link
</a> 
MIP problems could be extremely hard to solve especially when the problem size goes wild or the problem falls into some specific structures like near-singular constraint space. In these cases, using particular solver options (often referred as <b>solver tuning</b>) could yield surprisingly efficient solution processes. This project offers a fundamental guidance for beginners facing excessively long solution times in CPLEX. The tuning procedures are also applicable to other solvers, such as FICO-Xpress and Gurobi, as they typically share similar solver options. (arguably Gurobi might have the best performance, but still case dependent).

### General Rule of Thumb

To be clear at the beginning, like all the tuning procedures, the ways provided in this guide is very **subjective**. All solvers in fact largely depend on many sophisticated heuristics to initialize the algorithm or preprocess the branch and cut searching. What we are technically doing for the solver tuning is to modify the heuristic methods (kind of adding another self-designed heuristic onto the existing ones). So it should be kept in mind that one good solver tuning result is with possibility zero applicable to all scenarios, even if the scenarios are alike. But it could hold substantial merits in sequential or parallel problem solving in large quantities for identical problem structure (like how GPU works for us). Hence, it should be noted that the example case we are talking in this guide is a MIP problem with millions of constraints & variables for a unit commitment problem in the power sector. Compared to other MIP applications, the unit commitment problem features extremely high dimensionality due to the tight coupling between the integer and continuous variables, stringent time coupling constraints across the whole problem, which renders the feasibility space overwhelmingly large, and the highly sparse yet redundant 

### Step 1. Observe the Optimization Log

We should always start with the **default** solver setting. It is possible to get a lot of understanding on the problem when checking the optimization log. 


#### 
