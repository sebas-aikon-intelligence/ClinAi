import React from 'react';
import { Patient } from '@/features/patients/types';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface ContactListProps {
    patients: Patient[];
    selectedPatientId?: string;
    onSelect: (patientId: string) => void;
}

export function ContactList({ patients, selectedPatientId, onSelect }: ContactListProps) {
    const [search, setSearch] = React.useState('');

    const filtered = patients.filter(p =>
        p.first_name.toLowerCase().includes(search.toLowerCase()) ||
        p.last_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-80 border-r border-slate-200 bg-white flex flex-col h-full rounded-l-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-800 mb-2">Mensajes</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        placeholder="Buscar paciente..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-100"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-y-auto flex-1">
                {filtered.map(patient => (
                    <button
                        key={patient.id}
                        onClick={() => onSelect(patient.id)}
                        className={cn(
                            "w-full p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50",
                            selectedPatientId === patient.id && "bg-primary-50 hover:bg-primary-100 border-primary-100" // active state
                        )}
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                            {patient.first_name[0]}{patient.last_name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <span className="font-semibold text-slate-800 truncate">{patient.first_name} {patient.last_name}</span>
                                {/* <span className="text-xs text-slate-400">12:30</span> */}
                            </div>
                            <p className="text-xs text-slate-500 truncate">
                                {patient.phone || 'Sin WhatsApp'}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
