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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<AuthResponse['user'] | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on mount
        const loadStoredAuth = () => {
            const storedUser = authService.getStoredUser();
            const storedToken = authService.getStoredToken();

            if (storedUser && storedToken) {
                setUser(storedUser);
                setToken(storedToken);
            } else {
                setUser(null);
                setToken(null);
            }
        };

        loadStoredAuth();
        setIsLoading(false);

        // BroadcastChannel for cross-tab communication
        const authChannel = new BroadcastChannel('auth_sync');

        const refreshUser = async () => {
            if (authService.getStoredToken()) {
                try {
                    const freshUser = await authService.getCurrentUser();
                    setUser(freshUser);
                    localStorage.setItem('user', JSON.stringify(freshUser));
                } catch (err) {
                    console.error('Failed to refresh user data:', err);
                }
            }
        };

        // Listen for storage events (synced across tabs for localStorage)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token' || e.key === 'user') {
                loadStoredAuth();
            }
        };

        // Refresh when tab becomes visible or focused
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                refreshUser();
            }
        };

        const handleFocus = () => {
            refreshUser();
        };

        // Listen to messages from other tabs
        authChannel.onmessage = (event) => {
            if (event.data === 'sync') {
                refreshUser();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            authChannel.close();
        };
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

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user && !!token,
                isLoading,
                login,
                logout,
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
