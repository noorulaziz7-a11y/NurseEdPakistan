import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vite config for a client folder inside a monorepo/project root.
 * - root: client directory
 * - build.outDir: dist/public (so server can serve dist/*)
 * - aliases: mirror these in tsconfig.json "paths"
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  // the client app lives in /client
  root: path.resolve(__dirname, "client"),
  build: {
    // final client files go to dist/public so your server can serve dist
    outDir: path.resolve(__dirname, "dist", "public"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: true,
    // Uncomment and set correct backend port to enable API proxying during dev.
    // Useful if your Express server runs on localhost:4000 (example).
    /*
    proxy: {
      // proxies /api/* to the backend server during development
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
    */
  },
  // exclude server-only/node-native packages from dependency pre-bundling
  optimizeDeps: {
    exclude: [
      // add packages that belong to server-side code only, e.g. DB drivers, ORMs
      "pg",
      "drizzle-orm",
      "@neondatabase/serverless",
      "ws"
    ],
  },
});
