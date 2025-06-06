import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { validateCsrfToken, extractCsrfTokenFromCookie } from '@/lib/csrf';

export async function POST(request: Request) {
  const { email, password, csrfToken } = await request.json();
  
  // Get the CSRF token from the cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const storedCsrfToken = extractCsrfTokenFromCookie(cookieHeader);
  
  // Validate CSRF token
  if (!csrfToken || !storedCsrfToken || !validateCsrfToken(csrfToken, storedCsrfToken)) {
    return NextResponse.json(
      { message: 'Invalid request' },
      { status: 403 }
    );
  }
  
  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and password are required' },
      { status: 400 }
    );
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password. If you don\'t have an account, please sign up.' },
        { status: 401 }
      );
    }
    
    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password. If you don\'t have an account, please sign up.' },
        { status: 401 }
      );
    }
    
    // Create a session cookie (basic implementation)
    // In a real app, you would use a more secure approach with JWT or NextAuth.js
    const sessionId = uuidv4();
    
    // Set a cookie in the response
    const response = NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
    
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
