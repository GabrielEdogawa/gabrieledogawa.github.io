---
layout: page
title: Solver tuning for CPLEX
description: Beginner's guide on how to effectively make your optimization solver a pro
img: assets/img/cplex/cplex_logo.jpg
importance: 2
category: Work
---

[IBM ILOG CPLEX](https://www.ibm.com/products/ilog-cplex-optimization-studio) is one of the most powerful commercial solvers in the world widely used in industry and academia. However, as we all know, <span class="dashed-popover" data-toggle="popover" data-placement="top" title="Mixed-Integer Programming">MIP</span> problems could be extremely hard to solve especially when the problem size goes wild or the problem falls into some specific structures like near-singular constraint space. In these cases, using particular solver options (often referred as <b>solver tuning</b>) could yield surprisingly efficient solution processes. This project offers a fundamental guidance for beginners facing excessively long solution times in CPLEX. The tuning procedures are also applicable to other solvers, such as FICO-Xpress and Gurobi, as they typically share similar solver options. (arguably Gurobi might have the best performance, but still case dependent).

### Preface

To be clear at the beginning, like all the tuning procedures, the ways provided in this guide is very <b>subjective</b>. All solvers in fact largely depend on many sophisticated heuristics to initialize the algorithm or preprocess the branch and cut searching. Refer to [this documentation](https://www.gurobi.com/resources/mixed-integer-programming-mip-a-primer-on-the-basics/) from Gurobi (yes, they get a far better and user-friendlier doc!) for more details regarding how solver works towards solving MIP. What we are technically doing for the solver tuning is to modify the heuristic methods (kind of adding another self-designed heuristic onto the existing ones). So it should be kept in mind that one good solver tuning result is <u>with probability zero</u> applicable to all scenarios, even if the scenarios are alike. But it could hold substantial merits in sequential or parallel problem solving in large quantities for identical problem structure (like how GPU works for us). 

It should be noted that the example case we are talking in this guide is a <span class="dashed-popover" data-toggle="popover" data-placement="top" title="Mixed-Integer Linear Programming">MILP</span> problem with millions of constraints & variables for a [unit commitment](https://en.wikipedia.org/wiki/Unit_commitment_problem_in_electrical_power_production) (UC) problem. Compared to other MIP applications, the UC problem has the following unique features:
- <b>Extremely high dimensionality</b> due to the tight coupling between the integer and continuous variables.
- <b>Stringent time coupling constraints</b> across the whole problem, which renders the feasibility space overwhelmingly large.
- <b>Highly sparse yet redundant constraints with highly symmetric formulation structure</b>, leading to heavy dual degeneracy risk.

Those unique features give us an initial idea on how we should tell the solver to customize its solution procedure.

### Inspect the Optimization Log

We should always start with the <b>default</b> solver setting. After obtaining the optimization log, it is very possible to gain a lot better understanding on the problem when checking the log. When doing so, ask the following questions:

#### Does the solver have a hard time finding incumbents?

This is arguably the most common issue we would face when solving large-scale UC problems. [Incumbent](https://www.ibm.com/docs/en/cofz/12.9.0?topic=optimizer-when-integer-solution-is-found-incumbent) is the best feasible solution found so far that could satisfy all constraints in the model. So when the solver takes minutes or even hours finding the next improved incumbent, it means that the model is extremely near-infeasible or the constraint space is too smooth. Then, there are two potential ways to speed up the searching if you don't want to change (simplify) your model.

- Set the solver option <b>MIP emphasis</b> to <u>emphasize feasibility over optimality</u>:<br> 
  `cpx.parameters.emphasis.mip.set(1)`.<br> 
  Doing so commands the solver to use more aggressive branching strategies to find feasible solutions as soon as possible.
- Set the solver option <b>variable selection</b> to <u>strong branching</u>:<br> 
  `cpx.parameters.mip.strategy.variableselect(3)`.<br> 
  This setting causes variable selection based on partially solving a number of subproblems with tentative branches to see which branch is most promising. This is often effective on large, difficult problems.

#### Does the solver spend too much time in presolve?

[Presolve](https://support.gurobi.com/hc/en-us/articles/360024738352-How-does-presolve-work) is a significant procedure that the solver usually first enters in the solving stage, where it prunes the model with redundant constraints & variables and prepares reduced branches and nodes for further inspection. However, the abundance of tight physical constraints and symmetry model structure in large-scale UC problems could commonly jeopardize the presolve stage. When the presolve stage takes a majority of the total solution time, try the following solver options:

- Set the solver option <b>node presolve selector</b> to <u>aggressive node probing</u>:<br>
  `cpx.parameters.mip.strategy.presolvenode(3)`<br>
  Setting this commands the solver to perform the maximally aggressive level of presolve performed at the node level during the branch solution search.
  
In fact, when finding the solver gets stuck in presolve, the best practice should be to sit back and inspect the model again, trying to prune unnecessary constraints and variables manually.
  
#### Does the solver struggles in reducing the gap at the initial stage?

Somestimes the solver could have difficulty quickly improving the objective value or finding good-quality feasible solutions early in the process. Usually, the presolve could significantly improve the early-stage solution hunting, but for large-scale problems it could be way insufficent for solver to crack the nutshell at the beginning due to symmetry model structure, weak relaxation, and large coonstraint space. This issue could be detrimental to solution time even rendering the solver time-out. Fortunately, there are several effective solver options that could speed up.

- Set the solver option <b>relative MIP gap before starting to polish a solution</b> to <u>some high percentage value</u>:<br>
  `cpx.parameters.mip.tolerances.mipgappolish(0.9)`<br>
  [Solution polishing](https://www.ibm.com/docs/en/icos/22.1.1?topic=heuristics-solution-polishing) can yield better solutions in situations where good solutions are otherwise hard to find. More time-intensive than other heuristics, solution polishing is actually a variety of branch-and-cut that works after an initial solution is available. Because of the high cost entailed by solution polishing, it is not called throughout branch-and-cut like other heuristics. So basically it only gets used when user calls it. As an additional step after branch-and-cut, solution polishing can potentially improve the incumbent quickly. Hence, one could enable this option in large percentage value to start polishing when the solver gets stuck early. And it is usually very powerful based on my experience for the early stuck scenarios.
- Set the solver option <b>MIP starting value</b> to <u>set discrete variable values and use auto mipstart level</u>:<br>
  `cpx.parameters.mip.start(2)`<br>
  This option 
