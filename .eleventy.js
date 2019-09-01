

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
