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

A Customers table contains records for everyone that has made a purchase at a store. At the end of the day all transactions must be processed by either updating existing customer records or inserting new ones.

### Create example tables

```SQL
CREATE TABLE Customer(
   FirstName        VARCHAR(20)
  ,LastName         VARCHAR(20)
  ,PhoneNumber      VARCHAR(20)
  ,LastPurchase     VARCHAR(20)
  ,IsRepeatCustomer BIT
);

  
CREATE TABLE Transaction (
   Customer_FirstName   VARCHAR(20)
  ,Customer_LastName    VARCHAR(20)
  ,Customer_PhoneNumber VARCHAR(20)
  ,PurchasedItem        VARCHAR(20)
);
```

### Add example rows

```SQL

INSERT INTO Customer(FirstName,
                     LastName,
                     PhoneNumber,
                     LastPurchase,
                     IsRepeatCustomer)
VALUES ('Alfred', 'Jones',  '802 555 1234', 'Clock',     0),
       ('Ashley', 'Berry',  '802 333 9999', 'Table Saw', 0),
       ('Jeff',   'Probst', '802 222 0000', 'Fire Wood', 0);


INSERT INTO Transaction(Customer_FirstName,
                        Customer_LastName,
                        Customer_PhoneNumber,
                        PurchasedItem)
VALUES ('Samantha', 'Smith',    '518 123 9876', 'Apple Basket'),
       ('Henry',    'McDonald', '802 122 4322', 'Trampoline'),
       ('Ashley',   'Berry',    '802 333 9999', 'Saw Blade');
```

### We have these two tables

```SQL
SELECT * FROM Customer;
SELECT * FROM Transaction;
```

#### Customer Table

| FirstName | LastName | PhoneNumber  | LastPurchase | IsRepeatCustomer |
|-----------|----------|--------------|--------------|------------------|
| Alfred    | Jones    | 802 555 1234 | Clock        | false            |
| Ashley    | Berry    | 802 333 9999 | Table Saw    | false            |
| Jeff      | Probst   | 802 222 0000 | Fire Wood    | false            |

#### Transaction Table

| Customer_FirstName | Customer_LastName | Customer_PhoneNumber | PurchasedItem |
|--------------------|-------------------|----------------------|---------------|
| Samantha           | Smith             | 518 123 9876         | Apple Basket  |
| Henry              | McDonald          | 802 122 4322         | Trampoline    |
| Ashley             | Berry             | 802 333 9999         | Saw Blade     |

### Execute `MERGE`

In the following example, we'll execute the `MERGE` statement, with `Transactions` as the *source table* and `Customers` as the *target table*.

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

### Result

Here's the Customer Table after `Merge` operation, which adds two new rows and updates one row.

| FirstName     | LastName     | PhoneNumber      | LastPurchase     | IsRepeatCustomer |
|---------------|--------------|------------------|------------------|------------------|
| Alfred        | Jones        | 802 555 1234     | Clock            | FALSE            |
| Ashley        | Berry        | 802 333 9999     | ==Saw Blade==    | ==TRUE==         |
| Jeff          | Probst       | 802 222 0000     | Fire   Wood      | FALSE            |
| ++Samantha++  | ++Smith++    | ++518 123 9876++ | ++Apple Basket++ | ++FALSE++        |
| ++Henry++     | ++McDonald++ | ++802 122 4322++ | ++Trampoline++   | ++FALSE++        |


## Notes

The `MERGE` statement will not work correctly if there are multiple rows in the source table that meet the merge condition. The source table should be made unique before executing the `MERGE.` One good strategy for removing duplicates is by [using a CTE](/posts/duplicate_removal/)

## Additional Resources

* [Database SQL Reference | Oracle](https://docs.oracle.com/cd/B19306_01/server.102/b14200/statements_9016.htm)
* [SQL Server MERGE | SQL Server Tutorial](http://www.sqlservertutorial.net/sql-server-basics/sql-server-merge/)

