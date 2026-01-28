'use client';

import React, { useState } from 'react';
import { Patient, PatientFile, Prescription, Activity } from '../types';
import { Tag } from '@/features/tags/types';
import { PatientTimeline } from './PatientTimeline';
import { PatientFiles } from './PatientFiles';
import { PatientPrescriptions } from './PatientPrescriptions';
import { QuickActions } from './QuickActions';
import { TagSelector } from '@/features/tags/components/TagSelector';
import { assignTagToPatient, removeTagFromPatient } from '@/features/tags/actions/tagActions';
import { cn } from '@/lib/utils';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';

interface PatientDetailProps {
    patient: Patient;
    files: PatientFile[];
    prescriptions: Prescription[];
    activities: Activity[];
    assignedTags: string[]; // ID list
}

export function PatientDetail({ patient, files, prescriptions, activities, assignedTags }: PatientDetailProps) {
    const [activeTab, setActiveTab] = useState<'timeline' | 'files' | 'prescriptions' | 'info'>('timeline');

    const tabs = [
        { id: 'timeline', label: 'Línea de Tiempo' },
        { id: 'files', label: 'Archivos' },
        { id: 'prescriptions', label: 'Recetas' },
        { id: 'info', label: 'Información' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-6 p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-primary-500/20 shrink-0">
                    {patient.first_name[0]}{patient.last_name[0]}
                </div>

                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                {patient.first_name} {patient.last_name}
                                <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full font-medium">
                                    {patient.pipeline_stage}
                                </span>
                            </h1>
                            <p className="text-slate-500 flex gap-4 mt-1">
                                <span>{patient.email || 'Sin email'}</span>
                                <span>•</span>
                                <span>{patient.phone || 'Sin teléfono'}</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/dashboard/patients" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                            <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                                <Edit className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-between items-end">
                        <TagSelector
                            selectedTagIds={assignedTags}
                            onSelect={(tagId) => assignTagToPatient(patient.id, tagId)}
                            onRemove={(tagId) => removeTagFromPatient(patient.id, tagId)}
                        />
                        <QuickActions phone={patient.phone} email={patient.email} />
                    </div>
                </div>
            </div>

            {/* Tabs & Content */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 bg-white/50 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="flex border-b border-white/20 p-2 gap-1 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                                    activeTab === tab.id
                                        ? "bg-white text-primary-600 shadow-sm"
                                        : "text-slate-500 hover:bg-white/50 hover:text-slate-700"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {activeTab === 'timeline' && <PatientTimeline activities={activities} />}
                        {activeTab === 'files' && <PatientFiles patientId={patient.id} files={files} />}
                        {activeTab === 'prescriptions' && <PatientPrescriptions patientId={patient.id} prescriptions={prescriptions} />}
                        {activeTab === 'info' && (
                            <div className="grid grid-cols-2 gap-6 text-sm">
                                <div className="space-y-1">
                                    <label className="text-slate-400 font-medium">Dirección</label>
                                    <p className="text-slate-700 font-medium">{patient.address || 'No registrada'}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-slate-400 font-medium">Fecha de Nacimiento</label>
                                    <p className="text-slate-700 font-medium">{patient.birth_date || 'No registrada'}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-slate-400 font-medium">ID Sistema</label>
                                    <p className="text-slate-700 font-mono text-xs">{patient.id}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
