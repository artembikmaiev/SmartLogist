'use client';

// Сторінка входу для адміністраторів.
import LoginForm from '@/components/auth/LoginForm';

export default function AdminLogin() {
    return (
        <LoginForm
            role="admin"
            title="Вхід для адміністратора"
            subtitle="Доступ до управління системою"
            gradientFrom="from-slate-100"
            placeholderEmail="admin@smartlogist.ua"
        />
    );
}
