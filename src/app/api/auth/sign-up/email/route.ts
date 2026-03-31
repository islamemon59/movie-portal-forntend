import { NextRequest, NextResponse } from "next/server";
import { getDatabase, hashPassword, generateUserId, generateSessionId } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = getDatabase();
    
    // Check if email already exists
    const existingUser = db.prepare("SELECT id FROM user WHERE email = ?").get(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Create user
    const userId = generateUserId();
    const hashedPassword = hashPassword(password);
    const now = Date.now();

    db.prepare(`
      INSERT INTO user (id, email, name, password, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, email, name, hashedPassword, now, now);

    // Create session
    const sessionId = generateSessionId();
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

    db.prepare(`
      INSERT INTO session (id, userId, expiresAt, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(sessionId, userId, expiresAt, now, now);

    return NextResponse.json(
      {
        data: {
          user: { id: userId, email, name },
          session: { id: sessionId },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Signup failed" },
      { status: 500 }
    );
  }
}
