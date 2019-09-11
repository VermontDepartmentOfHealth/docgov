

module.exports = function(eleventyConfig) {

    // static passthroughs
    eleventyConfig.addPassthroughCopy("src/favicon.ico");
    eleventyConfig.addPassthroughCopy("src/manifest.json");
    eleventyConfig.addPassthroughCopy("src/sw.js");
    eleventyConfig.addPassthroughCopy({"src/_includes/assets": "/assets"});

    // grab 3rd party dependencies
    eleventyConfig.addPassthroughCopy({"node_modules/mark.js/dist/mark.min.js": "/vendor/scripts/mark.js"});
    eleventyConfig.addPassthroughCopy({"node_modules/gumshoejs/dist/gumshoe.polyfills.min.js": "/vendor/scripts/gumshoe.js"});
    eleventyConfig.addPassthroughCopy({"node_modules/highlightjs/styles": "/vendor/styles/hljs"});
    eleventyConfig.addPassthroughCopy({"node_modules/firacode/distr/woff": "/assets/fonts/"});
    eleventyConfig.addPassthroughCopy({"node_modules/firacode/distr/woff2/": "/assets/fonts/"});
    eleventyConfig.addPassthroughCopy({"node_modules/typeface-noto-serif/files": "/assets/fonts/"});
    eleventyConfig.addPassthroughCopy({"node_modules/typeface-roboto/files": "/assets/fonts/"});

    // add filters
    eleventyConfig.addFilter("cssmin", require("./src/_plugins/clean-css.js") );
    eleventyConfig.addFilter("jsmin", require("./src/_plugins/clean-js.js") );
    eleventyConfig.addFilter("dateDisplay", require("./src/_plugins/dates.js") );
    eleventyConfig.addFilter("removeHash", html => html.replace(/ #/g,""));
    eleventyConfig.addFilter("removeParen", html => html.replace(/\(.*?\)/g,""));
    eleventyConfig.addFilter("contentTags", tags => tags.filter(t=> !["post","draft"].includes(t)));
    eleventyConfig.addFilter("isPostType", tags => tags && tags.some(t => ["post","draft"].includes(t)));
    eleventyConfig.addFilter("take", (array, n) => array.slice(0,n));

    
    // custom collections
    let builder = require("./src/_plugins/builder.js")
    eleventyConfig.addCollection("projects", col => builder(col, "project", "name", "summary", "project", "./src/projects/"));
    eleventyConfig.addCollection("authors", col => builder(col, "author", "name", "summary", "authors", "./src/authors/"));
    eleventyConfig.addCollection("teams", col => builder(col, "team", "name", "summary", "team", "./src/teams/"));
    eleventyConfig.addCollection("departments", col => builder(col, "department", "name", "summary", "department", "./src/departments/"));
 

    // configure syntax highlighting
    let md = require("./src/_plugins/customize-markdown.js")()
    eleventyConfig.setLibrary("md", md);


    eleventyConfig.addPairedShortcode("markdown", (content, inline = null) => {
        return inline
          ? md.renderInline(content)
          : md.render(content);
      });

    // add plugins
    let pluginTOC = require('eleventy-plugin-nesting-toc');
    eleventyConfig.addPlugin(pluginTOC);
        
    return {
        dir: {
            input: "src",
            layouts: "_layouts"
        },

        // By default markdown files are pre-processing with liquid template engine
        // https://www.11ty.io/docs/config/#default-template-engine-for-markdown-files
        markdownTemplateEngine: "njk",
    };
};
