import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * We emit JS directly into the `extension/` tree to match manifest paths:
 *  - content/index.js
 *  - background/index.js
 *  - ui/options.js  (built from options.tsx)
 *
 * Overlay/floating button code is imported by content/index.ts and will be bundled.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "extension",
    emptyOutDir: false, // keep manifest, html, etc.
    sourcemap: false,
    rollupOptions: {
      input: {
        "content/index": path.resolve(__dirname, "extension/content/index.ts"),
        "background/index": path.resolve(
          __dirname,
          "extension/background/index.ts"
        ),
        "ui/options": path.resolve(__dirname, "extension/ui/options.tsx"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        // Keep nested folders (content/, background/, ui/)
        preserveModules: false,
      },
    },
    target: "es2022",
    minify: false,
  },
});
