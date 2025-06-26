import { NextResponse } from 'next/server';
import { GET } from '@/app/api/users/me/route';
import * as auth from '@/lib/auth';

// Mock the auth module
jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}));

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, options) => ({
      data,
      ...options,
    })),
  },
}));

describe('Users Me API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns user data when session exists', async () => {
    // Mock user data
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'student',
    };

    // Mock the getSession function to return a session with user
    (auth.getSession as jest.Mock).mockResolvedValue({
      user: mockUser,
    });

    // Call the API route handler
    const response = await GET();

    // Check if getSession was called
    expect(auth.getSession).toHaveBeenCalled();

    // Check if NextResponse.json was called with the user data
    expect(NextResponse.json).toHaveBeenCalledWith(mockUser);

    // Check the response
    expect(response).toEqual({
      data: mockUser,
    });
  });

  test('returns 401 when no session exists', async () => {
    // Mock the getSession function to return null
    (auth.getSession as jest.Mock).mockResolvedValue(null);

    // Call the API route handler
    const response = await GET();

    // Check if getSession was called
    expect(auth.getSession).toHaveBeenCalled();

    // Check if NextResponse.json was called with the error message and status
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: 'Unauthorized' },
      { status: 401 }
    );

    // Check the response
    expect(response).toEqual({
      data: { message: 'Unauthorized' },
      status: 401,
    });
  });

  test('returns 401 when session exists but has no user', async () => {
    // Mock the getSession function to return a session without user
    (auth.getSession as jest.Mock).mockResolvedValue({});

    // Call the API route handler
    const response = await GET();

    // Check if getSession was called
    expect(auth.getSession).toHaveBeenCalled();

    // Check if NextResponse.json was called with the error message and status
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: 'Unauthorized' },
      { status: 401 }
    );

    // Check the response
    expect(response).toEqual({
      data: { message: 'Unauthorized' },
      status: 401,
    });
  });

  test('returns 500 when an error occurs', async () => {
    // Mock the getSession function to throw an error
    (auth.getSession as jest.Mock).mockRejectedValue(new Error('Test error'));

    // Mock console.error to prevent error output in tests
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Call the API route handler
    const response = await GET();

    // Check if getSession was called
    expect(auth.getSession).toHaveBeenCalled();

    // Check if console.error was called
    expect(consoleErrorSpy).toHaveBeenCalled();

    // Check if NextResponse.json was called with the error message and status
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: 'Failed to fetch user data' },
      { status: 500 }
    );

    // Check the response
    expect(response).toEqual({
      data: { message: 'Failed to fetch user data' },
      status: 500,
    });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
