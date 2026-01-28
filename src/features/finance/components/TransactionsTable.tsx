'use client';

import React from 'react';
import { Transaction } from '../types';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { deleteTransaction } from '../actions/financeActions';

interface TransactionsTableProps {
    transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar transacción?')) return;
        await deleteTransaction(id);
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Fecha</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Descripción</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Tipo</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Estado</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Monto</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.map(t => (
                            <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                                    {new Date(t.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-800">{t.description}</div>
                                    <div className="text-xs text-slate-400">{t.patient_id ? 'Asociado a paciente' : 'General'}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                                        t.type === 'income' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                    )}>
                                        {t.type === 'income' ? 'Ingreso' : 'Gasto'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                                        t.status === 'completed' ? "bg-green-50 text-green-700" :
                                            t.status === 'pending' ? "bg-yellow-50 text-yellow-700" :
                                                "bg-red-50 text-red-700"
                                    )}>
                                        {t.status === 'completed' ? 'Completado' : t.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                                    </span>
                                </td>
                                <td className={cn(
                                    "px-6 py-4 text-sm font-bold text-right whitespace-nowrap",
                                    t.type === 'income' ? "text-green-600" : "text-slate-800"
                                )}>
                                    {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                    No hay transacciones registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
