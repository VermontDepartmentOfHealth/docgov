---
title_word: ORM
title: 'Data Access & Object Relational Mapping in .NET'
summary: 'Some different flavors of how to query data from a database and consume it in your business logic'
tags: ['post', 'ORM', 'Data Access', 'ADO.NET', '.NET']
authors: ['Kyle']
date: 2020-01-23
draft: true
---

Here's an overview of some of the data access methods currently in use by VDH


## Setup

But first, a little bit of setup

### Data Setup

The data isn't important, but if you want to run locally, this example is using the [AdventureWorks](./adventureworks/) database

Here's an example of a Stored Procedure that queries data from a table:

```sql
CREATE OR ALTER PROCEDURE [dbo].GetPersonById
    @BusinessEntityID [int]
AS
BEGIN
    SELECT p.BusinessEntityID,
           p.PersonType,
           p.FirstName,
           p.MiddleName,
           p.LastName,
           p.ModifiedDate
    FROM Person.Person p
    WHERE p.BusinessEntityID = @BusinessEntityID
END;
```

In SSMS, we could invoke the stored procedure like this:

```sql
EXEC dbo.GetPersonById @BusinessEntityID = 7
```

Which would return the following output:

| Business Entity ID | Person Type | First Name | Middle Name | Last Name | Modified Date |
|:------------------:|-------------|------------|-------------|-----------|---------------|
| 7                  | EM          | Dylan      | A           | Miller    | 2009-02-01    |


### .NET Setup

All of the examples with use ADO.NET to connect to a database and open a `SqlCommand`.  They'll all share the following structure:

```cs
var cnnBuilder = new SqlConnectionStringBuilder
{
    InitialCatalog = "AdventureWorks2017",      // database
    DataSource = @"AHSVDH405520L\SQLExpress01", // server
    IntegratedSecurity = true                   // windows auth
};

using (var cnn = new SqlConnection(cnnBuilder.ToString()))
using (var cmd = new SqlCommand())
{
    cnn.Open();
    cmd.Connection = cnn;

    // access data here

}
```



## DataAdapter -> Table

```cs
// access data here
cmd.CommandText = "dbo.GetPersonById";
cmd.CommandType = CommandType.StoredProcedure;
cmd.Parameters.Add("BusinessEntityID", SqlDbType.Int).Value = 7;

using (var da = new SqlDataAdapter(cmd))
{
    var dt = new DataTable();
    da.Fill(dt);
}
```

**Pros**
* Super quick to get started with
* Good for offloading logic to database

**Cons**
* Lacks Strong Typing
* Data access must be done with strings

## DataAdapter -> XSD Table

One added step toward static type safety is to scaffold out the table ahead of time.  We can do this by creating a [Typed Dataset](https://docs.microsoft.com/en-us/dotnet/framework/data/adonet/dataset-datatable-dataview/typed-datasets) using an XML Schema Definition (XSD) file.

![Dataset Designer](/assets/images/posts/data-access/dataset-designer.png)

Once the schema is built, Visual Studio has a native way to process files by defining a custom tool on the properties for each file.  In this case, we'll use `MSDataSetGenerator` which unlocks the context menu option to "Run Custom Tool"

![MSDataSetGenerator](/assets/images/posts/data-access/custom-tool.png)

This creates a static class for our schema which inherits from `System.Data` Dataset and DataTable classes in a generated file that includes some of these class signatures

```cs file:Person.Designer.cs
public class Person : System.Data.DataSet {}
public class PersonDataTable : System.Data.TypedTableBase<PersonRow> {}
public class PersonRow : System.Data.DataRow {}
```

Note that now we can replace the column name access with strongly typed properties on each row:

```diff
- row["BusinessEntityId"]
+ row.BusinessEntityID
```

**Pros**
* Provides Strong Typing

**Cons**
* Hard to modify / extend
* Complicated build step that [can have issues](https://stackoverflow.com/a/23664840/1366033)
* Hard to read/reason about generated files in source control
* Bloated API //TODO stats?
* Design tool facet to learn

## Vanilla DataReader

Our vanilla data reader begins with a vanilla class

```cs
class Person
{
    public int BusinessEntityID { get; set; }
    public string PersonType { get; set; }
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public DateTime ModifiedDate { get; set; }
}
```


A first pass at using the `DataReader` to map incoming values to the object would look like this:

```cs
var persons = new List<Person>();

using (var reader = cmd.ExecuteReader())
{
    while (reader.Read())
    {
        var person = new Person();

        person.BusinessEntityID = (int)reader["BusinessEntityID"];
        person.PersonType = (string)reader["PersonType"];
        person.FirstName = (string)reader["FirstName"];
        person.MiddleName = (string)reader["MiddleName"];
        person.LastName = (string)reader["LastName"];
        person.ModifiedDate = (DateTime)reader["ModifiedDate"];

        persons.Add(person);
    }
}
```

You might want to add some more maturity with null checking with guarded if statements like this:

```cs
if (reader["BusinessEntityID"] != DBNull.Value) person.BusinessEntityID = (int)reader["BusinessEntityID"];
if (reader["PersonType"] != DBNull.Value) person.PersonType = (string)reader["PersonType"];
if (reader["FirstName"] != DBNull.Value) person.FirstName = (string)reader["FirstName"];
if (reader["MiddleName"] != DBNull.Value) person.MiddleName = (string)reader["MiddleName"];
if (reader["LastName"] != DBNull.Value) person.LastName = (string)reader["LastName"];
if (reader["ModifiedDate"] != DBNull.Value) person.ModifiedDate = (DateTime)reader["ModifiedDate"];
```


## DataAccess

## Dappper