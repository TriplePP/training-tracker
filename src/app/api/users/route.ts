import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcrypt';
import { validateCsrfToken, extractCsrfTokenFromCookie } from '@/lib/csrf';

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string: string): string {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export async function GET() {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
}

export async function POST(request: Request) {
    try {
        const responseData = await request.json();
        
        // Get the CSRF token from the cookie
        const cookieHeader = request.headers.get('cookie') || '';
        const storedCsrfToken = extractCsrfTokenFromCookie(cookieHeader);
        
        // Validate CSRF token
        if (!responseData.csrfToken || !storedCsrfToken || !validateCsrfToken(responseData.csrfToken, storedCsrfToken)) {
            return NextResponse.json(
                { message: 'Invalid request' },
                { status: 403 }
            );
        }
        
        // Validate required fields
        const requiredFields = ['username', 'email', 'password', 'firstname', 'lastname'];
        for (const field of requiredFields) {
            if (!responseData[field]) {
                return NextResponse.json(
                    { message: `${field} is required` },
                    { status: 400 }
                );
            }
        }
        
        // Check if user with email or username already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: responseData.email },
                    { username: responseData.username }
                ]
            }
        });
        
        if (existingUser) {
            if (existingUser.email === responseData.email) {
                return NextResponse.json(
                    { message: 'Email already in use' },
                    { status: 409 }
                );
            }
            if (existingUser.username === responseData.username) {
                return NextResponse.json(
                    { message: 'Username already taken' },
                    { status: 409 }
                );
            }
        }
        
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(responseData.password, saltRounds);
        
        // Capitalize first letter of first name and last name
        const capitalizedFirstname = capitalizeFirstLetter(responseData.firstname);
        const capitalizedLastname = capitalizeFirstLetter(responseData.lastname);
        
        // Create new user with hashed password and capitalized names
        const newUser = await prisma.user.create({
            data: {
                username: responseData.username,
                email: responseData.email,
                password: hashedPassword,
                firstname: capitalizedFirstname,
                lastname: capitalizedLastname,
                role: responseData.role || "student"
            },
        });

        // Return user without password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = newUser;
        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { message: 'Failed to create user' },
            { status: 500 }
        );
    }
}
