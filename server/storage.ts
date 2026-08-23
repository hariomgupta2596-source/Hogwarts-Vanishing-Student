import { db } from "./db.js";
import { users, type User, type InsertUser } from "../shared/schema.js";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: Pick<InsertUser, "username" | "password" | "house">): Promise<User>;
  updateUserProgress(id: number, scoreAdded: number, gameCompleted: number): Promise<User | undefined>;
  makeFinalChoice(id: number, choice: "seal" | "expose" | "erase"): Promise<User | undefined>;
  getLeaderboard(): Promise<User[]>;
  updateCustomization(id: number, item: string): Promise<User | undefined>;
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
    
    const rewards: Record<number, string> = {
      1: "Apprentice Robes",
      2: "Investigator's Cloak",
      3: "Senior Inquisitor's Mantle",
      4: "Master of Mysteries Raiment"
    };

    const [updatedUser] = await db
      .update(users)
      .set({ 
        score: user.score + scoreAdded,
        completedGames: newCompletedGames,
        unlockedItems: sql`array_append(unlocked_items, ${rewards[gameCompleted]})`
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

  
    async updateCustomization(id: number, item: string): Promise<User | undefined> {
      const [updatedUser] = await db
        .update(users)
        .set({ equippedItem: item })
        .where(eq(users.id, id))
        .returning();
      return updatedUser;
    }
  
  async getLeaderboard(): Promise<User[]> {
    // Top 50 users by score
    return await db.select().from(users).orderBy(desc(users.score)).limit(50);
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: Pick<InsertUser, "username" | "password" | "house">): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password ?? "Mistry@2537",
      house: insertUser.house ?? "gryffindor",
      score: 0,
      completedGames: 0,
      startTime: new Date(),
      finalChoice: null,
      unlockedItems: [],
      equippedItem: "Standard Robes",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserProgress(id: number, scoreAdded: number, gameCompleted: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const newCompletedGames = Math.max(user.completedGames, gameCompleted);
    const rewards: Record<number, string> = {
      1: "Apprentice Robes",
      2: "Investigator's Cloak",
      3: "Senior Inquisitor's Mantle",
      4: "Master of Mysteries Raiment"
    };

    const newUnlocked = [...user.unlockedItems];
    if (rewards[gameCompleted] && !newUnlocked.includes(rewards[gameCompleted])) {
      newUnlocked.push(rewards[gameCompleted]);
    }

    const updatedUser: User = {
      ...user,
      score: user.score + scoreAdded,
      completedGames: newCompletedGames,
      unlockedItems: newUnlocked,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async makeFinalChoice(id: number, choice: "seal" | "expose" | "erase"): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    let finalScore = user.score;
    if (user.startTime) {
      const elapsedMs = new Date().getTime() - new Date(user.startTime).getTime();
      const thirtyMinsMs = 30 * 60 * 1000;
      if (elapsedMs < thirtyMinsMs) {
        const remainingMins = (thirtyMinsMs - elapsedMs) / (60 * 1000);
        finalScore += Math.floor(remainingMins * 10);
      }
    }

    const choiceBonuses = {
      seal: 50,
      expose: 100,
      erase: 75
    };
    finalScore += choiceBonuses[choice];

    const updatedUser: User = {
      ...user,
      finalChoice: choice,
      score: finalScore,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateCustomization(id: number, item: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      equippedItem: item,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getLeaderboard(): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
  }
}

export class SafeStorage implements IStorage {
  private dbStorage?: DatabaseStorage;
  private memStorage: MemStorage;

  constructor() {
    this.memStorage = new MemStorage();
    if (process.env.DATABASE_URL) {
      try {
        this.dbStorage = new DatabaseStorage();
      } catch (e) {
        console.error("Failed to initialize DatabaseStorage, using MemStorage:", e);
      }
    }
  }

  private async execute<T>(
    dbFn: (s: DatabaseStorage) => Promise<T>,
    memFn: (s: MemStorage) => Promise<T>
  ): Promise<T> {
    if (this.dbStorage) {
      try {
        return await dbFn(this.dbStorage);
      } catch (err) {
        console.error("Database storage query error, falling back to MemStorage:", err);
      }
    }
    return await memFn(this.memStorage);
  }

  async getUser(id: number) {
    return this.execute(s => s.getUser(id), s => s.getUser(id));
  }

  async getUserByUsername(username: string) {
    return this.execute(s => s.getUserByUsername(username), s => s.getUserByUsername(username));
  }

  async createUser(user: Pick<InsertUser, "username" | "password" | "house">) {
    return this.execute(s => s.createUser(user), s => s.createUser(user));
  }

  async updateUserProgress(id: number, scoreAdded: number, gameCompleted: number) {
    return this.execute(s => s.updateUserProgress(id, scoreAdded, gameCompleted), s => s.updateUserProgress(id, scoreAdded, gameCompleted));
  }

  async makeFinalChoice(id: number, choice: "seal" | "expose" | "erase") {
    return this.execute(s => s.makeFinalChoice(id, choice), s => s.makeFinalChoice(id, choice));
  }

  async getLeaderboard() {
    return this.execute(s => s.getLeaderboard(), s => s.getLeaderboard());
  }

  async updateCustomization(id: number, item: string) {
    return this.execute(s => s.updateCustomization(id, item), s => s.updateCustomization(id, item));
  }
}

export const storage = new SafeStorage();


