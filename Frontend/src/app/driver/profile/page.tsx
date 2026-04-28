'use client';

// Сторінка персонального профілю водія з можливістю перегляду та подання запитів на зміну даних.

import ProfileInfoCard from '@/components/profile/ProfileInfoCard';
import ActivitySidebar from '@/components/profile/ActivitySidebar';
import FuelPricesCard from '@/components/profile/FuelPricesCard';
import ChangePasswordModal from '@/components/profile/ChangePasswordModal';
import { useProfile } from '@/hooks/useProfile';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState } from 'react';
import { Shield, Key } from 'lucide-react';

export default function DriverProfilePage() {
    const {
        user,
        isEditing,
        setIsEditing,
        isSubmitting,
        activities,
        isLoadingActivities,
        updateProfile,
        changePassword,
        updateStatus
    } = useProfile('driver');

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    return (
        <ProtectedRoute requiredRole="driver">
            <div className="p-8 bg-slate-50 min-h-screen">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Мій профіль</h1>
                    <p className="text-slate-500 text-sm mt-1">Персональна інформація водія та налаштування</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <ProfileInfoCard
                            role="driver"
                            user={user}
                            isEditing={isEditing}
                            isSubmitting={isSubmitting}
                            setIsEditing={setIsEditing}
                            onSave={updateProfile}
                            onStatusUpdate={updateStatus}
                        />

                        {/* Безпека */}
                        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Безпека</h2>
                                    <p className="text-sm text-slate-500">Захист вашого доступу</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <Key className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Пароль</p>
                                            <p className="text-sm font-bold text-slate-900 mt-0.5">••••••••••••</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setIsPasswordModalOpen(true)}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-blue-600 hover:border-blue-300 transition-all shadow-sm active:scale-95"
                                    >
                                        Змінити
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <Shield className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">2FA</p>
                                            <p className="text-sm font-bold text-slate-900 mt-0.5">Вимкнено</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Soon</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <ActivitySidebar
                            activities={activities}
                            isLoading={isLoadingActivities}
                        />

                        <FuelPricesCard />

                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Налаштування</h2>
                            <div className="space-y-3">
                                {['Email', 'Push', 'SMS'].map(type => (
                                    <label key={type} className="flex items-center justify-between cursor-pointer group">
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{type} сповіщення</span>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded border-slate-200 focus:ring-blue-500" />
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ChangePasswordModal 
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSave={changePassword}
                isSubmitting={isSubmitting}
            />
        </ProtectedRoute>
    );
}
