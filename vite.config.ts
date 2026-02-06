import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// ✅ ESM-safe __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "client"),
  resolve: {
    alias: [
      { find: /^@\/app/, replacement: path.resolve(__dirname, "client/src/app") },
      { find: /^@\/modules/, replacement: path.resolve(__dirname, "client/src/modules") },
      { find: /^@\/shared/, replacement: path.resolve(__dirname, "client/src/shared") },
      { find: "@", replacement: path.resolve(__dirname, "client/src") },
      { find: "@shared", replacement: path.resolve(__dirname, "shared") },
      { find: "@assets", replacement: path.resolve(__dirname, "attached_assets") },
    ],
  },
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
    fs: { strict: false },
  },
  appType: "spa",
});
