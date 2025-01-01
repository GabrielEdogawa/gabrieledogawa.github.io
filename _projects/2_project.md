---
layout: page
title: Solver tuning for CPLEX
description: Beginner's guide on how to effectively make your optimization solver a pro
img: assets/img/cplex/cplex_logo.jpg
importance: 2
category: Work
---

[IBM ILOG CPLEX](https://www.ibm.com/products/ilog-cplex-optimization-studio) is one of the most powerful commercial solvers in the world widely used in industry and academia. However, as we all know, 

<span
  data-toggle="popover"
  data-placement="top"
  data-html="true"
  data-content="This is the popover content."
>
  Hover over this text
</span>

MIP problems could be extremely hard to solve especially when the problem size goes wild or the problem falls into some specific structures like near-singular constraint space. In these cases, using particular solver options (often referred as <b>solver tuning</b>) could yield surprisingly efficient solution processes. This project offers a fundamental guidance for beginners facing excessively long solution times in CPLEX. The tuning procedures are also applicable to other solvers, such as FICO-Xpress and Gurobi, as they typically share similar solver options. (arguably Gurobi might have the best performance, but still case dependent).

### General Rule of Thumb

To be clear at the beginning, like all the tuning procedures, the ways provided in this guide is very **subjective**. All solvers in fact largely depend on many sophisticated heuristics to initialize the algorithm or preprocess the branch and cut searching. Refer to [this documentation](https://www.gurobi.com/resources/mixed-integer-programming-mip-a-primer-on-the-basics/) from Gurobi (yes, they get a far better and user-friendlier doc!) for more details regarding how solver works towards solving MIP. What we are technically doing for the solver tuning is to modify the heuristic methods (kind of adding another self-designed heuristic onto the existing ones). So it should be kept in mind that one good solver tuning result is with possibility zero applicable to all scenarios, even if the scenarios are alike. But it could hold substantial merits in sequential or parallel problem solving in large quantities for identical problem structure (like how GPU works for us). 

It should be noted that the example case we are talking in this guide is a MILP problem with millions of constraints & variables for a unit commitment (UC) problem in the power sector. Compared to other MIP applications, the unit commitment problem has the following unique features:
- <b>Extremely high dimensionality</b> due to the tight coupling between the integer and continuous variables
- <b>Stringent time coupling constraints</b> across the whole problem, which renders the feasibility space overwhelmingly large.
- <b>Highly sparse yet potentially redundant constraints with highly symmetric formulation structure</b>, leading to heavy dual degeneracy risk.

Those unique features give us an initial idea on how we should tell the solver to customize its solution procedure.

### Inspect the Optimization Log

We should always start with the **default** solver setting. After getting the optimization log, it is very possible to gain a lot better understanding on the problem when checking the log. When doing so, ask yourself the following questions:

#### Does the problem have a hard time finding incumbents?

This is arguably the most common issue we would face when solving large-scale UC problems. [Incumbent](https://www.ibm.com/docs/en/cofz/12.9.0?topic=optimizer-when-integer-solution-is-found-incumbent) is the best feasible solution found so far that could satisfy all constraints in the model. So when the solver takes minutes or even hours finding the next improved incumbent, it means that the model is extremely near-infeasible or the constraint space is too smooth. Then, there are two potential ways to speed up the searching if you don't want to change (simplify) your model.
