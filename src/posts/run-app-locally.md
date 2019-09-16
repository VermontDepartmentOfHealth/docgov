---
title_word: Apps
title: Run Apps Locally
tags: ['draft', 'overview']
authors: ['Kyle', 'Brian']
department: VDH
date: 2019-09-16
summary: "How to download, setup, configure, and run VDH Apps Locally"
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
> $$\\\\nessie\prog\Training\Developer Resources\JIRA\Git User Guide.docx$$

## 2. Open Visual Studio

### Picking the Right VS Version

As of Sep 2019, first attempt to open project files with Visual Studio 2017

https://en.wikipedia.org/wiki/Microsoft_Visual_Studio
