---
title_word: Markdown
title: Markdown Overview
tags: ['post', 'overview']
authors: ['Kyle']
date: 2019-08-30
summary: "Markdown is a simple way to format text that is both human readable and can also be easily converted to a webpage"
---

It's no surprise... Markdown is my favorite ever! It translates really well into how I want to *\*write\** out of the box.

It powers Stack Overflow, Github, and a good chunk of the internet, while offering a delicate balance between robust expressiveness in typography, human readability on all platforms, and amazingly simple full text search.

If you're just getting started there are a couple symbols to remember that will help translate text into **TEXT**!  There are plenty of online guides already detailing various flavors, but here's a brief overview contextualized into this site, including which elements are available and how they are displayed.

For some external quick reference guides, you can check out [CommonMark](https://commonmark.org/help/) or the original [Markdown Syntax documentation](https://daringfireball.net/projects/markdown/syntax) by John Gruber

## Syntax Guide

<div class="split">
    <span><s>Input</s></span>
    <span><s>Output</s></span>
</div>


### Text



<div class="split">
<span>

\*italics\*  
\*\*bold\*\*  
\~\~muted\~\~  
\`inline-code\`  

</span>
<span>

*italics*  
**bold**  
~~muted~~  
`inline-code`  

</span>
</div>


### Blockquote

<div class="split">
<span>

\> Blockquote \*\*bold\*\*

</span>
<span>

> Blockquote **bold**

</span>
</div>



### Headers

<div class="split">
<span>

\# h1 - Primary  
\## h2 - Secondary  
\### h3 - Tertiary  
\#### h4 - Quaternary  

</span>
<span>


# h1 - Primary

## h2 - Secondary

### h3 - Tertiary

#### h4 - Quaternary

</span>
</div>


### Resources

<div class="split">
<span>

\[link text\](http://example.com/)  
\![img alt text\](/assets/heart.svg)  

</span>
<span>

[link text](http://example.com/)  
![img alt text](/assets/images/icons/fa/heart.svg)  

</span>
</div>

### Lists

<div class="split">
<span>

\* un-ordered list  
\* eggs  
\* milk  

</span>
<span>


* un-ordered list
* eggs
* milk

</span>
</div>

<div class="split">
<span>

1\. ordered list  
2\. home  
3\. go to 2  


</span>
<span>


1. ordered list
2. home
3. go to 2

</span>
</div>

### Horizontal Rule

<div class="split">
<span>

Three Dashes: \---
OR three Astrix: \***
OR three Underscore: \___

</span>
<span>

---

</span>
</div>


### Tables

Here's an awesome [markdown table generator](https://www.tablesgenerator.com/markdown_tables) if you're copying data from another source

<div class="split">
<span>

<pre>| Name  | Age  |
| ----- |:----:|
| Frida | 10   |
| Buddy | 12   |
| Gus   | 5    |
</pre>

</span>
<span>

| Name  | Age  |
| ----- |:----:|
| Frida | 10   |
| Buddy | 12   |
| Gus   | 5    |


</span>
</div>


### Syntax Highlighting

For more info on supported languages, see [syntax highlighting](/posts/syntax-highlighting/)

<div class="split">
<span>

\`\`\`js
var pet = {
    name: "Frida",
    age: 13
}
\`\`\`

</span>
<span>

```js
var pet = {
    name: "Frida",
    age: 13
}
```

</span>
</div>


## Extensions

### Inline Text


<div class="split">
<span>

\+\+inserted\+\+  
\=\=mark\=\=  

</span>
<span>

++inserted++  
==mark==  

</span>
</div>

### Spoiler


<div class="split">
<span>

\!\!Secret\!\!

</span>
<span>

!!Secret!!

</span>
</div>

### Definition List


<div class="split">
<span>

Term 1
  \~ Definition 1

Term 2
\:   Definition  2

</span>
<span>


Term 1
  ~ Definition 1

Term 2
:   Definition  2

</span>
</div>

### File

<div class="split">
<span>

\$\$\\\\nessie\prog\Software\\$\$

</span>
<span>


$$\\\\nessie\prog\Software\\$$

</span>
</div>


## Nunjucks Filters

### Embed Tweet

<div class="split">
<span>

<pre><code>&#x007b;% tweet "1188837207206977536" %&#x007d;</code></pre>

</span>
<span>


{% tweet "1188837207206977536" %}

</span>
</div>




<style>
/* prevent examples from showing up in toc */
li [href='#h--secondary'],
li [href='#h--tertiary'],
li [href='#h--quaternary'] {
    display: none;
}
</style>
