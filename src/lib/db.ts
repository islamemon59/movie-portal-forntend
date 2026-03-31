import BetterSqlite3 from "better-sqlite3";
import path from "path";
import crypto from "crypto";

const dbPath = path.join(process.cwd(), "auth.db");
let db: any;

export function initializeDatabase() {
  if (db) return db;
  
  db = new BetterSqlite3(dbPath);
  db.pragma("foreign_keys = ON");
  
  // Ensure tables exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password TEXT,
      emailVerified INTEGER DEFAULT 0,
      image TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS session (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      expiresAt INTEGER NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
    );
  `);
  
  return db;
}

export function getDatabase() {
  if (!db) {
    initializeDatabase();
  }
  return db;
}

// Hash password
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Generate session ID
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Generate user ID
export function generateUserId(): string {
  return "user_" + crypto.randomBytes(16).toString("hex");
}
