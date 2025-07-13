import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/bot.ts"],
  format: "cjs", // Output CJS (discord.js won't work with ESM)
  minify: false, // No minification needed for CLI
  sourcemap: true,
  clean: true, // Clean output folder before build
  platform: "node",
  target: "esnext", // Target latest Node.js version
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version || "unknown"),
  },
});
