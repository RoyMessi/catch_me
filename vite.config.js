// https://vitejs.dev/config/
// https://vitejs.dev/guide/build.html

import { defineConfig } from "vite";
import path from "path";
import { ViteMinifyPlugin } from "vite-plugin-minify";

export default defineConfig({
  base: "./",
  publicDir: "./public",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [ViteMinifyPlugin({})],
});
