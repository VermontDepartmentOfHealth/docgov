---
title_word: WebForms
title: 'Applying styles to the WebForms design view'
summary: "The designer is arguably one of the better features of WebForms: let's make it even better by applying site-wide styles to the static design view"
tags: ['post', 'asp.net', 'webforms', 'designer']
authors: ['Kyle']
date: 2020-02-19
---

One of the best developer experience (DX) tools of ASP.​NET WebForms is displaying a design view of what the code would look like when rendered during design time.  This makes a lot of sense in the natural evolution of .NET tooling when bringing WinForms to the web through WebForms.

Mostly this works out of the box, but there are a couple tricks to making sure stylesheets show up correctly and consistently across various pages during both design time *and* run time.  Here's a quick run through of how to apply stylesheets so they show up in WebForms master layout, pages, and controls.



Let's say there's `site.css` file that has a single CSS rule in it:

```css file=styles/site.css
h1,h2,h3 {
    background: lightblue;
    padding: 5px;
}
```

## Master Layout

We'll add the styles to our `site.master` page so it's applied everywhere, but we also want to make sure it shows up at design time as well.

Here are three different ways to add a stylesheet to master:

```html file=site.master
<link type="text/css" rel="stylesheet" href="./Styles/Site.css?v=2" />
<link type="text/css" rel="stylesheet" href="<%= Page.ResolveUrl("~/Styles/Site.css") %>?v=2" />
<link type="text/css" rel="stylesheet" href="~/Styles/Site.css?v=2" />
```

1. The first option, `./Styles/Site.css`, will render the stylesheet at design-time because the master file is sitting at the same folder root as the Styles folder, but will fail at runtime when a request is made to a different location within the application.

    For example, a request to `/Patient/Search.aspx` would look for the styles folder in a sibling directory at the following location `/Patient/Styles/Site.css`

2. Another way to dynamically resolve the URL for each page is to use the [ASPX View Engine](https://support.microsoft.com/en-us/help/976112/introduction-to-asp-net-inline-expressions-in-the-net-framework) syntax to inject server side code using [`<%= %>`](https://docs.microsoft.com/en-us/previous-versions/dotnet/netframework-4.0/k6xeyd4z(v=vs.100)) and call [`Page.ResolveUrl()`](https://docs.microsoft.com/en-us/dotnet/api/system.web.ui.control.resolveurl?view=netframework-4.8) which will dynamically get the correct path for the `Site.css` file based on which page is getting called

    However, there's a limit to how much code Visual Studio will try to execute at design time in trying to determine what the page will look like, and VS does not call the code render block at design time.

3. The third option leverages the [application root operator (`~`)](https://docs.microsoft.com/en-us/previous-versions/aspnet/ms178116(v=vs.100)) in one of several tags that ASP.​NET will automagically resolve for each request.

    The bonus here is that it will resolve at **run-time *and* design-time**

So using option 3, the master page will render correctly like this:

![Master Site Design View](/assets/images/posts/webforms-designer/master-site-designer.png)

> **NOTE**: There are also a couple other ways to include resources using the ASP.​NET bundler with [`Microsoft.AspNet.Web.Optimization.WebForms`](https://www.nuget.org/packages/Microsoft.AspNet.Web.Optimization.WebForms/), but that's a whole other discussion


## Page Control

The pages design view is always rendered inside the master page each page is bound to, so as long as the master page is styled, the page content will be as well.

**Here's a simplified master > page inheritance structure**:

```html raw file=site.master
&lt;%@ Master Language="C#" AutoEventWireup="true" CodeFile="Site.master.cs" Inherits="Site" %&gt;

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head runat="server"&gt;
    &lt;title&gt; Designer Styles Demo &lt;/title&gt;
    &lt;link type="text/css" rel="stylesheet" href="~/Styles/Site.css?v=2" /&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;asp:ContentPlaceHolder id="<mark>MainContent</mark>" runat="server"&gt;
        &lt;!-- placeholder for content --&gt;
    &lt;/asp:ContentPlaceHolder&gt;
&lt;/body&gt;
&lt;/html&gt;
```

```html raw file=default.aspx
&lt;%@ Page MasterPageFile="<mark>~/Site.Master</mark>" Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Home" %&gt;

&lt;asp:Content ID="BodyContent" ContentPlaceHolderID="<mark>MainContent</mark>" runat="server"&gt;

    &lt;h2&gt;Home Page&lt;/h2&gt;
    &lt;p&gt;Here's some home page content&lt;/p&gt;

&lt;/asp:Content&gt;
```

And here's what the designer will look like:

![Master > Page Design View](/assets/images/posts/webforms-designer/page-designer.png)

## User Control

The last piece that can be tricky to style is custom user controls that are dropped into pages.  That's because they don't have a strongly typed dependency on any master page or page control.  At runtime, they'll gain access to site-wide styles when used in an existing page, but there's no way to guarantee where they'll be used at design time.

**Here's a simplified Page > Control inheritance structure**:

```html raw file=search.aspx
&lt;%@ Page Language="C#" AutoEventWireup="true" CodeFile="Search.aspx.cs" Inherits="Patient_Search" MasterPageFile="~/Site.Master"  %&gt;
&lt;%@ Register Src="~/<mark>SearchControl.ascx</mark>" TagPrefix="<mark>uc1</mark>" TagName="SearchControl" %&gt;

&lt;asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server"&gt;
    
    &lt;h2&gt;Search Patient&lt;/h2&gt;
    
    &lt;<mark>uc1</mark>:SearchControl runat="server" ID="SearchControl" /&gt;

&lt;/asp:Content&gt;
```

```html file=SearchControl.ascx
<%@ Control Language="C#" AutoEventWireup="true" CodeFile="SearchControl.ascx.cs" Inherits="Patient_SearchControl" %>

<h3>Patient Search Control</h3>
```

If we look at the current design view for `SearchControl.ascx` there won't be any styling applied to the `<h3>`:

![User Control Design View Unstyled](/assets/images/posts/webforms-designer/user-control-designer-unstyled.png)

There are two potential workarounds to applying styles to the designer but excluding them from the runtime payload:

### If Statement

One strategy is to use an if statement inside an [embed code block](https://docs.microsoft.com/en-us/previous-versions/ms178135(v=vs.140)).  While this will always execute to false, it's enough to pull in the stylesheet during design time like this:


```html
<% if(false){ %><link href="./Styles/Site.css" rel="stylesheet" type="text/css" /><% } %>
```

### Visible=False

Another possibility is to include `runat="server"` attribute which will convert any tag to be server rendered and allow you to also add `Visible="False"` like this:

```html
<link type="text/css" rel="stylesheet" href="../Styles/Site.css" runat="server" Visible="False" id="DesignerStyles" />
```

In both cases, the user control will now render like this in the designer view:

![User Control Design View Styled](/assets/images/posts/webforms-designer/user-control-designer-styled.png)

In this example, the styling of a `<h3>` tag might be trivial, but in situations where the user control is taking on a lot of rendering, it can be extremely helpful to have up to date styles when layout out the page.

## Wrap Up

You should include stylesheets on master in a way that's accessible to both the designer and the runtime like this:

```html
<link type="text/css" rel="stylesheet" href="~/Styles/Site.css?v=2" />
```

If you want styles in the design view for user controls, you can add them like this:

```html
<!-- designer styles -->
<link type="text/css" rel="stylesheet" href="../Styles/Site.css" runat="server" Visible="False" id="DesignerStyles" />
```

One final note of caution that using the designer as a drag and drop UI builder can be tricky on the web and break content flow by statically positioning elements.  But putting that aside, as a read-only view, the ability to have but having an immediate feedback loop on what the rendered page will look like when editing is simply amazing.
