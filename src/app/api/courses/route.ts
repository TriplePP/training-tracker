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
    // Build the query
    const query: any = {
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
        date: 'asc' // Order by date ascending
      }
    };
    
    // Add trainerId filter if provided
    if (trainerId) {
      query.where = {
        trainerId: parseInt(trainerId)
      };
    }
    
    const courses = await prisma.course.findMany(query);
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { message: 'Failed to fetch courses' },
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
