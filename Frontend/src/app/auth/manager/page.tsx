'use client';

// Сторінка входу для менеджерів з розділеним інтерфейсом авторизації.
import LoginForm from '@/components/auth/LoginForm';

export default function ManagerLogin() {
    return (
        <LoginForm
            role="manager"
            title="Вхід для менеджера"
            subtitle="Увійдіть до панелі управління"
            gradientFrom="from-slate-50"
            placeholderEmail="manager@smartlogist.ua"
        />
    );
}
