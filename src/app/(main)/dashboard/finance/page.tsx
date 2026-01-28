'use client';

import React, { useState } from 'react';
import { useFinance } from '@/features/finance/hooks/useFinance';
import { FinanceCards } from '@/features/finance/components/FinanceCards';
import { RevenueChart } from '@/features/finance/components/RevenueChart';
import { TransactionsTable } from '@/features/finance/components/TransactionsTable';
import { CreateTransactionModal } from '@/features/finance/components/CreateTransactionModal';
import { Plus, Loader2 } from 'lucide-react';

export default function FinancePage() {
    const { transactions, stats, isLoading, refresh } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="h-full p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Finanzas</h1>
                    <p className="text-slate-500">Control de ingresos, gastos y rendimiento.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Transacción
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            ) : (
                <>
                    <FinanceCards stats={stats} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-3">
                            <RevenueChart transactions={transactions} />
                        </div>
                        <div className="lg:col-span-3">
                            <h3 className="font-bold text-slate-800 mb-4 text-lg">Transacciones Recientes</h3>
                            <TransactionsTable transactions={transactions} />
                        </div>
                    </div>
                </>
            )}

            <CreateTransactionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    refresh();
                }}
            />
        </div>
    );
}
