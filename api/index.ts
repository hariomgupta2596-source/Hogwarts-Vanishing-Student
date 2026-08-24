import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Normalize request URL for Vercel Serverless Function environment
app.use((req: Request, _res: Response, next: NextFunction) => {
  let url = req.url || "/";
  if (!url.startsWith("/api")) {
    url = "/api" + (url.startsWith("/") ? "" : "/") + url;
  }
  req.url = url;
  next();
});

let registered = false;
async function init() {
  if (!registered) {
    await registerRoutes({} as any, app);

    // Explicit route fallbacks without /api prefix
    app.post("/users", (req, res, next) => { req.url = "/api/users"; app(req, res, next); });
    app.get("/users/check-username", (req, res, next) => { req.url = "/api/users/check-username" + (req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""); app(req, res, next); });
    app.post("/users/:id/progress", (req, res, next) => { req.url = `/api/users/${req.params.id}/progress`; app(req, res, next); });
    app.post("/users/:id/choice", (req, res, next) => { req.url = `/api/users/${req.params.id}/choice`; app(req, res, next); });
    app.post("/users/:id/customization", (req, res, next) => { req.url = `/api/users/${req.params.id}/customization`; app(req, res, next); });
    app.get("/leaderboard", (req, res, next) => { req.url = "/api/leaderboard"; app(req, res, next); });
    app.get("/leaderboard/houses", (req, res, next) => { req.url = "/api/leaderboard/houses"; app(req, res, next); });

    // Catch-all 404 handler for API routes (always return JSON)
    app.use((_req: Request, res: Response) => {
      res.status(404).json({ message: "API endpoint not found" });
    });

    // Global Error Handler for Vercel Serverless Function to ensure JSON output
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error("Vercel API Error:", err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      return res.status(status).json({ message });
    });

    registered = true;
  }
}

export default async function handler(req: any, res: any) {
  try {
    await init();
    app(req, res);
  } catch (err: any) {
    console.error("Vercel Handler Exception:", err);
    res.status(500).json({ message: err?.message || "Internal Server Error" });
  }
}
