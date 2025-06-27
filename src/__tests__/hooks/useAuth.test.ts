import {renderHook} from '@testing-library/react';
import {useSession} from 'next-auth/react';
import {useAuth} from '@/hooks/useAuth';

// Mock the useSession hook
jest.mock('next-auth/react', () => ({
    useSession: jest.fn(),
}));

describe('useAuth Hook', () => {
    test('returns isAuthenticated as true when status is authenticated', () => {
        // Mock the useSession hook to return authenticated status
        (useSession as jest.Mock).mockReturnValue({
            data: {
                user: {
                    id: '1',
                    name: 'Test User',
                    email: 'test@example.com',
                    role: 'student',
                },
            },
            status: 'authenticated',
        });

        // Render the hook
        const {result} = renderHook(() => useAuth());

        // Check the returned values
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.user).toEqual({
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'student',
        });
    });

    test('returns isAuthenticated as false when status is unauthenticated', () => {
        // Mock the useSession hook to return unauthenticated status
        (useSession as jest.Mock).mockReturnValue({
            data: null,
            status: 'unauthenticated',
        });

        // Render the hook
        const {result} = renderHook(() => useAuth());

        // Check the returned values
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.user).toBeUndefined();
    });

    test('returns isLoading as true when status is loading', () => {
        // Mock the useSession hook to return loading status
        (useSession as jest.Mock).mockReturnValue({
            data: null,
            status: 'loading',
        });

        // Render the hook
        const {result} = renderHook(() => useAuth());

        // Check the returned values
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.isLoading).toBe(true);
        expect(result.current.user).toBeUndefined();
    });
});
