import type { Express, Request, Response } from "express";

const staticRoutes = [
  "/",
  "/about-us",
  "/colleges",
  "/news",
  "/study-library",
  "/contact",
  "/blog",
  "/exam-prep",
  "/exam-prep/dashboard",
  "/exam-prep/leaderboard",
  "/exam-prep/daily-challenge",
  "/exam-prep/analytics",
  "/exam-prep/ielts",
  "/exam-prep/ielts/listening",
  "/exam-prep/ielts/reading",
  "/exam-prep/ielts/writing",
  "/exam-prep/ielts/speaking",
];

function getSiteUrl(req: Request) {
  return process.env.SITE_URL || `${req.protocol}://${req.get("host")}`;
}

export function registerSeoRoutes(app: Express) {
  app.get("/robots.txt", (req: Request, res: Response) => {
    const siteUrl = getSiteUrl(req);
    res.type("text/plain");
    res.send(`User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
  });

  app.get("/sitemap.xml", (req: Request, res: Response) => {
    const siteUrl = getSiteUrl(req);
    const urls = staticRoutes
      .map((path) => {
        return `<url><loc>${siteUrl}${path}</loc></url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

    res.type("application/xml");
    res.send(xml);
  });
}
