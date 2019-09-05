

module.exports = function(eleventyConfig) {

    // static passthroughs
    eleventyConfig.addPassthroughCopy("src/favicon.ico");
    eleventyConfig.addPassthroughCopy({"src/_includes/assets": "/assets"});

    // add filters
    eleventyConfig.addFilter("cssmin", require("./src/_plugins/clean-css.js") );
    eleventyConfig.addFilter("jsmin", require("./src/_plugins/clean-js.js") );
    eleventyConfig.addFilter("dateDisplay", require("./src/_plugins/dates.js") );
    eleventyConfig.addFilter("contentTags", tags => tags.filter(t=> t !== "post"));
    eleventyConfig.addFilter("take", (array, n) => array.slice(0,n));


    // custom collections
    var builder = require("./src/_plugins/builder.js")
    eleventyConfig.addCollection("projects", col => builder(col, "project", "name", "summary", "project", "./src/projects/"));
    eleventyConfig.addCollection("authors", col => builder(col, "author", "name", "summary", "authors", "./src/authors/"));
    eleventyConfig.addCollection("teams", col => builder(col, "team", "name", "summary", "team", "./src/teams/"));
    eleventyConfig.addCollection("departments", col => builder(col, "department", "name", "summary", "department", "./src/departments/"));
 

    // configure syntax highlighting
    var md = require("./src/_plugins/customize-markdown.js")()
    eleventyConfig.setLibrary("md", md);

        
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
