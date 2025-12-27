/**
 * AuthService - Simple password-based authentication with username and PIN
 */

export class AuthService {
  private static readonly AUTH_KEY = 'productivity-app-auth';
  private static readonly SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

  // User credentials (hashed)
  private static readonly USERNAME = 'drewdrew';
  private static readonly PASSWORD_HASH = 'cb889b53cbfc29a1a9b558039cbc2b84dd60fb32491ea0050123907376b4f73f'; // Canley99!!
  private static readonly PIN_HASH = 'a268777d1ba1e6b8abcb4ca845ab7de17421dcd6bbad6e54877a82dd44234870'; // 13031996

  static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async login(username: string, password: string, pin: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    const pinHash = await this.hashPassword(pin);
    
    if (username === this.USERNAME && passwordHash === this.PASSWORD_HASH && pinHash === this.PIN_HASH) {
      const session = {
        authenticated: true,
        timestamp: Date.now(),
        username: username
      };
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  }

  static isAuthenticated(): boolean {
    try {
      const sessionStr = localStorage.getItem(this.AUTH_KEY);
      if (!sessionStr) return false;

      const session = JSON.parse(sessionStr);
      const now = Date.now();
      
      // Check if session is still valid (within 7 days)
      if (session.authenticated && (now - session.timestamp) < this.SESSION_DURATION) {
        return true;
      }
      
      // Session expired
      this.logout();
      return false;
    } catch {
      return false;
    }
  }

  static logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
  }

  static extendSession(): void {
    if (this.isAuthenticated()) {
      const sessionStr = localStorage.getItem(this.AUTH_KEY);
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        session.timestamp = Date.now();
        localStorage.setItem(this.AUTH_KEY, JSON.stringify(session));
      }
    }
  }

  static getUsername(): string {
    try {
      const sessionStr = localStorage.getItem(this.AUTH_KEY);
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        return session.username || 'User';
      }
    } catch {
      return 'User';
    }
    return 'User';
  }
}
