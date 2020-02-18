---
title_word: Perf
title: Exploring Queries with Optional Parameters
tags: ['post', 'sql', 'perf']
authors: ['Kyle']
date: 2019-12-03
summary: "What is the perf impact of including every column as an optional parameter in your query and how to best address it"
draft: true
---


[How can I use optional parameters in a T-SQL stored procedure?](https://stackoverflow.com/q/3415582/1366033)
[sql search query with multiple optional search parameters](https://stackoverflow.com/q/22179855/1366033)
[How to Optimize the Use of the “OR” Clause When Used with Parameters](https://stackoverflow.com/q/2161573/1366033)


[Dynamic Search Conditions in T‑SQL](http://www.sommarskog.se/dyn-search.html)


**Parameter Sniffing**

[The Elephant and the Mouse, or, Parameter Sniffing in SQL Server](https://www.brentozar.com/archive/2013/06/the-elephant-and-the-mouse-or-parameter-sniffing-in-sql-server/)
[Parameter Sniffing Problem and Possible Workarounds](https://blogs.msdn.microsoft.com/turgays/2013/09/10/parameter-sniffing-problem-and-possible-workarounds/)

```sql
DECLARE @CONST_PAT                          VARCHAR(20) = 'PAT',
        @CONST_PROV                         VARCHAR(20) ='PROV',
        @CONST_PCP_ORG                      VARCHAR(20) = 'PCP_ORG',
        @CONST_A                            CHAR(1)  = 'A',
        @CONST_N                            CHAR(1)  = 'N',
        @CONST_VT                           CHAR(2)  = 'VT';

                
DECLARE @entity_uid         AS INT = 584;

SELECT p.entity_uid,p.birth_time,org.entity_uid,
       org.display_nm
FROM dbo.Person p
INNER JOIN dbo.[Role] r 
    ON p.entity_uid = r.entity_uid
    AND R.subject_class_cd = @CONST_PAT
    AND R.cd = @CONST_PAT 
    AND R.scoping_class_cd = @CONST_PROV
    AND R.scoping_role_cd = @CONST_PCP_ORG 
    AND R.status_cd = @CONST_A
INNER JOIN Organization org ON org.entity_uid = r.scoping_entity_uid    
WHERE @entity_uid IS NOT NULL OR org.entity_uid = @entity_uid --CASE WHEN @entity_uid IS NOT NULL THEN @entity_uid ELSE org.entity_uid END
```