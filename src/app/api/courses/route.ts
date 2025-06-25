import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { validateCsrfToken, extractCsrfTokenFromCookie } from '@/lib/csrf';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trainerId = searchParams.get('trainerId');
    const courseId = searchParams.get('id');
    
    // If a specific course ID is requested
    if (courseId) {
      const course = await prisma.course.findUnique({
        where: {
          id: parseInt(courseId)
        },
        include: {
          trainer: {
            select: {
              id: true,
              username: true,
              firstname: true,
              lastname: true,
            }
          },
          enrollments: {
            include: {
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
          }
        }
      });
      
      if (!course) {
        return NextResponse.json(
          { message: 'Course not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(course);
    }
    
    // Otherwise, return a list of courses
    // Build the query with proper types
    const query = {
      include: {
        trainer: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
          }
        }
      },
      orderBy: {
        date: 'asc' as const // Type assertion to 'asc' literal
      },
      where: trainerId ? { trainerId } : undefined
    };
    
    const courses = await prisma.course.findMany(query);
    
    // Always return a 200 status code with the courses array (even if empty)
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { message: 'Failed to fetch courses', error: String(error) },
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
    const requiredFields = ['title', 'description', 'date', 'icon', 'trainerId'];
    for (const field of requiredFields) {
      if (!responseData[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Create new course
    const newCourse = await prisma.course.create({
      data: {
        title: responseData.title,
        description: responseData.description,
        date: new Date(responseData.date),
        icon: responseData.icon,
        trainerId: responseData.trainerId,
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { message: 'Failed to create course' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('id');
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
    
    // Validate course ID
    if (!courseId) {
      return NextResponse.json(
        { message: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: {
        id: parseInt(courseId)
      }
    });
    
    if (!existingCourse) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'icon'];
    for (const field of requiredFields) {
      if (!responseData[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Update the course
    const updatedCourse = await prisma.course.update({
      where: {
        id: parseInt(courseId)
      },
      data: {
        title: responseData.title,
        description: responseData.description,
        date: new Date(responseData.date),
        icon: responseData.icon,
      },
      include: {
        trainer: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
          }
        },
        enrollments: {
          include: {
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
        }
      }
    });
    
    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { message: 'Failed to update course', error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('id');
    
    // Get the CSRF token from the cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const storedCsrfToken = extractCsrfTokenFromCookie(cookieHeader);
    
    // Validate CSRF token from the request header
    const csrfToken = request.headers.get('X-CSRF-Token');
    if (!csrfToken || !storedCsrfToken || !validateCsrfToken(csrfToken, storedCsrfToken)) {
      return NextResponse.json(
        { message: 'Invalid request' },
        { status: 403 }
      );
    }
    
    // Validate course ID
    if (!courseId) {
      return NextResponse.json(
        { message: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(courseId)
      }
    });
    
    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Delete all enrollments for this course first
    await prisma.enrollment.deleteMany({
      where: {
        courseId: parseInt(courseId)
      }
    });
    
    // Delete the course
    await prisma.course.delete({
      where: {
        id: parseInt(courseId)
      }
    });
    
    return NextResponse.json(
      { message: 'Course deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { message: 'Failed to delete course', error: String(error) },
      { status: 500 }
    );
  }
}
