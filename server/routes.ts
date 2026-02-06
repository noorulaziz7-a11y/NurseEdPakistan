import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modulesDir = path.join(__dirname, "modules");

async function loadModuleRouters() {
  const entries = await fs.readdir(modulesDir, { withFileTypes: true });
  const routers: express.Router[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const modulePath = `./modules/${entry.name}/routes`;
    try {
      const imported = await import(modulePath);
      if (imported?.default) {
        routers.push(imported.default);
      }
    } catch (error) {
      console.warn(`Skipping module routes for ${entry.name}:`, error);
    }
  }

  return routers;
}

export async function registerRoutes(app: express.Express) {
  const router = express.Router();
  const routers = await loadModuleRouters();

  routers.forEach((moduleRouter) => {
    router.use(moduleRouter);
  });

  // Versioned API (preferred) + legacy path for backward compatibility
  app.use("/api/v1", router);
  app.use("/api", router);

  return router;
}
