'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Package, AlertTriangle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const inventory = [
    { id: 1, name: 'Anestesia Local (Cajas)', stock: 12, minInfo: 5, status: 'ok', category: 'Insumos Médicos' },
    { id: 2, name: 'Guantes de Nitrilo (Cajas)', stock: 3, minInfo: 10, status: 'low', category: 'Descartables' },
    { id: 3, name: 'Brackets Metálicos (Kit)', stock: 0, minInfo: 2, status: 'critical', category: 'Ortodoncia' },
    { id: 4, name: 'Resina Compuesta (Jeringas)', stock: 8, minInfo: 4, status: 'ok', category: 'Restauración' },
];

export default function InventoryPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-luxury-700 to-luxury-900">
                        Inventario Inteligente
                    </h1>
                    <p className="text-luxury-600">Control de stock con reposición automática.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-luxury-600 text-white font-medium rounded-xl shadow-lg hover:bg-luxury-700 transition-all">
                    <Plus className="w-4 h-4" />
                    Agregar Ítem
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="from-red-500/10 to-red-600/5 border-red-200/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100/50 rounded-lg text-red-700"><AlertTriangle className="w-5 h-5" /></div>
                        <span className="text-luxury-600 font-medium">Stock Crítico</span>
                    </div>
                    <p className="text-3xl font-bold text-luxury-900">1 Ítem</p>
                    <button className="text-xs text-red-600 font-medium mt-2 hover:underline">
                        Ver detalles &rarr;
                    </button>
                </GlassCard>

                <GlassCard className="from-gold-500/10 to-gold-600/5 border-gold-200/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gold-100/50 rounded-lg text-gold-700"><Package className="w-5 h-5" /></div>
                        <span className="text-luxury-600 font-medium">Por Agotarse</span>
                    </div>
                    <p className="text-3xl font-bold text-luxury-900">1 Ítem</p>
                    <button className="text-xs text-gold-600 font-medium mt-2 hover:underline">
                        Solicitar pedido &rarr;
                    </button>
                </GlassCard>

                <GlassCard className="from-luxury-500/10 to-luxury-600/5 border-luxury-200/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-luxury-100/50 rounded-lg text-luxury-700"><Package className="w-5 h-5" /></div>
                        <span className="text-luxury-600 font-medium">Total Ítems</span>
                    </div>
                    <p className="text-3xl font-bold text-luxury-900">154</p>
                    <span className="text-xs text-luxury-600 font-medium mt-1 block">
                        Valor inventario estim: $4,500
                    </span>
                </GlassCard>
            </div>

            <GlassCard title="Listado de Insumos">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-600">Ítem</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-600">Categoría</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-600">Stock Actual</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-600">Estado</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-luxury-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {inventory.map(item => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-luxury-900">{item.name}</td>
                                    <td className="px-6 py-4 text-sm text-luxury-600">{item.category}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-medium text-luxury-800">{item.stock}</span>
                                        <span className="text-xs text-luxury-400 ml-2">(Min: {item.minInfo})</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-full border font-medium",
                                            item.status === 'ok' ? "bg-mint-50 text-mint-700 border-mint-200" :
                                                item.status === 'low' ? "bg-gold-50 text-gold-700 border-gold-200" :
                                                    "bg-red-50 text-red-700 border-red-200"
                                        )}>
                                            {item.status === 'ok' ? 'Normal' : item.status === 'low' ? 'Bajo' : 'Crítico'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-luxury-500 hover:text-luxury-700 text-sm font-medium">Editar</button>
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
