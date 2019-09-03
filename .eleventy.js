

module.exports = function(eleventyConfig) {

    // static passthroughs
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/favicon.ico");


    // add filters
    eleventyConfig.addFilter("cssmin", require("./src/_filters/clean-css.js") );
    eleventyConfig.addFilter("jsmin", require("./src/_filters/clean-js.js") );
    eleventyConfig.addFilter("dateDisplay", require("./src/_filters/dates.js") );
    eleventyConfig.addFilter("contentTags", tags => tags.filter(t=> t !== "post"));
    eleventyConfig.addFilter("take", (array, n) => array.slice(0,n));


    // custom collections
    var builder = require("./src/_collections/builder.js")
    eleventyConfig.addCollection("projects", col => builder(col, "project", "name", "summary", "project", "./src/projects/"));
    eleventyConfig.addCollection("authors", col => builder(col, "author", "name", "summary", "authors", "./src/authors/"));
    eleventyConfig.addCollection("teams", col => builder(col, "team", "name", "summary", "team", "./src/teams/"));
    eleventyConfig.addCollection("departments", col => builder(col, "department", "name", "summary", "department", "./src/departments/"));
 


    // set markdown defaults (inline so we can extend)
    let markdownIt = require("markdown-it");
    let options = {
      html: true,
      breaks: true,
      linkify: true
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

    eleventyConfig.setLibrary("md", markdownIt(options).use(markdownItAnchor, opts));
        
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
