---
layout: post.njk
header_word: SSIS
title: How to Install SSIS
tags: ['post', 'how-to']
authors: ['Sandra']
date: 2019-08-30
summary: "How to install and configure SQL Server Integration Services (SSIS)"
---

1. Uninstall VS 2017 (and any other versions of VS)
2. Uninstall SQL Server 2012 (and any other versions of SQL Server)
3. Restart computer
4. Install SQL Server 2008 from <\\ahs\ahsfiles\VDH\Divisional Shares\Prog\Software\SQL Server 2008 R2 SP2 - Advanced - BIDS>

     I selected these options and accepted all defaults

     ![feature-selection](/assets/images/install-ssis-feature-selection.png)

5. Restart computer
6. Install SQL Server 2012 from <\\ahs\ahsfiles\AHS ALL SHARE\AHS IT DBA\SQL_Server\SQL_2012\InstallationMedia\DeveloperEdition\Desktop\>
    
    Selected options in screenshots below, otherwise accepted defaults.

    ![setup-role](/assets/images/install-ssis-setup-role.png)

    ![reporting-services](/assets/images/install-ssis-reporting-services.png)

    ![instance-configuration](/assets/images/install-ssis-instance-configuration.png)


 
7. Restart computer
8. Install Visual Studio 2010 - <\\nessie\prog\Software\VS 2010 image\VS_2010.iso\setup.exe>
   
   Got these errors, but they didn’t seem to affect overall installation.


   > Error log [08/29/19,08:50:53] Microsoft SQL Server 2008 R2 Management Objects (x64): [2] WARNING! Setup Failed for optional component Microsoft SQL Server 2008 R2 Management Objects (x64). MSI returned error code 1603
   > [08/29/19,08:53:40] VS70pgui: [2] DepCheck indicates Microsoft SQL Server 2008 R2 Management Objects (x64) is not installed.
   > \*\*\*EndOfSession\*\*\*[08/29/19,15:10:19] Microsoft SQL Server 2008 Express Service Pack 1 (x64): [2] Error code -2068578304 for this component is not recognized.
   > [08/29/19,15:10:19] Microsoft SQL Server 2008 Express Service Pack 1 (x64): [2] Component Microsoft SQL Server 2008 Express Service Pack 1 (x64) returned an unexpected value.
   > \*\*\*EndOfSession\*\*\*
 
    ![vs-2010](/assets/images/install-ssis-vs-2010.png)

9. Restart computer
10.	Install Visual Studio 2010 SP1 from <\\ahs\ahsfiles\VDH\Divisional Shares\Prog\Software\Visual Studio 2010 SP1>
11.	Test SSIS and SSRS and SSMS. **SUCCESS**!!! 🎉
12.	Restart
13.	Install Visual Studio Professional 2017 <\\ahs\ahsfiles\VDH\Divisional Shares\Prog\Software\VS 2017>

    Options selected :

    * All windows
    * All web and cloud
    * No mobile and gaming
    * Other – VS extension and .net core

14.	Installation will restart computer
15.	Test opening SSIS and SSRS and SSMS . **SUCCESS**!!! 🎉
16.	Test opening VS sln file – tried Patient profile and got this message
 
    ![aspnet-mvc](/assets/images/install-ssis-aspnet-mvc.png)


17. Clicked Install and reopened successfully!!! Yay!!!
 
    ![vs-2017](/assets/images/install-ssis-vs-2017.png)
