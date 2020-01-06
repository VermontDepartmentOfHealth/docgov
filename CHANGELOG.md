---
layout: default.njk
title: Release Notes
tags: ['page']
toc: true
permalink: 'changelog.md/index.html'
---

# Release Notes

<!--

Instructions:

Once every couple months, version the current state of the site as a "Release".  I'd rather not interrupt our continuous deployment with the need to update the changelog for every single commit pushed to master, but this just serves as a sort of roadmap of work over time.

Add release notes to this file and also upload to https://github.com/VermontDepartmentOfHealth/docs/releases


Release notes should use the following template:

```md
## v### - Date `MMM Do, YYYY` (ex. Mar 1st 2018)
### Overview
### Release Notes
#### Content Additions
#### Enhancements
#### Fixes
#### Tech Debt
#### Thanks
```

If a section is blank, you can omit it from a particular release


For the overview, include the following links:

* [Site Snapshot](https://5d81bb5a41ee47000a71682f--open-sourced.netlify.com/)
* [Codebase Snapshot](https://github.com/VermontDepartmentOfHealth/docs/tree/d4ca10115ad8a49714668fa8805b901b6fdbcc9c)
* [Netlify Build](https://app.netlify.com/sites/open-sourced/deploys/5d81bb5a41ee47000a71682f)

On Github, add a Release Title of a quote from your favorite show & attach a zip of the site snapshot on netlify


In Changelog.md, Github will automatically add links to issue ids and usernames, but we should linkify them in this document

#57        -> [#57](https://github.com/VermontDepartmentOfHealth/docs/issues/57)
@jmathias3 -> [@jmathias3](https://github.com/jmathias3)

-->

## v0.6 - Jan 5th, 2020

### Overview

* [Site Snapshot](https://5e1295803a630e000917d510--open-sourced.netlify.com/)
* [Codebase Snapshot](https://github.com/VermontDepartmentOfHealth/docs/tree/v0.6-beta)
* [Netlify Build](https://app.netlify.com/sites/open-sourced/deploys/5e1295803a630e000917d510)


### Release Notes

#### Content Additions

* update merge and remove duplicate pages
* add [interview page for app developers](https://docgov.dev/hiring/app/)
* add post on [RAISERROR](https://docgov.dev/posts/raiserror/)
* add copy editing notes, install instructions, core styles
* add changelog

#### Enhancements

* #30 add `insert`, `mark`, and `spoiler` md syntax
* #10 add netlify CMS
* #69 add dark mode
* #81 add markdown files in project root (ex. Readme) to site
* #78 add noindex to draft posts
* Update format of **display density** toggle
* Add ability to embed tweets
* add link to drafts page during dev
* add <kbd>kbd</kbd> styles
* add table of contents to root documents

#### Fixes

* #84 don't link to tags that don't have landing pages
* #77 fix horizontal scrolling
* fix blurry hr
* fix contrast on syntax highlighting theme colors
* don't display toc if empty
* fix search on 404 page and update styling

#### Tech Debt

* #22 add frontmatter snippet for posts
* #80 update nunjucks workspace support and recommendations
* #35 add ie11 compatibility for grid, es6, and polyfills
* #87 fix build perf for css and js minification
* #91 add pull request template




## v0.5 - Sep 18th, 2019

### Overview

* [Site Snapshot](https://5d81bb5a41ee47000a71682f--open-sourced.netlify.com/)
* [Codebase Snapshot](https://github.com/VermontDepartmentOfHealth/docs/tree/v0.5-beta)
* [Netlify Build](https://app.netlify.com/sites/open-sourced/deploys/5d81bb5a41ee47000a71682f)

### Release Notes

> Multiple content updates from multiple authors!!! That's the mission, not the bells & whistles; although I will admit, the whistles are fun.

#### Content Additions

* Removing Duplicates Using CTE
* Using SQL Merge
* Added page for redgate snippets
* run apps locally DRAFT

#### Enhancements

* #57 refactor asset paths to work the same locally and on prod 
* #60 switch to network first with cache fallback
* #62 update copy button and syntax highlighting


#### Fixes

* add `role="img"` to svgs

#### Thanks

* John (@jmathias3) - First Post (2x) 🎉
* Brian (@MudPunk) - Redgate Article & Copy Editing

## v0.4 - Sep 13th, 2019

### Overview

* [Site Snapshot](https://5d7c34d1692ec7000aab9d03--open-sourced.netlify.com/)
* [Codebase Snapshot](https://github.com/VermontDepartmentOfHealth/docs/tree/v0.4-beta)
* [Netlify Build](https://app.netlify.com/sites/open-sourced/deploys/5d7c34d1692ec7000aab9d03)

### Release Notes

> Now deployed to [docgov.dev](https://docgov.dev/)

#### Content Additions

* #61 add offline page when site isn't cached
* add authentication draft

#### Enhancements

* #23 add css tooltip
* #29 add service worker
* #40 add draft status
* #41 add syntax highlighting theme picker
* #43 add swipe to open side nav
* #48 add settings page
* #52 add last update field
* #53 add github setup intro
* #54 create doc gov icon and icon assets
* #60 serve google fonts locally
* #61 detect offline and add offline banner
* #62 Add copy button to code snippets
* DocGov.Dev domain acquired!

#### Fixes

* simplify toc text & update hash for scrollIntoView

#### Thanks

* Brian (@MudPunk) - Worked on #52 add last update field

## v0.3 - Sep 6th, 2019

### Overview

* [Site Snapshot](https://5d72d9533e6aa80008267553--open-sourced.netlify.com/)
* [Codebase Snapshot](https://github.com/VermontDepartmentOfHealth/docs/tree/v0.3-beta)
* [Netlify Build](https://app.netlify.com/sites/open-sourced/deploys/5d72d9533e6aa80008267553)


### Release Notes

#### Content Additions

* add acronyms page
* #12 add contributing docs
* #12 add code of conduct
* #14 add author, team, project, and department pages

#### Enhancements

* #1 add issue templates
* #3 add side navbar
* #13 add metadata linting / validation
* #15 add syntax highlighting support
* #17 add link to page history
* #18 add social meta tags
* #20 add 404 page
* #21 add table of contents sidenav
* #26 create re-usable post preview template
* #28 add archive with all posts and limit homepage post count
* #29 create brand icon, manifest, and social thumbnail
* #30 add def list markdown syntax
* #33 add responsive site title styles
* #34 add minimal print styles
* #37 add toggle to side navbar
* #38 highlight active side navbar item
* #42 use multi-word match, improve result highlighting
* #45 better manage client side dependencies
* add scrollspy and smooth scroll to toc

#### Fixes

* #31 allow line wraps on anchor tag highlights



## v0.2 - Aug 31st, 2019

### Overview

* [Site Snapshot](https://5d6b3f4cfc2c13000c9a8b3f--open-sourced.netlify.com/)
* [Codebase Snapshot](https://github.com/VermontDepartmentOfHealth/docs/tree/v0.2-beta)
* [Netlify Build](https://app.netlify.com/sites/open-sourced/deploys/5d6b3f4cfc2c13000c9a8b3f)

### Release Notes

> Renamed from **OpenSourced** to **DocGov**, with much consternation from Katie

#### Content Additions

* add new hire intro materials
* add M&O Jira ticket priorities
* add how to install SSIS from sandra
* #16 add markdown sample page

#### Enhancements

* #2 create tag pages and tab page index
* #4 add search function with text highlighting.
* #6 add metadata post layout
* #27 add display density toggle
* add inline js filter
* rebrand doc gov

#### Fixes

* fix lighthouse audit perf and a11y

#### Thanks

* Brian (@MudPunk) - First Post & Copy Editing 🎉
* Sandra - First Post 🎉


## v0.1 - Aug 23rd, 2019

### Overview

* [Site Snapshot](https://5d60199f98e8d00008f242ac--open-sourced.netlify.com/)
* [Codebase Snapshot](https://github.com/VermontDepartmentOfHealth/docs/tree/v0.1-beta)
* [Netlify Build](https://app.netlify.com/sites/open-sourced/deploys/5d60199f98e8d00008f242ac)

### Release Notes

> Create initial 11ty site engine with sample contents, master layout, and post template

#### Content Additions

* IT Orientation
* Hiring Overview

#### Enhancements

* add edit button
* add layout page and styles





<style>
/* only show release tag in toc */
.toc li > ol {
    display: none;
}
</style>

