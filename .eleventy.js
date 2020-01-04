
module.exports = function(eleventyConfig) {

    // static passthroughs - remap to root
    eleventyConfig.addPassthroughCopy({"assets/images/icons/fav/favicon.ico": "/favicon.ico"});
    eleventyConfig.addPassthroughCopy({"assets/images/icons/fav/manifest.json": "/manifest.json"});
    eleventyConfig.addPassthroughCopy({"assets/scripts/service-worker.js": "/service-worker.js"});
    
    eleventyConfig.addPassthroughCopy("assets/images");
    eleventyConfig.addPassthroughCopy("assets/scripts");
    eleventyConfig.addPassthroughCopy("assets/styles");
    eleventyConfig.addPassthroughCopy("admin");

    // grab 3rd party dependencies
    eleventyConfig.addPassthroughCopy({"node_modules/mark.js/dist/mark.min.js": "/vendor/scripts/mark.js"});
    eleventyConfig.addPassthroughCopy({"node_modules/gumshoejs/dist/gumshoe.polyfills.min.js": "/vendor/scripts/gumshoe.js"});
    eleventyConfig.addPassthroughCopy({"node_modules/highlightjs/styles": "/vendor/styles/hljs"});
    eleventyConfig.addPassthroughCopy({"node_modules/firacode/distr/woff": "/assets/fonts/"});
    eleventyConfig.addPassthroughCopy({"node_modules/firacode/distr/woff2/": "/assets/fonts/"});
    eleventyConfig.addPassthroughCopy({"node_modules/typeface-noto-serif/files": "/assets/fonts/"});
    eleventyConfig.addPassthroughCopy({"node_modules/typeface-roboto/files": "/assets/fonts/"});

    // add filters
    eleventyConfig.addFilter("cssmin", require("./plugins/clean-css.js") );
    eleventyConfig.addFilter("jsmin", require("./plugins/clean-js.js") );
    eleventyConfig.addFilter("dateDisplay", require("./plugins/dates.js") );
    eleventyConfig.addFilter("removeHash", html => html.replace(/ #/g,""));
    eleventyConfig.addFilter("removeParen", html => html.replace(/\(.*?\)/g,""));
    eleventyConfig.addFilter("contentTags", tags => tags.filter(t => !["post","draft"].includes(t)));
    eleventyConfig.addFilter("findByName", (arr, findValue) => arr.find(a => a.name === findValue));
    eleventyConfig.addFilter("isPostType", tags => tags && tags.some(t => ["post","draft"].includes(t)));
    eleventyConfig.addFilter("isDraft", tags => tags && tags.some(t => t === 'draft'));
    eleventyConfig.addFilter("take", (array, n) => array.slice(0,n));
    eleventyConfig.addFilter("sortByPostCount", arr => arr.sort((a,b) => (a.posts.length < b.posts.length ? 1 : -1)));

    
    // custom collections
    let builder = require("./plugins/builder.js")
    eleventyConfig.addCollection("authors", col => builder(col, "author", "name", "summary", "authors", "./pages/authors/"));
    eleventyConfig.addCollection("projects", col => builder(col, "project", "name", "summary", "project", "./pages/projects/"));
    eleventyConfig.addCollection("teams", col => builder(col, "team", "name", "summary", "team", "./pages/teams/"));
    eleventyConfig.addCollection("departments", col => builder(col, "department", "name", "summary", "department", "./pages/departments/"));

    // bundle collection
    eleventyConfig.addCollection("bundles", col => {
        let script = col.getFilteredByGlob("**/meta/bundle-scripts.njk")[0]
        let style = col.getFilteredByGlob("**/meta/bundle-styles.njk")[0]
        return { script, style }
    });
 
    // configure syntax highlighting
    let md = require("./plugins/customize-markdown.js")()
    eleventyConfig.setLibrary("md", md);


    eleventyConfig.addPairedShortcode("markdown", (content, inline = null) => {
        return inline
          ? md.renderInline(content)
          : md.render(content);
      });

    // add plugins
    let pluginTOC = require('eleventy-plugin-nesting-toc');
    eleventyConfig.addPlugin(pluginTOC, {tags: ['h2, h3']});

    /* embed tweet plugin setup */
    let pluginEmbedTweet = require("eleventy-plugin-embed-tweet")
    let tweetEmbedOptions = {
        cacheDirectory: 'tweets',
        useInlineStyles: false 
    }
    eleventyConfig.addPlugin(pluginEmbedTweet, tweetEmbedOptions);
        
    return {
        dir: {
            "data": "data",
            "includes": "assets",
            "layouts": "layouts"
        },

        // By default markdown files are pre-processing with liquid template engine
        // https://www.11ty.io/docs/config/#default-template-engine-for-markdown-files
        markdownTemplateEngine: "njk",
    };
};
