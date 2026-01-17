'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Shield, UserCog, LogOut, Settings } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navigation = [
        { name: 'Менеджери', href: '/admin/managers', icon: Users },
        { name: 'Водії', href: '/admin/drivers', icon: UserCog },
        { name: 'Дозволи', href: '/admin/permissions', icon: Shield },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">SL</span>
                        </div>
                        <div>
                            <span className="font-bold text-slate-900 text-lg">SmartLogist</span>
                            <span className="block text-xs text-slate-500">Адмін панель</span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${active
                                            ? 'bg-purple-50 text-purple-700 font-medium'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        <Link href="/admin/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">АД</span>
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-slate-900">Адміністратор</p>
                                <p className="text-xs text-slate-500">Admin</p>
                            </div>
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="hidden md:inline">Вийти</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
