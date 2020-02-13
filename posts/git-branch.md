---
title_word: git
title: So you've made changes against your local master branch and want them somewhere else
tags: ['post', 'git']
authors: ['Kyle']
date: 2020-02-04
summary: "A review of the happy path git workflow and what to do when you find yourself in the #1 predicament in git of making changes against a different working copy than the one you intended."
draft: true
---

## Happy Path - Git Workflow

1. Checkout origin/master
2. Create a local branch
3. Commit local changes
4. Push branch to origin
5. Submit PR into origin/master
6. Checkout local master and pull in changes


Your local master branch should always reflect what's on origin/master.  If it doesn't, you can always reset it by deleting your local copy and pulling in a checking out a fresh version from master

## Common Pitfalls

### 1. Help, I made changes against my local master branch

Create a new branch

* Working Copy Parent
* Checkout new branch

```bash
git checkout -b new_branch_name
```

### 2. Help, I made changes that I want to apply to a different branch instead


1. stash local changes (puts every local delta in a "stash")
2. switch to any branch
3. apply stash to branch
