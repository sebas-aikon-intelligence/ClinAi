'use client';

import React, { useState } from 'react';
import { Prescription } from '../types';
import { createPrescription, sendPrescription } from '../actions/patientActions';
import { Send, Plus, FileText, Loader2 } from 'lucide-react';

interface PatientPrescriptionsProps {
    patientId: string;
    prescriptions: Prescription[];
}

export function PatientPrescriptions({ patientId, prescriptions }: PatientPrescriptionsProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [isSending, setIsSending] = useState<string | null>(null);
    const [form, setForm] = useState({ medication: '', dosage: '', instructions: '' });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await createPrescription(patientId, form);
        setIsCreating(false);
        setForm({ medication: '', dosage: '', instructions: '' });
    };

    const handleSend = async (id: string, channel: 'email' | 'whatsapp') => {
        setIsSending(id);
        await sendPrescription(id, channel);
        setIsSending(null);
    };

    return (
        <div className="space-y-6">
            {!isCreating ? (
                <button
                    onClick={() => setIsCreating(true)}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50/50 transition-all flex items-center justify-center gap-2 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Receta
                </button>
            ) : (
                <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-semibold text-slate-800">Nueva Receta</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            required
                            placeholder="Medicamento"
                            className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                            value={form.medication}
                            onChange={e => setForm({ ...form, medication: e.target.value })}
                        />
                        <input
                            required
                            placeholder="Dosis"
                            className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                            value={form.dosage}
                            onChange={e => setForm({ ...form, dosage: e.target.value })}
                        />
                    </div>
                    <textarea
                        required
                        placeholder="Instrucciones"
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200 h-24 resize-none"
                        value={form.instructions}
                        onChange={e => setForm({ ...form, instructions: e.target.value })}
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsCreating(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                            Guardar Receta
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {prescriptions.map(p => (
                    <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-slate-800">{p.medication}</h4>
                                <p className="text-sm text-slate-500">{p.dosage}</p>
                            </div>
                            <span className="text-xs text-slate-400">{new Date(p.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg mb-4">
                            {p.instructions}
                        </p>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => handleSend(p.id, 'whatsapp')}
                                disabled={!!isSending}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-medium transition-colors"
                                title="Enviar por WhatsApp"
                            >
                                {isSending === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                WhatsApp
                            </button>
                            <button
                                onClick={() => handleSend(p.id, 'email')}
                                disabled={!!isSending}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-medium transition-colors"
                                title="Enviar por Email"
                            >
                                {isSending === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                                Email
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
