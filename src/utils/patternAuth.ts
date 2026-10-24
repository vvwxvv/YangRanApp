// src/utils/PatternAuth.ts  (or .js if you use plain JS)
import { EXPECTED_PATTERN } from '@/utils/patternPassword'; // << single source of truth

export class PatternAuth {
  private static readonly STORAGE_KEY  = 'pattern_auth';
  private static readonly SESSION_KEY  = 'pattern_session';
  private static readonly SESSION_DURATION = 30 * 60 * 1000; // 30 min

  /* --------------  pattern  -------------- */
  static savePattern(pattern: number[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pattern));
    console.log('Pattern saved:', pattern);
  }

  static getPattern(): number[] | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as number[];
      console.log('Retrieved pattern from LS:', p);
      return p;
    }
    // nothing in localStorage → use the constant file
    console.log('No stored pattern, using constant:', EXPECTED_PATTERN);
    return EXPECTED_PATTERN;
  }

  static validatePattern(input: number[]): boolean {
    const saved = this.getPattern();
    if (!saved) return false; // should never happen now
    const ok = JSON.stringify(saved) === JSON.stringify(input);
    console.log('Validating. Saved:', saved, 'Input:', input, 'Valid:', ok);
    if (ok) this.setSession();
    return ok;
  }

  static clearPattern(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('Pattern cleared from LS');
  }

  static generateSecurePattern(length = 6): number[] {
    const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, length);
  }

  /* --------------  session  -------------- */
  static setSession(): void {
    if (typeof window === 'undefined') return;
    const exp = Date.now() + this.SESSION_DURATION;
    localStorage.setItem(this.SESSION_KEY, String(exp));
    console.log('Session set, expires:', new Date(exp).toLocaleString());
  }

  static isSessionValid(): boolean {
    if (typeof window === 'undefined') return false;
    const exp = Number(localStorage.getItem(this.SESSION_KEY) || '0');
    const ok = Date.now() < exp;
    console.log('Session valid:', ok, 'Expiry:', new Date(exp).toLocaleString());
    return ok;
  }

  static clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.SESSION_KEY);
    console.log('Session cleared');
  }

  static getSessionTimeRemaining(): number {
    if (typeof window === 'undefined') return 0;
    const exp = Number(localStorage.getItem(this.SESSION_KEY) || '0');
    return Math.max(0, exp - Date.now());
  }

  static getSessionExpiry(): number | null {
    if (typeof window === 'undefined') return null;
    const exp = Number(localStorage.getItem(this.SESSION_KEY) || '0');
    return exp || null;
  }
}