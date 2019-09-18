---
title_word: Merge
title: SQL Merge
tags: ['post', 'how-to', 'sql']
authors: ['John']
date: 2019-09-12
summary: "Description and example of using MERGE statement in SQL"
---

## Overview

The `MERGE` statement can be used to insert, update or delete records on a target table based on comparisons to a source table. `MERGE` provides a clean way to make complex comparisons between tables and take a variety of actions based on results of those comparisons.

## Example

```SQL
MERGE INTO targetCustomerTable t
  USING sourceCustomerTable s
  ON( --Merge condition defined here
      t.Fullname = s.Fullname
    )
  WHEN MATCHED THEN --When matched, update target table
    UPDATE SET t.repeatCustomer = true,
               t.lastPurchase = s.CurrentPurchase
  WHEN NOT MATCHED THEN --When not matched, insert new record
    INSERT(id, Fullname, lastPurchase)
    VALUES(s.ID, s.Fullname, s.CurrentPurchase)
```

## Notes

The `MERGE` statement will not work correctly if there are multiple rows in the source table that meet the merge condition. The source table should be made unique before executing the `MERGE.` One good strategy for removing duplicates is by [using a CTE](/posts/duplicate_removal/)

## Additional Resources

* [Database SQL Reference | Oracle](https://docs.oracle.com/cd/B19306_01/server.102/b14200/statements_9016.htm)
* [SQL Server MERGE | SQL Server Tutorial](http://www.sqlservertutorial.net/sql-server-basics/sql-server-merge/)

