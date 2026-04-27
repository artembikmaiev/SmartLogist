'use client';

// Особистий кабінет адміністратора з налаштуваннями профілю та безпеки.

import ProfileInfoCard from '@/components/profile/ProfileInfoCard';
import ActivitySidebar from '@/components/profile/ActivitySidebar';
import ChangePasswordModal from '@/components/profile/ChangePasswordModal';
import { useProfile } from '@/hooks/useProfile';
import { useState } from 'react';
import { Shield, Key, Mail, Phone, Calendar, User as UserIcon } from 'lucide-react';

export default function AdminProfilePage() {
    const { 
        user, 
        isEditing, 
        setIsEditing, 
        isSubmitting, 
        activities, 
        isLoadingActivities, 
        updateProfile,
        changePassword 
    } = useProfile('admin');

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Профіль адміністратора</h1>
                <p className="text-slate-500 text-sm mt-1">Керування вашим обліковим записом та безпекою</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Основна інформація */}
                    <ProfileInfoCard
                        role="admin"
                        user={user}
                        isEditing={isEditing}
                        isSubmitting={isSubmitting}
                        setIsEditing={setIsEditing}
                        onSave={updateProfile}
                    />

                    {/* Безпека та швидкі дії */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Безпека</h2>
                                <p className="text-sm text-slate-500">Захист вашого доступу</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-purple-200 transition-all">
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
                                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-purple-600 hover:border-purple-300 transition-all shadow-sm active:scale-95"
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

                    {/* Детальна інформація */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-8">Деталі акаунту</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Email</p>
                                    <p className="text-sm font-semibold text-slate-900">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Телефон</p>
                                    <p className="text-sm font-semibold text-slate-900">{user?.phone || 'Не вказано'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Дата реєстрації</p>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('uk-UA') : 'Невідомо'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                    <UserIcon className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Роль</p>
                                    <p className="text-sm font-semibold text-slate-900 uppercase tracking-tighter">Системний адміністратор</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <ActivitySidebar activities={activities} isLoading={isLoadingActivities} />
                    
                    {/* Картка допомоги */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                        <h3 className="text-xl font-bold mb-2 relative z-10">Потрібна допомога?</h3>
                        <p className="text-slate-400 text-sm mb-6 relative z-10">Зверніться до технічної підтримки системи SmartLogist.</p>
                        <button className="w-full py-3 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-colors relative z-10 active:scale-[0.98]">
                            Написати в підтримку
                        </button>
                    </div>
                </div>
            </div>

            <ChangePasswordModal 
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSave={changePassword}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
