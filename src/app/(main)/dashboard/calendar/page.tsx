import { Suspense } from 'react';
import { getAppointments } from '@/features/calendar/actions/appointmentActions';
import { ClinicCalendar } from '@/features/calendar/components/ClinicCalendar';
import { Loader2 } from 'lucide-react';
import { NewAppointmentButton } from './NewAppointmentButton';

export default async function CalendarPage() {
    const appointments = await getAppointments();

    return (
        <div className="h-full p-6 flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Calendario Clínico</h1>
                    <p className="text-slate-500">Gestiona citas y agenda del equipo.</p>
                </div>
                <NewAppointmentButton />
            </div>

            <div className="flex-1 min-h-0">
                <Suspense fallback={
                    <div className="h-full flex items-center justify-center bg-white/50 backdrop-blur rounded-3xl border border-white/20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                    </div>
                }>
                    <ClinicCalendar initialAppointments={appointments} />
                </Suspense>
            </div>
        </div>
    );
}
