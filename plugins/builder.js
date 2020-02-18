/**
 * 
 * @param {*} collection 
 * @param {string} categoryTagName on a category detail page, the tag property used eg. "author"
 * @param {string} categoryKey on a category detail page, the unique key eg. "name"
 * @param {string} categoryDataField on a category detail page, any extra info eg. "summary"
 * @param {string} postDataFieldName on a content post, the font matter data field eg. "author"
 * @param {string} filePath the folder path where category detail page is placed eg. "./projects/"
 */
module.exports =  function BuildCollection(collection, categoryTagName,  categoryKey, categoryDataField, postDataFieldName, filePath) {
    validateCategory(collection, categoryTagName,  categoryKey, categoryDataField, postDataFieldName, filePath)

    // all categories that have their own page
    let categoryPages = collection.getFilteredByTag(categoryTagName)

    // grab all (published) posts in descending order
    let allPosts = collection.getFilteredByTag('post').filter(item => !item.data.draft).reverse()

    // go through each category page and attach relevant posts
    var categoryCollection = categoryPages.map(page => {
        let categoryName = page.data[categoryKey]; 

        // find all relevant posts - do you have field (i.e. 'author') and if so is the value equal to the current category
        let categoryPosts = allPosts.filter(p => equalsOrIncludes(p.data[postDataFieldName], categoryName));

        let colItem = {
            name: page.data[categoryKey],
            summary: page.data[categoryDataField],
            url: page.url,
            posts: categoryPosts
        }
        return colItem
    })

    return categoryCollection;
}

function equalsOrIncludes(stringOrArray, checkValue) {
    if (!stringOrArray) return false
    if (stringOrArray === checkValue) return true         // works only if `typeof stringOrArray === "string"`
    if (stringOrArray.includes(checkValue)) return true;  // works only if `Array.IsArray(stringOrArray)`
    return false;
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
        console.warn(chalk.yellow(`Missing ${categoryTagName} pages for:\n* ${missingCategories.join("\n* ")}\n`));
        console.warn(chalk.yellow(`To fix, create the following files:\n${files.join("\n")}\n`));
        // todo automatically generate placeholder file or link to create or cli instruction to create
    }

}