'use client';

import ProfileInfoCard from '@/components/profile/ProfileInfoCard';
import ActivitySidebar from '@/components/profile/ActivitySidebar';
import { useProfile } from '@/hooks/useProfile';
import { useState, useEffect } from 'react';
import { currencyService } from '@/services/currency.service';
import type { CurrencyRate } from '@/types/currency.types';

export default function ManagerProfilePage() {
    const { user, isEditing, setIsEditing, isSubmitting, activities, isLoadingActivities, updateProfile } = useProfile('manager');
    const [rates, setRates] = useState<CurrencyRate[]>([]);
    const [ratesLoading, setRatesLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const data = await currencyService.getRates();
                setRates(data);
                setLastUpdated(new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }));
            } catch (err) {
                console.error('Failed to fetch rates:', err);
            } finally {
                setRatesLoading(false);
            }
        };
        fetchRates();
    }, []);

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Мій профіль</h1>
                <p className="text-slate-500 text-sm mt-1">Керування обліковим записом менеджера</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <ProfileInfoCard
                        role="manager"
                        user={user}
                        isEditing={isEditing}
                        isSubmitting={isSubmitting}
                        setIsEditing={setIsEditing}
                        onSave={updateProfile}
                    />

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Безпека</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-blue-200 transition-all">
                                <div>
                                    <p className="font-black text-slate-900 text-xs uppercase tracking-widest">Пароль</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Останнє оновлення: 3 місяці тому</p>
                                </div>
                                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-blue-300 transition-all shadow-sm">Змінити</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <ActivitySidebar activities={activities} isLoading={isLoadingActivities} />

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden relative">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Курси валют</h2>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live NBU</span>
                                </div>
                                {lastUpdated && (
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Оновлено о {lastUpdated}</span>
                                )}
                            </div>
                        </div>
                        <div className="space-y-3">
                            {ratesLoading ? <div className="animate-pulse space-y-2"><div className="h-10 bg-slate-100 rounded-lg"></div><div className="h-10 bg-slate-100 rounded-lg"></div></div> : rates.map(rate => (
                                <div key={rate.code} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-blue-200 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">{rate.code === 'USD' ? '$' : '€'}</div>
                                        <p className="font-black text-slate-900 text-xs tracking-widest">{rate.code}</p>
                                    </div>
                                    <p className="font-black text-slate-900 text-sm">{rate.rate.toFixed(2)} <span className="text-[10px] text-slate-400">₴</span></p>
                                </div>
                            ))}
                        </div>
                    </div>

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
    );
}
