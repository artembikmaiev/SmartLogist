'use client';

// Головна дашборд-сторінка водія з оглядом поточних завдань та статистики.

import { redirect } from 'next/navigation';

export default function DriverPage() {
    redirect('/driver/trips');
}
