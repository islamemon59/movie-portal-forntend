import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie or header
    const authHeader = request.headers.get("authorization");
    const sessionId = authHeader?.replace("Bearer ", "");

    if (!sessionId) {
      return NextResponse.json(null, { status: 200 });
    }

    const db = getDatabase();
    
    // Find session
    const session = db.prepare(`
      SELECT s.*, u.id, u.email, u.name FROM session s
      LEFT JOIN user u ON s.userId = u.id
      WHERE s.id = ? AND s.expiresAt > ?
    `).get(sessionId, Date.now());

    if (!session) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(
      {
        user: {
          id: session.id,
          email: session.email,
          name: session.name,
          emailVerified: true,
          role: "USER",
        },
        session: {
          id: session.id,
          expiresAt: session.expiresAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get session error:", error);
    return NextResponse.json(null, { status: 200 });
  }
}
