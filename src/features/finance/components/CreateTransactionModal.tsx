'use client';

import React, { useState } from 'react';
import { createTransaction } from '../actions/financeActions';
import { X, Loader2 } from 'lucide-react';

interface CreateTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateTransactionModal({ isOpen, onClose }: CreateTransactionModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        amount: '',
        type: 'income',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        status: 'paid'
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await createTransaction({
            ...form,
            amount: parseFloat(form.amount),
            type: form.type as 'income' | 'expense',
            status: form.status as 'paid' | 'pending' | 'cancelled'
        });
        setIsSubmitting(false);
        onClose();
        // Reset form or keep common values?
        setForm({ ...form, amount: '', description: '' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 animate-in zoom-in-95 duration-200 relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">Nueva Transacción</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Tipo</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value })}
                            >
                                <option value="income">Ingreso</option>
                                <option value="expense">Gasto</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Monto</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                                value={form.amount}
                                onChange={e => setForm({ ...form, amount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Categoría</label>
                        <input
                            required
                            list="categories"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                            value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value })}
                        />
                        <datalist id="categories">
                            <option value="Consulta" />
                            <option value="Procedimiento" />
                            <option value="Farmacia" />
                            <option value="Alquiler" />
                            <option value="Nómina" />
                            <option value="Insumos" />
                        </datalist>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Descripción</label>
                        <input
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Fecha</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                                value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Estado</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
                                value={form.status}
                                onChange={e => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="paid">Pagado</option>
                                <option value="pending">Pendiente</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>
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
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
