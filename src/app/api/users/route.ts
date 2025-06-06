import { NextResponse } from 'next/server';
import {prisma} from "@/lib/prisma";

export async function GET() {
    console.log('success');
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
}

export async function POST(request: Request) {
    const responseData = await request.json();
    const newUser = await prisma.user.create({
        data: {
            username: responseData.username,
            email: responseData.email,
            password: responseData.password,
            firstname: responseData.firstname,
            lastname: responseData.lastname,
            role: responseData.role || "student"
        },
    });

    return NextResponse.json(newUser, { status: 201 });
}
