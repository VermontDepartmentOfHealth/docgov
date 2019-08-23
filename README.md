# Open Sourced Read Me

A Collection of public facing Overviews, Guidelines, Strategies, Standards, Technologies, and other shareable resources at VDH / AHS / ADS

[![Netlify Status](https://api.netlify.com/api/v1/badges/9f4b70bd-ec3e-4e7e-b036-4446fbcd4b74/deploy-status)](https://app.netlify.com/sites/open-sourced/deploys)

Available at https://open-sourced.netlify.com/


## Built With

* [11ty/Eleventy](https://www.11ty.io) - static site generation


## Project Setup

* Install [Node.js & NPM](https://nodejs.org/en/download/)
* Run `npm install` in the project directory to install local dependencies
* Install eleventy globally
    ```js
    npm i @11ty/eleventy -g
    ```
* Run `npm run serve` to run a local dev environment
* Access dev copy of the site at [localhost:8080](http://localhost:8080)

## NPM Scripts

```bash
npm run build             # runs `npx eleventy` to build the site
npm run serve             # builds site + serves `_site` directory
```
