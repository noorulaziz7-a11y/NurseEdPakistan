import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath, URL } from "node:url"; // <-- ADDED THIS IMPORT

/**
 * Vite config for a client folder inside a monorepo/project root.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    // ✅ UPDATED to use the modern ESM-compatible syntax
    alias: {
      "@": fileURLToPath(new URL("./client/src", import.meta.url)),
      "@shared": fileURLToPath(new URL("./shared", import.meta.url)),
      "@assets": fileURLToPath(new URL("./attached_assets", import.meta.url)),
    },
  },
  // the client app lives in /client
  root: path.resolve(fileURLToPath(new URL(".", import.meta.url)), "client"),
  build: {
    // final client files go to dist/public so your server can serve dist
    outDir: path.resolve(fileURLToPath(new URL(".", import.meta.url)), "dist", "public"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    exclude: [
      "pg",
      "drizzle-orm",
      "@neondatabase/serverless",
      "ws",
    ],
  },
});