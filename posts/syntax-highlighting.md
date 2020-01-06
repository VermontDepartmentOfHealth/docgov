---
title_word: Code
title: Syntax Highlighting
tags: ['post', 'overview']
authors: ['Kyle']
date: 2019-09-02
summary: "Syntax highlighting makes code snippets readable and enjoyable"
---

For general markdown support, checkout [our markdown overview](/posts/markdown/)

Here's a list of supported languages that will be transformed by [highlight.js](https://highlightjs.org/)

> **Bonus!**
> Head over to the [settings page](/settings/#theme) to set a custom theme

## JavaScript

```js
var pet = {
    name: "Frida",
    age: 13
}
```

## HTML

```html
<!doctype html>
<html lang="en">
    <head>
        <title>doc GOV</title>
    </head>
    <body class="page">
    </body>
</html>
```

## CSS

```css
@media (max-width: 865px) {
  /* only show nav toggles on small screens only show nav toggles on small screens */
  .hamburger {
    display:flex
  }
}
```

## SQL

```sql
-- Setup CTE
WITH ActiveEmployee AS (
    SELECT *
    FROM Employee e
    WHERE e.IsActive = TRUE
)
SELECT * FROM Employees
```


## INI (TOML)

```ini
CONSUMER_KEY=EFf98235jjsef
CONSUMER_SECRET=OeiL835Lu8325
```

## YAML

```yaml
title_word: 'Careers'
title: 'Full Stack .NET Software Developer'
tags: ['post', 'workforce']
```


## Diff

```diff
- var sayHello = function(name) {
-   return 'Hi, ' + name
- }
+ let sayHello = name => `Hi, ${name}`
```
