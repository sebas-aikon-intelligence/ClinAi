'use client';

import React from 'react';
import { FinanceStats } from '../types';
import { DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface FinanceCardsProps {
    stats: FinanceStats;
}

export function FinanceCards({ stats }: FinanceCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <DollarSign className="w-24 h-24 text-primary-500" />
                </div>
                <p className="text-sm font-medium text-slate-500 mb-1">Ingresos Totales</p>
                <h3 className="text-3xl font-bold text-slate-800">${stats.totalRevenue.toLocaleString()}</h3>
                <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+12% vs mes anterior</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <TrendingDown className="w-24 h-24 text-red-500" />
                </div>
                <p className="text-sm font-medium text-slate-500 mb-1">Gastos</p>
                <h3 className="text-3xl font-bold text-slate-800">${stats.totalExpenses.toLocaleString()}</h3>
                <div className="mt-4 flex items-center text-red-600 text-sm font-medium">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    <span>+5% vs mes anterior</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <DollarSign className="w-24 h-24 text-green-500" />
                </div>
                <p className="text-sm font-medium text-slate-500 mb-1">Utilidad Neta</p>
                <h3 className="text-3xl font-bold text-slate-800">${stats.netIncome.toLocaleString()}</h3>
                <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                    <span>Margen: {stats.totalRevenue ? ((stats.netIncome / stats.totalRevenue) * 100).toFixed(1) : 0}%</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Clock className="w-24 h-24 text-yellow-500" />
                </div>
                <p className="text-sm font-medium text-slate-500 mb-1">Por Cobrar</p>
                <h3 className="text-3xl font-bold text-slate-800">${stats.pendingIncome.toLocaleString()}</h3>
                <div className="mt-4 flex items-center text-yellow-600 text-sm font-medium">
                    <span>{stats.pendingIncome > 0 ? 'Acción requerida' : 'Todo al día'}</span>
                </div>
            </div>
        </div>
    );
}
