import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { validateCsrfToken, extractCsrfTokenFromCookie } from '@/lib/csrf';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');
    const enrollmentId = searchParams.get('id');
    
    // If a specific enrollment ID is requested
    if (enrollmentId) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          id: parseInt(enrollmentId)
        },
        include: {
          course: true,
          user: {
            select: {
              id: true,
              username: true,
              firstname: true,
              lastname: true,
              email: true,
            }
          }
        }
      });
      
      if (!enrollment) {
        return NextResponse.json(
          { message: 'Enrollment not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(enrollment);
    }
    
    // Build the query with proper types
    const query = {
      include: {
        course: true,
        user: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true,
          }
        }
      },
      where: {}
    };
    
    // Add filters if provided
    if (userId) {
      query.where = { ...query.where, userId };
    }
    
    if (courseId) {
      query.where = { ...query.where, courseId: parseInt(courseId) };
    }
    
    const enrollments = await prisma.enrollment.findMany(query);
    
    return NextResponse.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { message: 'Failed to fetch enrollments', error: String(error) },
      { status: 500 }
    );
  }
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
    const requiredFields = ['userId', 'courseId'];
    for (const field of requiredFields) {
      if (!responseData[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Check if the enrollment already exists
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: responseData.userId,
        courseId: responseData.courseId,
      }
    });
    
    if (existingEnrollment) {
      return NextResponse.json(
        { message: 'You are already enrolled in this course' },
        { status: 400 }
      );
    }
    
    // Create new enrollment
    const newEnrollment = await prisma.enrollment.create({
      data: {
        userId: responseData.userId,
        courseId: responseData.courseId,
        status: 'booked',
      },
      include: {
        course: true,
        user: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json(newEnrollment, { status: 201 });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { message: 'Failed to create enrollment', error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const enrollmentId = searchParams.get('id');
    
    // Get the CSRF token from the request header
    const csrfToken = request.headers.get('X-CSRF-Token');
    const cookieHeader = request.headers.get('cookie') || '';
    const storedCsrfToken = extractCsrfTokenFromCookie(cookieHeader);
    
    // Validate CSRF token
    if (!csrfToken || !storedCsrfToken || !validateCsrfToken(csrfToken, storedCsrfToken)) {
      return NextResponse.json(
        { message: 'Invalid request' },
        { status: 403 }
      );
    }
    
    // Validate enrollment ID
    if (!enrollmentId) {
      return NextResponse.json(
        { message: 'Enrollment ID is required' },
        { status: 400 }
      );
    }
    
    // Check if enrollment exists
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        id: parseInt(enrollmentId)
      }
    });
    
    if (!enrollment) {
      return NextResponse.json(
        { message: 'Enrollment not found' },
        { status: 404 }
      );
    }
    
    // Delete the enrollment
    await prisma.enrollment.delete({
      where: {
        id: parseInt(enrollmentId)
      }
    });
    
    return NextResponse.json(
      { message: 'Enrollment cancelled successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cancelling enrollment:', error);
    return NextResponse.json(
      { message: 'Failed to cancel enrollment', error: String(error) },
      { status: 500 }
    );
  }
}
