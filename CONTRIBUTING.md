# Contributing to Doc Gov

Hi There! 👋

Thanks for taking the time to help improve the this documentation repository.  This will help outline some of the tools and options for making meaningful contributions.

If you have content you'd like to share, I'd love if you wanted to share it here

## Pull Requests

Have a suggestion you'd like to see implemented on the website or some content ideas? Awesome! 🎉

We'd love to merge in any Pull Requests that help improve the website's design, accessibility, or documentation.  If you have any ideas but aren't quite sure how to go about them, you can always [Open an Issue](https://github.com/VermontDepartmentOfHealth/docs/issues/new/choose) to make a suggestion or ask for help.  

That said, feel free to **Submit a PR** and we can always work through any feedback.

1. Fork the repo on github to push changes on your own branch
2. Checkout the [README](/readme/) for more info on how to get the project setup on your local machine
3. When submitting a pull request, please check the box [`Allow Edits from Maintainers`](https://help.github.com/en/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork) which will allow project members to make changes to your branch prior to merging in.

Happy Coding! 😀

## GitHub

The codebase, issues, pull requests, and project backlog is all managed through our [GitHub](https://github.com/) organization Page for the [Vermont Department of Health](https://github.com/VermontDepartmentOfHealth).  To update and contribute to this repository, you'll need both:

1. A [free github account](https://github.com/join)
2. Invitation to join our [Organization Members](https://github.com/orgs/VermontDepartmentOfHealth/people)

Please contact Kyle.Mitofsky@vermont.gov with your Github username to request access to the VDH Organization account to get started

## Branch Deploys & Deploy Context

Netlify creates [atomic](https://www.netlify.com/docs/versioning-and-rollbacks/#atomic-deploys), [immutable](https://medium.com/netlify/how-netlifys-deploying-and-routing-infrastructure-works-c90adbde3b8d) deploys with [instant rollbacks](https://www.netlify.com/docs/versioning-and-rollbacks/#rollbacks) to any deployment you've ever made.

Any commits pushed to master will automatically be built and deployed to the production url. If you push a commit to a branch, netlify will create a build preview for that commit and branch.  [Branch deploys](https://www.netlify.com/docs/continuous-deployment/#branches-deploys) can also be deployed to the docgov domain if we [setup a custom subdomain](https://app.netlify.com/sites/open-sourced/settings/domain#branch-subdomains).  For example if you wanted your own site at `kyle.docgov.dev` or `beta.docgov.dev`.  Netlify will also build a [deploy preview for every pull request](https://www.netlify.com/blog/2016/07/20/introducing-deploy-previews-in-netlify/).

* Master - https://docgov.dev/
* Commit - https://5d7c35838fe05f0008d062e5--open-sourced.netlify.com/
* Branch - https://feature-domain--open-sourced.netlify.com/
* Preview - https://deploy-preview-42--open-sourced.netlify.com/

To test out a your changes, you can run the build locally following the instructions in the [ReadMe.md](./README.MD) or just commit changes directly on github and view the staged deployment.

## Coding Environment

We're not super opinionated, so use your IDE / Editor of choice, but we're pretty partial to [Visual Studio Code](https://code.visualstudio.com/)

There are [recommended extensions](https://code.visualstudio.com/docs/editor/extension-gallery#_recommended-extensions) in `./.vscode/extensions.json` that you'll be prompted to install when you open the workspace.

## Frontmatter

Each markdown file should start with a [yaml](https://learnxinyminutes.com/docs/yaml/) [frontmatter](https://www.11ty.io/docs/data-frontmatter/) block to provide meta data used to display and categorize the post.

```yaml
title_word: Hiring             # a single word under 15 characters - will be prepended to "doc Gov" on the site title
title: Hiring Overview         # a short article title - will be
tags: ['post', 'workforce']    # all posts must have the tag 'post' in addition to at least one other tagging option in /data/taglist
authors: ['Kyle', 'Brian']     # an array of authors - each should correspond to a key in /authors/
date: 2019-08-22               # the original create date for the post
updated: 2019-08-22            # (optional) most recent change date
summary: "An overview of ..."  # the summary that will appear when the article is referenced elsewhere.  
                               # Should be 1-2 short sentences with the elevator pitch for the article
pageClass: "search"            # (optional) class string that will be added to document.body
```


## Coding conventions

### Markdown

Markdown validation is provided by [vscode-markdownlint](https://github.com/DavidAnson/vscode-markdownlint).

Current exceptions, which are saved to `/.markdownlint.json`, and their rationale

* [MD012](https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md#md012---multiple-consecutive-blank-lines) - **Multiple blank lines**  
  Headings often have a tall visual margin to separate content - if markdown authors want to emulate that, okay

* [MD013](https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md#md013---line-length) - **Line Length too long**  
  If folks want to put paragraphs in markdown, that's fine, just use an IDE that wraps lines

* [MD025](https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md#md025---multiple-top-level-headers-in-the-same-document) - **Multiple Headers**  
  False reading from building our markdown pages using templates like this `# {{title}}`

* [MD033](https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md#md033---inline-html) - **Inline HTML**  
  If we want to make use of inline html, go for it

* [MD034](https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md#md033---inline-html) - **No Bare URLS**  
  We explicitly convert bare urls in our markdown via `linkify: true`

### Spelling

Spelling validation is provided by [vscode-spell-checker](https://github.com/streetsidesoftware/vscode-spell-checker).

Exceptions should be saved to `./.vscode/settings.json` in the `cSpell.words` section

#### Copy Editing

From [Words To Avoid in Educational Writing](https://css-tricks.com/words-avoid-educational-writing/), consider avoiding the following words:

* Simply
* Just
* Obviously
* Basically
* Of course
* Clearly
* Easy

They often presume a level of mastery that not all users may have and often the writing will make sense without it like this: 

> ~~Simply~~ Use a string array as the `prefix` property.

If you notice any examples in existing posts, feel free to submit a PR.

### Images

Images taken from [undraw.co](https://undraw.co/search) should use theme color `#008a45` and should manually add `role="img"` to the root node.