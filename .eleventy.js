

module.exports = function(eleventyConfig) {

    // static passthroughs
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/favicon.ico");


    // add filters
    eleventyConfig.addFilter("squash", require("./src/_filters/squash.js") );
    eleventyConfig.addFilter("cssmin", require("./src/_filters/clean-css.js") );
    eleventyConfig.addFilter("dateDisplay", require("./src/_filters/dates.js") );

        
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
