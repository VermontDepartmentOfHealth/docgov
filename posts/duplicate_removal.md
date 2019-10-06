---
title_word: Duplicates
title: Removing Duplicates Using CTE
tags: ['post', 'how-to', 'sql']
authors: ['John']
date: 2019-09-12
summary: "A brief description of using CTEs to remove duplicates from a table."
---

## Overview

Imports from a variety of sources and direct entry of records can often result in duplicate records within database tables. These duplicates make many operations unreliable and threaten overall data integrity and. One effective strategy for removing duplicates is to use a [CTE](https://www.essentialsql.com/introduction-common-table-expressions-ctes/) (Common Table Expression) and a [`PARTITION`](http://www.sqltutorial.org/sql-window-functions/sql-partition-by/) clause.

## Example

The student table contains duplicate records that we will remove using a [CTE](https://www.essentialsql.com/introduction-common-table-expressions-ctes/).

### Create example table

```SQL
CREATE TABLE Student(
  FirstName         VARCHAR(20)
  ,LastName         VARCHAR(20)
  ,PhoneNumber      VARCHAR(20)
  ,Advisor          VARCHAR(20)
  ,DateAdded        Date
 );

```

### Add example rows

```SQL

INSERT INTO Student(FirstName,
                      LastName,
                      PhoneNumber,
                      Advisor,
                      DateAdded)
VALUES ('Alan', 'Jones',  '802 555 3214', 'Mr. Smith','2015-12-17'),
       ('Sarah', 'Berry',  '802 333 5555', 'Ms. Beel','2014-05-07'),
       ('Craig', 'Probst', '802 222 0342', 'Ms. Hemsworth','2015-04-16'),
       ('Alan', 'Jones',  '802 555 3214', 'Mr. Parsley','2016-11-15');


```

### Resulting Students table

 <table>
  <tr>
    <th>FirstName</th>
    <th>LastName</th>
    <th>PhoneNumber</th>
    <th>Advisor</th>
    <th>DateAdded</th>
  </tr>
  <tr>
    <td>Sarah</td>
    <td>Berry</td>
    <td>802 333 5555</td>
    <td>Ms. Beel</td>
    <td>2014-05-07</td>
  </tr>
    <tr class="border">
    <td> Alfred</td>
    <td>Jones</td>
    <td>802 555 3214</td>
    <td>Mr. Smith</td>
    <td>2014-12-17</td>
  </tr>
  <tr>
    <td>Craig</td>
    <td>Probst</td>
    <td>802 222 0342</td>
    <td>Ms. Hemsworth</td>
    <td>2015-04-16</td>
  </tr>
  <tr class="border">
    <td> Alfred</td>
    <td>Jones</td>
    <td>802 555 3214</td>
    <td>Mr. Parsley </td  >
    <td>2016-11-15</td>
  </tr>
</table>

For this example we will consider a record to be a duplicate if it has the same first name, last name and phone number as another record. By this definition, the second and last rows for Alfred Jones are duplicates. 

## Remove Duplicates

```SQL
WITH toDeleteCTE AS --create CTE
(
    SELECT FirstName,
           LastName,
           PhoneNumber,
           Advisor,
           DateAdded
           --add row number column partitioned over all columns that define a row as unique
           ROW_NUMBER() OVER
                (PARTITION BY FirstName,
                               LastName,
                               PhoneNumber
                ) AS rn
    FROM Student
)--Delete every row after the first within each partition
DELETE FROM toDeleteCTE WHERE rn > 1
```
## Result Table

The duplicate row has been found using our own definition of equivalence and removed from the source table. 

 <table>
  <tr>
    <th>FirstName</th>
    <th>LastName</th>
    <th>PhoneNumber</th>
    <th>Advisor</th>
    <th>DateAdded</th>
  </tr>
  <tr>
    <td>Sarah</td>
    <td>Berry</td>
    <td>802 333 5555</td>
    <td>Ms. Beel</td>
    <td>2014-05-07</td>
  </tr>
    <tr>
    <td>Alfred</td>
    <td>Jones</td>
    <td>802 555 3214</td>
    <td>Mr. Smith</td>
    <td>2015-12-17</td>
  </tr>
  <tr>
    <td>Craig</td>
    <td>Probst</td>
    <td>802 222 0342</td>
    <td>Ms. Hemsworth</td>
    <td>2015-04-16</td>
  </tr>
</table>


## Notes

As the code snippet above demonstrates, CTEs point to source tables and deletion of rows from the CTE results in deletion from the source table.


## Additional Resources

* [http://www.sqltutorial.org/sql-window-functions/sql-partition-by/](http://www.sqltutorial.org/sql-window-functions/sql-partition-by/)

