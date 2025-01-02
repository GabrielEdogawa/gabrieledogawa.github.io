---
layout: distill
title: Solver Tuning for Beginners
permalink: /work_life/solver
description: Beginner's guide on how to effectively make your optimization solver a pro
tags: solver tuning
giscus_comments: true
date: 2024-12-31
featured: true
mermaid:
  enabled: true
  zoomable: true
code_diff: true
map: true
chart:
  chartjs: true
  echarts: true
  vega_lite: true
tikzjax: true
typograms: true

authors:
  - name: Dr. Shengfei Yin
    url: "https://www.gabriel-yin.com"
    affiliations:
      name: GE Vernova, Inc.

bibliography: 2018-12-22-distill.bib

toc:
  - name: Preface
  - name: Inspect the Optimization Log
    subsections:
    - name: Does the solver have a hard time finding incumbents?
    - name: Does the solver spend too much time in Presolve?
    - name: Does the solver struggle with reducing the gap at the initial stage?
    - name: Does the solver struggle with reducing the gap at the final stage?
  - name: Some Possible Silver Bullets
  - name: One More Thing
---

## Preface

[IBM ILOG CPLEX](https://www.ibm.com/products/ilog-cplex-optimization-studio) is one of the most powerful commercial solvers in the world widely used in industry and academia. However, as we all know, <span class="dashed-popover" data-toggle="popover" data-placement="top" title="Mixed-Integer Programming">MIP</span> problems could be extremely hard to solve especially when the problem size goes wild or the problem falls into some specific structures like near-singular constraint space. In these cases, using particular solver options (often referred to as <b>solver tuning</b>) could yield surprisingly efficient solution processes. This page offers a fundamental guidance for beginners facing excessively long solution times in CPLEX. The tuning procedures are also applicable to other solvers, such as FICO-Xpress and Gurobi, as they typically share similar solver options (arguably Gurobi might have the best performance, but still case dependent).

To be clear at the beginning, the tuning procedure provided in this guide is very <b>subjective</b>. All solvers in fact largely depend on many sophisticated heuristics to initialize the algorithm, preprocess the searching, and polish the solutions. Refer to [this documentation](https://www.gurobi.com/resources/mixed-integer-programming-mip-a-primer-on-the-basics/) from Gurobi (yes, they get a far better and user-friendlier doc!) for more details regarding how solver works towards solving MIP. What we are technically doing for the solver tuning is to modify the heuristic methods (kind of adding another self-designed heuristic onto the existing ones). So it should be kept in mind that one good solver tuning result is <u>with probability zero</u> applicable to all scenarios, even if the scenarios are alike. But it could hold substantial merits in sequential or parallel problem solving in large quantities for identical problem structure (like how GPU works for us). 

It should be noted that the example case we are talking in this guide is a <span class="dashed-popover" data-toggle="popover" data-placement="top" title="Mixed-Integer Linear Programming">MILP</span> problem with millions of constraints & variables for [unit commitment](https://en.wikipedia.org/wiki/Unit_commitment_problem_in_electrical_power_production) (UC). Compared to other MIP applications, the UC problem has the following unique features:
- <b>Extremely high dimensionality</b> due to the tight coupling between the integer and continuous variables.
- <b>Stringent time coupling constraints</b> across the whole problem, which renders the feasibility space overwhelmingly large.
- <b>Heavily sparse yet redundant constraints with highly symmetric formulation structure</b>, leading to high dual degeneracy risk.

Those unique features give us an initial idea on how we should tell the solver to customize its solution procedure.

I slightly changed the formatting of this project so that you could leave questions or comments at the end. I'll try my best to answer them.

---

## Inspect the Optimization Log

We should always start with the <b>default</b> solver setting. After obtaining the optimization log, it is very possible to gain a lot better understanding on the problem when checking the log. When doing so, ask the following questions:

### Does the solver have a hard time finding incumbents?

This might be the most common issue we would face when solving large-scale UC problems. [Incumbent](https://www.ibm.com/docs/en/cofz/12.9.0?topic=optimizer-when-integer-solution-is-found-incumbent) is the best feasible solution found so far that could satisfy all constraints in the model, serving as an lower bound (in maximization problem) when calculating the MIP gap. So when the solver takes minutes or even hours finding the next improved incumbent, it means that the model is extremely near-infeasible or the LP relaxation is too weak. Then, there are two potential ways to speed up the searching if you don't want to change (simplify) your model.

- Set the solver option <b>MIP emphasis</b> to <u>emphasize feasibility over optimality</u>:<br> 
  `cpx.parameters.emphasis.mip.set(1)`.<br> 
  Doing so commands the solver to use more aggressive branching strategies to find feasible solutions as soon as possible. This is also one of the most impactful meta options that one should usually try first when the solver performance is poor.
- Set the solver option <b>variable selection</b> to <u>strong branching</u>:<br> 
  `cpx.parameters.mip.strategy.variableselect.set(3)`.<br> 
  This setting causes variable selection based on partially solving a number of subproblems with tentative branches to see which branch is most promising. This is often effective on large, difficult problems.
- Set the solver option <b>matrix scaling</b> to <u>more aggressive scaling</u>:<br> 
  `cpx.parameters.preprocessing.scaling.set(1)`.<br> 
  Sometimes the model could struggle with staying feasible during the solution procedure due to numerical stability or large differences in coefficient magnitudes. Hence, using more aggressive scaling might appear to be effective.

### Does the solver spend too much time in Presolve?

[Presolve](https://support.gurobi.com/hc/en-us/articles/360024738352-How-does-presolve-work) is a significant procedure that the solver usually first enters in the solving stage, where it prunes the model with redundant constraints & variables and prepares refined branches and nodes for further inspection. However, the abundance of tight physical constraints and model symmetry in large-scale UC problems could commonly jeopardize the Presolve stage. When the Presolve stage takes a majority of the total solution time, try the following solver options:

- Set the solver option <b>node presolve selector</b> to <u>aggressive node probing</u>:<br>
  `cpx.parameters.mip.strategy.presolvenode.set(3)`<br>
  Setting this commands the solver to perform the maximally aggressive level of Presolve performed at the node level during the branch solution search.
  
In fact, when finding the solver gets stuck in Presolve, the best practice should be to sit back and inspect the model again, trying to prune unnecessary constraints and variables manually.
  
### Does the solver struggle with reducing the gap at the initial stage?

Somestimes the solver could have difficulty quickly improving the objective value or finding good-quality feasible solutions early in the process. Usually, Presolve could significantly improve the early-stage solution hunting, but for large-scale problems it could be way insufficent for solver to crack the nutshell at the beginning due to model symmetry, weak LP relaxation, and large constraint space. This issue could be detrimental to solution time even rendering the solver time-out. Fortunately, there are several effective solver options that could speed up.

- Set the solver option <b>relative MIP gap before starting to polish a solution</b> to <u>some high percentage value</u>:<br>
  `cpx.parameters.mip.tolerances.mipgappolish.set(0.9)`<br>
  [Solution polishing](https://www.ibm.com/docs/en/icos/22.1.1?topic=heuristics-solution-polishing) can yield better solutions in situations where good solutions are otherwise hard to find. More time-intensive than other heuristics, solution polishing is actually a variety of branch-and-cut that works after an initial solution is available. Because of the high cost entailed by solution polishing, it is not called throughout branch-and-cut like other heuristics. So basically it only gets used when user calls it. As an additional step after branch-and-cut, solution polishing can potentially improve the incumbent quickly. Hence, one could enable this option in large percentage value to start polishing when the solver gets stuck early. Still, it is particularly noteworthy that the polishing algorithm does not always work fine. In fact, it could in some scenarios even worsen the solution searching without any benefit. It inherently is a time-intensive and more aggressive refinement procedure that exploits and focuses on the neighbor nodes of the current incumbent. Thus, when to activate the polishing is critical when tuning sophisticated problems. 
- Set the solver option <b>MIP starting value</b> to <u>set discrete variable values and use check feasibility mipstart level</u>:<br>
  `cpx.parameters.mip.start.set(2)`<br>
  This option controls the use of advanced starting values for MIP. A setting of 2 indicates that the values should be checked to see if they provide an integer feasible solution before starting root optimization. Setting like this would help facilitate the initial "feasibilization" and hence expedite the imcubent searching.
- Set the solver option <b>symmetry breaking cuts</b> to <u>moderate level of symmetry breaking</u>:<br>
  `cpx.parameters.mip.strategy.symmetry.set(1)`<br>
  [Symmetry](https://en.wikipedia.org/wiki/Symmetry-breaking_constraints) in an optimization problem refers to cases where multiple equivalent solutions exist due to the interchangeable nature of variables, constraints, or other problem structures. A symmetry-breaking cut is a set of additional constraints to eliminate symmetric solutions without removing any feasible or optimal solutions, which could greatly reduce the searching effort.
  
### Does the solver struggle with reducing the gap at the final stage?

More often in solving large-scale MIP problems, the solver could spend hours reducing the gap from 5% to 1%, for example. This is because the solver does a bad job with fine-tuning the solution due to the diminishing returns of exploring the solution space as it approaches optimality. This issue is *de facto* one of the most common bottlenecks for large-scale MIP applications, not just UC, because of the <span class="dashed-popover" data-toggle="popover" data-placement="top" title="Weak LP relaxation; Diminishing marginal returns; Exponentional search space">natures of branch-and-cut</span>. It is also arguably the most difficult problems in tuning the solver. One might want to try with the following options:

- Set the solver option <b>relative MIP gap before starting to polish a solution</b> to <u>some low percentage value</u>:<br>
  `cpx.parameters.mip.tolerances.mipgappolish.set(0.1)`<br>
  If the solver could easily reduce the gap at the beginning, there is no need to activate polishing at the early stage because of its computational intensity as discussed above. Sometimes it could be very effective in tightening the bounds later because of its strong neighbor refinement capability, which is very useful in later stages when the solver spends exponential efforts going over nodes.
- Set the solver option <b>node selection strategy</b> to <u>choose the most recently created node</u>:<br>
  `cpx.parameters.mip.strategy.nodeselect.set(0)`<br>
  The default option for this one is choosing the unprocessed node with the best objective function for the associated LP relaxation. By setting it 0 commands the solver to choose the most recently created node, with the same reason of employing polishing.
  
---

## Some Possible Silver Bullets

Sometimes the following options are elixirs that setting them correctly could work like magic, especially for <span class="dashed-popover" data-toggle="popover" data-placement="top" title="Problems with large differences in coefficient magnitudes and setting scaling is insufficient to work">ill-conditioned</span> MIP problems. 

- Set the solver option <b>numerical emphasis</b> to <u>exercise extreme caution in computation</u>:<br>
  `cpx.parameters.emphasis.numerical.set(1)`<br>
  Setting this commands the solver to focus on avoiding numerical issues, which may involve slower but more robust calculations, with consequent performance trade-offs in time and memory. By sacrificing the solution effort in handling nodal relaxation problems, the solver could achieve an overall better solution time for problems highly sensitive to numerical stability.
- Set the solver option <b>Markowitz tolerance</b> to <u>some tuned values</u>:<br>
  `cpx.parameters.simplex.tolerances.markowitz.set(0.0001)`<br>
  This is a very interesting solver option. [Markowitz tolerance](https://support.gurobi.com/hc/en-us/articles/14785877856145-What-does-the-Markowitz-tolerance-do) is used as a criterion to decide which pivot elements are acceptable for simplex algorithm that controls the numerical stability during the factorization of the basis matrices. It also impacts the MIP problem due to the intensive procedure of solving LP relaxations. For ill-conditioned MIP problems, tuning this value could sometimes be very effective. Though the default value of this one is 0.01, decreasing it could help when one observes frequent infeasible incumbents or slow convergence, while increasing it could save the day if one encounters out-of-memory in solving LP relaxations.

---

## One More Thing

There are still a huge bunch of solver options out there for solvers like CPLEX that this guide doesn't touch. But I believe we have covered the most impactful ones. There are also some built-in tuning tools of these solvers, like [CPLEX automatic tuning tool](https://www.ibm.com/support/pages/cplex-performance-tuning-mixed-integer-programs#Item2), [Gurobi parameter tuning tool](https://docs.gurobi.com/projects/optimizer/en/current/features/tuning.html), and [FICO-Xpress tuner](https://www.fico.com/fico-xpress-optimization/docs/dms2018-04/evalguide2/dhtml/eg2sec1_sec_eg2ssec12.html). Personally speaking, I don't usually find these tools useful, since they would yield very specific and non-generalizable solver options that works particularly for the one instance you test. They are also frustratingly empirical. 

Hope these recommendations give you a good start on tuning the solver. Leave me a comment below if you have any questions! Have fun 👻
