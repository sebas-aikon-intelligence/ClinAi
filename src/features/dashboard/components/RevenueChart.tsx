'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface RevenueChartProps {
    data?: {
        month: string;
        ingresos: number;
        gastos: number;
    }[];
}

const defaultData = [
    { month: 'Ene', ingresos: 32000, gastos: 12000 },
    { month: 'Feb', ingresos: 28000, gastos: 15000 },
    { month: 'Mar', ingresos: 35000, gastos: 10000 },
    { month: 'Abr', ingresos: 42000, gastos: 18000 },
    { month: 'May', ingresos: 38000, gastos: 14000 },
    { month: 'Jun', ingresos: 45200, gastos: 12450 },
];

export function RevenueChart({ data = defaultData }: RevenueChartProps) {
    const totalIngresos = data.reduce((sum, d) => sum + d.ingresos, 0);
    const totalGastos = data.reduce((sum, d) => sum + d.gastos, 0);
    const neto = totalIngresos - totalGastos;

    return (
        <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">
                    Ingresos vs Gastos
                </h3>
                <div className="flex gap-4 text-sm">
                    <span className="text-emerald-600 font-semibold">
                        Neto: ${neto.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                        <XAxis
                            dataKey="month"
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                        />
                        <YAxis
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                            contentStyle={{
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                borderRadius: '12px',
                                border: '1px solid rgba(0,0,0,0.1)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey="ingresos"
                            name="Ingresos"
                            fill="#10b981"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="gastos"
                            name="Gastos"
                            fill="#ef4444"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}
