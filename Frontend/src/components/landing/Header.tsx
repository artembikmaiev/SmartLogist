'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/80 backdrop-blur-md shadow-sm'
                : 'bg-white/60 backdrop-blur-sm'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center relative">
                        <span className="text-white font-bold text-sm">SL</span>
                        <div className="absolute inset-0 bg-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
                    </div>
                    <span className="font-bold text-slate-900 text-lg">SmartLogist</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <a
                        href="#features"
                        className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
                    >
                        Можливості
                    </a>
                    <a
                        href="#how-it-works"
                        className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
                    >
                        Як це працює
                    </a>
                    <a
                        href="#roles"
                        className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
                    >
                        Для кого
                    </a>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/managers"
                        className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
                    >
                        Адмін панель
                    </Link>
                    <Link
                        href="/auth/manager"
                        className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
                    >
                        Кабінет менеджера
                    </Link>
                    <Link
                        href="/auth/driver"
                        className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                        Вхід для водія
                    </Link>
                </div>
            </div>
        </header>
    );
}
