---
title_word: Perf
title: Make your queries SARGable
tags: ['post', 'sql', 'perf']
authors: ['Kyle']
date: 2019-12-03
summary: "What are SARGable queries, how to write them, and how do them impact performance"
draft: true
---

Here's a pop quiz, and if you pass it, you can probably skip this article:

**Which of the following three predicates is 'Best'**:

```sql
SELECT * FROM Orders o WHERE DateDiff(DAY, o.OrderDate, GetDate()) >= 7  -- A
SELECT * FROM Orders o WHERE DateAdd(DAY, o.OrderDate, 7) < GetDate()    -- B
SELECT * FROM Orders o WHERE o.OrderDate < DateAdd(DAY, -7, GetDate())   -- C
```

Give it a minute - hover to reveal the answer

!!**Option C** - Because `o.OrderDate` is not inside of a function and thus *SARGable*!!

The answer, dear reader, 


[What makes a SQL statement sargable?](https://stackoverflow.com/q/799584/1366033)

```sql
Bad: Select ... WHERE isNull(FullName,'Ed Jones') = 'Ed Jones'
Fixed: Select ... WHERE ((FullName = 'Ed Jones') OR (FullName IS NULL))

Bad: Select ... WHERE SUBSTRING(DealerName,4) = 'Ford'
Fixed: Select ... WHERE DealerName Like 'Ford%'

Bad: Select ... WHERE DateDiff(mm,OrderDate,GetDate()) >= 30
Fixed: Select ... WHERE OrderDate < DateAdd(mm,-30,GetDate()) 
```

[What does the word “SARGable” really mean?](https://dba.stackexchange.com/q/162263/31340)


Sargable operators: =, >, <, >=, <=, BETWEEN, LIKE, IS [NOT] NULL, EXISTS
Sargable operators that rarely improve performance: <>, IN, OR, NOT IN, NOT EXISTS, NOT LIKE

[If You Can’t Index It, It’s Probably Not SARGable](https://www.brentozar.com/archive/2018/03/cant-index-probably-not-sargable/)


[How to Search and Destroy Non-SARGable Queries on Your Server](https://bertwagner.com/2017/08/22/how-to-search-and-destroy-non-sargable-queries-on-your-server/)