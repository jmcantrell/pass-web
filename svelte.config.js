const sveltePreprocess = require("svelte-preprocess");
const postcssConfig = require("./postcss.config.js");

const preprocess = sveltePreprocess({
  postcss: postcssConfig,
  sourceMap: true,
  emitCss: true
});

module.exports = { preprocess };
