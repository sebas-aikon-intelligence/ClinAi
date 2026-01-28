'use client';

import React, { useState } from 'react';
import { Patient } from '../types';
import { PatientGallery } from './PatientGallery';
import { PatientPipeline } from './PatientPipeline';
import { CreatePatientModal } from './CreatePatientModal';
import { LayoutGrid, Kanban, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientsViewProps {
    initialPatients: Patient[];
}

export function PatientsView({ initialPatients }: PatientsViewProps) {
    const [view, setView] = useState<'gallery' | 'pipeline'>('gallery');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patients] = useState(initialPatients); // In real app, might want to use optimistic updates or re-fetch on focus. 
    // Since we use actions with revalidatePath, the page props should update on navigation/refresh? 
    // Actually, client component props update if parent re-renders. 
    // For simplicity using props directly or initial state. 
    // Better to use passed props directly for updates to reflect.

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Pacientes</h1>
                    <p className="text-slate-500">Gestiona tus pacientes y prospectos.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-slate-200">
                        <button
                            onClick={() => setView('gallery')}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                view === 'gallery' ? "bg-white shadow-sm text-primary-600" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setView('pipeline')}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                view === 'pipeline' ? "bg-white shadow-sm text-primary-600" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <Kanban className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20 font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Paciente</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                {view === 'gallery' ? (
                    <PatientGallery patients={initialPatients} />
                ) : (
                    <PatientPipeline patients={initialPatients} />
                )}
            </div>

            <CreatePatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
