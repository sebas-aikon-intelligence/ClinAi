'use client';

import React, { useState } from 'react';
import { createAppointment } from '../actions/appointmentActions';
import { X, Loader2 } from 'lucide-react';

interface CreateAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDateTime?: string; // ISO string
}

export function CreateAppointmentModal({ isOpen, onClose, initialDateTime }: CreateAppointmentModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        title: '',
        patient_id: '', // Ideally a selector
        start: initialDateTime || new Date().toISOString().slice(0, 16),
        end: initialDateTime ? new Date(new Date(initialDateTime).getTime() + 60 * 60 * 1000).toISOString().slice(0, 16) : new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
        notes: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await createAppointment({
            ...form,
            start: new Date(form.start).toISOString(),
            end: new Date(form.end).toISOString(),
            status: 'scheduled'
        });
        setIsSubmitting(false);
        onClose();
        setForm({ title: '', patient_id: '', start: '', end: '', notes: '' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in zoom-in-95 duration-200 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-slate-800 mb-6">Nueva Cita</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Título</label>
                        <input
                            required
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                            placeholder="Consulta General"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    {/* Note: Patient selector should actally fetch patients. Keeping simple text for now/MVP */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">ID Paciente</label>
                        <input
                            required
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                            placeholder="UUID del paciente"
                            value={form.patient_id}
                            onChange={e => setForm({ ...form, patient_id: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700">Inicio</label>
                            <input
                                type="datetime-local"
                                required
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                                value={form.start}
                                onChange={e => setForm({ ...form, start: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Fin</label>
                            <input
                                type="datetime-local"
                                required
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                                value={form.end}
                                onChange={e => setForm({ ...form, end: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700">Notas</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200 h-20 resize-none"
                            value={form.notes}
                            onChange={e => setForm({ ...form, notes: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Crear Cita'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
