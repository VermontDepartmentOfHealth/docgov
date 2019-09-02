
module.exports = function(collection) {
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
}

  
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