'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, Check, Search, X, Plus } from 'lucide-react';

export interface PatientOption {
    id: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    contact_info?: {
        phone?: string;
        email?: string;
    };
    phone?: string;
    email?: string;
}

interface SearchablePatientSelectProps {
    value: string;
    onChange: (value: string) => void;
    patients: PatientOption[];
    placeholder?: string;
    label?: string;
    onCreateNew?: () => void;
    required?: boolean;
}

export function SearchablePatientSelect({
    value,
    onChange,
    patients,
    placeholder = "Buscar paciente...",
    label = "Paciente",
    onCreateNew,
    required = false
}: SearchablePatientSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const getPatientName = (patient: PatientOption) => {
        if (patient.full_name) return patient.full_name;
        return `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
    };

    const getPatientPhone = (patient: PatientOption) => {
        return patient.contact_info?.phone || patient.phone || null;
    };

    const getPatientEmail = (patient: PatientOption) => {
        return patient.contact_info?.email || patient.email || null;
    };

    const selectedPatient = patients.find(p => p.id === value);

    const filteredPatients = patients.filter(patient => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        const name = getPatientName(patient).toLowerCase();
        const phone = getPatientPhone(patient)?.toLowerCase() || '';
        const email = getPatientEmail(patient)?.toLowerCase() || '';
        return name.includes(query) || phone.includes(query) || email.includes(query);
    });

    const handleSelect = (patientId: string) => {
        onChange(patientId);
        setSearchQuery('');
        setIsOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            {label && (
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {label} {required && <span className="text-red-400">*</span>}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40
                           text-left flex items-center justify-between transition-all duration-200
                           hover:bg-white/80 hover:border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50"
            >
                {selectedPatient ? (
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                            {getPatientName(selectedPatient).charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <span className="text-slate-800 font-medium">{getPatientName(selectedPatient)}</span>
                            {getPatientPhone(selectedPatient) && (
                                <span className="text-xs text-slate-400 ml-2">{getPatientPhone(selectedPatient)}</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <span className="text-slate-400">{placeholder}</span>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl rounded-xl
                                   border border-white/60 shadow-xl shadow-black/10 overflow-hidden"
                    >
                        <div className="p-3 border-b border-slate-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar por nombre, telefono o email..."
                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200
                                               text-sm text-slate-800 placeholder-slate-400
                                               focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto py-2">
                            {value && (
                                <button
                                    type="button"
                                    onClick={() => handleSelect('')}
                                    className="w-full px-4 py-2.5 text-left text-slate-400 hover:bg-slate-50 transition-colors flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Quitar paciente
                                </button>
                            )}

                            {filteredPatients.length === 0 ? (
                                <div className="px-4 py-8 text-center">
                                    <User className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                                    <p className="text-sm text-slate-400">No se encontraron pacientes</p>
                                    <p className="text-xs text-slate-300 mt-1">Intenta con otro termino de busqueda</p>
                                    {onCreateNew && (
                                        <button
                                            type="button"
                                            onClick={() => { onCreateNew(); setIsOpen(false); }}
                                            className="mt-3 px-4 py-2 rounded-lg bg-primary-50 text-primary-600 text-sm font-medium
                                                       hover:bg-primary-100 transition-colors flex items-center gap-2 mx-auto"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Crear nuevo paciente
                                        </button>
                                    )}
                                </div>
                            ) : (
                                filteredPatients.map(patient => (
                                    <button
                                        key={patient.id}
                                        type="button"
                                        onClick={() => handleSelect(patient.id)}
                                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors
                                                   ${value === patient.id ? 'bg-primary-50' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600
                                                       flex items-center justify-center text-white font-bold flex-shrink-0">
                                            {getPatientName(patient).charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-slate-800 truncate">{getPatientName(patient)}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-2 truncate">
                                                {getPatientPhone(patient) && (
                                                    <span>📱 {getPatientPhone(patient)}</span>
                                                )}
                                                {getPatientEmail(patient) && (
                                                    <span>✉️ {getPatientEmail(patient)}</span>
                                                )}
                                            </div>
                                        </div>
                                        {value === patient.id && <Check className="w-4 h-4 text-primary-500 flex-shrink-0" />}
                                    </button>
                                ))
                            )}

                            {filteredPatients.length > 0 && onCreateNew && (
                                <div className="border-t border-slate-100 mt-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => { onCreateNew(); setIsOpen(false); }}
                                        className="w-full px-4 py-2.5 text-left text-primary-600 hover:bg-primary-50 transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Crear nuevo paciente
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
