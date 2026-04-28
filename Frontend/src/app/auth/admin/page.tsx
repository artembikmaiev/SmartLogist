'use client';

import React, { useState, useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SetupAdminForm from '@/components/auth/SetupAdminForm';
import { authService } from '@/services/auth.service';

export default function AdminLogin() {
    const [isAdminExists, setIsAdminExists] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const exists = await authService.checkAdminExists();
                setIsAdminExists(exists);
            } catch (error) {
                console.error('Failed to check admin existence:', error);
                setIsAdminExists(true); // Fallback to login
            } finally {
                setIsChecking(false);
            }
        };

        checkAdmin();
    }, []);

    if (isChecking) {
        return (
            <div key="loading" className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    if (isAdminExists === false) {
        // Додаємо key, щоб React знав, що це абсолютно новий компонент
        return <SetupAdminForm key="setup-form" />;
    }

    return (
        <LoginForm
            key="login-form" // Додаємо key тут також
            role="admin"
            title="Вхід для адміністратора"
            subtitle="Доступ до управління системою"
            gradientFrom="from-slate-100"
            placeholderEmail="admin@smartlogist.ua"
        />
    );
}
