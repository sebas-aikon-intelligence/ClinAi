'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const ClinicCalendar = dynamic(
    () => import('@/features/calendar/components/ClinicCalendar').then(mod => mod.ClinicCalendar),
    {
        ssr: false,
        loading: () => <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
    }
);

export default function CalendarPage() {
    return (
        <div className="h-full p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Calendario</h1>
                <p className="text-slate-500">Agenda de citas y recordatorios.</p>
            </div>
            <ClinicCalendar />
        </div>
    );
}
