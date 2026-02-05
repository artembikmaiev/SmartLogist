'use client';

import LoginForm from '@/components/auth/LoginForm';

export default function DriverLogin() {
    return (
        <LoginForm
            role="driver"
            title="Вхід для водія"
            subtitle="Увійдіть до особистого кабінету"
            gradientFrom="from-green-50"
            placeholderEmail="driver@smartlogist.ua"
        />
    );
}
