---
title_word: FANDL
title: FANDL Database View
tags: ['post', 'fandl', 'sql', 'ssms']
authors: ['Brian']
date: 2019-10-23
summary: "An overview of how to connect and write queries against the FANDL Warehouse."
---

## Overview

The following will lay out how to:

* Connect to the FANDL Database
* Query Data
* Export Data

## Connecting to the database

When you open SQL Server Management Studio (SSMS), you sill be prompted to connect to a Database Server. The first time you connect, you'll need to type in the name of the server. After the initial connection, the next time you start SSMS, it will be there by default. If it is not there, you can always type it in again, or use the drop down to select a previously visited server.

The "Authentication:" field will always be "Windows Authentication". You should never need to type in a password in order to connect. 

![Connecting to the server][1]

**If you cannot connect, contact AHS.VDHITDatabaseTeam@vermont.gov.** They can help with getting you assigned to the appropriate Active Directory Group(s) needed for accessing a database.

## Querying Data

### First Time Connecting

After you connect, the **Object Explorer** window will appear on the left side with the server(s) you are connected to. You can expand it to browse the various databases and the objects they house.

Browse to the **whFANDL** database **Views** can be done in four steps

* Expand the **Server** Node
* Expand the **Databases** Node
* Expand the Database Node **whFANDL**
* Expand the **Views** Node

![Browsing the server][2]

You can follow this same process to expand the **Tables** folder if you wish to look at the raw data that seeds the **Views**.

### Basic Queries

There are a number of ways data can be queried.

**Option 1**

If you **Right-Click** on a view, you can then use the **SELECT Top 1000 Rows** option. 

![Top 1000][3]

This will generate a select statement against the system for the TOP 1000 rows in the view.

**Advantages:** This is a very quick way to get a select statement that can then be modified with a Where Clause for quickly retrieving data. It also includes the names of all the columns, so you can remove those that you do not need in your results.

**Disadvantages:** If there are more than 1000 records, they will not be displayed unless you remove the **TOP 1000** portion of the query.

**Option 2**

Create a New Query and write the sql yourself.

You can either Right Click on the name of the database, in this case **whFANDL**, or click the **New Query** button on the top. When doing either of thisee, double check the **Database Dropdown** in the upper left menu ribbon. It should say **whFANDL**. If it is blank, or has another database displayed, simply click the dropdown, browse to the appropriate database, and select it.

![New Query][4]


After you have a **New Query** window and have verified the database connection is correct, you can write a simple query against any of the views. The starting syntax is always the same.

```sql
SELECT * FROM <NAME OF THE VIEW>
```

![New Query Select][5]

The * (Asterix) in a SQL SELECT means "All Columns". If we only wanted to return results for specific columns, we'd need to specify them.

The following example will only return all data for the three columns specified.

```sql
SELECT ESTABLISHMENT_NUMBER, NAME, COMPLAINT from D_COMPLAINT
```

**Advantages:** Over time, it's more likely that you'll be reusing saved query files. Once opened, all you'll need to do is confirm the correct target database, making this the faster option.

**Disadvantages:** You can unintentionally connect to the wrong database when you create a new query or open an existing one.

### Limiting Data

Now that we can get data out of the system, we need to limit what is returned.

To do this, we'll need to add a "WHERE" clause to our "SELECT" statements by specifying that a given COLUMN from the VIEW we are querying is either within a range of values, or an exact value.

##### WHERE - Exact Match

Lets say we are looking up entries in D_COMPLAINT for "ONE WORLD"

```sql
SELECT * FROM D_COMPLAINT
WHERE NAME = 'ONE WORLD'
```

Long as we have no typo's, we should get back any records that exist where the column "NAME" has a value of "ONE WORLD".

##### WHERE - Wild Cards

Lets say we are looking up entries for all entries where the "NAME" starts with the word "ONE"

```sql
SELECT DATE_COMPLAINT_RECEIVED, ESTABLISHMENT_NUMBER, Name
FROM D_COMPLAINT
WHERE NAME LIKE 'ONE%'
```

![Where Clause - Wild Card Right][6]




You may want to find all establishments with the word "ONE" in them. To do this, place % on either side of the string to be matched.

```sql
SELECT ID, NAME, LINK_ID, LINK_NAME
FROM D_ESTAB_MASTER
WHERE NAME LIKE '%ONE%'
```

![Where Clause - Wild Card All][7]


##### WHERE - Ranges

There may be instances where you want to search for data that falls within a range of values, say two dates.

```sql
SELECT ID, NAME, LINK_ID, LINK_NAME
FROM D_ESTAB_MASTER
WHERE NAME LIKE '%ONE%'
```


## Exporting Data

Exporting can be done in a few different ways

* Copy and Paste results
* Exporting to...
  * EXCEL
  * CSV
  * Tab Delimited File

### Export - Copy and Paste

After you have run a query, you can select the data you want to copy in much the same way you would in programs like Microsoft Excel.

The below GIF demonstrates how to select
* A single Row
* Multiple Rows
* A block of data
* All Results

At the point you have the data you want you can copy it in three ways

* Ctrl+C
* Right-Click -> Copy
* Right-Click -> Copy With Headers
  * Will copy selected data and include Column Names as they appear in the header.
* Right-Click -> Open in Excel
  * Open the selected results in Excel

![Select Results To Copy][8]


## References

All GIF's captured using [Screen To GIF - www.screentogif.com][9]

[1]: /assets/images/posts/fandl/FANDL_Tutorial_Connect.gif
[2]: /assets/images/posts/fandl/FANDL_Tutorial_Browse.gif
[3]: /assets/images/posts/fandl/FANDL_Tutorial_Top1000.gif
[4]: /assets/images/posts/fandl/FANDL_Tutorial_NewQueryDatabase.gif
[5]: /assets/images/posts/fandl/FANDL_Tutorial_NewQuerySelect.gif
[6]: /assets/images/posts/fandl/FANDL_Tutorial_WhereWildCard_Right.gif
[7]: /assets/images/posts/fandl/FANDL_Tutorial_WhereWildCard_All.gif
[8]: /assets/images/posts/fandl/FANDL_Tutorial_SelectResults.gif
[9]: https://www.screentogif.com/