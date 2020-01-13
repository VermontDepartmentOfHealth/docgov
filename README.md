---
layout: default.njk
title: Read Me
tags: ['page']
toc: true
permalink: 'readme.md/index.html'
---

# [Doc Gov](https://docgov.dev)

A Collection of public facing Overviews, Guidelines, Strategies, Standards, Technologies, and other shareable resources at VDH / AHS / ADS

[![Netlify Status](https://api.netlify.com/api/v1/badges/9f4b70bd-ec3e-4e7e-b036-4446fbcd4b74/deploy-status)](https://app.netlify.com/sites/open-sourced/deploys)

## Powered By

* [**Eleventy**](https://www.11ty.io) - static site generation
* [**Netlify**](https://www.netlify.com/) - static site hosting
* [markdown-it](https://github.com/markdown-it/markdown-it) - markdown processor

## Project Wikis

* [ReadMe](/readme.md) - Running the project locally and overview of project architecture
* [Contributing](/contributing.md) - Guidelines for authoring a post
* [Code of Conduct](/code_of_conduct.md) - Requirements for being a respectful community member
* [Resources](/resources.md) - Scratchpad of links and notes during development
* [Changelog](/changelog.md) - Release notes over time

## Project Setup

1. Install [Node.js & NPM](https://nodejs.org/en/download/)
2. Run `npm install` in the project directory to install local dependencies
3. Install eleventy globally

    ```bash
    npm i @11ty/eleventy -g
    npm i rimraf -g
    npm i cross-env -g
    ```

4. Run `npm run serve` to run a local dev environment
5. Access dev copy of the site at [localhost:8080](http://localhost:8080)

## NPM Scripts

```bash
npm run build       # builds site for production
npm run serve       # builds site + serves `_site` directory
npm run clean       # deletes `_site` directory
npm run clear-cache # deletes twitter cache
npm run favicon     # generates favicon assets from svg
```


## File Structure

``` bash
2019.vtcodecamp
├── _site/                # generated site output
├── .vscode/              # vs code editor configs
├── .github/              # github configs
├── .netlify/             # netlify dev settings
├── node_modules/         # created by npm install
├── admin/                # pages for Netlify CMS
├── src
│   ├── _data             # data directory for 11ty (json + js)
│   │   ├── config.js     # environment settings
│   │   └── sponsor.js    # data driving sponsor section
│   ├── _includes         # template directory for 11ty
│   │   └── defaultLayout # parent template layout page
│   ├── assets            # static assets to build into site
│   │   └── sponsorLogos/ # sponsor logos
│   ├── [PageName].md     # any .md files will be built into html
│   ├── [PageName].njk    # any .njk files will be built into html
│   ├── favicon.ico       # favicon needs to be in root dir
│   └── index.njk         # home page
├── package.json          # lists npm modules, package, and scripts
├── .eleventy.js          # config information for 11ty
├── .gitignore            # ignored files in git
├── netlify.toml          # deploy settings for netlify
├── resources.md          # helpful links
└── readme.md             # 🟊 [You Are Here]
```


## Project Architecture

### Eleventy Collections

Collections provide a way to enumerate processed content.  Collection categories are set by the `tags` page or added via the `.eleventy.js` config

* all
  * post (tagged post)
    * published
    * drafts
  * page (tagged page)
    * authors
    * projects
    * departments
    * teams
  * meta
* *`<tag_names>`*
* `eleventyExcludeFromCollections` - will still be processed, but won't appear in collections
