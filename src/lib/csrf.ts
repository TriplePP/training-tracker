import {v4 as uuidv4} from 'uuid';

// Client-side CSRF functions

/**
 * Generate a CSRF token using UUID v4
 * @returns A unique CSRF token
 */
export function generateCsrfToken(): string {
    const token = uuidv4();
    return token;
}

/**
 * Set a CSRF token in a cookie (client-side)
 * @param token The CSRF token to store
 * @param maxAge Cookie expiration time in seconds (default: 1 hour)
 */
export function setCsrfCookie(token: string, maxAge: number = 3600): void {
    try {
        if (typeof document !== 'undefined') {
            // Add secure flag in production
            const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
            document.cookie = `csrf_token=${token}; path=/; max-age=${maxAge}; SameSite=Strict${secure}`;
        }
    } catch (error) {
        console.error('Error setting CSRF cookie:', error);
    }
}

/**
 * Generate a CSRF token and store it in a cookie (client-side)
 * @param maxAge Cookie expiration time in seconds (default: 1 hour)
 * @returns The generated CSRF token
 */
export function generateAndSetCsrfToken(maxAge: number = 3600): string {
    try {
        const token = generateCsrfToken();
        setCsrfCookie(token, maxAge);
        return token;
    } catch (error) {
        console.error('Error generating and setting CSRF token:', error);
        // Return a fallback token in case of error
        return generateCsrfToken();
    }
}

/**
 * Extract CSRF token from cookie string
 * @param cookieHeader The cookie header string
 * @returns The CSRF token or empty string if not found
 */
export function extractCsrfTokenFromCookie(cookieHeader: string): string {
    try {
        const csrfCookie = cookieHeader.split(';').find(c => c.trim().startsWith('csrf_token='));
        return csrfCookie ? csrfCookie.split('=')[1] : '';
    } catch (error) {
        console.error('Error extracting CSRF token from cookie:', error);
        return '';
    }
}

/**
 * Verify that the provided token matches the one in the cookie
 * @param token The token to validate
 * @param storedToken The token stored in the cookie
 * @returns True if the tokens match, false otherwise
 */
export function validateCsrfToken(token: string, storedToken: string): boolean {
    try {
        if (!token || !storedToken) {
            console.error('CSRF validation failed: Missing token or stored token');
            return false;
        }
        return token === storedToken;
    } catch (error) {
        console.error('Error validating CSRF token:', error);
        return false;
    }
}
