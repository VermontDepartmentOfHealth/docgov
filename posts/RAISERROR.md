---
title_word: RAISERROR
title: How does RAISERROR work?
tags: ['post', 'sql']
authors: ['Kyle']
date: 2019-12-23
summary: "What does RAISERROR(50001, 16, 1, 'dbo.GetPerson', 'PersonId') do and what do all those magic numbers mean?"
---

## Intro

Let's start with two questions:

1. What does `RAISERROR(50001, 16, 1, 'dbo.GetPerson', 'PersonId')` do?  
2. And do all those [magic numbers](https://en.wikipedia.org/wiki/Magic_number_(programming)) mean?

To answer that, let's first look at what each parameter is doing:

```sql
RAISERROR(50001,           -- Message Id.  
          16,              -- Severity,  
          1,               -- State,  
          'dbo.GetPerson', -- 1st argument passed to msg string
          'PersonId');     -- 2nd argument passed to msg string
```

> **Note**: In SQL Server, the keyword `RaisError` is ['mis-spelled' with only one 'e'](https://stackoverflow.com/q/2821082/1366033) (just like [`loginame`](https://stackoverflow.com/q/29877638/1366033)) which appears to be a holdover from naming standards in [Sysbase](https://en.wikipedia.org/wiki/Sybase).
> 
> However, in our Global Admin DB, the custom SP we use to log errors is spelled 'correctly' as `dbo.RaiseError`

## Message Id

There are a couple different overloads, so as an alternative syntax, you *could* omit the `message_id` lookup altogether and pass a custom string template or a single literal like this:

```sql
RAISERROR('Hi %s', 16, 1, 'Kyle')
RAISERROR('Hi Kyle', 16, 1)
```

However, passing in a message ID allows you to leverage a re-usable string template in the database.

According to [`RAISERROR` docs](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/raiserror-transact-sql):

> Error numbers for user-defined error messages should be greater than 50000

There are tons of internal error message ids that SQL Server uses to conduct business or log errors, but we can lookup *our own* custom messages like this:

```sql
SELECT * FROM sys.messages s WHERE s.message_id > 50000
```

| msg id | severity | text                                                                                                    |
|:------:|:--------:|---------------------------------------------------------------------------------------------------------|
| 50001  |    16    | The stored procedure *%s* expects the *%s* parameter, which was not supplied.                           |
| 50002  |    16    | The stored procedure *%s* was supplied with an invalid *%s* parameter; the value supplied was '*%s*'.   |
| 50003  |    16    | The stored procedure *%s* incurred the following error: *%s*.                                           |
| 50004  |    16    | The SSIS/DTS package *%s* incurred the following error in the *%s* step: *%s*.                          |
| 50005  |    16    | The job *%s* incurred the following error in the *%s* step: *%s*.                                       |
| 50006  |    16    | The trigger *%s* on the table *%s* incurred the following error: *%s*.                                  |
| 50007  |    16    | The trigger *%s* on the database *%s* incurred the following error: *%s*.                               |
| 50008  |    16    | The trigger *%s* on the server *%s* incurred the following error: *%s*.                                 |
| 50009  |    16    | The stand-alone-script *%s* incurred the following error: *%s*.                                         |
| 50010  |    16    | *%s*                                                                                                    |

\*This list of AHS custom error messages is also detailed in section 8.1 of our [AHS SQL Environment Standards](https://confluence/download/attachments/13533262/AHS_SQL_EnvironmentStandards_v4.0.pdf)

So to answer the question for our first param, the `50001` provides the corresponding template and the final error message will combine the trailing param array and insert anywhere `%s` appears, forming this error message:

> The stored procedure *dbo.GetPerson* expects the *PersonId* parameter, which was not supplied.

So what do the next two params do then?

## Severity

The default value is **16** which represents "general errors that can be corrected by the user."

The severity levels can be divided up into the following ranges:

| Level | Description                                                           |
|:-----:|-----------------------------------------------------------------------|
| 0-10  | Indicates **informational messages** and not actual errors            |
| 11-16 | Indicate errors that **can be corrected by the user**                 |
| 17-19 | Indicate software errors that **cannot be corrected by the user**     |
| 20-24 | Indicate system problems and are **fatal errors**                     |

\* Check out the MS docs on [Database Engine Error Severities](https://docs.microsoft.com/en-us/sql/relational-databases/errors-events/database-engine-error-severities) for the full list, with detailed descriptions for each number

Since the `message_id` comes with a default security level, you can actually pass `-1` to use the one associated to that message.  So the following two statements do the same thing:

```sql
RAISERROR(50010, 16, 1, 'My bad')
RAISERROR(50010, -1, 1, 'My bad')
```


### Control-of-Flow

We often use `RAISERROR` within a procedure to validate incoming parameters and hault execution with an informative error if they don't.

Be aware, there are [specific conditions](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/raiserror-transact-sql#remarks) under which `RAISERROR` will impact the [control of flow](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/control-of-flow) for the statement being executed:

> When RAISERROR is run with a **severity of 11 or higher** in a **TRY block**, it transfers control to the associated CATCH block.

So the following raise error statement will abort execution and transfer to the catch block

```sql
BEGIN TRY
    RAISERROR('Custom Error - Level 16', 16, 1)
    PRINT 'Happy Path Flow'
END TRY
BEGIN CATCH
    PRINT 'Catch Error Flow'
END CATCH

--- PRINTS: 'Catch Error Flow'
```

However, if you use a severity of < 11 or anytime you call `RAISERROR` outside a `TRY...CATCH` block, flow will proceed as normal, even if [`XACT_ABORT`](https://docs.microsoft.com/en-us/sql/t-sql/statements/set-xact-abort-transact-sql) is turned on.



## State & Logging Output

The last parameter captures a number ranging from 0-127 to represent the "state" of your script.  This would be helpful if you had the same error message repeat multiple times, and wanted to quickly identify which line was causing the problem:

Here's a trivial example where the same we might have two different checks for the same ID, and we want to capture state to report which check detected the error

```SQL
-- make sure the person exists
IF NOT EXISTS (SELECT 1 FROM dbo.Person p WHERE p.entity_uid = @PersonId)
    RAISERROR(50002, 16, 1, 'dbo.GetPerson', 'PersonId')

-- make sure the person has the relevant record
IF NOT EXISTS (SELECT 1 FROM dbo.HearingTest h WHERE h.entity_uid = @PersonId)
    RAISERROR(50002, 16, 2, 'dbo.GetPerson', 'PersonId')
```

However, RAISERROR also generates metadata that is available through calling the following system functions:

* [`ERROR_LINE()`](https://docs.microsoft.com/en-us/sql/t-sql/functions/error-line-transact-sql)
* [`ERROR_MESSAGE()`](https://docs.microsoft.com/en-us/sql/t-sql/functions/error-message-transact-sql)
* [`ERROR_NUMBER()`](https://docs.microsoft.com/en-us/sql/t-sql/functions/error-number-transact-sql)
* [`ERROR_PROCEDURE()`](https://docs.microsoft.com/en-us/sql/t-sql/functions/error-procedure-transact-sql)
* [`ERROR_SEVERITY()`](https://docs.microsoft.com/en-us/sql/t-sql/functions/error-severity-transact-sql)
* [`ERROR_STATE()`](https://docs.microsoft.com/en-us/sql/t-sql/functions/error-state-transact-sql)

So the state number can probably be gleaned more reliably just from relying on the line number from the error message

## Throw VS. RaisError

Another way to report problems & control flow is to use the `THROW` command which has a similar syntax / parameters.  The official guidance, according to the [docs on RAISERROR](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/raiserror-transact-sql) is that:

> New applications [SQL Server 2012+] should use [`THROW`](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/throw-transact-sql) instead

```sql
BEGIN TRY
    --RAISERROR(50010, 16, 1, 'Whoops!')
    THROW 50010, 'Whoops!', 1
END TRY
BEGIN CATCH
    SELECT ERROR_MESSAGE(),
           ERROR_NUMBER(),
           ERROR_SEVERITY(),
           ERROR_PROCEDURE(),
           ERROR_STATE(),
           ERROR_LINE()
END CATCH
```

One advantage is that `THROW` will honor the [`SET XACT_ABORT`](https://docs.microsoft.com/en-us/sql/t-sql/statements/set-xact-abort-transact-sql) flag

However, since our script templates are designed to work across a variety of SQL Server instances, at this point in time, we're likely to continue with our adoption of RAISERROR for the time being.

## Further Reading

* [Raise custom error message with RAISERROR in SQL Server](https://stackoverflow.com/q/15944630/1366033)
* [What do the different RAISERROR severity levels mean?](https://stackoverflow.com/q/1122925/1366033)
* [Why does Sql Server keep executing after raiserror when xact_abort is on?](https://stackoverflow.com/q/76346/1366033)
* [THROW vs. RAISERROR](https://stackoverflow.com/q/24141845/1366033)

