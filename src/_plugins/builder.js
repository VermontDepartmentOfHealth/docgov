/**
 * 
 * @param {*} collection 
 * @param {string} categoryTagName on a category detail page, the tag property used eg. "author"
 * @param {string} categoryKey on a category detail page, the unique key eg. "name"
 * @param {string} categoryDataField on a category detail page, any extra info eg. "summary"
 * @param {string} postDataFieldName on a content post, the font matter data field eg. "author"
 * @param {string} filePath the folder path where category detail page is placed eg. "./src/projects/"
 */
module.exports =  function BuildCollection(collection, categoryTagName,  categoryKey, categoryDataField, postDataFieldName, filePath) {
    validateCategory(collection, categoryTagName,  categoryKey, categoryDataField, postDataFieldName, filePath)

    // all categories that have their own page
    let categoryPages = collection.getFilteredByTag(categoryTagName)

    // grab all posts
    let allPosts = collection.getFilteredByTag('post')

    // go through each category page and attach relevant posts
    var categoryData = {}
    for (let page of categoryPages) {
        let categoryName = page.data[categoryKey]; 

        // find all relevant posts
        let categoryPosts = allPosts.filter(p => p.data[postDataFieldName] && (p.data[postDataFieldName] === categoryName || p.data[postDataFieldName].includes(categoryName)));
        let data = {
            summary: page.data[categoryDataField],
            url: page.url,
            posts: categoryPosts
        }
        categoryData[categoryName] = data;
    }

    return categoryData;
}

  
function validateCategory(collection, categoryTagName,  categoryKey, categoryDataField, postDataFieldName, filePath) {
    // get all authors in author pages
    let categoryPages = collection.getFilteredByTag(categoryTagName)
    var allPageCategories = categoryPages.map(p => p.data[categoryKey])

    // get all authors referenced by posts
    let allPosts = collection.getAll()
    var allPostCategories = allPosts.filter(p => p.data[postDataFieldName]).map(p => p.data[postDataFieldName])
    allPostCategories = allPostCategories.reduce((a, b) => a.concat(b), []); // flatten
    allPostCategories = [...new Set(allPostCategories)]                      // deduplicate

    // check for any post authors w/o author pages
    var missingCategories = allPostCategories.filter(a => !allPageCategories.includes(a))

    if (missingCategories.length) {
        const chalk = require('chalk');
        var files = missingCategories.map(a => `${filePath}${a}.md`);
        console.warn(chalk.yellow(`Missing ${postTagName} pages for:\n* ${missingCategories.join("\n* ")}\n`));
        console.warn(chalk.yellow(`To fix, create the following files:\n${files.join("\n")}\n`));
    }

}