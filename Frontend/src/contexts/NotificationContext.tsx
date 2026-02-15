'use client';

// Контекст для зберігання та оперативного сповіщення про нові системні події в UI та їх відображення у реальному часі.

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastType } from '@/components/ui/Toast';

interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

interface NotificationContextType {
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        setToasts((prev) => {
            // Prevent duplicate messages
            if (prev.some(t => t.message === message)) {
                return prev;
            }
            const id = Math.random().toString(36).substring(2, 9);
            return [...prev, { id, message, type }];
        });
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const notificationApi = {
        success: (msg: string) => addToast(msg, 'success'),
        error: (msg: string) => addToast(msg, 'error'),
        warning: (msg: string) => addToast(msg, 'warning'),
        info: (msg: string) => addToast(msg, 'info'),
    };

    // Listen for global events
    React.useEffect(() => {
        const handleNotification = (event: CustomEvent<{ message: string; type: ToastType }>) => {
            const { message, type } = event.detail;
            addToast(message, type || 'info');
        };

        window.addEventListener('notification:show', handleNotification as EventListener);
        return () => window.removeEventListener('notification:show', handleNotification as EventListener);
    }, [addToast]);

    return (
        <NotificationContext.Provider value={notificationApi}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
                <div className="flex flex-col items-end pointer-events-auto">
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            id={toast.id}
                            message={toast.message}
                            type={toast.type}
                            onClose={removeToast}
                        />
                    ))}
                </div>
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within NotificationProvider');
    return context;
};
