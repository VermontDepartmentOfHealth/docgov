---
title_word: SQL
title: 'Execution Plan Stability Testing'
summary: 'Identify the degree of parameter sensitivity in your Stored Procedures with execution plan stability testing'
tags: ['post', 'sql', 'perf']
authors: ['Kyle']
date: 2020-03-10
draft: true
---

Here's a guide based on Kimberly Tripp's video on [Stored Procedure Optimization Techniques](https://www.youtube.com/watch?v=x3FgHIOfBM0) (timestamp @ [38:54](https://youtu.be/x3FgHIOfBM0?t=2334))

One potential source of issues is 


One of the concepts she talked about was how to identify Parameter Sensitivity.

The first random call to a SP gets to set the cached execution plan, so relying on an optimal first call in the wild is speculative at best.  

A good starting point for diagnosis is to:

1. Create a Code Coverage test plan with the several possible invocations of a SP
2. Clear the cached evaluation with `sp_recompile`
3. Run one possible set of params to set the initial plan
4. Add IO statistics to capture logical reads with `SET STATISTICS IO ON`
5. Run all code coverage tests with each set of parameters and see how well they each fair against the execution plan in step 3
6. Go back to step 2 and repeat with each possible set of params
7. Get a baseline for the best possible results by running all test cases with `WITH RECOMPILE`

This strategy should allow you to test the variance in logical reads based on the cached execution plan and the degree of parameter sensitivity.  

Recompiling should always give the best execution plan, but suffers from lack of exaction plan caching.  Although a bad execution plan is going to likely to be far in worse than the cost of generating an execution plan. Her ultimate solution is to use Dynamic SQL to get the best of both worlds – custom plans with caches.
