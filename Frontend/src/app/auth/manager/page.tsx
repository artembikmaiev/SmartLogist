'use client';

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
