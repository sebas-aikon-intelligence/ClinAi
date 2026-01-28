import React from 'react';
import { Patient } from '../types';
import { cn } from '@/lib/utils';
import { Calendar, Phone, Mail, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

interface PatientCardProps {
    patient: Patient;
    className?: string;
}

export function PatientCard({ patient, className }: PatientCardProps) {
    const statusColors = {
        lead: 'bg-blue-100 text-blue-700',
        contacted: 'bg-yellow-100 text-yellow-700',
        scheduled: 'bg-purple-100 text-purple-700',
        active: 'bg-green-100 text-green-700',
        inactive: 'bg-slate-100 text-slate-700'
    };

    return (
        <Link
            href={`/dashboard/patients/${patient.id}`}
            className={cn(
                "group relative bg-white/60 backdrop-blur-md rounded-3xl p-5 border border-white/50 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300",
                className
            )}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/20">
                        {patient.first_name[0]}{patient.last_name[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                            {patient.first_name} {patient.last_name}
                        </h3>
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", statusColors[patient.pipeline_stage])}>
                            {patient.pipeline_stage}
                        </span>
                    </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-full transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-2 mb-4">
                {patient.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="truncate">{patient.email}</span>
                    </div>
                )}
                {patient.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>{patient.phone}</span>
                    </div>
                )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                    Agregado: {new Date(patient.created_at).toLocaleDateString()}
                </span>
                <div className="flex -space-x-2">
                    {/* Placeholder for tags or avatars */}
                </div>
            </div>
        </Link>
    );
}
