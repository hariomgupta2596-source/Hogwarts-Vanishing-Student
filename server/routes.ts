import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage.js";
import { api } from "../shared/routes.js";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // POST /api/users - Create or Get User
  app.post(api.users.createOrGet.path, async (req, res) => {
    try {
      const input = api.users.createOrGet.input.parse(req.body);
      
      let user = await storage.getUserByUsername(input.username);
      
      if (user) {
        if (user.password !== input.password) {
          return res.status(401).json({ message: "Invalid access cipher." });
        }
        // Return existing user only if they haven't finished the game
        if (user.finalChoice) {
          return res.status(403).json({ 
            message: "This investigator has already closed their file. Please choose a new identity." 
          });
        }
        return res.status(200).json(user);
      }
      
      // Create new user
      user = await storage.createUser({
        username: input.username,
        password: input.password,
        house: input.house,
      });
      return res.status(201).json(user);
      
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // POST /api/users/:id/progress - Update game progress
  app.post(api.users.updateProgress.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const input = api.users.updateProgress.input.parse(req.body);
      
      const updatedUser = await storage.updateUserProgress(id, input.scoreAdded, input.gameCompleted);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.status(200).json(updatedUser);
      
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // POST /api/users/:id/choice - Make final choice
  app.post(api.users.makeFinalChoice.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const input = api.users.makeFinalChoice.input.parse(req.body);
      
      const updatedUser = await storage.makeFinalChoice(id, input.choice);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.status(200).json(updatedUser);
      
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // POST /api/users/:id/customization - Update character customization
  app.post("/api/users/:id/customization", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { item } = req.body;
      const updatedUser = await storage.updateCustomization(id, item);
      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(updatedUser);
    } catch (err) {
      return res.status(500).json({ message: "Failed to update customization" });
    }
  });

  // GET /api/leaderboard - Get top players
  app.get(api.leaderboard.get.path, async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      
      // Map to the expected response type
      const response = leaderboard.map(u => ({
        id: u.id,
        username: u.username,
        score: u.score,
        finalChoice: u.finalChoice,
        equippedItem: u.equippedItem
      }));
      
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  return httpServer;
}
