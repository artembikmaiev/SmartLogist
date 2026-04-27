'use client';

import { useState } from 'react';
import { X, Lock, Loader2, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<boolean>;
    isSubmitting: boolean;
}

export default function ChangePasswordModal({ isOpen, onClose, onSave, isSubmitting }: ChangePasswordModalProps) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Паролі не співпадають');
            return;
        }

        if (newPassword.length < 6) {
            setError('Пароль має бути не менше 6 символів');
            return;
        }

        const success = await onSave({ currentPassword, newPassword });
        if (success) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
                <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <Lock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Зміна пароля</h2>
                            <p className="text-xs text-slate-400">Оновіть доступ до кабінету</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <FormField label="Поточний пароль" id="currentPassword">
                        <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </FormField>

                    <div className="grid grid-cols-1 gap-6">
                        <FormField label="Новий пароль" id="newPassword">
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </FormField>

                        <FormField label="Підтвердіть пароль" id="confirmPassword">
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </FormField>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium animate-shake">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Скасувати
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            className="flex-1 gap-2"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Зберегти
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
