// Цей файл є вхідною точкою для компонентів управління рейсами, що об'єднує карту та список рейсів.
import React from 'react';
import dynamic from 'next/dynamic';

export const Map = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400"> Завантаження карти...</div>
});

export { default as CreateTripModal } from './CreateTripModal';
