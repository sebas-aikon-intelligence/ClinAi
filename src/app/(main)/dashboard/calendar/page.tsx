'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Clock } from 'lucide-react';

const hours = Array.from({ length: 9 }, (_, i) => i + 9); // 9am to 5pm
const specialists = ['Dr. Pérez (General)', 'Dra. López (Odont)', 'Dr. Silva (Pediatra)'];

export default function CalendarPage() {
    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-luxury-700 to-luxury-900">
                        Agenda Clínica
                    </h1>
                    <p className="text-luxury-600">Vista multi-especialista</p>
                </div>
                <div className="flex gap-4 items-center">
                    <GlassCard className="flex items-center gap-4 py-2 px-4 !bg-white/40">
                        <button className="p-1 hover:bg-white/20 rounded-lg"><ChevronLeft className="w-5 h-5 text-luxury-700" /></button>
                        <div className="flex items-center gap-2 font-semibold text-luxury-800">
                            <CalIcon className="w-5 h-5" />
                            <span>27 Enero 2024</span>
                        </div>
                        <button className="p-1 hover:bg-white/20 rounded-lg"><ChevronRight className="w-5 h-5 text-luxury-700" /></button>
                    </GlassCard>
                    <button className="px-4 py-2.5 bg-luxury-600 text-white rounded-xl shadow-lg hover:bg-luxury-700 transition-colors">
                        + Nueva Cita
                    </button>
                </div>
            </div>

            <GlassCard className="flex-1 overflow-auto p-0 border-white/30 backdrop-blur-2xl">
                <div className="grid grid-cols-[80px_1fr_1fr_1fr] min-w-[800px] h-full divide-x divide-white/20">
                    {/* Time Column */}
                    <div className="bg-white/5 pt-14">
                        {hours.map(hour => (
                            <div key={hour} className="h-32 border-b border-white/10 text-right pr-4 text-sm font-medium text-luxury-500 relative">
                                <span className="-top-2.5 relative">{hour}:00</span>
                            </div>
                        ))}
                    </div>

                    {/* Specialist Columns */}
                    {specialists.map((spec, i) => (
                        <div key={i} className="relative">
                            <div className="sticky top-0 bg-white/20 backdrop-blur-md p-4 text-center font-bold text-luxury-800 border-b border-white/20 z-10">
                                {spec}
                            </div>
                            <div className="relative">
                                {hours.map(hour => (
                                    <div key={hour} className="h-32 border-b border-white/10"></div>
                                ))}

                                {/* Mock Events */}
                                {i === 0 && (
                                    <div className="absolute top-0 left-2 right-2 h-28 mt-2 bg-luxury-200/80 border border-luxury-300 rounded-lg p-3 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer">
                                        <h4 className="font-bold text-luxury-900 text-sm">María González</h4>
                                        <p className="text-xs text-luxury-700 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> 09:00 - 10:00</p>
                                        <span className="inline-block mt-2 px-2 py-0.5 bg-luxury-100 text-luxury-700 text-[10px] rounded-full">Primera Vez</span>
                                    </div>
                                )}
                                {i === 1 && (
                                    <div className="absolute top-32 left-2 right-2 h-44 mt-2 bg-mint-200/80 border border-mint-300 rounded-lg p-3 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer">
                                        <h4 className="font-bold text-luxury-900 text-sm">Carlos Ruiz</h4>
                                        <p className="text-xs text-luxury-700 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> 10:00 - 11:30</p>
                                        <span className="inline-block mt-2 px-2 py-0.5 bg-mint-100 text-mint-700 text-[10px] rounded-full">Tratamiento</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    )
}
