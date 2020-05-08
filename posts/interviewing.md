---
tags: ['post', 'workforce']
authors: ['Kyle', 'Brian']
date: 2019-08-22
summary: "An overview of our hiring process as we strive to make our interviewing process as open, fair, and inclusive as we can"
pagination:
  data: roles
  size: 1
  alias: role
roles:
 - DBA
 - App
permalink: "interview/{{role | lower }}/index.html"
renderData:
  title: "Dev Interview Process"
  title_word: 'Interviews'
---


## Positions

Slightly different versions of this page exist for two different roles:


<ul class="radio-buttons list-unstyled d-flex">
{%- for rl in roles %}
  <li><a href="/interview/{{rl | lower }}/" {% if rl == role %} aria-current {% endif %} >
     {{ rl }}
   </a></li>
{% endfor -%}
</ul>

## Hello & Welcome

If you're here and interested in a job with the Agency of Digital Services & Vermont Department of Health, a warm welcome and big hello.   Our goal is to make the hiring process as inclusive, transparent, and fair as humanely possible.  We want you to be able to show off your core competencies, and how those skills transfer to our team.

## What to Prepare

1. Create a System Diagram of a Previous Project
2. Familiarize yourself with our Development Environment (see below for details)

### Project Diagram

Prior to the interview, please provide a simple diagram of a system or application that you worked on with a summary of what the end-product did.  We want you to be able to showcase something you've built or you're particularly proud of. Please be prepared to provide technical details about the system during the interview.

Here are a couple of examples of system diagrams [Entity Relationship Diagram][6] / [Software Architectural Diagram][7] as starting points, but adapt to your system design and interfaces. Please feel free to use whatever drawing or diagramming tools you'd like, including a pen and paper, or any available free UML tools like [draw.io][9]

If for whatever reason, you're unable to produce a diagram before the interview, please let us know.


## What to Expect

**Interview Duration**: Please block off approximately two hours for the interview.

**Getting Here**: There are meters and several parking garages around town, and we are also located right next to the Downtown Center stop on [GMT's bus line][14]. Please see the [City of Burlington Parking Guide][13] for more information

**Location**: We're located at [108 Cherry Street][10], Third floor, Suite 301.  

[![Vermont Department of Health Cherry Street Entrance][11]][12]

**Arrival**: You'll need to check-in with the front desk, and they'll either send you up or buzz us down and we'll meet up in the lobby.  
**Panel** You'll meetup with 3-4 folks here, across different tech stacks on our team.

**Clothing**: Dress attire around here is somewhere between casual and business casual, but feel free to wear whatever makes you feel comfortable.

### Interview Outline

1. Panel Questions
2. Personal Project Discussion
3. Pair Coding Exercises
4. Questions for Us

### Pair Coding Exercises

We want to work through some live-coding examples of the typical sorts of stuff we do here on a regular basis.  Our framing as a pair problems is so we can think-through solutions together and we're available for as much or as little help as is needed.

* You'll have full access to Google, Stack Overflow, or any other online resources you might want.
* We'll have a pair coding setup with two keyboard and two mice
* We want you to feel as comfortable writing code as you would be at work, which means...
  * If you want to drive, okay
  * Don't want to drive, okay
  * Want to use the internet, okay
  * Want to use a whiteboard, also okay
  * Prefer a sitting or standing desk, both fine

The coding setup should look something like this (well, exactly like this).

![office setup][8]



{% if 'app' == role | lower %}

## Application / .NET Developer

We'll be using [Visual Studio 2017][15] with [Resharper][16] on Windows 10

Here's an overview of the types of coding question we'll look at:

* Probably do a FizzBuzz example in C# (or language of your choice*)
* Read and explain some existing code in C#
* Discuss architectural design considerations

>***Note**: If your primary language is not C#, please contact us ahead of time, and we'll try our best to setup a development environment that you're comfortable in so you can showcase your skills.



{% elif 'dba' == role | lower%}


## DBA / SQL Developer

We'll be using [SQL Server Express 2017][4] with [SSMS 2018][3] with [RedGate SQL Prompt][5] on Windows 10

Here's an overview of the types of SQL we'll look at:

* Setup a couple tables
* Write some queries
* Read and review some code
* Discuss database design


{% endif %}


## Next Steps

Following any interview, we'll make sure to get back to you within 1-2 weeks and let you know if we'll be moving forward or not




[2]: https://humanresources.vermont.gov/talent-acquisition/successfactors-recruiting/successfactors-first-time-login
[3]: https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms
[4]: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
[5]: https://www.red-gate.com/products/sql-development/sql-prompt/
[6]: /assets/images/posts/hiring/CIS-ERD.png
[7]: /assets/images/posts/hiring/CSHN-Arichitecture.png
[8]: /assets/images/posts/hiring/pair-desktop.jpg
[9]: https://www.draw.io/
[10]: https://www.google.com/maps/place/108+Cherry+St,+Burlington,+VT+05401/
[11]: /assets/images/posts/hiring/vdh-zampieri-building.jpg
[12]: https://www.google.com/maps/@44.4792551,-73.2138143,3a,75y,6.07h,82.04t/data=!3m7!1e1!3m5!1soZtO_DFW4FHeZw4j4gcGxA!2e0!6s%2F%2Fgeo2.ggpht.com%2Fcbk%3Fpanoid%3DoZtO_DFW4FHeZw4j4gcGxA%26output%3Dthumbnail%26cb_client%3Dmaps_sv.tactile.gps%26thumb%3D2%26w%3D203%26h%3D100%26yaw%3D311.1357%26pitch%3D0%26thumbfov%3D100!7i13312!8i6656
[13]: https://www.burlingtonvt.gov/DPW/Parking
[14]: http://ridegmt.com/gmt-schedules/
[15]: https://visualstudio.microsoft.com/vs/
[16]: https://www.jetbrains.com/resharper/