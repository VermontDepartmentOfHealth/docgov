const squash = require("./_filters/squash");

class SearchIndex {
    data() {
      return {
          // https://www.11ty.io/docs/languages/javascript/#permalinks
        permalink: "/search.json",
        eleventyExcludeFromCollections: true,
      };
    }
  
    render(data) {
        let search = data.collections.post.map(item => {
          return {
            url: item.url,
            title: item.data.title,
            text: squash(`${item.data.title} ${item.data.templateContent}`)
          }  
        })
        var stringify = JSON.stringify(search, null, 2)
        return stringify;
      }
  }
  
  module.exports = SearchIndex;