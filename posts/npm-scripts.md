---
title_word: npm
title: 'Making NPM scripts work cross platform'
summary: 'How to write npm scripts that work cross platform and avoid the headache of "rm is not a recognized as an internal or external command"'
hero: "/assets/images/posts/npm-scripts/thumbnail.png"
tags: ['post', 'npm', 'bash', 'shell']
authors: ['Kyle']
date: 2020-01-06
---


## <abbr title="Too Long, Didn't Read">TLDR</abbr>; Here are the changes we made to npm scripts

```diff
"scripts": {
-    "build": "set ELEVENTY_ENV=prod&& npx @11ty/eleventy",
-    "serve": "set ELEVENTY_ENV=dev&& npx @11ty/eleventy --serve",
-    "clean": "rm -rf _site"
+    "build": "npx cross-env ELEVENTY_ENV=prod npx @11ty/eleventy",
+    "serve": "npx cross-env ELEVENTY_ENV=dev  npx @11ty/eleventy --serve",
+    "clean": "npx rimraf _site"
}
```

And if you don't want to use npx, you can install [cross-env](https://www.npmjs.com/package/cross-env) and [rimraf](https://www.npmjs.com/package/rimraf) globally:

```bash
npm i rimraf -g
npm i cross-env -g
```


## The Problem

The fundamental challenge is that whatever string ends up in the script section will get sent directly to whatever shell you've selected.  Which means for true cross compatibility, the only safe scripts require syntaxes and commands that perfectly overlap in both **cmd** and **bash** - which is a small venn diagram.

Running on the wrong environment will yield something like this:

> 'rm' is not recognized as an internal or external command, operable program or batch file.

We largely work on Windows machines, but our deployment is handled via Netlify on linux, so it's important there's a functioning script for each environment.

Here's some of the commands we'd like to run and several different implementations across environments to see if we can find something that works universally.

1. Setting Environment Variables
2. Deleting Folder/Files
3. Running Multiple Commands


## #1 Setting Environment Variables

### BASH / Linux

The `&&` operator is optional when setting an environment variable and then running a subsequent command.

```bash
MY_NAME=Kyle echo Hi, \'$MY_NAME\'
MY_NAME=Kyle && echo Hi, \'$MY_NAME\'
```

### CMD / Windows

```bat
set MY_NAME=Kyle&& echo Hi '%MY_NAME%'
```

***Note 1**: You cannot have *any space* between the value being set and the `&&` command operator

**Note 2*: For this particular example, the variable expansion will occur immediately, so in order to [set *and* use the variable in the same line](https://superuser.com/a/950944/180163) you'll need to wrap in `cmd` evaluation, pass in `/V` for delayed environment variable expansion, and delimit with `!` instead of `$`.   But it should be fine to consume the variable in a subsequent command.


### Node.js

Attach directly to [`process.env`](https://nodejs.org/dist/latest-v8.x/docs/api/process.html#process_process_env)

```js
process.env.MY_NAME = 'Kyle';
```

### NPM CLI

From [How to set environment variables in a cross-platform way](https://stackoverflow.com/q/32446734/1366033), there's a package by Kent C. Dodds called [`cross-env`](https://www.npmjs.com/package/cross-env) that allows you to set environment variables across multiple platforms like this:

```bash
npx cross-env ELEVENTY_ENV=prod npx @11ty/eleventy
```

### .ENV file

You can create a file named `.env`

```ini
MY_NAME=Kyle
```

And then load into the process with a library like [dotEnv](https://www.npmjs.com/package/dotenv) like this:

```js
require('dotenv').config()
```

### Build Server / Netlify

You might also set some environment variables on your build server settings like in [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/):

![image](https://user-images.githubusercontent.com/4307307/71743381-6cfd3f00-2e32-11ea-93e2-e355765e17fc.png)


## #2 Delete Files / Folder

### BASH / Linux

[`rm`](https://ss64.com/bash/rm.html) with `-f` force and `-r` recursive

```bash
rm -rf _site
```

### CMD / Windows

The [windows equivalent](https://stackoverflow.com/a/97896/1366033) is [`rd`](https://ss64.com/nt/rd.html) remove directory with `/s` to delete all subfolders and `/q` to not prompt for y/n confirmation

```bat
rd /s /q _site
```

### Node.js

Use [`fs.rmdir`](https://nodejs.org/api/fs.html#fs_fs_rmdir_path_options_callback) to [remove entire directory](https://stackoverflow.com/a/57866165/1366033) which will work recursively as of [Node **v12.10.0**](https://nodejs.org/en/blog/release/v12.10.0/)

```js
const fs = require('fs');
fs.rmdir("_site", { recursive: true });
```

### NPM CLI

[RimRaf](https://github.com/isaacs/rimraf#cli) is a recursive delete package that has a CLI which can be used like this:

```bash
npx rimraf _site
```

## #3 Running Multiple Commands

### BASH / Linux

How to [run multiple bash commands](https://askubuntu.com/a/539293/349745) - Docs on [list of commands / control operators](https://www.gnu.org/software/bash/manual/html_node/Lists.html)

| Syntax     | Description                      |
|------------|----------------------------------|
| `A ;  B`   | Run A and then run B             |
| `A && B`   | Run A, if it succeeds then run B |
| `A || B` | Run A, if it fails then run B    |

```bash
echo hey && echo you
```

### CMD / Windows

How to [run two commands in one cmd line](https://stackoverflow.com/a/8055390/1366033) - Docs on [redirection](https://ss64.com/nt/syntax-redirection.html) and [conditional processing symbols](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-xp/bb490954(v=technet.10)#using-multiple-commands-and-conditional-processing-symbols)

| Syntax     | Description                      |
|------------|----------------------------------|
| `A &  B`   | Run A and then run B             |
| `A && B`   | Run A, if it succeeds then run B |
| `A || B` | Run A, if it fails then run B    |

```bat
echo hey && echo you
```

### NPM CLI

You can [Run npm scripts sequentially](https://stackoverflow.com/q/39172536/1366033) or [run npm scripts in parallel](https://stackoverflow.com/q/30950032/1366033) with a library called [`npm-run-all`](https://www.npmjs.com/package/npm-run-all)

If you had the following scripts in your `package.json`:

```json
"scripts": {
    "lint":  "eslint src",
    "build": "babel src -o lib"
}
```

You could run them all like this:

```bash
$ npm-run-all -s lint build # sequentially
$ npm-run-all -p lint build # in parallel
```

## Possible Solutions

### Create Node Script

One escape hatch seems to be to to invoke a script contained in a node.js file - because node is a prerequisite anyway and is cross-OS compatible.  However, this also seems pretty heavy handed for a 1 line function to delete a directory.  This is similar to the approach taken by [Create React App](https://create-react-app.dev/docs/available-scripts/) with [react-scripts](https://www.npmjs.com/package/react-scripts), but they have substantially more complexity to handle.

Another challenge to this approach is when calling CLI / binary commands like `eleventy --serve`.  To do that we need to [execute a command line binary with Node.js](https://stackoverflow.com/q/20643470/1366033) and also [pipe the response to `stdout`](https://stackoverflow.com/q/12941083/1366033)

So it could work a little something like this:

**File**: `Package.json`:

```json
"scripts" : {
    "build" : "node build.js"
}
```

**File**: `Build.js`

```js
let { exec } = require('child_process');
let log = (err, stdout, stderr) => console.log(stdout)

exec("git config --global user.name", log);
```

Also, if an OS agnostic node command wouldn't work, you can also use [`require("os")`](https://nodejs.org/api/os.html) to get "operating system-related utility methods and properties"

### Environment Specific Scripts

As outlined in [package.json with OS specific script](https://stackoverflow.com/a/53197655/1366033), there's a library called [**run-script-os**](https://www.npmjs.com/package/run-script-os) that helps automagically toggle between named script versions

So if we had the following scripts setup for each supported environment:

```json
"scripts": {
    "build": "npx run-script-os",
    "build:windows": "SET ELEVENTY_ENV=prod&& npx @11ty/eleventy",
    "build:default": "export ELEVENTY_ENV=prod && npx @11ty/eleventy"
}
```

You could manually run with the fully qualified name like this:

```bash
$ npm run build:windows
```

Or you could let **run-script-os** decide for you:

```bash
$ npm run build
```

If you have even 3-4 scripts in your `package.json`, this probably starts cluttering them up with 9-12 different variations, but is still relatively lightweight and sets the correct syntax for each environment.

### Use NPM CLI packages

Leveraging NPM packages to enhance and supplant regular terminal commands gives us a platform agnostic way to call functionality that's running node under the hood.  For maximum portability, I'm a fan of using [`npx`](https://www.npmjs.com/package/npx) to lower the onboarding cost of someone joining a project and installing dependencies.  But once folks are brought up to speed, they can still do a global install of any command line packages for local performance.

At the potential cost of additional dependencies (none of which are felt by the end client), this probably gives us a solution that is both **robust** & **terse** as long as a CLI exists for what you're trying to do...

> Spoiler! There's probably an NPM package for it

This is the approach we're [currently using for this site](https://github.com/VermontDepartmentOfHealth/docs/commit/59a346c25f8)

## Further Reading

* [npm package.json OS specific script](https://stackoverflow.com/a/53197655/1366033)
* [Writing cross-platform Node.js](https://shapeshed.com/writing-cross-platform-node/#scripts-in-packagejson)
* [Writing cross-platform npm scripts on Windows](https://techblog.dorogin.com/writing-cross-platform-npm-scripts-on-windows-79c510339ea6)
