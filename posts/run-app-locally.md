---
title_word: Apps
title: Run Apps Locally
tags: [post, overview ]
authors: [Kyle, Brian]
department: VDH
date: 2019-09-16
summary: How to download, setup, configure, and run VDH Apps Locally
draft: true
---

## 1. Git Clone

Go get the git URL for a project from [Bitbucket (formerly stash)](https://ahs-jira-prod.ahs.state.vt.us:8443/stash/projects/VDH)

![git clone](/assets/images/posts/apps/git-clone.png)

By convention, repositories should be cloned to either:

* `C:\Stash`
* `H:\Stash`

So navigate to that folder and run `git clone` with the stash url

```bash
cd c:/stash
git clone https://ahs-jira-prod.ahs.state.vt.us:8443/stash/scm/vdh/cis.git
```

> **Note**: For more directions on how to setup git, see our user guide here:
> $$\\\\nessie\\prog\\Training\\Developer Resources\\JIRA\\Git User Guide.docx$$

## 2. Open Visual Studio

### Picking the Right VS Version

As of Sep 2019, first attempt to open project files with Visual Studio 2017

[Visual Studio Versions](https://en.wikipedia.org/wiki/Microsoft_Visual_Studio#History)

| Product | v#    | Date      |
| ------- | :---: | --------- |
| VS 2019 | 16.0  | Apr, 2019 |
| VS 2017 | 15.0  | Mar, 2017 |
| VS 2012 | 22.0  | Sep, 2012 |
| VS 2010 | 10.0  | Apr, 2010 |
| VS 2008 | 9.0   | Nov, 2008 |
| VS 2005 | 8.0   | Nov, 2005 |

## 3. Pull in Dependencies

* Nuget
* References

## 4. Set Config

App environment is typically set in either

* `app.config`
* `web.config`

Make sure to update the database and server environments where you intend to point

```xml
<add key="Database" value="..."/>
<add key="Server"   value="..."/>
```
