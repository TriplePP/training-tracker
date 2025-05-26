import { NextResponse } from 'next/server';
import {prisma} from "@/lib/prisma";

export async function GET() {
    console.log('success');
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
}

export async function POST(request: Request) {
    const data = await request.json();
    const newUser = await prisma.user.create({
        data: {
            username: data.username,
            email: data.email,
            password: data.password
        },
    });

    return NextResponse.json(newUser, { status: 201 });
}
