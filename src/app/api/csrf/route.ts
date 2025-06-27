import {NextResponse} from 'next/server';
import {generateCsrfToken} from '@/lib/csrf';

export async function GET() {
    try {
        // Generate a new CSRF token
        const csrfToken = generateCsrfToken();

        // Set the CSRF token as a cookie
        const response = NextResponse.json({csrfToken});

        // Set the cookie with the CSRF token
        response.cookies.set('csrf_token', csrfToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Error generating CSRF token:', error);
        return NextResponse.json(
            {message: 'Failed to generate CSRF token'},
            {status: 500}
        );
    }
}
