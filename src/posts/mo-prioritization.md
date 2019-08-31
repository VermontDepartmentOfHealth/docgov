---
layout: post.njk
title: M&O Prioritization
tags: ['post', 'team', 'process']
authors: ['Kyle']
team: MO
date: 2019-08-29
summary: "Usage guidelines on setting priorities on incoming and existing JIRA tickets"
---

In order to triage incoming tickets, we're currently making use of the following priorities (defaulted to *Medium*)

# JIRA Priorities

| Name        |  Icon                                    |  Color                                              |
|-------------|:----------------------------------------:|:---------------------------------------------------:|
| **Blocker** | {% include "images/icons/blocker.svg" %} | <div style="background:#990000" class="fill"></div> |
| **Major**   | {% include "images/icons/major.svg" %}   | <div style="background:#cc0000" class="fill"></div> |
| **Medium**  | {% include "images/icons/medium.svg" %}  | <div style="background:#FFAB00" class="fill"></div> |
| **Minor**   | {% include "images/icons/minor.svg" %}   | <div style="background:#339900" class="fill"></div> |
| **Trivial** | {% include "images/icons/trivial.svg" %} | <div style="background:#006600" class="fill"></div> |
| **Backlog** | {% include "images/icons/backlog.svg" %} | <div style="background:#131372" class="fill"></div> |
| **Unknown** | {% include "images/icons/unknown.svg" %} | <div style="background:#B0BAC5" class="fill"></div> |

## {% include "images/icons/blocker.svg" %} Blocker

<!-- Authoring Hint: disable line wrap / zoom out for super wide table text -->

| {% include "images/icons/bug.svg" %}  Bug                                                                    | {% include "images/icons/story.svg" %} Enhancement                      |
|--------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Blocks development and/or testing work, production could not run. Crashes, loss of data, severe memory leak. | Vital to release.  Time mandated deadline by legislature or grant       |



## {% include "images/icons/major.svg" %}  Major

| {% include "images/icons/bug.svg" %}  Bug                                                                    | {% include "images/icons/story.svg" %} Enhancement                      |
|--------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Major loss of function.                                                                                      | ex. code refactoring for maintainability, providing better UX on forms  |



## {% include "images/icons/medium.svg" %} Medium

| {% include "images/icons/bug.svg" %}  Bug                                                                    | {% include "images/icons/story.svg" %} Enhancement                      |
|--------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Impairment to functionality with time intensive or incomplete workaround.                                    | Quality of Life enhancement which adds value to interface, process.  Makes usage and maintainability easier or more efficient. |



## {% include "images/icons/minor.svg" %} Minor

| {% include "images/icons/bug.svg" %}  Bug                                                                    | {% include "images/icons/story.svg" %} Enhancement                      |
|--------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Minor loss of function, or other problem where easy workaround is present.                                   | Minor addition of business value from completing                        |



## {% include "images/icons/trivial.svg" %} Trivial

| {% include "images/icons/bug.svg" %}  Bug                                                                    | {% include "images/icons/story.svg" %} Enhancement                      |
|--------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Cosmetic problem like misspelt words or misaligned text.                                                     | Minor UI tweaks. Addressing minor technical debt issues in code and documentation. |



## {% include "images/icons/backlog.svg" %} Backlog

| {% include "images/icons/bug.svg" %}  Bug                                                                    | {% include "images/icons/story.svg" %} Enhancement                      |
|--------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| ~~N/A~~                                                                                                      |  Work that can be completed as time allows. Ex. Efficiency improvements, non-critical lifecycle upgrades, technical debt |


## {% include "images/icons/unknown.svg" %} Unknown

| {% include "images/icons/bug.svg" %}  Bug                                                                    | {% include "images/icons/story.svg" %} Enhancement                      |
|--------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Unknown Priority at this time. For requester to review and assign.                                           |  Unknown Priority at this time. For requester to review and assign.     |



<style type="text/css">
h2 {
  display: flex;
}

h2 svg {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

h2+table th {
  width: 50%;
  vertical-align: middle;
  background: #f9f9f9;
  color: inherit;
}
h2+table th svg {
  vertical-align: inherit;
}
</style>