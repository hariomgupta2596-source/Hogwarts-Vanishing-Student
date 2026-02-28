import { db } from "./db";
import { users, type User, type InsertUser } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: Pick<InsertUser, "username" | "password" | "house">): Promise<User>;
  updateUserProgress(id: number, scoreAdded: number, gameCompleted: number): Promise<User | undefined>;
  makeFinalChoice(id: number, choice: "seal" | "expose" | "erase"): Promise<User | undefined>;
  getLeaderboard(): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: Pick<InsertUser, "username" | "password" | "house">): Promise<User> {
    const [user] = await db.insert(users).values({ ...insertUser, startTime: new Date() }).returning();
    return user;
  }

  async updateUserProgress(id: number, scoreAdded: number, gameCompleted: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    // Ensure we don't count the same game multiple times or go above 4
    const newCompletedGames = Math.max(user.completedGames, gameCompleted);
    
    const [updatedUser] = await db
      .update(users)
      .set({ 
        score: user.score + scoreAdded,
        completedGames: newCompletedGames
      })
      .where(eq(users.id, id))
      .returning();
      
    return updatedUser;
  }

  async makeFinalChoice(id: number, choice: "seal" | "expose" | "erase"): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    let finalScore = user.score;
    
    // Time Bonus calculation
    if (user.startTime) {
      const elapsedMs = new Date().getTime() - new Date(user.startTime).getTime();
      const thirtyMinsMs = 30 * 60 * 1000;
      if (elapsedMs < thirtyMinsMs) {
        const remainingMins = (thirtyMinsMs - elapsedMs) / (60 * 1000);
        finalScore += Math.floor(remainingMins * 10); // 10 points per remaining minute
      }
    }

    // Final Choice Bonus
    const choiceBonuses = {
      seal: 50,
      expose: 100,
      erase: 75
    };
    finalScore += choiceBonuses[choice];

    const [updatedUser] = await db
      .update(users)
      .set({ 
        finalChoice: choice,
        score: finalScore 
      })
      .where(eq(users.id, id))
      .returning();
      
    return updatedUser;
  }

  async getLeaderboard(): Promise<User[]> {
    // Top 50 users by score
    return await db.select().from(users).orderBy(desc(users.score)).limit(50);
  }
}

export const storage = new DatabaseStorage();
