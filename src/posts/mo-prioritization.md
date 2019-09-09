---
title_word: Prioritization
title: M&O Prioritization
tags: ['post', 'process']
authors: ['Kyle']
team: MO
create_date: 2019-08-29
summary: "Usage guidelines on setting priorities on incoming and existing JIRA tickets"
---

In order to triage incoming tickets, we're currently making use of the following priorities (defaulted to *Medium*)

# JIRA Priorities

| Name        |  Icon                                    |  Color                                              |
|-------------|:----------------------------------------:|:---------------------------------------------------:|
| **Blocker** | {% include "assets/images/icons/jira/blocker.svg" %} | <div style="background:#990000" class="fill"></div> |
| **Major**   | {% include "assets/images/icons/jira/major.svg" %}   | <div style="background:#cc0000" class="fill"></div> |
| **Medium**  | {% include "assets/images/icons/jira/medium.svg" %}  | <div style="background:#FFAB00" class="fill"></div> |
| **Minor**   | {% include "assets/images/icons/jira/minor.svg" %}   | <div style="background:#339900" class="fill"></div> |
| **Trivial** | {% include "assets/images/icons/jira/trivial.svg" %} | <div style="background:#006600" class="fill"></div> |
| **Backlog** | {% include "assets/images/icons/jira/backlog.svg" %} | <div style="background:#131372" class="fill"></div> |
| **Unknown** | {% include "assets/images/icons/jira/unknown.svg" %} | <div style="background:#B0BAC5" class="fill"></div> |

## {% include "assets/images/icons/jira/blocker.svg" %} Blocker

<!-- Authoring Hint: disable line wrap / zoom out for super wide table text -->

* {% include "assets/images/icons/jira/bug.svg" %}  **Bug** - Blocks development and/or testing work, production could not run. Crashes, loss of data, severe memory leak.
* {% include "assets/images/icons/jira/story.svg" %} **Enhancement** - Vital to release.  Time mandated deadline by legislature or grant
* {% include "assets/images/icons/jira/task.svg" %} **Task** - Data fix that is preventing access or services for multiple end-users in production



## {% include "assets/images/icons/jira/major.svg" %}  Major

* {% include "assets/images/icons/jira/bug.svg" %}  **Bug** -  Major loss of function. 
* {% include "assets/images/icons/jira/story.svg" %} **Enhancement** - ex. code refactoring for maintainability, providing better UX on forms
* {% include "assets/images/icons/jira/task.svg" %} **Task** - ex. Data fix that is preventing access or services for a single end-user in production



## {% include "assets/images/icons/jira/medium.svg" %} Medium

* {% include "assets/images/icons/jira/bug.svg" %}  **Bug** -  Impairment to functionality with time intensive or incomplete workaround.
* {% include "assets/images/icons/jira/story.svg" %} **Enhancement** - Quality of Life enhancement which adds value to interface, process.  Makes usage and maintainability easier or more efficient. 
* {% include "assets/images/icons/jira/task.svg" %} **Task** - Data quality or Data integrity fixes that are visible to users




## {% include "assets/images/icons/jira/minor.svg" %} Minor

* {% include "assets/images/icons/jira/bug.svg" %}  **Bug** -  Minor loss of function, or other problem where easy workaround is present.
* {% include "assets/images/icons/jira/story.svg" %} **Enhancement** -  Minor addition of business value from completing 
* {% include "assets/images/icons/jira/task.svg" %} **Task** - Data cleanup for internal use only data



## {% include "assets/images/icons/jira/trivial.svg" %} Trivial

* {% include "assets/images/icons/jira/bug.svg" %}  **Bug** - Cosmetic problem like misspelt words or misaligned text. 
* {% include "assets/images/icons/jira/story.svg" %} **Enhancement** -  Minor UI tweaks. Addressing minor technical debt issues in code and documentation.



## {% include "assets/images/icons/jira/backlog.svg" %} Backlog

* {% include "assets/images/icons/jira/bug.svg" %}  **Bug** - ~~N/A~~
* {% include "assets/images/icons/jira/story.svg" %} **Enhancement** -  Work that can be completed as time allows. Ex. Efficiency improvements, non-critical lifecycle upgrades, technical debt 
* {% include "assets/images/icons/jira/task.svg" %} **Task** - Internal upkeep. Refactor data schema & normalization



## {% include "assets/images/icons/jira/unknown.svg" %} Unknown

* {% include "assets/images/icons/jira/bug.svg" %}  **Bug** -Unknown Priority at this time. For requester to review and assign.  
* {% include "assets/images/icons/jira/story.svg" %} **Enhancement** -  Unknown Priority at this time. For requester to review and assign.  


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
    padding-left: 54px;
}
h2 + ul li {
    text-indent: -22px;
}
h2 + ul li svg {
  height: 16px;
  margin-top: -2px;
  vertical-align: middle;
  margin-right: 2px;
}
</style>
