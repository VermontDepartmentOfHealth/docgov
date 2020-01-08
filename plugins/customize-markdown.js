
module.exports = function CustomizeMD() {
    var highlight = require('./customize-highlight.js');

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
            // remove parens & strip special chars
            let newStr = s.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z ]/gi, '').trim();
            // take first 4 words and separate with "-""
            newStr = newStr.split(" ").slice(0, 6).join("-");
            return newStr;
        },
        permalinkClass: "direct-link",
        permalinkSymbol: "#",
        level: [1, 2, 3, 4]
    };

    // add file extension
    let markdownItFile = require("./markdown-it-file");
    let markdownItDefList = require("markdown-it-deflist")
    let markdownItMark = require('markdown-it-mark')
    let markdownItIns = require('markdown-it-ins')
    let markdownItSpoiler = require('markdown-it-spoiler')
    let markdownItCheckbox = require('markdown-it-checkbox')

    return markdownIt(options)
        .use(markdownItAnchor, opts)
        .use(markdownItFile)
        .use(markdownItDefList)
        .use(markdownItMark)
        .use(markdownItIns)
        .use(markdownItSpoiler)
        .use(markdownItCheckbox, {
            divWrap: true,
            divClass: 'checkbox',
          });
}
  