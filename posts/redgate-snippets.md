---
title_word: Redgate
title: Redgate Snippets
tags: ['post', 'redgate', 'sql']
authors: ['Brian']
date: 2019-09-17
summary: "An overview of how to create custom Redgate Snippets"
---


![sql diagram](/assets/images/posts/redgate/drawing.svg)

## Overview

[Redgate Snippets][3] are custom blocks of code with pre-defined fields that allow users to quickly create SQL Queries in SSMS by allowing the user to focus on what it is they want to do but not requiring them to remember every bit of syntax.

## Using existing Snippets

Redgate SQL Prompt comes with a large number of pre-defined snippets. While most of them are quite useless, they are adequate in showing the different ways in which snippets can be used.

1. To view, edit, and/or add existing snippets, navigate to **SQL Prompt**->**Snippet Manager...**
2. Select **Snippets** under the **Suggestions** category.

![SQL Prompt - Menu][1]
![SQL Prompt - Options][2]

### Syntax Overview

Snippets use SQL mixed with *placeholders*. Placeholders fall into a few different categories.

1. Fields that are automatically filed in, such as \$TIME\$, which will auto generate a date and time field based on the formate specified.
2. Fields that prompt the user to input some criteria. For instance, you may have a snippet to create a table. The active field in this case would be the Table Name the user must specify.
3. The placeholder is where the users selected or copied text is inserted. For example, if you create a short script that must be deployed, you could have a snippet to encapsulate everything in our Stand Alone Script template with most of the fields pre-filled based on your needs.

|Placeholder|Usage|
|----------------------------------------|--------------------|
|\$CURSOR\$|Specifies the cursor position when the snippet is inserted. For example, SELECT \$CURSOR\$ FROM places the cursor after SELECT.|
|\$DATE\$|Inserts the current date. You can specify a custom date format, for example \$DATE(MM/dd/yyyy)\$.
|\$DBNAME\$|Inserts the name of the connected database.|
|\$GUID\$|Inserts a globally unique identifier.|
|\$MACHINE\$|Inserts the name of machine running SQL Prompt.|
|\$PASTE\$|Inserts the contents of the clipboard.|
|\$SELECTEDTEXT\$|Inserts the selected text. You can use this placeholder to create a snippet that encloses your selection in a block, eg BEGIN...END. Snippets using this placeholder are included in the actions list .|
|\$SELECTIONSTART\$|Start of selected text|
|\$SELECTIONEND\$|End of selected text. Anything selected will be encapsulated with the snippet.|
|\$SERVER\$|Inserts the name of the connected SQL server.|
|\$TIME\$|Inserts the current time. You can specify a custom time format, for example \$TIME(HH:mm:ss)\$.|
|\$USER\$|Inserts the name of the connected user.|




## Snippet Examples

## Alter Table Add Column

In this example we will :
1. Create a new snippet to alter a table and add a column
2. Create an example table
3. Alter the table by utilizing the snippet


#### 1 - Create Snippet

1. On the *Snippets* menu, click *New...*
2. You will be presented with the following screen :
3. ![SQL Prompt - Alter Table Blank][4]
4. Each Snippet consists of four parts
   1. *Snippet:* - This is what you'd type to reference the snippet.
      1. In this example we used **atac** for **A**lter **T**able **A**dd **C**olumn
   2. *Description:* - A short description of what the snippet is supposed to do.
   3. *Code:* - The snippet SQL and Placeholders
      1. Each Placeholder must start and end with \$. A placeholder can contain spaces and special characters.
   4. *Placeholders:* - Lists each of the defined placeholders from the *Code:* section, as well as giving the option for default values.
      1. In this example we left all defaults empty, with the exception of \$schema\$, which we default to **dbo**
   5. ![SQL Prompt - Alter Table Filled][5]
   6. Hit **Save** and return to your IDE.


#### 2 - Example Setup

Create a simple table.

```sql
CREATE TABLE dbo.TestTable (
    Col1 INT PRIMARY KEY,
    Col2 VARCHAR(10)
)
```

#### 3 - Use our new snippet

In SSMS, start typing the snippet name, in this case **atac**. As you type, the suggestions box will appear.
![SQL Prompt - Alter Table Blank][6]
Highlight the snippet by using the arrow keys and hit enter or use the mouse to select the appropriate snippet.

The syntax from the snippet will appear with focus on the first element. In this case, it's \$schema\$, which is defaulted to **dbo**. You can hit enter to move to the next field if you wish to leave it as **dbo**.

Do the same for the other three fields, hitting enter after you've filled in the appropriate criteria.

You can also move around the fields by hitting *tab* to move forward, or *shift+tab* to move backwards.

**NOTE**: You must always hit enter on the last field, or hit esc at any point, to remove focus from the current snippet.

![SQL Prompt - Alter Table Gif][7]

## Stand Alone Script Template

Current standards dictate that we must use Templates for our code. While nice in practice, the initial scaffolding is designed as a One Size Fits all, which means there's lots of extraneous code that most of us do not need.

The following example is how to create a Snippet to do most of the leg work for you.

#### 1 - SAS Snippet

The following is code is for a snippet I've named SAS - **S**tand **A**lone **S**cript.

Things to note :
1. In the "CHANGE LOG" section, you'll want to replace "Brian Nowak" with your own name.
2. You'll notice that \$Control_ID\$ appears multiple times. When a Placeholder name appears more than once, regardless of which one is edited, they will all be updated with the same text.
3. Lets say you've written some sql, if you select it, then click on the menu that appears in SSMS, it will be automatically inserted into the area where \$SELECTEDTEXT\$ appears.

![SQL Prompt - SAS][8]

Full Snippet Text :

```sql
/***************************************************************************************************
										Agency of Human Services
								Stand-Alone Script (Template version: 1.4)
****************************************************************************************************
NAME:			$Control_ID$
SOURCE FILE:	$Control_ID$.sql
PURPOSE:		$DESCRIPTION$
DATA TABLES:	
ERROR NUMBERS:	21 - 50000 = Run-time error (SQL Server generated)
				50009 = Data/Schema integrity error (developer generated)
TEST SCRIPT:	
============================================ CHANGE LOG ============================================
NAME			DATE		CONTROL#	ACTION
====================================================================================================
Brian Nowak		$DATE(MM/dd/yyyy)$	$Control_ID$		$Text$
***************************************************************************************************/
/*#################################### INITIALIZATION SECTION ####################################*/
-- NOTE: ALL constants and variables must be declared in this section.
BEGIN TRY
	SET XACT_ABORT ON;	-- Catch all run-time errors and halt transaction.
	SET NOCOUNT OFF;	-- Do count records for Stand-Alone Scripts.

	-- Declare constants here. Use the "@CONST_" prefix.
	DECLARE @CONST_DatabaseName				VARCHAR(50),
			@CONST_ScriptName				VARCHAR(200);

	-- Set constants here. Use AHS-soft coding techniques for constants that need to be soft coded.
	SELECT	@CONST_DatabaseName	= DB_NAME(),
			@CONST_ScriptName	= '$Control_ID$';

	-- Declare local variables here.
	DECLARE @ErrorMessage				VARCHAR(1000);

	-- Set local variables here.

/*######################################### MAIN SECTION #########################################*/
	-- NOTE: All INSERT, UPDATE and DELETE statements must be within a transaction.
	BEGIN TRANSACTION; -- Should be removed if no data in permanent tables is modified.
	-- Enter the main SQL statement here.

	$SELECTEDTEXT$

	COMMIT TRANSACTION; -- Should be removed if the BEGIN TRANSACTION statement was removed.
END TRY
/*################################# FINAL ERROR CHECKING SECTION #################################*/
BEGIN CATCH
	-- NOTE: Avoid using cursors. Cursor clean-up: IF CURSOR_STATUS('global','<CURSOR>')>-1 BEGIN CLOSE <CURSOR> DEALLOCATE <CURSOR> END;
	-- Rollback the transaction if it actually began.
	IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION; -- Should be removed if the BEGIN TRANSACTION statement was removed.
	-- Alert the user of the bad news.
	EXEC dbGlobalAdmin.dbo.RaiseError @CONST_DatabaseName; -- NOTE: If dbGlobalAdmin is not deployed on the server, remove this line.
	PRINT ERROR_MESSAGE();
END CATCH
```



#### 2 - SAS Usage

Snippets using the \$SELECTEDTEXT\$ placeholder will work a bit differently, such that a drop down menu will be available to the left of your SSMS editor with a text box filter at the top. Start typing the name of your snippet to apply it to the text you have selected.

The following GIF illustrates how to do this.

![SQL Prompt - SAS][9]


[1]: /assets/images/posts/redgate/SQLPrompt-menu-1.png
[2]: /assets/images/posts/redgate/SQLPrompt-menu-2.png
[3]: https://documentation.red-gate.com/sp7/speeding-up-your-queries/managing-snippets/
[4]: /assets/images/posts/redgate/SQLPrompt-AlterTable-1.png
[5]: /assets/images/posts/redgate/SQLPrompt-AlterTable-2.png
[6]: /assets/images/posts/redgate/SQLPrompt-AlterTable-3.png
[7]: /assets/images/posts/redgate/SQLPrompt-AlterTable-4.gif
[8]: /assets/images/posts/redgate/SQLPrompt-SAS-1.png
[9]: /assets/images/posts/redgate/SQLPrompt-SAS-2.gif



<!-- page specific styles -->
<style type="text/css">
table thead th:first-child {
    width: 11rem;
}
</style>
