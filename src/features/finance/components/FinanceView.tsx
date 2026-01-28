'use client';

import React, { useState } from 'react';
import { FinanceSummary, Transaction } from '../types';
import { GlassCard } from '@/components/ui/GlassCard';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteTransaction } from '../actions/financeActions';
import { toast } from 'sonner';
import { CreateTransactionModal } from './CreateTransactionModal';

interface FinanceViewProps {
    initialTransactions: Transaction[];
    summary: FinanceSummary;
}

export function FinanceView({ initialTransactions, summary }: FinanceViewProps) {
    const [transactions, setTransactions] = useState(initialTransactions);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6 bg-white/60">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Balance Total</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-2">${summary.balance.toFixed(2)}</h3>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 bg-white/60">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Ingresos</p>
                            <h3 className="text-3xl font-bold text-green-600 mt-2">+${summary.total_income.toFixed(2)}</h3>
                        </div>
                        <div className="p-3 bg-green-100 rounded-xl text-green-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 bg-white/60">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Gastos</p>
                            <h3 className="text-3xl font-bold text-red-600 mt-2">-${summary.total_expenses.toFixed(2)}</h3>
                        </div>
                        <div className="p-3 bg-red-100 rounded-xl text-red-600">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                    </div>
                </GlassCard>
            </div>

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Transacciones Recientes</h2>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/20"
                >
                    <Plus className="w-4 h-4 mr-2" /> Nueva Transacción
                </Button>
            </div>

            <GlassCard className="overflow-hidden bg-white/80">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Descripción</th>
                                <th className="px-6 py-4 font-semibold">Paciente</th>
                                <th className="px-6 py-4 font-semibold">Tipo</th>
                                <th className="px-6 py-4 font-semibold">Método</th>
                                <th className="px-6 py-4 font-semibold text-right">Monto</th>
                                <th className="px-6 py-4 font-semibold text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        No hay transacciones registradas.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {t.description}
                                            <div className="text-xs text-slate-400 font-normal mt-0.5">
                                                {new Date(t.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {t.patient ? `${t.patient.first_name} ${t.patient.last_name}` : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {t.type === 'income' ? (
                                                <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded w-fit text-xs font-medium">
                                                    <ArrowUpRight className="w-3 h-3 mr-1" /> Ingreso
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded w-fit text-xs font-medium">
                                                    <ArrowDownLeft className="w-3 h-3 mr-1" /> Gasto
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 capitalize">
                                            {t.payment_method.replace('_', ' ')}
                                        </td>
                                        <td className={`px-6 py-4 text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                            {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${t.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                                                    t.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                        'bg-slate-100 text-slate-700 border-slate-200'
                                                }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            <CreateTransactionModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}
