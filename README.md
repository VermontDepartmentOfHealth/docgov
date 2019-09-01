# Open Sourced Read Me

A Collection of public facing Overviews, Guidelines, Strategies, Standards, Technologies, and other shareable resources at VDH / AHS / ADS

[![Netlify Status](https://api.netlify.com/api/v1/badges/9f4b70bd-ec3e-4e7e-b036-4446fbcd4b74/deploy-status)](https://app.netlify.com/sites/open-sourced/deploys)

Available at [https://open-sourced.netlify.com/](https://open-sourced.netlify.com/)


## Built With

* [11ty/Eleventy](https://www.11ty.io) - static site generation


## Project Setup

* Install [Node.js & NPM](https://nodejs.org/en/download/)
* Run `npm install` in the project directory to install local dependencies
* Install eleventy globally

    ```bash
    npm i @11ty/eleventy -g
    ```

* Run `npm run serve` to run a local dev environment
* Access dev copy of the site at [localhost:8080](http://localhost:8080)

## NPM Scripts

```bash
npm run build             # runs `npx eleventy` to build the site
npm run serve             # builds site + serves `_site` directory
```


## Linting

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

### Spelling

Spelling validation is provided by [vscode-spell-checker](https://github.com/streetsidesoftware/vscode-spell-checker).

Exceptions should be saved to `./.vscode/settings.json` in the `cSpell.words` section

