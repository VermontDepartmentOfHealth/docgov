// configure syntax highlighting
var hljs = require('highlightjs'); 

// customize
hljs.getLanguage('sql').keywords += ' with'; 

// pin button to side of container
var copyBtn = `<button class="btn-icon btn-copy" >
                    <span class="btn-text">Copy</span>
                    <img src="/assets/images/icons/fa/copy.svg" alt="copy icon">
                </button>`

let highlight = function (str, lang) {
    let formatted = str

    // parse language if we got one - if we fail, just escape
    if (lang && hljs.getLanguage(lang)) {
        try {
            formatted = hljs.highlight(lang, str, true).value
        } catch (__) {
            formatted = md.utils.escapeHtml(str)
        }
    }

    // container must start with pre ... if (highlighted.indexOf('<pre') AND is whitespace sensitive
    let output = `<pre class="hljs-container hljs">${copyBtn}<pre class="hljs"><code>${formatted}</code></pre></pre>`;

    return output;
}

  


  module.exports =  highlight