'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, Clock, FileText, ChevronDown, Check, Sparkles, Search } from 'lucide-react';
import { toast } from 'sonner';
import { createTask, type Patient, type Profile } from '../actions/taskActions';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    patients: Patient[];
    profiles: Profile[];
    onTaskCreated: (task: unknown) => void;
}

const STATUS_OPTIONS = [
    { value: 'todo', label: 'Por Hacer', icon: '📋', color: 'from-slate-400 to-slate-500' },
    { value: 'in_progress', label: 'En Progreso', icon: '🔄', color: 'from-amber-400 to-orange-500' },
    { value: 'done', label: 'Completado', icon: '✅', color: 'from-emerald-400 to-green-500' }
] as const;

// Searchable Patient Selector Component
function SearchablePatientSelect({
    value,
    onChange,
    patients,
    placeholder = "Buscar paciente..."
}: {
    value: string;
    onChange: (value: string) => void;
    patients: Patient[];
    placeholder?: string;
}) {
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

    const selectedPatient = patients.find(p => p.id === value);

    // Filter patients by name, phone, or email
    const filteredPatients = patients.filter(patient => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();

        const nameMatch = patient.full_name.toLowerCase().includes(query);
        const phoneMatch = patient.contact_info?.phone?.toLowerCase().includes(query);
        const emailMatch = patient.contact_info?.email?.toLowerCase().includes(query);

        return nameMatch || phoneMatch || emailMatch;
    });

    const handleSelect = (patientId: string) => {
        onChange(patientId);
        setSearchQuery('');
        setIsOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Paciente
            </label>

            {/* Selected Display / Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 
                           text-left flex items-center justify-between transition-all duration-200
                           hover:bg-white/80 hover:border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
            >
                {selectedPatient ? (
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                            {selectedPatient.full_name.charAt(0)}
                        </div>
                        <div>
                            <span className="text-slate-800 font-medium">{selectedPatient.full_name}</span>
                            {selectedPatient.contact_info?.phone && (
                                <span className="text-xs text-slate-400 ml-2">{selectedPatient.contact_info.phone}</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <span className="text-slate-400">{placeholder}</span>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown with Search */}
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
                        {/* Search Input */}
                        <div className="p-3 border-b border-slate-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar por nombre, teléfono o email..."
                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200
                                               text-sm text-slate-800 placeholder-slate-400
                                               focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-h-64 overflow-y-auto py-2">
                            {/* Clear Selection Option */}
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
                                    <p className="text-xs text-slate-300 mt-1">Intenta con otro término de búsqueda</p>
                                </div>
                            ) : (
                                filteredPatients.map(patient => (
                                    <button
                                        key={patient.id}
                                        type="button"
                                        onClick={() => handleSelect(patient.id)}
                                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors
                                                   ${value === patient.id ? 'bg-sky-50' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 
                                                       flex items-center justify-center text-white font-bold flex-shrink-0">
                                            {patient.full_name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-slate-800 truncate">{patient.full_name}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-2 truncate">
                                                {patient.contact_info?.phone && (
                                                    <span>📱 {patient.contact_info.phone}</span>
                                                )}
                                                {patient.contact_info?.email && (
                                                    <span>✉️ {patient.contact_info.email}</span>
                                                )}
                                            </div>
                                        </div>
                                        {value === patient.id && <Check className="w-4 h-4 text-sky-500 flex-shrink-0" />}
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Custom Select Component for Staff
function CustomSelect({
    label,
    icon: Icon,
    value,
    onChange,
    options,
    placeholder
}: {
    label: string;
    icon: React.ElementType;
    value: string;
    onChange: (value: string) => void;
    options: { id: string; label: string; sublabel?: string }[];
    placeholder: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.id === value);

    return (
        <div ref={ref} className="relative">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5" />
                {label}
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 
                           text-left flex items-center justify-between transition-all duration-200
                           hover:bg-white/80 hover:border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
            >
                <span className={selectedOption ? 'text-slate-800' : 'text-slate-400'}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 py-2 bg-white/95 backdrop-blur-xl rounded-xl 
                                   border border-white/60 shadow-xl shadow-black/10 max-h-48 overflow-y-auto"
                    >
                        <button
                            type="button"
                            onClick={() => { onChange(''); setIsOpen(false); }}
                            className="w-full px-4 py-2.5 text-left text-slate-400 hover:bg-slate-50 transition-colors"
                        >
                            {placeholder}
                        </button>
                        {options.map(option => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => { onChange(option.id); setIsOpen(false); }}
                                className={`w-full px-4 py-2.5 text-left flex items-center justify-between transition-colors
                                           ${value === option.id ? 'bg-sky-50 text-sky-700' : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                                <div>
                                    <div className="font-medium">{option.label}</div>
                                    {option.sublabel && (
                                        <div className="text-xs text-slate-400">{option.sublabel}</div>
                                    )}
                                </div>
                                {value === option.id && <Check className="w-4 h-4 text-sky-500" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Status Selector Component
function StatusSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    return (
        <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Estado
            </label>
            <div className="grid grid-cols-3 gap-2">
                {STATUS_OPTIONS.map(status => (
                    <button
                        key={status.value}
                        type="button"
                        onClick={() => onChange(status.value)}
                        className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5
                                   ${value === status.value
                                ? `bg-gradient-to-r ${status.color} text-white shadow-lg`
                                : 'bg-white/60 text-slate-600 hover:bg-white/80 border border-white/40'}`}
                    >
                        <span>{status.icon}</span>
                        <span className="hidden sm:inline">{status.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export function CreateTaskModal({ isOpen, onClose, patients, profiles, onTaskCreated }: CreateTaskModalProps) {
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedPatient, setSelectedPatient] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState<'todo' | 'in_progress' | 'done'>('todo');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setTitle('');
        setNotes('');
        setSelectedPatient('');
        setAssignedTo('');
        setDueDate('');
        setStatus('todo');
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            toast.error('El título es obligatorio');
            return;
        }

        setIsSubmitting(true);
        try {
            const newTask = await createTask(
                title.trim() + (notes ? `\n---\n${notes}` : ''),
                selectedPatient || null,
                assignedTo || null,
                dueDate ? new Date(dueDate).toISOString() : null,
                status
            );

            if (newTask) {
                toast.success('Tarea creada correctamente');
                onTaskCreated(newTask);
                resetForm();
                onClose();
            } else {
                toast.error('Error al crear la tarea');
            }
        } catch (error) {
            console.error(error);
            toast.error('Ocurrió un error inesperado');
        } finally {
            setIsSubmitting(false);
        }
    };

    const profileOptions = profiles.map(p => ({
        id: p.id,
        label: p.full_name,
        sublabel: p.role === 'doctor' ? 'Doctor' : 'Staff'
    }));

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg bg-gradient-to-br from-white/90 to-white/70 
                                   backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/10 
                                   border border-white/60 overflow-hidden"
                    >
                        {/* Header Gradient */}
                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-sky-400/20 via-purple-400/10 to-pink-400/10 blur-2xl" />

                        {/* Header */}
                        <div className="relative px-6 pt-6 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 
                                               flex items-center justify-center shadow-lg shadow-sky-500/25">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Nueva Tarea</h2>
                                    <p className="text-sm text-slate-500">Crea una tarea para tu equipo</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-slate-100/80 transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="relative px-6 pb-6 space-y-5">
                            {/* Title */}
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                    Título *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="¿Qué necesitas hacer?"
                                    className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 
                                               text-slate-800 placeholder-slate-400 text-lg font-medium
                                               focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-transparent
                                               transition-all duration-200"
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5" />
                                    Notas
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Agrega detalles adicionales..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 
                                               text-slate-700 placeholder-slate-400 text-sm resize-none
                                               focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-transparent
                                               transition-all duration-200"
                                />
                            </div>

                            {/* Patient (Searchable) & Assignee Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <SearchablePatientSelect
                                    value={selectedPatient}
                                    onChange={setSelectedPatient}
                                    patients={patients}
                                    placeholder="Buscar paciente..."
                                />
                                <CustomSelect
                                    label="Asignar a"
                                    icon={User}
                                    value={assignedTo}
                                    onChange={setAssignedTo}
                                    options={profileOptions}
                                    placeholder="Opcional"
                                />
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Fecha Límite
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 
                                               text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400/50 
                                               focus:border-transparent transition-all duration-200
                                               [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                                />
                            </div>

                            {/* Status */}
                            <StatusSelector value={status} onChange={(v) => setStatus(v as typeof status)} />

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold
                                               hover:bg-slate-200 transition-all duration-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !title.trim()}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 
                                               text-white font-semibold shadow-lg shadow-sky-500/25
                                               hover:shadow-xl hover:shadow-sky-500/30 hover:from-sky-400 hover:to-blue-500
                                               disabled:opacity-50 disabled:cursor-not-allowed
                                               transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            Crear Tarea
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
