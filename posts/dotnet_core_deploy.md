---
title_word: 'DotNetCoreDeploy'
title: 'Deploying a .Net Core Application'
tags: ['post', 'how-to', 'process', '.net-Core', 'deployment']
authors: ['John']
date: 2020-02-15
summary: "How to deploy a .Net core application"
draft: true
---
## Overview
Is there stuff in the read me i did for the NDC sync that would be good in this doc?
.Net core is the successor to the .Net framework. We are transitioning to developing in .Net core and when possible we will port existing .Net applications. There are significant advantages to using .Net core but also differences that necessitate a change to some of our deployment processes.

### Advantages
.Net Core gives us the option to deploy as [Framework dependent or Self-contained](https://docs.microsoft.com/en-us/dotnet/core/deploying/index). For a Self-contained deployment,.Net does not need to be installed on a machine in order for the application to run. This is because it is deployed with the applications dependencies included. This also means that applications from different versions of .Net Core can be installed on the same machine. This lighterweight deployment model is particulary useful when deploying in containers.  

## Deployments Include Many Files
As is noted in the article linked above, self contained deployments are larger as they need to bring along all of the applications dependencies. Even if the size of the files is not an issue, the number of files alone can make the deployment process cumbersome and make mistakes more likely. 

## Solution
This problem of a large number of files in .Net Core self contained deployments is described in [this article](https://www.hanselman.com/blog/BrainstormingCreatingASmallSingleSelfcontainedExecutableOutOfANETCoreApplication.aspx) Also described in this article is the Warp tool that we are currently using. This tool packages up multiple dependencies into a single file for a smaller easier to manage deployment. 

### Batch Files
This tool needs to be installed and run using the command prompt. After publishing and using warp to create a more compact deployment, the next step is simply moving the files to thier intended location. Since every one of these steps can be completed in command line we have decided to create a batch that includes all of the statements needed to deploy a .Net Core application using Warp.
