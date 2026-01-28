'use client';

import React, { useState } from 'react';
import { Patient } from '../types';
import { PatientCard } from './PatientCard';
import { Search } from 'lucide-react';

interface PatientGalleryProps {
    patients: Patient[];
}

export function PatientGallery({ patients }: PatientGalleryProps) {
    const [search, setSearch] = useState('');

    const filteredPatients = patients.filter(p =>
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        p.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar paciente..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all font-medium placeholder:text-slate-400"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPatients.map(patient => (
                    <PatientCard key={patient.id} patient={patient} />
                ))}
                {filteredPatients.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        No se encontraron pacientes.
                    </div>
                )}
            </div>
        </div>
    );
}
