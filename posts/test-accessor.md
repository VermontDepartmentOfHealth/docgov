---
title_word: tdd
title: 'Unit testing a private method with a Private Accessor'
summary: 'How to manually add an assembly accessor to a test project in order to test private methods in .NET Framework'
tags: ['post', 'unit-testing', 'mstest', '.net']
authors: ['Kyle']
date: 2020-01-24
draft: true
---

## Forward

Upfront, it's probably worth noting that it's up for debate when you [*should* run unit tests on private methods](https://stackoverflow.com/a/250719/1366033), but the existence of many workarounds proves that for some number of people, there's value in being able to verify the logic in private functions.  I'd personally argue that private methods are allowed to hide implementation details, but I still want to be able to verify that I've done that implementation correctly.

All that aside, one way to do that is with an assembly accessor.  This method has been officially deprecated according to the MS Docs on [Unit Tests for Private, Internal, and Friend Methods](https://docs.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2010/bb385974(v=vs.100)).  However we have several places that currently use this approach, so it's worth spelling out what it does before pivoting to newer solutions

## Setup

Here's an example class we could add to any project

```cs
class Maths
{
    private int Add(int a, int b)
    {
        return a + b;
    }
}
```


Historically, inside **Visual Studio 2010**, you could right click a private method, and select "Create Unit Tests" and VS would do the necessary work to make sure the private method was available.

![VS 2010 create unit tests](/assets/images/posts/test-accessor/vs-2010-create-tests.png)

Which would display the prompt:

> **Add InternalsVisibleToAttribute**  
> You have chosen to generate tests for a type that is marked as Friend, or Internal.  Would you like to add the InternalsVisibleTo attribute to project 'MyConsoleApp'?

However, in **Visual Studio 2017**, this is no longer an option - instead you get the dialog


> Create Unit Tests is supported only on a non-test project and within a public class or a public method.


![VS 2017 create unit tests](/assets/images/posts/test-accessor/vs-2017-create-tests.png)

If we upgrade a 2010 project -> 2017, this approach will still work. If we want to seed a 2017 project from scratch, here's the manual steps to properly setup each project with the correct attributes.

## Manually Add Private Test Accessor

Let's say you're starting with a console app with the above class in a project named `CoolConsoleApp.csproj`

1. Create a new Test library.  Go to your Solution, "Add New Project" and select "Unit Test Project" and name it `CoolConsoleApp.Test`

    ![Add MSTest Project](/assets/images/posts/test-accessor/add-mstest-project.png)


2. In the original console project, open `AssemblyInfo.cs` file (usually under your project's Properties folder), and add the following compiler attribute

    ```cs
    [assembly: System.Runtime.CompilerServices.InternalsVisibleTo("CoolConsoleApp.Test")]
    ```

3. In the test project, add a project reference to the console app and a reference to `Microsoft.VisualStudio.QualityTools.UnitTestFramework` which should be installed somewhere like this:

    ````none
    C:\Program Files (x86)\Microsoft Visual Studio\2017\Professional\Common7\IDE\PublicAssemblies\Microsoft.VisualStudio.QualityTools.UnitTestFramework.dll
    ````

    This assembly adds a *Build Action* of `Shadow` and also a `[TestClass]` attribute in the [`Microsoft.VisualStudio.TestTools.UnitTesting` Namespace](https://docs.microsoft.com/en-us/dotnet/api/microsoft.visualstudio.testtools.unittesting)

    You will also  need to either remove the reference to `Microsoft.VisualStudio.TestPlatform.TestFramework` or the `using` statements since they both bring in the same classes

    ![Test Project References](/assets/images/posts/test-accessor/test-project-references.png)


4. In the test project, create a folder named `Test References` and a text file named `CoolConsoleApp.accessor` (easiest by using Add > New Empty File)

    The contents of the file should include the console project name and `Desktop` [as opposed to mobile](https://stackoverflow.com/a/9975608/1366033)


    ``` file:CoolConsoleApp.accessor
    CoolConsoleApp.exe
    Desktop
    ```

    And then set the **Build Action** to `Shadow`

    ![Project Accessor](/assets/images/posts/test-accessor/accessor.png)

5. On the solution, create a new Folder named `Solution Items` and then create a new `Test Settings` file named `local.testsettings`

    ![Test Settings](/assets/images/posts/test-accessor/test-settings.png)

    Especially if you get the warning ["Unit Test Adapter threw exception: URI formats are not supported"](https://stackoverflow.com/a/27509544/1366033)

6. On each test method add a [`[DeploymentItem]` attribute](https://docs.microsoft.com/en-us/dotnet/api/microsoft.visualstudio.testtools.unittesting.deploymentitemattribute?view=mstest-net-1.2.0) with the name of your package like this:

    ```diff
      [TestMethod]
    + [DeploymentItem("CoolConsoleApp.exe")]
      public void TestMethod1()
    ```

7. And that should do it!

    ![Test Complete](/assets/images/posts/test-accessor/test-complete.png)


All that said, you might still [run into build problems](https://stackoverflow.com/q/6596555/1366033)