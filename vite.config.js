import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { svelte } from "@sveltejs/vite-plugin-svelte";

const baseUrl = process.env.BASE_URL || "/";
const projectDir = dirname(fileURLToPath(import.meta.url));
const packageConfig = JSON.parse(readFileSync(join(projectDir, "package.json")));

export default function ({ mode }) {
  const production = mode == "production";
  const development = mode == "development";

  const config = {
    base: baseUrl,
    root: join(projectDir, "src"),
    build: {
      outDir: join(projectDir, "build"),
      emptyOutDir: true,
      sourcemap: true,
      minify: production,
      chunkSizeWarningLimit: 1024
    },
    publicDir: join(projectDir, "public"),
    define: {
      "process.env.BASE_URL": JSON.stringify(baseUrl),
      ...Object.fromEntries(
        ["name", "version", "homepage", "bugs"].map((key) => {
          return [`process.env.PACKAGE_${key.toUpperCase()}`, JSON.stringify(packageConfig[key])];
        })
      )
    },
    resolve: {
      extensions: [".js", ".svelte"],
      alias: {
        "@": join(projectDir, "src")
      }
    },
    plugins: [svelte()],
    clearScreen: false
  };

  if (development) {
    config.server = {
      host: "0.0.0.0",
      port: 8000,
      https: {
        key: readFileSync(join(projectDir, "localhost-key.pem")),
        cert: readFileSync(join(projectDir, "localhost-cert.pem"))
      }
    };
  }

  return config;
}
