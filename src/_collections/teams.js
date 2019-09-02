
module.exports = function(collection) {
    validateAuthors(collection)

    // grab global data from any item
    let teamPages = collection.getFilteredByTag("team")
    let allPosts = collection.getAll()

    var teamData = {}
    for (let page of teamPages) {
        let teamName = page.data.name;
        let teamPosts = allPosts.filter(p => p.data.team && p.data.team === teamName)
        let data = {
            summary: page.data.summary,
            posts: teamPosts
        }
        teamData[teamName] = data;
    }

    return teamData;
}

  
function validateAuthors(collection) {
    // get all authors in author pages
    let teamPages = collection.getFilteredByTag("team")
    var allTeamsFromPages = teamPages.map(p => p.data.name)

    // get all authors referenced by posts
    let allPosts = collection.getAll()
    var allTeamsFromPosts = allPosts.filter(p => p.data.team).map(p => p.data.team)
    allTeamsFromPosts = allTeamsFromPosts.reduce((a, b) => a.concat(b), []); // flatten
    allTeamsFromPosts = [...new Set(allTeamsFromPosts)]                      // deduplicate

    // check for any post authors w/o author pages
    var missingTeams = allTeamsFromPosts.filter(a => !allTeamsFromPages.includes(a))

    if (missingTeams.length) {
        const chalk = require('chalk');
        var files = missingTeams.map(a => `./src/teams/${a}.md`);
        console.warn(chalk.yellow(`Missing team pages for:\n* ${missingTeams.join("\n* ")}\n`));
        console.warn(chalk.yellow(`To fix, create the following files:\n${files.join("\n")}\n`));
    }

}