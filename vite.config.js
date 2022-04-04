import { join } from "path";
import { readFileSync } from "fs";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import dynamicImport from "vite-plugin-dynamic-import";
import packageConfig from "./package.json";

export default function ({ mode }) {
  const test = mode == "test";
  const production = mode == "production";
  const development = mode == "development";

  const config = {
    root: join(__dirname, "src"),
    base: test ? "/test/" : process.env.BASE_URL || "/",
    publicDir: join(__dirname, "public"),
    define: Object.fromEntries(
      ["name", "version", "homepage", "bugs"].map((key) => {
        return [`process.env.PACKAGE_${key.toUpperCase()}`, JSON.stringify(packageConfig[key])];
      })
    ),
    resolve: {
      extensions: [".js", ".svelte"],
      alias: {
        "@": join(__dirname, "src"),
      },
    },
    build: {
      outDir: join(__dirname, "build"),
      emptyOutDir: true,
      sourcemap: true,
      minify: production,
      chunkSizeWarningLimit: 1024,
    },
    css: {
      devSourcemap: true,
    },
    plugins: [svelte(), dynamicImport()],
    clearScreen: false,
  };

  if (development) {
    config.server = {
      host: "0.0.0.0",
      port: 8000,
      https: {
        key: readFileSync(join(__dirname, "localhost-key.pem")),
        cert: readFileSync(join(__dirname, "localhost-cert.pem")),
      },
    };
  }

  return config;
}
