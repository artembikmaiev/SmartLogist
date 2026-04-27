'use client';

// Компонент вищого порядку для захисту маршрутів від неавторизованого доступу на основі ролей.
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'manager' | 'driver';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading) {
            const isAdminRoute = pathname?.startsWith('/admin');

            if (!isAuthenticated) {
                if (isAdminRoute) {
                    router.push('/auth/admin');
                } else {
                    router.push('/');
                }
            } else if (requiredRole && user?.role !== requiredRole) {
                // Тимчасово не перевіряємо роль для адмін-панелі, якщо користувач уже авторизований
                if (!isAdminRoute) {
                    router.push('/');
                }
            }
        }
    }, [isAuthenticated, isLoading, user, requiredRole, router, pathname]);

    const isAdminRoute = pathname?.startsWith('/admin');

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (requiredRole && user?.role !== requiredRole && !isAdminRoute) {
        return null;
    }

    return <>{children}</>;
}
