import { db } from "./db";
import { users, type User, type InsertUser } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: Pick<InsertUser, "username">): Promise<User>;
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

  async createUser(insertUser: Pick<InsertUser, "username">): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
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
    const [updatedUser] = await db
      .update(users)
      .set({ finalChoice: choice })
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
