import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- Tables ---

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  score: integer("score").default(0).notNull(),
  completedGames: integer("completed_games").default(0).notNull(),
  password: text("password").notNull().default("Mistry@2537"),
  house: text("house").notNull().default("gryffindor"),
  startTime: timestamp("start_time").defaultNow(),
  finalChoice: text("final_choice"),
  unlockedItems: text("unlocked_items").array().default([]).notNull(),
  equippedItem: text("equipped_item").default("Standard Robes").notNull(), // 'seal', 'expose', 'erase'
  createdAt: timestamp("created_at").defaultNow(),
});

// --- Schemas ---

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// --- Types ---

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// API Contract Types

export type CreateUserRequest = Pick<InsertUser, "username">;
export type UpdateProgressRequest = {
  scoreAdded: number;
  gameCompleted: number; // 1, 2, 3, or 4
};
export type FinalChoiceRequest = {
  choice: "seal" | "expose" | "erase";
};

export type UserResponse = User;
export type LeaderboardResponse = Pick<User, "id" | "username" | "score" | "finalChoice">[];
