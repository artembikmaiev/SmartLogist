'use client';

// Головна інформаційна панель менеджера з ключовими показниками ефективності (KPI) логістики, рейсами та повідомленнями.

import { redirect } from 'next/navigation';

export default function ManagerHomePage() {
  redirect('/manager/trips');
}
