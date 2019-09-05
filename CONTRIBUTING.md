# Contributing to Doc Gov

Hi There! 👋

Thanks for taking the time to help improve the this documentation repository.  This will help outline some of the tools and options for making meaningful contributions.

If you have content you'd like to share, I'd love if you'd do it here

## Pull Requests

Have a suggestion you'd like to see implemented on the website or some content ideas? Awesome! 🎉

We'd love to merge in any Pull Requests that help improve the website's design, accessibility, or documentation.  If you have any ideas but aren't quite sure how to go about them, you can always [Open an Issue](https://github.com/VermontDepartmentOfHealth/docs/issues/new/choose) to make a suggestion or ask for help.  

That said, feel free to **Submit a PR** and we can always work through any feedback.

1. Fork the repo on github to push changes on your own branch
2. Checkout the [README.md][/README.md] for more info on how to get the project setup on your local machine
3. When submitting a pull request, please check the box [`Allow Edits from Maintainers`](https://help.github.com/en/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork) which will allow project members to make changes to your branch prior to merging in.

Happy Coding! 😀


## Coding Environment

We're not super opinionated, so use your IDE / Editor of choice, but we're pretty partial to [Visual Studio Code](https://code.visualstudio.com/)

There are [recommended extensions](https://code.visualstudio.com/docs/editor/extension-gallery#_recommended-extensions) in `./.vscode/extensions.json` that you'll be prompted to install when you open the workspace.

## Frontmatter

Each markdown file should start with a [yaml](https://learnxinyminutes.com/docs/yaml/) [frontmatter](https://www.11ty.io/docs/data-frontmatter/) block to provide meta data used to display and categorize the post.

```yaml
title_word: Hiring            # a single word under 15 characters - will be prepended to "doc Gov" on the site title
title: Hiring Overview        # a short article title - will be
tags: ['post', 'workforce']   # all posts must have the tag 'post' in addition to at least one other tagging option in ./src/_data/taglist
authors: ['Kyle', 'Brian']    # an array of authors - each should correspond to a key in ./src/_data/authors
date: 2019-08-22              # the original create date for the post
summary: "An overview of ..." # the summary that will appear when the article is referenced elsewhere.  Should be 1-2 short sentences with the elevator pitch for the article
```


## Coding conventions

### Markdown

Markdown validation is provided by [vscode-markdownlint](https://github.com/DavidAnson/vscode-markdownlint).

Exceptions should be saved to `/.markdownlint.json`

* [MD012](https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md#md012---multiple-consecutive-blank-lines) - Multiple blank lines
  * Headings often have a tall visual margin to separate content - if markdown authors want to emulate that, okay
* [MD013](https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md#md013---line-length) - Line Length too long
  * If folks want to put paragraphs in markdown, that's fine, just use an IDE that wraps lines
* [MD025](https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md#md025---multiple-top-level-headers-in-the-same-document) - Multiple Headers
  * False reading from building our markdown pages using templates like this `# {{title}}`
* [MD033](https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md#md033---inline-html) - Inline HTML
  * If we want to make use of inline html, go for it
* [MD034](https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md#md033---inline-html) - No Bare URLS
  * We explicitly convert bare urls in our markdown via `linkify: true`

### Spelling

Spelling validation is provided by [vscode-spell-checker](https://github.com/streetsidesoftware/vscode-spell-checker).

Exceptions should be saved to `./.vscode/settings.json` in the `cSpell.words` section

