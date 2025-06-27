/**
 * Utility functions for password validation and login attempts management
 */

/**
 * Validates password complexity
 * Requirements:
 * - At least 8 characters long
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * - Contains at least one special character
 *
 * @param password The password to validate
 * @returns An object with isValid flag and error message if invalid
 */
export function validatePasswordComplexity(password: string): { isValid: boolean; message?: string } {
    if (password.length < 8) {
        return {isValid: false, message: 'Password must be at least 8 characters long'};
    }

    if (!/[A-Z]/.test(password)) {
        return {isValid: false, message: 'Password must contain at least one uppercase letter'};
    }

    if (!/[a-z]/.test(password)) {
        return {isValid: false, message: 'Password must contain at least one lowercase letter'};
    }

    if (!/[0-9]/.test(password)) {
        return {isValid: false, message: 'Password must contain at least one number'};
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return {isValid: false, message: 'Password must contain at least one special character'};
    }

    return {isValid: true};
}

// In-memory storage for login attempts
// In a production environment, this should be stored in a database
const loginAttempts: Record<string, { count: number; lastAttempt: number }> = {};

/**
 * Maximum number of allowed login attempts
 */
const MAX_LOGIN_ATTEMPTS = 3;

/**
 * Time window in milliseconds after which login attempts are reset (30 minutes)
 */
export const LOGIN_ATTEMPT_WINDOW = 30 * 60 * 1000;

/**
 * Records a failed login attempt for a user
 * @param email User's email
 * @returns The number of remaining attempts
 */
export function recordFailedLoginAttempt(email: string): number {
    const now = Date.now();

    // Initialize or reset if outside the time window
    if (!loginAttempts[email] || (now - loginAttempts[email].lastAttempt) > LOGIN_ATTEMPT_WINDOW) {
        loginAttempts[email] = {count: 1, lastAttempt: now};
        return MAX_LOGIN_ATTEMPTS - 1;
    }

    // Increment attempt count
    loginAttempts[email].count += 1;
    loginAttempts[email].lastAttempt = now;

    return MAX_LOGIN_ATTEMPTS - loginAttempts[email].count;
}

/**
 * Checks if a user has exceeded the maximum number of login attempts
 * @param email User's email
 * @returns True if the user has exceeded the maximum number of attempts
 */
export function hasExceededLoginAttempts(email: string): boolean {
    const now = Date.now();

    // If no attempts recorded or outside time window, user hasn't exceeded
    if (!loginAttempts[email] || (now - loginAttempts[email].lastAttempt) > LOGIN_ATTEMPT_WINDOW) {
        return false;
    }

    return loginAttempts[email].count >= MAX_LOGIN_ATTEMPTS;
}

/**
 * Resets login attempts for a user
 * @param email User's email
 */
export function resetLoginAttempts(email: string): void {
    delete loginAttempts[email];
}
