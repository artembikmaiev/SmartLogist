'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <NotificationProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </NotificationProvider>
    );
};
