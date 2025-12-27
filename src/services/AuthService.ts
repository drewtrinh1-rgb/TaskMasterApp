/**
 * AuthService - Simple password-based authentication with username and PIN
 */

export class AuthService {
  private static readonly AUTH_KEY = 'productivity-app-auth';
  private static readonly LOCKOUT_KEY = 'productivity-app-lockout';
  private static readonly SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

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

  static isLockedOut(): { locked: boolean; remainingTime?: number } {
    try {
      const lockoutStr = localStorage.getItem(this.LOCKOUT_KEY);
      if (!lockoutStr) return { locked: false };

      const lockout = JSON.parse(lockoutStr);
      const now = Date.now();
      const timeSinceLockout = now - lockout.timestamp;

      if (timeSinceLockout < this.LOCKOUT_DURATION) {
        const remainingTime = this.LOCKOUT_DURATION - timeSinceLockout;
        return { locked: true, remainingTime };
      }

      // Lockout expired, clear it
      localStorage.removeItem(this.LOCKOUT_KEY);
      return { locked: false };
    } catch {
      return { locked: false };
    }
  }

  static recordFailedAttempt(): void {
    try {
      const lockoutStr = localStorage.getItem(this.LOCKOUT_KEY);
      let lockout = lockoutStr ? JSON.parse(lockoutStr) : { attempts: 0, timestamp: Date.now() };

      lockout.attempts += 1;

      if (lockout.attempts >= this.MAX_ATTEMPTS) {
        lockout.timestamp = Date.now();
        lockout.locked = true;
      }

      localStorage.setItem(this.LOCKOUT_KEY, JSON.stringify(lockout));
    } catch {
      // Fail silently
    }
  }

  static resetFailedAttempts(): void {
    localStorage.removeItem(this.LOCKOUT_KEY);
  }

  static getRemainingAttempts(): number {
    try {
      const lockoutStr = localStorage.getItem(this.LOCKOUT_KEY);
      if (!lockoutStr) return this.MAX_ATTEMPTS;

      const lockout = JSON.parse(lockoutStr);
      return Math.max(0, this.MAX_ATTEMPTS - (lockout.attempts || 0));
    } catch {
      return this.MAX_ATTEMPTS;
    }
  }

  static async login(username: string, password: string, pin: string): Promise<boolean> {
    // Check if locked out
    const lockoutStatus = this.isLockedOut();
    if (lockoutStatus.locked) {
      return false;
    }

    const passwordHash = await this.hashPassword(password);
    const pinHash = await this.hashPassword(pin);
    
    if (username === this.USERNAME && passwordHash === this.PASSWORD_HASH && pinHash === this.PIN_HASH) {
      const session = {
        authenticated: true,
        timestamp: Date.now(),
        username: username
      };
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(session));
      this.resetFailedAttempts(); // Clear failed attempts on successful login
      return true;
    }
    
    // Record failed attempt
    this.recordFailedAttempt();
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
