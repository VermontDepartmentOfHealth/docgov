

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
        var authors = collection.items[0].data.authorlist.map(author => {
            var allPosts = collection.getAll()
            var authorName = author.name
            var authorPosts = allPosts.filter(col => col.data.authors && col.data.authors.includes(authorName))
            return {
                name: authorName,
                posts: authorPosts
            }
        })
        let object = {};

        for (let item of authors) {
            // destructure to split up name and everything else
            let {name, posts} = item
            object[name] = posts;
        }


        return object;
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
