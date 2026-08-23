import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// URL rewrite middleware for Vercel Serverless Function routing
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (!req.url.startsWith("/api")) {
    req.url = "/api" + (req.url.startsWith("/") ? "" : "/") + req.url;
  }
  next();
});

let registered = false;
async function init() {
  if (!registered) {
    await registerRoutes({} as any, app);

    // Global Error Handler to guarantee JSON responses (never HTML errors)
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
