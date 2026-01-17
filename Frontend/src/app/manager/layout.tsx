'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Truck, Users, BarChart3, Route, LogOut, Bell } from 'lucide-react';

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Рейси', href: '/manager/trips', icon: Route },
    { name: 'Водії', href: '/manager/drivers', icon: Users },
    { name: 'Транспорт', href: '/manager/vehicles', icon: Truck },
    { name: 'Аналітика', href: '/manager/analytics', icon: BarChart3 },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SL</span>
              </div>
              <span className="font-bold text-slate-900 text-lg">SmartLogist</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${active
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <Link href="/manager/profile" className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:opacity-80 transition-opacity">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-slate-900">Менеджер</p>
                  <p className="text-xs text-slate-500">manager@smartlogist.ua</p>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">МЛ</span>
                </div>
              </Link>

              {/* Logout */}
              <Link
                href="/"
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                title="Вийти"
              >
                <LogOut className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
