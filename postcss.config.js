const environment = process.env.NODE_ENV || "development";
const production = environment === "production";

const plugins = [
  require("postcss-normalize")(),
  require("postcss-preset-env")(),
  require("postcss-nested")()
];

if (production) {
  plugins.push(require("cssnano")());
}

module.exports = { plugins };
