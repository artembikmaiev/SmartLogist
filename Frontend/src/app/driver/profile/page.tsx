'use client';

// Сторінка персонального профілю водія з можливістю перегляду та подання запитів на зміну даних.

import ProfileInfoCard from '@/components/profile/ProfileInfoCard';
import ActivitySidebar from '@/components/profile/ActivitySidebar';
import FuelPricesCard from '@/components/profile/FuelPricesCard';
import { useProfile } from '@/hooks/useProfile';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DriverProfilePage() {
    const {
        user,
        isEditing,
        setIsEditing,
        isSubmitting,
        activities,
        isLoadingActivities,
        updateProfile,
        updateStatus
    } = useProfile('driver');

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

                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Безпека та доступ</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-blue-200 transition-all">
                                    <div>
                                        <p className="font-black text-slate-900 text-xs uppercase tracking-widest">Захист паролем</p>
                                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Останнє оновлення: 2 місяці тому</p>
                                    </div>
                                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-blue-300 transition-all shadow-sm">Змінити</button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-blue-200 transition-all">
                                    <div>
                                        <p className="font-black text-slate-900 text-xs uppercase tracking-widest">Двофакторна автентифікація</p>
                                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Рекомендовано для підвищення безпеки</p>
                                    </div>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm">Увімкнути</button>
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
        </ProtectedRoute>
    );
}
