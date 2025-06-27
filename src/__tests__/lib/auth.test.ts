import {getSession, getCurrentUser} from '@/lib/auth';
import {getServerSession} from 'next-auth/next';
import {authOptions} from '@/app/api/auth/[...nextauth]/auth-options';

// Mock the getServerSession function
jest.mock('next-auth/next', () => ({
    getServerSession: jest.fn(),
}));

// Mock the auth options
jest.mock('@/app/api/auth/[...nextauth]/auth-options', () => ({
    authOptions: {},
}));

describe('Auth Utilities', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getSession', () => {
        test('calls getServerSession with authOptions', async () => {
            // Mock the return value
            const mockSession = {user: {id: '1', name: 'Test User'}};
            (getServerSession as jest.Mock).mockResolvedValue(mockSession);

            // Call the function
            const result = await getSession();

            // Check if getServerSession was called with authOptions
            expect(getServerSession).toHaveBeenCalledWith(authOptions);

            // Check if the result is correct
            expect(result).toEqual(mockSession);
        });

        test('returns null when no session is found', async () => {
            // Mock the return value
            (getServerSession as jest.Mock).mockResolvedValue(null);

            // Call the function
            const result = await getSession();

            // Check if getServerSession was called with authOptions
            expect(getServerSession).toHaveBeenCalledWith(authOptions);

            // Check if the result is correct
            expect(result).toBeNull();
        });
    });

    describe('getCurrentUser', () => {
        test('returns user from session', async () => {
            // Mock the return value
            const mockUser = {id: '1', name: 'Test User'};
            (getServerSession as jest.Mock).mockResolvedValue({user: mockUser});

            // Call the function
            const result = await getCurrentUser();

            // Check if the result is correct
            expect(result).toEqual(mockUser);
        });

        test('returns undefined when no session is found', async () => {
            // Mock the return value
            (getServerSession as jest.Mock).mockResolvedValue(null);

            // Call the function
            const result = await getCurrentUser();

            // Check if the result is correct
            expect(result).toBeUndefined();
        });

        test('returns undefined when session has no user', async () => {
            // Mock the return value
            (getServerSession as jest.Mock).mockResolvedValue({});

            // Call the function
            const result = await getCurrentUser();

            // Check if the result is correct
            expect(result).toBeUndefined();
        });
    });
});
