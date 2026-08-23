import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let registered = false;
async function init() {
  if (!registered) {
    await registerRoutes({} as any, app);
    registered = true;
  }
}

export default async function handler(req: any, res: any) {
  await init();
  app(req, res);
}
