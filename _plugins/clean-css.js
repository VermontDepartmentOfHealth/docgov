const CleanCSS = require("clean-css");


/**
 * Minify CSS source code
  *
 * @param {String} cssSource
 */
module.exports = function(cssSource) {
    let result = new CleanCSS({}).minify(cssSource).styles;
  
    return result;
  }