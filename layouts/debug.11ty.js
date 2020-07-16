module.exports = function(data) {
    var stringify = JSON.safeStringify(data)
    return `<pre><code>${stringify}</code></pre>`;
};

// https://stackoverflow.com/a/11616993/1366033
JSON.safeStringify = (obj, indent = 2) => {
  let cache = [];
  const retVal = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : value,
    indent
  );
  cache = null;
  return retVal;
};