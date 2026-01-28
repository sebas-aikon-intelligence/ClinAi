'use client';

import React, { useState } from 'react';
import { Appointment } from '../types';
import { updateAppointment, deleteAppointment } from '../actions/appointmentActions';
import { X, Loader2, Trash2 } from 'lucide-react';

interface AppointmentModalProps {
    appointment: Appointment | null;
    onClose: () => void;
}

export function AppointmentModal({ appointment, onClose }: AppointmentModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notes, setNotes] = useState(appointment?.notes || '');

    if (!appointment) return null;

    const handleUpdate = async () => {
        setIsSubmitting(true);
        await updateAppointment(appointment.id, { notes });
        setIsSubmitting(false);
        onClose();
    };

    const handleDelete = async () => {
        if (!confirm('¿Eliminar cita?')) return;
        setIsSubmitting(true);
        await deleteAppointment(appointment.id);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in zoom-in-95 duration-200 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-slate-800 mb-2">{appointment.title}</h2>
                <p className="text-sm text-slate-500 mb-4">
                    {new Date(appointment.start).toLocaleString()} - {new Date(appointment.end).toLocaleTimeString()}
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1">Notas</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200 h-32 resize-none"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <button
                            onClick={handleDelete}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <div className="flex gap-2">
                            <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors">
                                Cerrar
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
