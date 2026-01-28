'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';

const transactions = [
    { id: 1, type: 'income', desc: 'Consulta General - María G.', amount: '+ $80.00', date: 'Hoy, 09:30 AM', status: 'completed' },
    { id: 2, type: 'income', desc: 'Limpieza Dental - Carlos R.', amount: '+ $120.00', date: 'Hoy, 11:00 AM', status: 'completed' },
    { id: 3, type: 'expense', desc: 'Compra Insumos Dentales', amount: '- $450.00', date: 'Ayer', status: 'completed' },
    { id: 4, type: 'income', desc: 'Ortodoncia Mensual - Ana S.', amount: '+ $200.00', date: 'Ayer', status: 'pending' },
];

export default function FinancePage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-luxury-700 to-luxury-900">
                        Finanzas
                    </h1>
                    <p className="text-luxury-600">Control de ingresos y egresos.</p>
                </div>
                <button className="px-6 py-2.5 bg-luxury-600 text-white font-medium rounded-xl shadow-lg hover:bg-luxury-700 transition-all">
                    + Nueva Transacción
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="from-mint-500/10 to-mint-600/5 border-mint-200/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-mint-100/50 rounded-lg text-mint-700"><TrendingUp className="w-5 h-5" /></div>
                        <span className="text-luxury-600 font-medium">Ingresos (Mes)</span>
                    </div>
                    <p className="text-3xl font-bold text-luxury-900">$45,200.00</p>
                    <span className="text-xs text-mint-600 font-medium flex items-center gap-1 mt-1">
                        +12.5% vs mes anterior
                    </span>
                </GlassCard>

                <GlassCard className="from-red-500/10 to-red-600/5 border-red-200/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100/50 rounded-lg text-red-700"><TrendingDown className="w-5 h-5" /></div>
                        <span className="text-luxury-600 font-medium">Gastos (Mes)</span>
                    </div>
                    <p className="text-3xl font-bold text-luxury-900">$12,450.00</p>
                    <span className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                        +5.2% vs mes anterior
                    </span>
                </GlassCard>

                <GlassCard className="from-luxury-500/10 to-luxury-600/5 border-luxury-200/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-luxury-100/50 rounded-lg text-luxury-700"><DollarSign className="w-5 h-5" /></div>
                        <span className="text-luxury-600 font-medium">Neto (Mes)</span>
                    </div>
                    <p className="text-3xl font-bold text-luxury-900">$32,750.00</p>
                    <span className="text-xs text-luxury-600 font-medium flex items-center gap-1 mt-1">
                        Margen Saludable
                    </span>
                </GlassCard>
            </div>

            <GlassCard title="Transacciones Recientes">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <tbody className="divide-y divide-white/10">
                            {transactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-2">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-2 rounded-lg", tx.type === 'income' ? "bg-mint-100 text-mint-700" : "bg-red-100 text-red-700")}>
                                                {tx.type === 'income' ? <CreditCard className="w-4 h-4" /> : <Receipt className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-luxury-900">{tx.desc}</p>
                                                <p className="text-xs text-luxury-500">{tx.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 text-right">
                                        <span className={cn("font-bold", tx.type === 'income' ? "text-mint-600" : "text-red-500")}>
                                            {tx.amount}
                                        </span>
                                    </td>
                                    <td className="py-4 px-2 text-right">
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-full border",
                                            tx.status === 'completed' ? "bg-mint-50 text-mint-700 border-mint-200" : "bg-gold-50 text-gold-700 border-gold-200"
                                        )}>
                                            {tx.status === 'completed' ? 'Completado' : 'Pendiente'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    )
}
