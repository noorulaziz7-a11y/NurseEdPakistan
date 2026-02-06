import path from "path";
import { fileURLToPath } from "url";
import type { Express } from "express";
import express from "express";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDistPath = path.resolve(__dirname, "../dist/public");
const indexHtmlPath = path.resolve(clientDistPath, "index.html");

export function serveStatic(app: Express) {
  if (!fs.existsSync(clientDistPath)) {
    console.warn(
      "Static assets not found. Run `npm run build` before `npm start`."
    );
    return;
  }

  app.use(express.static(clientDistPath));

  app.get("*", (_req, res) => {
    if (fs.existsSync(indexHtmlPath)) {
      res.sendFile(indexHtmlPath);
    } else {
      res.status(404).send("index.html not found");
    }
  });
}
