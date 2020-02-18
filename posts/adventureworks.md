---
title_word: 'Data'
title: 'How to Install the AdventureWorks Database'
tags: ['post', 'sql', 'data']
draft: true
authors: ['Kyle']
date: 2020-01-02
summary: "How to create shareable demos and isolated test cases with sample data from Microsoft's AdventureWorks database"
---

## Install SQL Server Express

> **Note**: Make sure go to SQL COnfiguration and set startup to manual .... TODO

## Install Adventure Works Database

AdventureWorks is a sample database that includes some test data, tables, stored procedures, and views.  AdventureWorks has replaced other [sample databases][1] like [contoso-data-warehouse][2] or [northwind][3].

MS Docs has a guide on [AdventureWorks installation and configuration][4]

1. Download the [`AdventureWorks2017.bak`][5] db backup and save it somewhere to your C: Drive (makes for easy finding).  

   This is the db file for the OnLine Transaction Processing ([OLTP][6]) which handles the transactional data storage - as opposed to OnLine Analytic Processing (OLAP) databases intended for wharehousing and analytics

2. Open SQL Server Management studio and connect to *your* local server.

   **DO NOT** install remote or sample databases on our shared servers

3. In Object Explorer, right click on the **Databases** and select **Restore Database**

   ![Restore Database Option](/assets/images/posts/adventureworks/RestoreDatabase.png)

4. Select **Device** and click the ellipses (...)

   ![Add Device](/assets/images/posts/adventureworks/AddDevice.png)

5. In the Select Backup Devices Dialog, click **Add**, select the file you downloaded earlier, and click **OK**

   ![Add Device](/assets/images/posts/adventureworks/SelectBackup.png)

The Database should now appear in your local databases and you can query or modify it just like any other DB

```sql
USE AdventureWorks2017

SELECT TOP 10 * FROM Person.Person
```

Here's a big ol' Database Diagram / Entity Relationship Diagram (ERD)

![Adventure Works ERD](/assets/images/posts/adventureworks/adventureworks2008_schema.gif)

[1]: https://github.com/microsoft/sql-server-samples/tree/master/samples/databases
[2]: https://github.com/microsoft/sql-server-samples/tree/master/samples/databases/contoso-data-warehouse
[3]: https://github.com/microsoft/sql-server-samples/tree/master/samples/databases/northwind-pubs
[4]: https://docs.microsoft.com/en-us/sql/samples/adventureworks-install-configure
[5]: https://github.com/Microsoft/sql-server-samples/releases/download/adventureworks/AdventureWorks2017.bak
[6]: https://en.wikipedia.org/wiki/Online_transaction_processing