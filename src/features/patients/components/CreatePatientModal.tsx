'use client';

import React, { useState } from 'react';
import { createPatient } from '../actions/patientActions';
import { CreatePatientInput } from '../types';
import { X, Loader2 } from 'lucide-react';

interface CreatePatientModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreatePatientModal({ isOpen, onClose }: CreatePatientModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState<CreatePatientInput>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        pipeline_stage: 'lead'
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await createPatient(form);
        setIsSubmitting(false);
        onClose();
        setForm({ first_name: '', last_name: '', email: '', phone: '', pipeline_stage: 'lead' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-8 animate-in zoom-in-95 duration-200 relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">Nuevo Paciente</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Nombre</label>
                            <input
                                required
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                                value={form.first_name}
                                onChange={e => setForm({ ...form, first_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Apellido</label>
                            <input
                                required
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                                value={form.last_name}
                                onChange={e => setForm({ ...form, last_name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Teléfono</label>
                        <input
                            type="tel"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Etapa Inicial</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
                            value={form.pipeline_stage}
                            onChange={e => setForm({ ...form, pipeline_stage: e.target.value as any })}
                        >
                            <option value="lead">Lead</option>
                            <option value="contacted">Contactado</option>
                            <option value="scheduled">Agendado</option>
                            <option value="active">Activo</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Crear Paciente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
