
module.exports =  function CustomizeMD() {
   // configure syntax highlighting
   var hljs = require('highlightjs'); 
   let highlight = function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(lang, str, true).value +
               '</code></pre>';
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }


   // set markdown defaults (inline so we can extend)
   let markdownIt = require("markdown-it");
   let options = {
     html: true,
     breaks: true,
     linkify: true,
     highlight: highlight
   };
   
   // add markdown anchor options
   let markdownItAnchor = require("markdown-it-anchor");
   let opts = {
       permalink: true,
       slugify: function(s) {
           // strip special chars
           let newStr = s.toLowerCase().replace(/[^a-z ]/gi,'').trim();
           // take first 4 words and separate with "-""
           newStr = newStr.split(" ").slice(0,6).join("-");
           return newStr;
       },
       permalinkClass: "direct-link",
       permalinkSymbol: "#",
       level: [1,2,3,4]
   };
   
   // add file extension
   let markdownItFile = require("./markdown-it-file");
   let markdownItDefList = require("markdown-it-deflist")

   return markdownIt(options)
            .use(markdownItAnchor, opts)
            .use(markdownItFile)
            .use(markdownItDefList);
}

  