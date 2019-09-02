

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
    eleventyConfig.addCollection("authors", function(collection) {
        validateAuthors(collection)

        // grab global data from any item
        let authorPages = collection.getFilteredByTag("author")
        let allPosts = collection.getAll()

        var authorData = {}
        for (let page of authorPages) {
            let authorName = page.data.name;
            let authorPosts = allPosts.filter(p => p.data.authors && p.data.authors.includes(authorName))
            let data = {
                summary: page.data.summary,
                posts: authorPosts
            }
            authorData[authorName] = data;
        }

        return authorData;

    });


 


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

function validateAuthors(collection) {
    // get all authors in author pages
    let authorPages = collection.getFilteredByTag("author")
    var allAuthorPages = authorPages.map(p => p.data.name)

    // get all authors referenced by posts
    let allPosts = collection.getAll()
    var allPostAuthors = allPosts.filter(p => p.data.authors).map(p => p.data.authors)
    allPostAuthors = allPostAuthors.reduce((a, b) => a.concat(b), []); // flatten
    allPostAuthors = [...new Set(allPostAuthors)]                      // deduplicate

    // check for any post authors w/o author pages
    var missingAuthors = allPostAuthors.filter(a => !allAuthorPages.includes(a))

    if (missingAuthors.length) {
        const chalk = require('chalk');
        var files = missingAuthors.map(a => `./src/authors/${a}.md`);
        console.warn(chalk.yellow(`Missing author pages for:\n* ${missingAuthors.join("\n* ")}\n`));
        console.warn(chalk.yellow(`To fix, create the following files:\n${files.join("\n")}\n`));
    }

}