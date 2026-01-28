'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle2, X, User, Calendar, MapPin } from 'lucide-react';

interface Appointment {
    id: string;
    start_time: string;
    status: string;
    type: string;
    patients: {
        full_name: string;
        avatar_url: string | null;
    }[] | null;
}

interface TodayTimelineProps {
    appointments: Appointment[];
}

export function TodayTimeline({ appointments }: TodayTimelineProps) {
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const statusMap = {
        confirmed: { color: "bg-sky-500", label: "Confirmada", text: "text-sky-700 bg-sky-50" },
        pending: { color: "bg-slate-300", label: "Pendiente", text: "text-slate-600 bg-slate-100" },
        done: { color: "bg-emerald-500", label: "Finalizado", text: "text-emerald-700 bg-emerald-50" },
        in_room: { color: "bg-amber-500 animate-pulse", label: "En Sala", text: "text-amber-800 bg-amber-50" },
        cancelled: { color: "bg-red-500", label: "Cancelada", text: "text-red-700 bg-red-50" }
    };

    return (
        <>
            <GlassCard className="h-full">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">
                        Hoy en Clínica
                    </h3>
                    <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        {appointments?.length || 0} Pacientes
                    </span>
                </div>

                <div className="space-y-4 relative h-[calc(100%-80px)] overflow-y-auto pr-2">
                    <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-sky-200 via-emerald-200 to-transparent" />

                    {appointments.map((apt) => {
                        const time = new Date(apt.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                        const patientName = Array.isArray(apt.patients) ? apt.patients[0]?.full_name : (apt.patients as any)?.full_name || 'Paciente';
                        const st = statusMap[apt.status as keyof typeof statusMap] || statusMap.pending;

                        return (
                            <div
                                key={apt.id}
                                className="relative pl-12 flex items-start group cursor-pointer"
                                onClick={() => setSelectedAppointment(apt)}
                            >
                                <div className={cn(
                                    "absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-colors",
                                    st.color
                                )}>
                                    {apt.status === 'done' ? <CheckCircle2 className="w-4 h-4 text-white" /> :
                                        <Clock className="w-4 h-4 text-white" />}
                                </div>

                                <div className="flex-1 bg-white hover:bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-slate-200 shadow-sm transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-800">{patientName}</h4>
                                            <p className="text-sm text-slate-500">{apt.type}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono text-sm font-semibold text-slate-600">{time}</p>
                                            <span className={cn(
                                                "text-xs px-2 py-0.5 rounded-full inline-block mt-1 font-medium",
                                                st.text
                                            )}>
                                                {st.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {appointments.length === 0 && (
                        <div className="text-center py-8 text-slate-400">
                            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No hay citas programadas para hoy</p>
                        </div>
                    )}
                </div>
            </GlassCard>

            {/* Appointment Detail Modal */}
            {selectedAppointment && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedAppointment(null)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedAppointment(null)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    {Array.isArray(selectedAppointment.patients)
                                        ? selectedAppointment.patients[0]?.full_name
                                        : (selectedAppointment.patients as any)?.full_name || 'Paciente'}
                                </h3>
                                <p className="text-slate-500">{selectedAppointment.type}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Clock className="w-5 h-5" />
                                <span>
                                    {new Date(selectedAppointment.start_time).toLocaleString('es-ES', {
                                        weekday: 'long',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <MapPin className="w-5 h-5" />
                                <span>Consultorio Principal</span>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button className="flex-1 px-4 py-3 bg-sky-500 text-white rounded-xl font-medium hover:bg-sky-600 transition-colors">
                                Ver Expediente
                            </button>
                            <button className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                                Iniciar Consulta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
