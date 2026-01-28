'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';

interface RevenueChartProps {
    transactions: Transaction[];
}

export function RevenueChart({ transactions }: RevenueChartProps) {
    // Process data for the chart (grouped by date)
    const data = React.useMemo(() => {
        const grouped = transactions.reduce((acc, curr) => {
            const date = new Date(curr.date).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = { date, income: 0, expense: 0 };
            }
            if (curr.status === 'paid') {
                if (curr.type === 'income') acc[date].income += Number(curr.amount);
                else acc[date].expense += Number(curr.amount);
            }
            return acc;
        }, {} as Record<string, { date: string, income: number, expense: number }>);

        // Sort by date
        return Object.values(grouped).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-10); // Show last 10 points
    }, [transactions]);

    if (transactions.length === 0) {
        return (
            <div className="h-[300px] w-full bg-slate-50/50 rounded-3xl border border-slate-200 flex items-center justify-center text-slate-400">
                No hay datos suficientes para el gráfico
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-[400px]">
            <h3 className="font-bold text-slate-800 mb-6">Flujo de Caja</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                    />
                    <Area type="monotone" dataKey="income" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIncome)" name="Ingresos" />
                    <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" name="Gastos" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
