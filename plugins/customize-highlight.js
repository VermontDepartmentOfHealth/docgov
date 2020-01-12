let { escapeHtml } = require('markdown-it')().utils;
var hljs = require('highlightjs');
const Window = require('window');
const window = new Window();
global.document = window.document // declare globally (needed in highlightjs)


module.exports = highlight

// customize
hljs.getLanguage('sql').keywords += ' with RAISERROR';

// pin button to side of container
const COPY_BTN = `<button class="btn-icon btn-copy">
                    <span class="btn-text">Copy</span>
                    <img src="/assets/images/icons/fa/copy.svg" alt="copy icon">
                 </button>`


function highlight(str, lang, info) {
    let formatted = escapeHtml(str)

    // grab fenced block metadata
    let useRaw = info.includes('raw')

    // parse language if we got one - if we fail, just escape
    if (lang && hljs.getLanguage(lang)) {
        try {
            if (!useRaw) {
                formatted = hljs.highlight(lang, str, true).value

            } else {

                let pre = document.createElement('pre');
                pre.innerHTML = `<code class="language-${lang}">${str}</code>`
                let codeNode = pre.childNodes[0]

                hljs.highlightBlock(codeNode)

                formatted = codeNode.innerHTML
            }
        } catch (__) {}
    }

    // container must start with pre ... if (highlighted.indexOf('<pre') AND is whitespace sensitive
    let output = `<pre class="hljs-container hljs">${COPY_BTN}<pre class="hljs"><code>${formatted}</code></pre></pre>`;

    return output;
}