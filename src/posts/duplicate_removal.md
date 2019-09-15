---
title_word: Duplicates
title: Removing Duplicates Using CTE
tags: ['post', 'how-to']
authors: ['John']
date: 2019-09-12
summary: "A brief description of using CTEs to remove duplicates from a table."
---


## Duplicate removal using CTEs

### Overview

Imports from a variety of sources and direct entry of records can often result in duplicate records within database tables. These duplicates make many operations unreliable and threaten overall data integrity and. One effective strategy for removing duplicates is to use a [CTE](https://www.essentialsql.com/introduction-common-table-expressions-ctes/) (Common Table Expression) and a [`PARTITION`](http://www.sqltutorial.org/sql-window-functions/sql-partition-by/) clause. 

### Syntax

```SQL
WITH toDeleteCTE AS --create CTE
(
    SELECT LastName, 
           FirstName, 
           JobTitle, 
           DateOfHire, 
           ROW_NUMBER() OVER --add row number column partioned over all columns that define a row as unique
                (PARTITION BY LastName, 
                               JobTitle,
                               DateOfHire
                ) AS rn 
    FROM EmployeeTable
)--Delete every row after the first within each partition
DELETE FROM toDeleteCTE WHERE rn > 1

```
### Notes
As the code snippet above demonstrates, CTEs point to source tables and deletion of rows from the CTE results in deletion from the source table.   


### Additional Resources
* [http://www.sqltutorial.org/sql-window-functions/sql-partition-by/](http://www.sqltutorial.org/sql-window-functions/sql-partition-by/)

