const environment = process.env.NODE_ENV || "development";
const production = environment === "production";

const plugins = [require("postcss-normalize")(), require("postcss-preset-env")()];

if (production) {
	plugins.push(require("cssnano")());
}

module.exports = { plugins };
