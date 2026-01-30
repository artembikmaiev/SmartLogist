'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import type { AuthResponse } from '@/types/auth.types';

interface AuthContextType {
    user: AuthResponse['user'] | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<AuthResponse['user'] | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load user from sessionStorage on mount
        const loadStoredAuth = () => {
            const storedUser = authService.getStoredUser();
            const storedToken = authService.getStoredToken();

            if (storedUser && storedToken) {
                setUser(storedUser);
                setToken(storedToken);

                // Fetch fresh user data from server to update permissions/profile
                authService.getCurrentUser()
                    .then(freshUser => {
                        setUser(freshUser);
                    })
                    .catch(err => {
                        console.error('Failed to refresh user data:', err);
                        // If token is invalid, logout might be needed, but for now we just log
                    });
            } else {
                setUser(null);
                setToken(null);
            }
        };

        loadStoredAuth();
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        setUser(response.user);
        setToken(response.token);
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setToken(null);
        router.push('/');
    };

    const refreshUser = async () => {
        try {
            const freshUser = await authService.getCurrentUser();
            setUser(freshUser);
        } catch (err) {
            console.error('Failed to refresh user data:', err);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user && !!token,
                isLoading,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
