---
title_word: nunjucks
title: 'How to escape nunjucks in markdown files in Eleventy'
summary: "Sometimes you want to allow nunjucks to inject data or logic in your md file... other times, you want to write about how to use nunjucks with code examples.  Here's how to do both"
tags: ['post', 'nunjucks']
authors: ['Kyle']
date: 2020-01-13
templateEngineOverride: md
draft: true
---

This issue occurs when you want to write a post or wiki that illustrates how to use nunjucks syntax

Let's say you intend to write this:

> Output a date with `{{'1/1/2010' | dateDisplay}}`

But what gets rendered is this

> Output a date with `January 1st 2010`

That's because when markdown files are processed through eleventy, we can extend the available markdown syntax with templating options as well.  In our case, we're using [nunjucks](https://mozilla.github.io/nunjucks/) by setting it in the [configuration file](https://www.11ty.dev/docs/config/#default-template-engine-for-markdown-files):


```js raw file:.eleventy.js
module.exports = {
    <mark>markdownTemplateEngine: "njk"</mark>
};
```

Here are the criteria we'll try to optimize for:

* [ ] Output looks good when built with eleventy
* [ ] Source looks good when rendered w/ Markdown preview (in editor / github)
* [ ] Source code is easy to read and maintain for developers
* [ ] Doesn't break page-wide nunjucks templating


Nunjucks has three types of tags:

* `{{ output }}`
* `{% logic  %}`
* `{# comment #}`



[Overriding the template language](https://www.11ty.dev/docs/languages/#overriding-the-template-language)