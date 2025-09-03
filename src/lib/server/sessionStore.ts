// Simple in-memory session store (for production, use Redis or database)
// This stores minimal session data instead of large JWTs in cookies

interface SessionData {
  userId: string;
  email: string;
  expiresAt: Date;
  userMetadata?: any;
}

class SessionStore {
  private sessions = new Map<string, SessionData>();
  private readonly SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

  generateSessionId(): string {
    return crypto.randomUUID();
  }

  createSession(userId: string, email: string, userMetadata?: any): string {
    const sessionId = this.generateSessionId();
    const expiresAt = new Date(Date.now() + this.SESSION_DURATION);
    
    this.sessions.set(sessionId, {
      userId,
      email,
      expiresAt,
      userMetadata
    });

    // Clean up expired sessions periodically
    this.cleanupExpiredSessions();
    
    return sessionId;
  }

  getSession(sessionId: string): SessionData | null {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return null;
    }

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  updateSession(sessionId: string, updates: Partial<SessionData>): boolean {
    const session = this.sessions.get(sessionId);
    
    if (!session || session.expiresAt < new Date()) {
      return false;
    }

    this.sessions.set(sessionId, { ...session, ...updates });
    return true;
  }

  deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  private cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(sessionId);
      }
    }
  }

  // Get session stats for debugging
  getStats() {
    return {
      activeSessions: this.sessions.size,
      sessions: Array.from(this.sessions.entries()).map(([id, data]) => ({
        id,
        userId: data.userId,
        email: data.email,
        expiresAt: data.expiresAt
      }))
    };
  }
}

export const sessionStore = new SessionStore();
