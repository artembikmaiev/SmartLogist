// Компонент відображення основних персональних даних користувача та його контактної інформації.
import { User, Mail, Phone, MapPin, Calendar, Shield, Save, X, Edit, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import { DriverStatusLabels, DriverStatus } from '@/types/drivers.types';
import { formatDate } from '@/lib/utils/date.utils';

interface ProfileInfoCardProps {
    user: any;
    isEditing: boolean;
    isSubmitting: boolean;
    setIsEditing: (val: boolean) => void;
    onSave: (data: any) => void;
    onStatusUpdate?: (status: DriverStatus) => void;
    role: 'driver' | 'manager';
}

export default function ProfileInfoCard({ user, isEditing, isSubmitting, setIsEditing, onSave, onStatusUpdate, role }: ProfileInfoCardProps) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        licenseNumber: '',
        department: 'Відділ логістики'
    });
    const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                licenseNumber: user.licenseNumber || '',
                department: 'Відділ логістики'
            });
        }
    }, [user]);

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-white">
                        {user?.fullName ? getInitials(user.fullName) : '??'}
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 leading-tight">{user?.fullName}</h3>
                        <p className="text-slate-500 font-medium text-sm mt-1">{role === 'driver' ? 'Водій-далекобійник' : 'Менеджер логістики'}</p>
                        <div className="flex items-center gap-2 mt-3">
                            {role === 'driver' && onStatusUpdate && (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${user?.status === 'Available' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                                    >
                                        {DriverStatusLabels[user?.status as DriverStatus] || user?.status}
                                        <ChevronDown className={`w-3 h-3 transition-transform ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isStatusMenuOpen && (
                                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden py-1">
                                            {(Object.keys(DriverStatusLabels) as DriverStatus[]).map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => { onStatusUpdate(status); setIsStatusMenuOpen(false); }}
                                                    className={`w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-slate-50 flex items-center justify-between ${user?.status === status ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600'}`}
                                                >
                                                    {DriverStatusLabels[status]}
                                                    {user?.status === status && <CheckCircle2 className="w-4 h-4" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">{user?.role}</span>
                        </div>
                    </div>
                </div>
                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4 mr-2" /> Редагувати</Button>
                ) : (
                    <div className="flex gap-2">
                        <Button onClick={() => onSave(formData)} isLoading={isSubmitting} size="sm" className="bg-green-600 hover:bg-green-700"><Save className="w-4 h-4 mr-2" /> Зберегти</Button>
                        <Button onClick={() => { setIsEditing(false); }} variant="secondary" size="sm" className="text-slate-600"><X className="w-4 h-4 mr-2" /> Скасувати</Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField label="Повне ім'я" id="fullName">
                    {isEditing ? <Input value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} icon={User} /> : <p className="font-bold text-slate-900">{user?.fullName}</p>}
                </FormField>
                <FormField label="Email" id="email">
                    {isEditing ? <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} icon={Mail} /> : <p className="font-bold text-slate-900 flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {user?.email}</p>}
                </FormField>
                <FormField label="Телефон" id="phone">
                    {isEditing ? <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} icon={Phone} /> : <p className="font-bold text-slate-900">{user?.phone || '—'}</p>}
                </FormField>
                {role === 'driver' ? (
                    <FormField label="Посвідчення" id="license">
                        {isEditing ? <Input value={formData.licenseNumber} onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })} icon={Shield} /> : <p className="font-bold text-slate-900">{user?.licenseNumber || '—'}</p>}
                    </FormField>
                ) : (
                    <FormField label="Відділ" id="department">
                        {isEditing ? <Input value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} icon={Shield} /> : <p className="font-bold text-slate-900">{formData.department}</p>}
                    </FormField>
                )}
                <FormField label="Дата прийняття" id="hired">
                    <p className="font-bold text-slate-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> {formatDate(user?.createdAt)}</p>
                </FormField>
                {role === 'driver' && (
                    <FormField label="Транспорт" id="vehicle">
                        <p className={`font-bold ${user?.assignedVehicle ? 'text-slate-900' : 'text-slate-400 italic'}`}>
                            {user?.assignedVehicle ? `${user.assignedVehicle.model} (${user.assignedVehicle.licensePlate})` : 'Не закріплено'}
                        </p>
                    </FormField>
                )}
            </div>
        </div>
    );
}
