---
title_word: Perf
title: How to make your Database slow with indexes
tags: ['post', 'sql', 'perf']
authors: ['Kyle']
date: 2019-12-03
summary: "Index are an equally great way to eek out performance and also tank it.  Figure out to the difference here"
draft: true
---

### Terms - Seek vs. Scan

Let's start with a couple definitions borrowed from [Pinal Dave][1]:

> **Index Scan** (Table Scan):  
> Since a scan touches every row in the table, whether or not it qualifies, the cost is proportional to the total number of rows in the table. Thus, a scan is an efficient strategy if the table is small or if most of the rows qualify for the predicate.
>
> **Index Seek**:  
> Since a seek only touches rows that qualify and pages that contain these qualifying rows, the cost is proportional to the number of qualifying rows and pages rather than to the total number of rows in the table.

When we create an index, our goal is likely to get an Index Seek out of queries, but how that is applied can get tricky, but indexes come with inherent trade-offs, so it's important to know whether adding them is adding value.

[SQL Server Plans : difference between Index Scan / Index Seek](https://stackoverflow.com/q/1136524/1366033)
[Index scans aren’t always bad, and index seeks aren’t always great.](https://www.brentozar.com/archive/2019/04/index-scans-arent-always-bad-and-index-seeks-arent-always-great/)
[Differences between SQL Server Clustered Index Scan and Index Seek](https://medium.com/geopits/differences-between-sql-server-clustered-index-scan-and-index-seek-311756e4d82c)

### Tradoffs - Read vs. Write

**Reads vs. Writes *(+ Memory)***

Indexes improve read times, but indexes must be updated every time new data is added to the table, so they slow down reads and occupy some storage space to store that information

## Index Gotchas

[3 Things You Should Know About SQL Indexes](https://www.celerity.com/how-to-design-sql-indexes)

**Queries use one index per joined table**

[Why don't I get an index seek?](https://dba.stackexchange.com/a/176889/31340)



[How to determine if an Index is required or necessary](https://dba.stackexchange.com/q/56/31340)


### By The Numbers - Index Statistics

We can investigate a couple things about indexes we have in the database

* [Which columns and tables have indexes][8]
  * [`sys.indexes`][5]
  * [`sys.index_columns`][9]
* [How to tell if an index is ever used][2]
  * [`sys.dm_db_index_usage_stats`][3] <sup>* since the [last server restart][10]</sup>
* [How do you determine the size of an index in SQL Server?][4]
  * [`sys.partitions`][6]
  * [`sys.allocation_units`][7]

Put it all together and what do you get

```sql
;WITH IndexSize AS (
	SELECT i.OBJECT_ID,
		   i.index_id,
		   8 * SUM(a.used_pages) AS [Indexsize(KB)]
	FROM sys.indexes i
	JOIN sys.partitions p ON p.OBJECT_ID = i.OBJECT_ID AND p.index_id = i.index_id
	JOIN sys.allocation_units a ON a.container_id = p.partition_id
	GROUP BY i.OBJECT_ID, i.index_id
),
IndexCols AS (
	SELECT
		i.OBJECT_ID,
		i.index_id,
		STUFF(REPLACE(REPLACE((
			SELECT QUOTENAME(c.name) + CASE WHEN ic.is_descending_key = 1 THEN ' DESC' ELSE '' END AS [data()]
			FROM sys.index_columns AS ic
			INNER JOIN sys.columns AS c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
			WHERE ic.object_id = i.object_id AND ic.index_id = i.index_id AND ic.is_included_column = 0
			ORDER BY ic.key_ordinal
			FOR XML PATH
		), '<row>', ', '), '</row>', ''), 1, 2, '') AS KeyColumns,
		STUFF(REPLACE(REPLACE((
			SELECT QUOTENAME(c.name) AS [data()]
			FROM sys.index_columns AS ic
			INNER JOIN sys.columns AS c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
			WHERE ic.object_id = i.object_id AND ic.index_id = i.index_id AND ic.is_included_column = 1
			ORDER BY ic.index_column_id
			FOR XML PATH
		), '<row>', ', '), '</row>', ''), 1, 2, '') AS IncludedColumns
	FROM sys.tables AS t
	INNER JOIN sys.indexes AS i ON t.object_id = i.object_id
)
SELECT OBJECT_NAME(i.OBJECT_ID) AS TableName,
	   i.[name] AS IndexName,
	   i.[type_desc] AS IndexType,
	   c.KeyColumns,
	   c.IncludedColumns,
	   ISNULL(u.user_scans, 0) AS UserScans,
	   ISNULL(u.user_seeks, 0) AS UserSeeks,
	   ISNULL(u.user_updates, 0) AS UserUpdates,
	   s.[Indexsize(KB)]
FROM sys.indexes i
LEFT JOIN IndexSize s ON s.object_id = i.object_id AND s.index_id = i.index_id
LEFT JOIN IndexCols c ON c.object_id = i.object_id AND c.index_id = i.index_id
LEFT JOIN sys.dm_db_index_usage_stats u ON u.object_id = i.object_id AND u.index_id = i.index_id
WHERE ISNULL(u.user_seeks, 0) = 0 
  AND i.[type] = 2 -- non-clustered
ORDER BY IndexType, TableName, IndexName
```


[1]: https://blog.sqlauthority.com/2007/03/30/sql-server-index-seek-vs-index-scan-table-scan/
[2]: https://stackoverflow.com/a/5145464/1366033
[3]: https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-db-index-usage-stats-transact-sql
[4]: https://stackoverflow.com/a/59185688/1366033
[5]: https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-indexes-transact-sql
[6]: https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-partitions-transact-sql
[7]: https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-allocation-units-transact-sql
[8]: https://stackoverflow.com/q/765867/1366033
[9]: https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-index-columns-transact-sql
[10]: https://stackoverflow.com/a/11442305/1366033