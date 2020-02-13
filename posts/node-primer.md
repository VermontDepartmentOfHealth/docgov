---
title_word: node
title: 'A node primer for C#/.NET Developers'
summary: 'A hello world tour through basic concepts in node development through the lens of a Visual Studio project'
tags: ['post', 'node', 'npm']
authors: ['Kyle']
date: 2020-01-15
draft: true
---

## Installation

#### Visual Studio

Install Visual Studio

#### Node

Install Node & Visual Studio Code (often called VSCode)



## Project Setup

#### Visual Studio

File > New Project

or 

```bash node
dotnet new
```

.csproj file

#### Node

```bash
$ npm init -y
```

package.json

## Dependency Management

#### Visual Studio

Uses **nuget** to bring in external dependencies

Nuget > Manage Packges

```ps
> nuget add package
```

`pacakages.config`

#### Node

Uses **npm** to bring in external dependencies

```bash
$ npm install core-js --save
```

The `--save` flag says to add it to your `package.json`

## Writing Code (Print Hello World)

#### Visual Studio



#### Node

## Running Code

#### Visual Studio


#### Node

```bash
$ node index.js
```

Or you can take scripts that you would run in bash and add them to your `package.json` scripts section like this:

```json
"scripts": {
    "start": "node index.js"
}
```

And now we can tell npm to run our package like this:

```bash
$ npm run start
```


## Debugging Code

#### Visual Studio

Attach to process

#### Debugging Code

`launch.json`


## Referencing External Files

#### Visual Studio



#### Debugging Code


## Object Oriented Programming

#### C#

#### JS

## Summary

