const Terser = require("terser");


/**
 * Minify CSS source code
  *
 * @param {String} jsSource
 */
module.exports = function(jsSource) {
  let minified = Terser.minify(jsSource);
  if( minified.error ) {
      console.log("Terser error: ", minified.error);
      return jsSource;
  }

  return minified.code;
}