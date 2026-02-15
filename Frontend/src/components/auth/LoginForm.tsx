'use client';

// Універсальний компонент форми входу, що підтримує різні ролі користувачів та валідацію.

import Link from 'next/link';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import { useLogin } from '@/hooks/useLogin';

interface LoginFormProps {
    role: 'driver' | 'manager' | 'admin';
    title: string;
    subtitle: string;
    gradientFrom: string;
    placeholderEmail: string;
}

export default function LoginForm({ role, title, subtitle, gradientFrom, placeholderEmail }: LoginFormProps) {
    const { email, setEmail, password, setPassword, error, isLoading, handleSubmit } = useLogin(role);

    return (
        <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${gradientFrom} to-slate-100 px-4`}>
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg">SL</div>
                        <span className="font-bold text-slate-900 text-2xl">SmartLogist</span>
                    </Link>
                    <h1 className="mt-6 text-3xl font-bold text-slate-900">{title}</h1>
                    <p className="mt-2 text-slate-600">{subtitle}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormField label="Email" id="email">
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder={placeholderEmail}
                                className="py-3"
                            />
                        </FormField>

                        <FormField label="Пароль" id="password">
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="py-3"
                            />
                        </FormField>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <Button type="submit" isLoading={isLoading} className="w-full py-3 h-12 text-base font-semibold">Увійти</Button>
                    </form>

                    <div className="mt-6 text-center space-y-2">
                        {role === 'admin' ? (
                            <>
                                <Link href="/auth/manager" className="text-sm text-blue-600 hover:text-blue-700 block transition-colors">
                                    Увійти як менеджер
                                </Link>
                                <Link href="/auth/driver" className="text-sm text-blue-600 hover:text-blue-700 block transition-colors">
                                    Увійти як водій
                                </Link>
                            </>
                        ) : role === 'driver' ? (
                            <Link href="/auth/manager" className="text-sm text-blue-600 hover:text-blue-700 block transition-colors">
                                Увійти як менеджер
                            </Link>
                        ) : (
                            <Link href="/auth/driver" className="text-sm text-blue-600 hover:text-blue-700 block transition-colors">
                                Увійти як водій
                            </Link>
                        )}
                        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 block transition-colors">Повернутися на головну</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
