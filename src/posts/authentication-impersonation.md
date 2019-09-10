---
title_word: Auth
title: Rolling our own Impersonation with ASP.NET
tags: ['draft', 'authentication']
authors: ['Kyle']
date: 2019-09-10
summary: "Forms Authentication + ActiveDirectory MembershipProvider + ASP.NET Impersonation in MVC 5"
---


For most app varieties, out-of-the-box [authentication mechanisms][1] are the best way to go, but Hybrid application may call for some hybrid authentication mechanisms / providers

* Internet - Forms Authentication
* Intranet - Windows Authentication
* [Extranet][2] - Forms + Windows???

Some of the constraints/goals trying to be achieved

1. Authenticate all users against their Active Directory credentials
2. Add ASP.NET Impersonation so user's credentials are leveraged against SQL Server so connections with `IntegratedSecurity=True` are made under the user's account
3. Expose the web application so it's externally accessible (but only to AD members)

All of the above goals can be *trivially* accomplished by using Basic Authentication, but there are [several pitfalls of basic authentication][3], most notably:

> * The password is sent over the wire in base64 encoding (which can be easily converted to plaintext).
> * The password is sent repeatedly, for each request. (Larger attack window)
> * The password is cached by the web browser, at a minimum for the length of the window / process. (Can be silently reused by any other request to the server, e.g. <abbr title="Cross-site request forgery">CSRF</abbr>)

Because the browser owns the credentials, we cannot forcefully expire a user's session from the server, since the credentials are stored for the entire life of the browser's process.  There are some attempts to [log out a user from a web site using Basic Authentication][4], but largely prove problematic and iffy when implementing across browsers.  And **ALL** rely on JavaScript to *hopefully* do what we want, leaving an easy attack vector available.

> **Aside**: I'll add that basic auth is an somewhat cludgy, un-customizable, outmoded way to provide credentials. Security concerns are way more important than user friendly UX, but basic auth lacks both.

A hybrid solution could leverage different components of Forms Authentication, while using Active Directory as the Membership Provider and programmatically Impersonating a user within the identity of a thread.

The basic outline of this solution draws heavily from the combining the following two articles / solutions:

1. [Using OWIN and Active Directory to authenticate users in ASP.Net MVC 5 application][5] by trailmax referenced in this SO Question on [Configure ASP.NET MVC for authentication against AD][6]
2. [Activate Windows Impersonation Selectively][7] and fleshed out in this SO Question on [Impersonate using Forms Authentication][8]

### 0. Understanding Authentication - Claims + Cookies + Users

If you already have a good handle on how authentication happens in .MVC 4.5+, you can skip to the [solution below<sup>⌄</sup>](#problem1).  But since we're switching from a relatively simple declaration in the config to a relatively complicated manual programmatic implementation, it'll be helpful to have a baseline understanding of the underlying concepts and libraries behind authentication works.

#### Part a - Cookies

First the easy part.  Cookies can be added to a browser for a given domain for various reasons.  When a resource is requested, cookies associated with that domain are sent in the RequestHeader.  ASP.NET can delete, update, or insert new cookies when sending a response that will be stored on the client for future requests.  

> **Aside**: This is the mechanism by which [ASP.NET manages session state][70] and is able to take random stateless HTTP  requests and resume a session right where you left off.

If you want to look at all the cookies for any application, you can go to `Dev Tools` > `Application` > `Cookies`

![App Cookies - Browser](/assets/images/posts/impersonation/app-cookies-browser.png)


And if you want to see how they are passed back to the application on each request, that information (as well as literally any information the server is going to be able to discern) will be sent on the request data visible in `Dev Tools` > `Network`

![App Cookies - Request](/assets/images/posts/impersonation/app-cookies-request.png)

Nothing scary, but it is the client side mechanism for being able to track a user.  Once authenticated, we want to dump their plain text credentials as fast as possible and thereafter communicate with tokens we can store as cookies on the client to identify *that* client

#### Part b - Claims

Claims based identity is the new wave in authentication.  It abstracts away the job of authentication to anybody you're willing to trust to do that work and store a list of users.  It's the backing mechanism for Form Based authentication in MVC 4.5+, but is also the perfect tool for this particular problem where we want to be able to decouple the responsibility of using credentials to identify users vs. making access control decisions once we have an authenticated user.

Here are some of the terms/players involved in making a claim:

* An **Identity Provider (IdP)** (or **Issuer**) is someone you trust to authenticate a user.  That trust is configured via your list of possible issuers and verified via a digital signature.  This could be your own organization's Active Directory or a third party auth services like Facebook, Google, Microsoft, etc.
* A **Security Token Service (STS)** is the actual software that a Identity Provider uses to create and issues tokens
* A **Token** (or **`ClaimsIdentity`**) is the published piece of information that expresses information about the authenticated entity.  Tokens can include as many different claims as they like, typically including things like Name and Email, but also include any other pieces of information they want like roles
* A **Claim** is just a key value pair containing the actual information about an entity (i.e. `Name="Kyle"` would be a *claim* that the token is making).


#TODO - replace images

**Getting a Token**:

![Getting a Token](/assets/images/posts/impersonation/getting-a-token.png)

**Using a Token**

![Using a Token](/assets/images/posts/impersonation/using-a-token.png)

What this provides is a way to not care about how an Identity Provider does it's job, merely the fact that you trust their judgement and that they will produce a token which contains information about an authenticated user that is useful to your application for making access control decisions.  Normally identity providers will take in a username/password combo, but they can do many other things, like 2-factor auth. used in their own assessment of verifying that the user is who they claim to be.


>**Further Reading**: For a deep dive, I recommend this pluralsight course on [Claims-based Identity for Windows: The Big Picture][35] by David Chappell


#### Implementation in .NET

To issue claims in a .NET application, we'll play the role both of Identity Provider and of Token Recipient (importantly those are two separate tasks and could be separated out if need be)

**Claims - Token Recipient**

The first thing we need is a vehicle for describing what the token should look like and where it'll come from.  In ASP.NET OWIN Middleware, we can [`UseIdentity` or `UseCookieAuthentication`][36].  For our purposes, we'll use [Using Cookie Authentication without ASP.NET Core Identity][59] which does the following:

> ASP.NET Core provides cookie middleware which serializes a user principal into an encrypted cookie and then, on subsequent requests, validates the cookie, recreates the principal and assigns it to the `User` property on `HttpContext`. If you want to provide your own login screens and user databases you can use the cookie middleware as a standalone feature.

Once we get ahold of the OWIN Middleware object, we can programmatically define the authentication engine for it to use like this:

```cs
app.UseCookieAuthentication(new CookieAuthenticationOptions
{
    AuthenticationType = "MyProjectAuthentication",
    CookieName = "MyAppCookieName",
    LoginPath = new PathString("/Login"),
    Provider = new CookieAuthenticationProvider(),
    CookieHttpOnly = true,
    ExpireTimeSpan = TimeSpan.FromMinutes(20), // adjust to your needs
    SlidingExpiration = true, // stay active while session active
});
```

This tells ASP.NET to listen for incoming cookies with the given `CookieName` and use them to pipe them into the current user during the request lifecycle.  

The **Type** of authentication being used isn't `Active Directory` or `Forms` per se... it's a new type that we concocted on the fly.  We're the ones that are taking user credentials and deriving a user, the process for which is merely an implementation detail.  So we're the once authoring the claim so we'll tell the CookieAuthenticationOptions to look for an AuthenticationType with our made up name of `MyProjectAunthentication` which we'll use as the AuthenticationType when building claims later.

**Claims - Token Provider**:

As a token provider, we need to come up with a way to verify the user, taking in their credentials or windows identity and generating a token that we have verified that represents the particular user.  I'll leave the issue of how to derive and verify an Active Directory account based on passed in credentials to later, but once we have identified a user, we can create a token and insert a cookie for it like this:

```cs
// we'll figure out how to acquire this somehow
UserPrincipal userPrincipal = GetUserPrincipal(name,pass); 

// grab the auth manager for the current app so we can update it
IAuthenticationManager authenticationManager = HttpContext.GetOwinContext().Authentication;

// we will build a token consisting of several claims
var identity = new ClaimsIdentity("MyProjectAuthentication",
                                   ClaimsIdentity.DefaultNameClaimType,
                                   ClaimsIdentity.DefaultRoleClaimType);

// add claims - could add more if we want to store on the cookie and retrieve for any user
identity.AddClaim(new Claim("http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider", "Active Directory"));
identity.AddClaim(new Claim(ClaimTypes.Name, userPrincipal.SamAccountName));
identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, userPrincipal.SamAccountName));

// clear out any existing claims with the same name
authenticationManager.SignOut("MyProjectAuthentication");
// sign in with our newly created claims identity
authenticationManager.SignIn(new AuthenticationProperties() { IsPersistent = false }, identity);
```

We've put in whatever due diligence we need to be certain that we have the current user and then built a [`ClaimsIdentity`][39] or token that represents that user.  The type of this claim is the same as the one we've told our CookieAuthentication middleware to care about in authenticating users.  And to this ClaimsIdentity, we can add a list of different [`Claim`][38] objects which can posses any type of information about a user we'd like to store in the cookie.

#### User Principal & Identity Terms:

**[Key Authentication / Security Terms][51]**:

* [**Principal** vs. **Identity**][52]
   Place different roles in abstraction
  <pre class="prettyprint"><code class="cs">public interface <span class="userType">IPrincipal</span>
  {
          <span class="userType">IIdentity</span> Identity { get; }
          bool IsInRole(string role);
  }
  </code></pre>

* **Principal** - The principal object represents the security context under which code is running
 *i.e. A wallet that has an ID and some other membership/loyalty cards inside of it*
* **Identity** - The identity object encapsulates information about the user or entity being validated
*i.e. the actual ID inside of the wallet - in most cases we just want to go straight to the ID to grab a user, but it might be helpful to know what kind of wallet it is also*

*  [**Authentication** vs. **Authorization**][53]
	* **Authentication** - verifying a user is who they claim to be 
        *i.e. a non-driver's licence issued by the DMV*
	* **Authorization** - what an authenticated user is allowed to do... note that we need to actually identify an authenticated user before we can say what random person blob 'x' is allowed to do
	 *i.e. allowing someone into a bar based on the authenticated age claims on their drivers licence*


<img width="250" src="/assets/images/posts/impersonation/principal-vs-identity.png" alt="Principal vs. Identity" />
**<sup>Principal vs. Identity</sup>**


#### User Principal & Identity - .NET Implementation

#### User Principal Access

There are several [different places where the user's identity is stored][40]:

> **Note**: [Since .NET 4.5, all principal classes derive from ClaimsPrincipal, enabling claims based authentication.][50]

* **Process Identity** - This is the identity the current process is running under.  At all times, it *must*  be a windows Account that can log onto the current machine because it is the account whose permissions are being used to actually execute code against the machine

 * [`System.Environment.UserName`][42]
     > Gets the user name of the person who is currently logged on to the Windows operating system.

 * [`System.Security.Principal.WindowsIdentity.GetCurrent()`][46]
     > Returns a [`WindowsIdentity`][47] object that represents the current Windows user.

* **User Identity** - The set of Frameworks, Libraries, and Classes that help store and retrieve the value of the Currently authenticated User

 * [`System.Web.HttpContext.Current.User.Identity.Name`][41]
     > Gets or sets security information for the current HTTP request. (The Name of the Logged in user on your Website)

 * [`System.Threading.Thread.CurrentPrincipal`][45]
     > Gets or sets the thread's current principal (for role-based security). In ASP.NET web applications [`HttpContext.User`][41] is copied into `Thread.CurrentPrincipal` for each new request)


 * [`System.Security.Claims.ClaimsPrincipal.Current`][43]
     > By default, [`Thread.CurrentPrincipal`][45] is returned. You can change this behavior by setting the [`ClaimsPrincipalSelector`][44] property to specify a delegate to be called to determine the current principal.

 * [`((Controller)this).User.Identity`][48]
     > (*inside of a controller*) - Gets the user security information for the current HTTP request.

 * <code>[System.Web.HttpContext.Current.GetOwinContext()][49].[Authentication ][57].[User][58]</code>
     > Returns the current `User` for the current request from the `Authentication` middleware functionality available on the current request from the OWIN context


![Identity Debugger][56]


>**Tip**: You can apply the [`[DebuggerDisplay]` attribute][54] to [external libraries][55] to get a high level view of objects (as seen above) like this:
> ```cs
> //add to AssemblyInfo.cs
> [assembly: DebuggerDisplay("[Name={Name}, Type={AuthenticationType}, IsAuth={IsAuthenticated}]", Target = typeof(System.Security.Claims.ClaimsIdentity))]
> [assembly: DebuggerDisplay("[Name={Name}, Type={AuthenticationType}, IsAuth={IsAuthenticated}]", Target = typeof(System.Security.Principal.WindowsIdentity))]
> ```

*Additionally, in other cases, users are sometimes acquired from [`Membership.GetUser()`][74] if you've configured a `MembershipProvider`

#### User Principal Assignment

So how/who assigns each of these values?  Most of them have public setters, so you're free to call something like `Thread.CurrentPrincipal = myPrincipal`, but typically the implementation of assigning user identity will be handled by the framework you're using.  So the user principal will usually be updated in one of two ways:

* <code>((WindowsIdentity)windowsPrincipal.Identity)?.<b>Impersonate()</b></code> will update the following claims:
  * [<code><i>System.</i><b>Environment.UserName</b></code>][42]
  * [<code><i>System.Security.Principal.</i><b>WindowsIdentity.GetCurrent()</b></code>][46]
* <code>authenticationManager.<b>SignIn()</b>(authProp, identity);</code> will update the following claims (sort of):
  * [<code><i>System.Web.</i><b>HttpContext.Current.User</b></code>][41]
  * [<code><i>System.Threading.</i><b>Thread.CurrentPrincipal</b></code>][45]
  * [<code><i>System.Security.Claims.</i><b>ClaimsPrincipal.Current</b></code>][43]
  * [<code><i>((Controller)this).</i><b>User.Identity</b></code>][48]
  * <code>[<i>System.Web.</i>HttpContext.Current.<b>GetOwinContext()</b>][49].[<b>Authentication</b>][57].[<b>User</b>][58]</code>

You'll notice that when you call `AuthenticationManager.SignIn()` the [current user principal is not updated instantaneously][65]. Instead, the [process is broken up into different sections by ASP.NET Identity and OWIN middleware][66]:

> Turned out that `SignIn` method does not set a cookie. It saves Identity objects into memory until time comes to set response cookies. And then claims are converted to a cookie and everything magically works

So it won't be until the response gives the cookie to the client and it is passed back by the next incoming request that [OWIN middleware will take the cookie and use it to set the current user during each request pipeline][67]:

<img width="600" src="/assets/images/posts/impersonation/asp-net-pipeline.png" alt="ASP.NET Pipeline" />
**<sup>ASP.NET Identity Pipeline</sup>**


## 1. Using Active Directory with Forms Authentication

**TODO**...

[A primer on OWIN cookie authentication middleware for the ASP.NET developer][73]


## 2. Using ASP.NET Impersonation with Forms Authentication

Our next mission is to replace this little line in the `web.config`

<pre class="prettyprint"><code class="xml">&lt;configuration&gt;
  &lt;system.web&gt;
    <b class="highlight">&lt;identity impersonate=&quot;true&quot; /&gt;</b>
  &lt;/system.web&gt;
&lt;/configuration&gt;
</code></pre>

According to the docs on [MSDN - Using IIS Authentication with ASP.NET Impersonation][12]:

> **Authentication** sets the <code>[HttpContext][13].[User][14]</code> property
> **Impersonation** sets the [`WindowsIdentity`][15] of the ASP.NET Application

That means that if we open a database connection like this:

```cs
string FirstName = "";
var cnnBuilder = new SqlConnectionStringBuilder()
{
    DataSource = GlobalVars.DatabaseServer,
    InitialCatalog = GlobalVars.Database,
    IntegratedSecurity = true
};
using (SqlConnection cnn = new SqlConnection(cnnBuilder.ToString()))
{
    cnn.Open();
    using (SqlCommand cmd = new SqlCommand("SELECT SUSER_NAME()", cnn))
    using (SqlDataReader reader = cmd.ExecuteReader())
    {
        while (reader.Read())
        {
            FirstName = reader[0].ToString(); // read from first position
        }
    }
}
```

That we'll be able to walk up to, connect with, and interact with the database under the credentials of the logged in user.  All of that is provided for free as long as we've authenticated using Basic or Windows auth, but we have to manually implement the functionality provided by ASP.NET if it doesn't inherently know about the credentials being sent.

Fortunately, we can manually do the exact same thing being done by ASP.NET.  Here's a **simplified** version of [how to programmatically impersonate the Authenticating User][16].

```cs
using System.Security.Principal;

WindowsImpersonationContext impersonationContext;
impersonationContext = 
    ((WindowsIdentity)User.Identity).Impersonate();

// Insert your code that runs under the security context of the authenticating user here.

impersonationContext.Undo();
```

In an ASP.NET application, the `// insert code here` section is actually the entire length of the request being handled.  So as soon as we receive the request, we'll want to catch the thread before in begins execution and then undo it when it finishes.  

> **Note**: We **HAVE** to call `Undo()` on any exit of the request, otherwise the main IIS worker process will continue impersonating the last user to request resources.  Even though we are entering the request for a particular user, `Impersonate` will update the one shared thread that is executing code for everyonne

To be able to wrap the code execution as described above, we'll look at the handlers exposed by  [`HttpApplication Events`][19] in **`Globals.asax.cs`**.  For our purposes, we'll use  the [`Application_PreRequestHandlerExecute`][17] and [`Application_PostRequestHandlerExecute`][18] 


<img width="500" src="/assets/images/posts/impersonation/HttpApplication-events.png" alt="HttpApplication Events" />
**<sup>HttpApplication Events</sup>**


So here's what that would look like, (again, simplified), at a high level any time we process a request and need to substitute the identity of a thread with that of the current user

```cs
// in global.asax.cs
void Application_PreRequestHandlerExecute(object send, EventArgs e)
{
  var impersonationContext = User.Identity.Impersonate();
}

// Entire request runs under the security context of the authenticating user

void Application_PostRequestHandlerExecute(object send, EventArgs e)
{
    impersonationContext.Undo();
}
```

Obviously there's some finessing here to store `impersonationContext` in `Session` so we have something to rollback at the end of the request, and some null handling we'll probably need for requests that arrive before users have provided credentials or after the session expires, but the basic concept is there.

Lest you worry that this is overly complicated, consider that this is exactly what `<identity impersonate="true" />` is doing at a high level.  If you inspect the process identity for a normal application, it'll always read something like `IIS APPPOOL\\DefaultAppPool`

![IIS Process Identity](/assets/images/posts/impersonation/process-identity.png)

So what black magic is in place that requests are ever impersonated, when the default identity for any thread is based on the app pool?  As soon as a request is initialized, if `identity=true`, ASP.NET will automatically convert the identity on that thread so any subsequent resources that are requested are done so under the new credentials. And when the request is finished, ASP.NET will automatically restore the identity back to the original thread.

Here's a view of the  Request/Process lifecycle from [How To: Use Impersonation and Delegation in ASP.NET][21]

[![Using programmatic impersonation to temporarily impersonate the original caller](/assets/images/posts/impersonation/programmatic-impersonation.png)][23]
**<sup>Using programmatic impersonation to temporarily impersonate the original caller</sup>**


And here's a high level view of the lifecycle of impersonating a user


<img width="500" src="/assets/images/posts/impersonation/impersonate-request.png" alt="Impersonate Request" />
**<sup>Impersonate Request Lifecycle</sup>**


In order for this to work, we'll need to be able to generate a `WindowsPrincipal` for a logged on user based on the credentials sent over forms authentication.  To do that, we can use the [`LogonUser`][24] function: 

> You specify the user with a user name and domain and ***authenticate*** the user with a ***plaintext*** password.  
> If the function succeeds, you receive a handle to a token that represents the logged-on user. You can then use this token handle to impersonate the specified user or, in most cases, to create a process that runs in the context of the specified user.

The `LogonUser` function is part of the [**Advapi32.dll**][28] which we'll have to pull in via the  [`DllImport`][25] attribute which exposes "methods from unmanaged dynamic-link libraries as a static entry point"

So this we'll place within the Login Action on our Account controller something like this:

```cs
[DllImport("kernel32.dll", SetLastError = true)]
public static extern bool CloseHandle(IntPtr handle);

//[DllImport("advapi32.dll", SetLastError = true)]
//public static extern bool LogonUser(string lpszUsername, string lpszDomain, string lpszPassword,
//                                    int dwLogonType, int dwLogonProvider, out int TokenHandle);

[DllImport("advapi32.dll", SetLastError = true)]
public static extern bool LogonUser(string principal,
                                string authority,
                                string password,
                                LogonSessionType logonType,
                                LogonProvider logonProvider,
                                out IntPtr token);
public enum LogonSessionType : int
{
    Interactive = 2,
    Network = 3,
    Batch = 4,
    Service = 5,
    Unlock = 7,
    NetworkCleartext = 8,
    NewCredentials = 9
}
public enum LogonProvider : int
{
    Default = 0, // default for platform (use this!)
    WinNT35,     // sends smoke signals to authority
    WinNT40,     // uses NTLM
    WinNT50      // negotiates Kerb or NTLM
}
```

Then we can actually logon like this inside our LoginController

```cs
IntPtr token = IntPtr.Zero;
bool isAuth = LogonUser(username, domainName, password, LogonSessionType.NetworkCleartext, LogonProvider.Default, out token);
return token;
```

The very last thing we should do is log off the user and deallocate the the `IntPtr` pointer anytime the user is logged off, either during the manually during the `Logoff` action or automatically during `Session_End`  which we can do by pulling in the [`CloseHandle`][26] function on the [**kernel32.dll**][27]

```cs
[DllImport("kernel32.dll", SetLastError = true)]
public static extern bool CloseHandle(IntPtr handle);
```

> **Tip**:  In order to Impersonate and switch security contexts on the fly, you'll need to Launch Visual Studio using **Run As Admin**.  In general, anytime we have a dependency on something occuring/existing, it's nice be able to state that dependency declaratively in your code, rather than merely relying on user memory to guarantee compliance.  As highlighted in [How to Do Impersonation][60], we can actually require this on each method via the [`PermissionSet`][61] attribute like this:
> ```cs
> [PermissionSet(SecurityAction.Demand, Name ="FullTrust")]
> public static void BeginImpersonationSession()
> ```


## 3. Windows Auth + Form Login

In our development code - we can't *entirely* rely on passing credentials and redirect to login until we do because it would grind the development experience to a screeching halt.  By default, [Visual Studio will launch with Windows Authentication enabled][72] and run under your own credentials

![Project Properties - Windows Auth](/assets/images/posts/impersonation/vs-windows-auth.png)

So our project should have two entirely separate available entry points:

* Either we're in Visual Studio in Debug and using **`Window Auth`**
* Or we've deployed and all end users should be using the **`Form Login`**

For as consistent a development experience as possible, both should invoke the same claims based credentials once we've authenticated, so any authorization code can be consistently built on top of that.

### Oddities - Static Files and Bundles

When you go to deploy, you might see the following problem:

![Bundle Network Error](/assets/images/posts/impersonation/bundle-network-error.png)

And there's not a very big difference between the original request and the subsequent resource requests it makes to load the rest of the page

![Request Types](/assets/images/posts/impersonation/request-types.png)

The problem, in this case, if you've followed the code above so far, is just a thrown exception when trying to retrieve the identity from session since the [session object is null when requesting a CSS, image, STatic HTML or JS file][30]:

> By default, static things like js, css, image files are not handled by ASP.NET because ASP.NET isn't required to do any processing for those request.  If you want ASP.NET to handle those request (so you can call HTTPModule etc...) you have to add those file request in Application Mapping section in IIS.


However, ASP.NET **does need** to get invoked in order to build bundles, even though the session is still not populated.  

<blockquote>
<b>Tip</b>:  If you want to be able to trigger this problem during development, you'll need to manually serve up bundles.  You can <a href="https://stackoverflow.com/a/12932276/1366033">set <code>EnableOptimizations</code> during <code>Application_Start()</code> to enable bundling/minification</a> like this:<br/><br/>
<pre class="prettyprint"><code class="cs">&#x23;if DEBUG
   // use this for testing bundle minification on dev
   System.Web.Optimization.BundleTable.EnableOptimizations = true;
&#x23;endif
</code></pre></blockquote>


The solution for which is just to hide our `BeginImpersonationSession` inside of a check to ensure we actually have a `Session` value set.  Bundle requests will step into this method and leave while regular calls will startup the behavior we want


<pre class="prettyprint"><code class="cs">async Task<int>void Application_PreRequestHandlerExecute(object send, EventArgs e)
{
    <span class="highlight">if (HttpContext.Current.Session != null)</span>
    {
        Impersonation.BeginImpersonationSession();
    }
}
</code></pre>

> **Note**: Where we attempt to impersonate users is up to you and your use case.  In some cases, you might just want user permissions during any `System.IO` events.  In this article, we're trying to manually recreate Impersonation as close as possible to its implementation in ASP.NET, so our goal is to impersonate during the entire lifespan of the thread being handled.


### Further Reading ~~(ugh, seriously)~~

Here are some additional materials that were helpful in investigating this issue:

* [MSDN - How To: Use Forms Authentication with Active Directory in ASP.NET 2.0][9]
* [MSDN - How To: Use Forms Authentication with Active Directory in Multiple Domains][10]
* [MSDN - How To: Use Impersonation and Delegation in ASP.NET 2.0][11]
* [Understanding the Owin External Authentication Pipeline *by Anders Abel*][68]
* [Creating Custom OAuth Middleware for MVC 5 *by Edward Charbeneau*][69]

[1]: https://technet.microsoft.com/en-us/library/cc733010.aspx
[2]: https://en.wikipedia.org/wiki/Extranet
[3]: https://security.stackexchange.com/a/990/24374
[4]: https://stackoverflow.com/q/233507/1366033
[5]: http://tech.trailmax.info/2016/03/using-owin-and-active-directory-to-authenticate-users-in-asp-net-mvc-5-application
[6]: https://stackoverflow.com/a/37446313/1366033
[7]: https://visualstudiomagazine.com/articles/2004/05/01/activate-windows-impersonation-selectively.aspx
[8]: https://stackoverflow.com/a/11873754/1366033
[9]: https://msdn.microsoft.com/en-us/library/ff650308.aspx
[10]: https://msdn.microsoft.com/en-us/library/ff650307.aspx
[11]: https://msdn.microsoft.com/en-us/library/ff647404.aspx
[12]: https://msdn.microsoft.com/en-us/library/134ec8tc.aspx
[13]: https://msdn.microsoft.com/en-us/library/System.Web.HttpContext "System.Web.HttpContext"
[14]: https://msdn.microsoft.com/en-us/library/System.Web.HttpContext.User "System.Web.HttpContext.User"
[15]: https://msdn.microsoft.com/en-us/library/System.Security.Principal.WindowsIdentity "System.Security.Principal.WindowsIdentity"
[16]: https://support.microsoft.com/en-us/help/306158/how-to-implement-impersonation-in-an-asp-net-application#3
[17]: https://msdn.microsoft.com/en-us/library/System.Web.HttpApplication.PreRequestHandlerExecute "System.Web.HttpApplication.PreRequestHandlerExecute"
[18]: https://msdn.microsoft.com/en-us/library/System.Web.HttpApplication.PostRequestHandlerExecute "System.Web.HttpApplication.PostRequestHandlerExecute"
[19]: https://msdn.microsoft.com/en-us/library/System.Web.HttpApplication_Events "System.Web.HttpApplication_Events"
[21]: https://msdn.microsoft.com/en-us/library/ms998351.aspx
[23]: https://msdn.microsoft.com/en-us/library/ms998351.aspx#paght000023_impersonatingorigcallertemp
[24]: https://msdn.microsoft.com/en-us/library/windows/desktop/aa378184(v=vs.85).aspx
[25]: https://msdn.microsoft.com/en-us/library/System.Runtime.InteropServices.DLLImportAttribute "System.Runtime.InteropServices.DLLImportAttribute"
[26]: https://msdn.microsoft.com/en-us/library/windows/desktop/ms724211.aspx
[27]: https://en.wikipedia.org/wiki/Microsoft_Windows_library_files#KERNEL32.DLL "KERNEL32.DLL exposes to applications most of the Win32 base APIs, such as memory management, input/output (I/O) operations, process and thread creation, and synchronization functions"
[28]: https://en.wikipedia.org/wiki/Microsoft_Windows_library_files#ADVAPI32.DLL "ADVAPI32.DLL provides security calls and functions for manipulating the registry."
[30]: https://forums.asp.net/t/1569930.aspx?Session+object+is+null+when+requesting+a+CSS+image+STatic+HTML+or+JS+file
[32]: https://stackoverflow.com/a/12932276/1366033
[35]: https://app.pluralsight.com/library/courses/claims-based-identity-big-picture/table-of-contents
[36]: https://stackoverflow.com/q/41845902/1366033
[38]: https://msdn.microsoft.com/en-us/library/System.Security.Claims.Claim "System.Security.Claims.Claim"
[39]: https://msdn.microsoft.com/en-us/library/System.Security.Claims.ClaimsIdentity "System.Security.Claims.ClaimsIdentity"
[40]: https://stackoverflow.com/q/8841816/1366033
[41]: https://msdn.microsoft.com/en-us/library/System.Web.HttpContext.User "System.Web.HttpContext.User"
[42]: https://msdn.microsoft.com/en-us/library/System.Environment.UserName "System.Environment.UserName"
[43]: https://msdn.microsoft.com/en-us/library/System.Security.Claims.ClaimsPrincipal.Current "System.Security.Claims.ClaimsPrincipal.Current"
[44]: https://msdn.microsoft.com/en-us/library/System.Security.Claims.ClaimsPrincipal.ClaimsPrincipalSelector "System.Security.Claims.ClaimsPrincipal.ClaimsPrincipalSelector"
[45]: https://msdn.microsoft.com/en-us/library/System.Threading.Thread.CurrentPrincipal "System.Threading.Thread.CurrentPrincipal"
[46]: https://msdn.microsoft.com/en-us/library/System.Security.Principal.WindowsIdentity.GetCurrent "System.Security.Principal.WindowsIdentity.GetCurrent"
[47]: https://msdn.microsoft.com/en-us/library/System.Security.Principal.WindowsIdentity "System.Security.Principal.WindowsIdentity"
[48]: https://msdn.microsoft.com/en-us/library/System.Web.Mvc.Controller.User "System.Web.Mvc.Controller.User"
[49]: https://msdn.microsoft.com/en-us/library/System.Web.HttpContextExtensions.GetOwinContext "System.Web.HttpContextExtensions.GetOwinContext"
[50]: https://stackoverflow.com/a/34961313/1366033
[51]: https://docs.microsoft.com/en-us/dotnet/standard/security/key-security-concepts
[52]: https://docs.microsoft.com/en-us/dotnet/standard/security/principal-and-identity-objects
[53]: https://stackoverflow.com/q/6556522/1366033
[54]: https://docs.microsoft.com/en-us/visualstudio/debugger/using-the-debuggerdisplay-attribute
[55]: https://stackoverflow.com/a/34697240/1366033
[56]: https://i.imgur.com/TcP1CL2.png
[57]: https://msdn.microsoft.com/en-us/library/Microsoft.Owin.IOwinContext.Authentication "Microsoft.Owin.IOwinContext.Authentication"
[58]: https://msdn.microsoft.com/en-us/library/Microsoft.Owin.Security.IAuthenticationManager.User "Microsoft.Owin.Security.IAuthenticationManager.User"
[59]: https://docs.microsoft.com/en-us/aspnet/core/security/authentication/cookie?tabs=aspnetcore2x
[60]: https://stackoverflow.com/a/7250145/1366033
[61]: https://msdn.microsoft.com/en-us/library/System.Security.PermissionSet "System.Security.PermissionSet"
[65]: https://stackoverflow.com/a/25311865/1366033
[66]: http://tech.trailmax.info/2014/08/aspnet-identity-and-owin-who-is-who/
[67]: https://coding.abel.nu/2014/06/asp-net-identity-and-owin-overview/
[68]: https://coding.abel.nu/2014/06/understanding-the-owin-external-authentication-pipeline/
[69]: https://www.red-gate.com/simple-talk/dotnet/.net-framework/creating-custom-oauth-middleware-for-mvc-5/
[70]: https://msdn.microsoft.com/en-us/library/aa479041.aspx
[72]: https://stackoverflow.com/a/17045276/1366033
[73]: https://brockallen.com/2013/10/24/a-primer-on-owin-cookie-authentication-middleware-for-the-asp-net-developer/
[74]: https://msdn.microsoft.com/en-us/library/System.Web.Security.Membership.GetUser "System.Web.Security.Membership.GetUser"