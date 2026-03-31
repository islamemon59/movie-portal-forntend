import { NextRequest, NextResponse } from "next/server";
import { getDatabase, hashPassword, generateSessionId } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = getDatabase();
    
    // Find user
    const user = db.prepare("SELECT * FROM user WHERE email = ?").get(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session
    const sessionId = generateSessionId();
    const now = Date.now();
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

    db.prepare(`
      INSERT INTO session (id, userId, expiresAt, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(sessionId, user.id, expiresAt, now, now);

    return NextResponse.json(
      {
        data: {
          user: { id: user.id, email: user.email, name: user.name },
          session: { id: sessionId },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { error: "Sign in failed" },
      { status: 500 }
    );
  }
}
