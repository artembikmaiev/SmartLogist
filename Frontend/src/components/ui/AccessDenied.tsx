import React from 'react';
import { UserX } from 'lucide-react';

interface AccessDeniedProps {
    resourceName?: string;
    message?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
    resourceName = 'перегляд цієї сторінки',
    message
}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center border border-slate-100">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserX className="w-10 h-10 text-red-500" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                    Доступ заборонено
                </h2>

                <p className="text-slate-500 font-medium leading-relaxed">
                    {message || `У вас немає дозволу на ${resourceName}.`}
                </p>

                <p className="text-slate-400 text-sm mt-4">
                    Зверніться до адміністратора для отримання доступу.
                </p>
            </div>
        </div>
    );
};
