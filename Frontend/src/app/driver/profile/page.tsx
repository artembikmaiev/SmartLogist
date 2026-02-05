'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import ProfileInfoCard from '@/components/profile/ProfileInfoCard';
import ActivitySidebar from '@/components/profile/ActivitySidebar';
import FuelPricesCard from '@/components/profile/FuelPricesCard';
import { useProfile } from '@/hooks/useProfile';

export default function DriverProfilePage() {
    const { user, isEditing, setIsEditing, isSubmitting, activities, isLoadingActivities, updateProfile, updateStatus } = useProfile('driver');

    return (
        <ProtectedRoute requiredRole="driver">
            <div className="p-8 bg-slate-50 min-h-screen">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Мій профіль</h1>
                    <p className="text-slate-500 text-sm mt-1">Особиста інформація та налаштування</p>
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
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Безпека</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center group hover:border-blue-200 transition-all">
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Пароль</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Останнє оновлення: 2 міс. тому</p>
                                    </div>
                                    <button className="text-xs font-black text-blue-600 uppercase tracking-tighter hover:underline">Змінити</button>
                                </div>
                                <div className="p-4 bg-blue-600 rounded-xl flex justify-between items-center group shadow-md">
                                    <p className="font-bold text-white text-sm">2FA Захист</p>
                                    <button className="bg-white text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Увімкнути</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <ActivitySidebar activities={activities} isLoading={isLoadingActivities} />
                        <FuelPricesCard />

                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Сповіщення</h2>
                            <div className="space-y-3">
                                {['Email', 'SMS', 'Push'].map(type => (
                                    <label key={type} className="flex items-center justify-between cursor-pointer group">
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{type} сповіщення</span>
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