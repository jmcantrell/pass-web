const fs = require("fs");
const path = require("path");
const { DefinePlugin, EnvironmentPlugin } = require("webpack");
const HtmlPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin: CleanPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CssPlugin = require("mini-css-extract-plugin");
const svelteConfig = require("./svelte.config.js");
const packageConfig = require("./package.json");

const mode = process.env.NODE_ENV || "development";
const baseUrl = process.env.BASE_URL || "/";

const srcDir = path.resolve(__dirname, "src");

const filename = "[name].[contenthash]";

const config = {
  mode,

  entry: path.resolve(srcDir, "index.js"),

  output: {
    path: path.resolve(__dirname, "build"),
    filename: `${filename}.js`,
    publicPath: baseUrl
  },

  devtool: "source-map",

  plugins: [
    new CleanPlugin(),
    new HtmlPlugin({
      template: path.resolve(srcDir, "index.html")
    }),
    new CssPlugin({
      filename: `${filename}.css`
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "**/*",
          context: path.resolve(__dirname, "public")
        }
      ]
    }),
    new DefinePlugin({
      "process.env.BASE_URL": JSON.stringify(baseUrl),
      ...Object.fromEntries(
        ["name", "version", "homepage", "bugs"].map((key) => {
          return [`process.env.PACKAGE_${key.toUpperCase()}`, JSON.stringify(packageConfig[key])];
        })
      )
    })
  ],

  resolve: {
    extensions: [".mjs", ".js", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },

  module: {
    rules: [
      {
        test: /\.(m?js|svelte)$/,
        resolve: { fullySpecified: false },
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            ignore: [/node_modules/],
            presets: [
              [
                "@babel/preset-env",
                {
                  debug: !!process.env.DEBUG,
                  browserslistEnv: mode,
                  useBuiltIns: "usage",
                  corejs: 3
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: { dev: mode === "development", ...svelteConfig }
        }
      },
      {
        test: /\.css$/i,
        use: [CssPlugin.loader, "css-loader", "postcss-loader"]
      }
    ]
  },

  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /\/node_modules\//,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  }
};

if (mode == "development") {
  config.devServer = {
    host: "0.0.0.0",
    port: +process.env.FRONTEND_SERVER_PORT || 8000,
    static: false,
    historyApiFallback: true,
    server: {
      type: "https",
      options: {
        key: fs.readFileSync("localhost-key.pem"),
        cert: fs.readFileSync("localhost-cert.pem")
      }
    }
  };
}

module.exports = config;
