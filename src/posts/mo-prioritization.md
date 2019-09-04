---
title_word: Prioritization
title: M&O Prioritization
tags: ['post', 'process']
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

* {% include "images/icons/bug.svg" %}  **Bug** - Blocks development and/or testing work, production could not run. Crashes, loss of data, severe memory leak.
* {% include "images/icons/story.svg" %} **Enhancement** - Vital to release.  Time mandated deadline by legislature or grant
* {% include "images/icons/task.svg" %} **Task** - Data fix that is preventing access or services for multiple end-users in production



## {% include "images/icons/major.svg" %}  Major

* {% include "images/icons/bug.svg" %}  **Bug** -  Major loss of function. 
* {% include "images/icons/story.svg" %} **Enhancement** - ex. code refactoring for maintainability, providing better UX on forms
* {% include "images/icons/task.svg" %} **Task** - ex. Data fix that is preventing access or services for a single end-user in production



## {% include "images/icons/medium.svg" %} Medium

* {% include "images/icons/bug.svg" %}  **Bug** -  Impairment to functionality with time intensive or incomplete workaround.
* {% include "images/icons/story.svg" %} **Enhancement** - Quality of Life enhancement which adds value to interface, process.  Makes usage and maintainability easier or more efficient. 
* {% include "images/icons/task.svg" %} **Task** - Data quality or Data integrity fixes that are visible to users




## {% include "images/icons/minor.svg" %} Minor

* {% include "images/icons/bug.svg" %}  **Bug** -  Minor loss of function, or other problem where easy workaround is present.
* {% include "images/icons/story.svg" %} **Enhancement** -  Minor addition of business value from completing 
* {% include "images/icons/task.svg" %} **Task** - Data cleanup for internal use only data



## {% include "images/icons/trivial.svg" %} Trivial

* {% include "images/icons/bug.svg" %}  **Bug** - Cosmetic problem like misspelt words or misaligned text. 
* {% include "images/icons/story.svg" %} **Enhancement** -  Minor UI tweaks. Addressing minor technical debt issues in code and documentation.



## {% include "images/icons/backlog.svg" %} Backlog

* {% include "images/icons/bug.svg" %}  **Bug** - ~~N/A~~
* {% include "images/icons/story.svg" %} **Enhancement** -  Work that can be completed as time allows. Ex. Efficiency improvements, non-critical lifecycle upgrades, technical debt 
* {% include "images/icons/task.svg" %} **Task** - Internal upkeep. Refactor data schema & normalization



## {% include "images/icons/unknown.svg" %} Unknown

* {% include "images/icons/bug.svg" %}  **Bug** -Unknown Priority at this time. For requester to review and assign.  
* {% include "images/icons/story.svg" %} **Enhancement** -  Unknown Priority at this time. For requester to review and assign.  


<style type="text/css">
h2 {
  display: flex;
}

h2 svg {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}
h2 .direct-link {
  padding: 0 !important;
}
h2 + ul {
    list-style: none;
    padding-left: 50px;
}
h2 + ul li {
    text-indent: -20px;
}
h2 + ul li svg {
  height: 16px;
  margin-top: -2px;
  vertical-align: middle;
}
</style>
