'use client';

import { createPortal } from 'react-dom';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createAppointment } from '../actions/appointmentActions';
import { getPatients } from '@/features/patients/actions/patientActions';
import { Patient } from '@/features/patients/types';
import { Loader2, Calendar as CalendarIcon, Clock, X, Sparkles, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { SearchablePatientSelect } from '@/shared/components/SearchablePatientSelect';
import { CreatePatientModal } from '@/features/patients/components/CreatePatientModal';

interface CreateAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDate?: Date;
}

const APPOINTMENT_TYPES = [
    { value: 'consultation', label: 'Consulta', color: 'from-blue-400 to-blue-600', icon: '🩺' },
    { value: 'follow_up', label: 'Seguimiento', color: 'from-purple-400 to-purple-600', icon: '📋' },
    { value: 'procedure', label: 'Procedimiento', color: 'from-red-400 to-red-600', icon: '⚕️' },
    { value: 'emergency', label: 'Urgencia', color: 'from-amber-400 to-amber-600', icon: '🚨' },
] as const;

export function CreateAppointmentModal({ isOpen, onClose, initialDate }: CreateAppointmentModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [isCreatePatientOpen, setIsCreatePatientOpen] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [patientId, setPatientId] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [type, setType] = useState<string>('consultation');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadPatients();
            if (initialDate) {
                setDate(initialDate.toISOString().split('T')[0]);
                const now = new Date();
                const nextHour = now.getHours() + 1;
                setStartTime(`${String(nextHour).padStart(2, '0')}:00`);
                setEndTime(`${String(nextHour + 1).padStart(2, '0')}:00`);
            }
        }
    }, [isOpen, initialDate]);

    const loadPatients = async () => {
        setLoadingPatients(true);
        try {
            const data = await getPatients();
            setPatients(data);
        } catch (error) {
            console.error('Failed to load patients', error);
            toast.error('Error al cargar pacientes');
        } finally {
            setLoadingPatients(false);
        }
    };

    const handlePatientCreated = async () => {
        setIsCreatePatientOpen(false);
        await loadPatients();
        toast.success('Lista de pacientes actualizada');
    };

    const resetForm = () => {
        setTitle('');
        setPatientId('');
        setDate('');
        setStartTime('');
        setEndTime('');
        setType('consultation');
        setNotes('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!patientId) {
            toast.error('Selecciona un paciente');
            return;
        }

        if (!date || !startTime || !endTime) {
            toast.error('Completa la fecha y horarios');
            return;
        }

        setIsLoading(true);

        try {
            // Create proper ISO date strings
            const startDateTime = new Date(`${date}T${startTime}:00`);
            const endDateTime = new Date(`${date}T${endTime}:00`);

            // Note: title and notes fields require DB migration to work
            // For now, only send fields that exist in the current schema
            await createAppointment({
                patient_id: patientId,
                start_time: startDateTime,
                end_time: endDateTime,
                type: type as 'consultation' | 'follow_up' | 'procedure' | 'emergency'
                // title and notes disabled until migration is applied
            });

            toast.success('Cita agendada correctamente');
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            toast.error(`Error al agendar: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

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
                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary-400/20 via-purple-400/10 to-pink-400/10 blur-2xl" />

                        {/* Header */}
                        <div className="relative px-6 pt-6 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600
                                               flex items-center justify-center shadow-lg shadow-primary-500/25">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Nueva Cita</h2>
                                    <p className="text-sm text-slate-500">Agenda una cita con un paciente</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-slate-100/80 transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Form with scrolling */}
                        <div className="relative max-h-[70vh] overflow-y-auto px-6 pb-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Patient Selector */}
                                {loadingPatients ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                                    </div>
                                ) : (
                                    <SearchablePatientSelect
                                        value={patientId}
                                        onChange={setPatientId}
                                        patients={patients}
                                        placeholder="Buscar paciente..."
                                        label="Paciente"
                                        required
                                    />
                                )}

                                {/* Title */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                        Titulo o Motivo
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Ej: Consulta General (opcional)"
                                        className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40
                                               text-slate-800 placeholder-slate-400
                                               focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-transparent
                                               transition-all duration-200"
                                    />
                                </div>

                                {/* Appointment Type */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Activity className="w-3.5 h-3.5" />
                                        Tipo de Cita
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {APPOINTMENT_TYPES.map((t) => (
                                            <button
                                                key={t.value}
                                                type="button"
                                                onClick={() => setType(t.value)}
                                                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                                                       flex items-center justify-center gap-2
                                                       ${type === t.value
                                                        ? `bg-gradient-to-r ${t.color} text-white shadow-lg`
                                                        : 'bg-white/60 text-slate-600 hover:bg-white/80 border border-white/40'}`}
                                            >
                                                <span>{t.icon}</span>
                                                <span>{t.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <CalendarIcon className="w-3.5 h-3.5" />
                                        Fecha
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40
                                               text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-400/50
                                               focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                {/* Time Range */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            Hora Inicio
                                        </label>
                                        <input
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40
                                                   text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-400/50
                                                   focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            Hora Fin
                                        </label>
                                        <input
                                            type="time"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40
                                                   text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-400/50
                                                   focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                        Notas (opcional)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Detalles adicionales..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40
                                               text-slate-700 placeholder-slate-400 text-sm resize-none
                                               focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-transparent
                                               transition-all duration-200"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold
                                               hover:bg-slate-200 transition-all duration-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !patientId}
                                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600
                                               text-white font-semibold shadow-lg shadow-primary-500/25
                                               hover:shadow-xl hover:shadow-primary-500/30 hover:from-primary-400 hover:to-primary-500
                                               disabled:opacity-50 disabled:cursor-not-allowed
                                               transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4" />
                                                Agendar Cita
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            {isCreatePatientOpen && (
                <CreatePatientModal
                    isOpen={isCreatePatientOpen}
                    onClose={handlePatientCreated}
                />
            )}
        </AnimatePresence>
    );
}
