'use client';
import { createPortal } from 'react-dom';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { updateAppointment, deleteAppointment } from '../actions/appointmentActions';
import { Appointment } from '../types';
import { Loader2, Calendar as CalendarIcon, Clock, User, FileText, Activity, Trash2, CheckCircle, XCircle, Pencil, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment | null;
}

export function AppointmentModal({ isOpen, onClose, appointment }: AppointmentModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Edit form state
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [type, setType] = useState('consultation');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (appointment) {
            setTitle(appointment.title ?? '');
            const start = new Date(appointment.start_time);
            const end = new Date(appointment.end_time);
            setDate(start.toISOString().split('T')[0]);
            setStartTime(start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
            setEndTime(end.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
            setType(appointment.type ?? 'consultation');
            setNotes(appointment.notes ?? '');
            setIsEditing(false); // Reset edit mode on new appointment
        }
    }, [appointment]);



    const handleStatusChange = async (newStatus: Appointment['status']) => {
        if (!appointment) return;
        setIsLoading(true);
        try {
            await updateAppointment(appointment.id, { status: newStatus });
            toast.success(`Cita marcada como ${newStatus}`);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Error al actualizar la cita');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!appointment) return;
        setIsLoading(true);
        try {
            const startDateTime = new Date(`${date}T${startTime}`);
            const endDateTime = new Date(`${date}T${endTime}`);

            await updateAppointment(appointment.id, {
                title,
                start_time: startDateTime,
                end_time: endDateTime,
                type: type as Appointment['type'],
                notes
            });
            toast.success('Cita actualizada correctamente');
            setIsEditing(false);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar cambios');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!appointment) return;
        if (!confirm('¿Estás seguro de eliminar esta cita?')) return;

        setIsLoading(true);
        try {
            await deleteAppointment(appointment.id);
            toast.success('Cita eliminada');
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Error al eliminar la cita');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || !appointment) return null;

    const modalContent = (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white/90 backdrop-blur-xl border-white/20 z-[100]">
                <DialogHeader>
                    <div className="flex justify-between items-start">
                        <DialogTitle className="text-xl font-bold text-slate-800 pr-8">
                            {isEditing ? 'Editar Cita' : "Detalles de la Cita"}
                        </DialogTitle>
                        {!isEditing && (
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' :
                                appointment.status === 'completed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                        'bg-amber-100 text-amber-700 border-amber-200'
                                }`}>
                                {appointment.status.replace('_', ' ')}
                            </span>
                        )}
                    </div>
                </DialogHeader>

                {isEditing ? (
                    <form onSubmit={handleSave} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Título</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Fecha</Label>
                                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Tipo</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="consultation">Consulta</SelectItem>
                                        <SelectItem value="follow_up">Seguimiento</SelectItem>
                                        <SelectItem value="procedure">Procedimiento</SelectItem>
                                        <SelectItem value="emergency">Urgencia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Inicio</Label>
                                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Fin</Label>
                                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Notas</Label>
                            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="h-20" />
                        </div>
                        <DialogFooter className="gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                            <Button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white">
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Guardar
                            </Button>
                        </DialogFooter>
                    </form>
                ) : (
                    <div className="py-2 space-y-4">
                        <div className="text-xl font-bold text-slate-800">{appointment.title}</div>

                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <CalendarIcon className="w-5 h-5 text-primary-500 mt-0.5" />
                            <div>
                                <div className="font-medium text-slate-800">{formatDate(appointment.start_time)}</div>
                                <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <Activity className="w-5 h-5 text-indigo-500" />
                            <div className="capitalize">{appointment.type}</div>
                        </div>

                        {appointment.notes && (
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <FileText className="w-4 h-4" /> Notas
                                </div>
                                <p className="text-sm text-slate-600 pl-6 whitespace-pre-wrap">{appointment.notes}</p>
                            </div>
                        )}

                        <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-between w-full pt-4 border-t border-slate-100">
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                    disabled={isLoading}
                                    className="text-slate-600 hover:bg-slate-50"
                                >
                                    <Pencil className="w-4 h-4 mr-2" /> Editar
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                    className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                                >
                                    <Trash2 className="w-4 h-4 lg:mr-2" /> <span className="hidden lg:inline">Eliminar</span>
                                </Button>
                            </div>

                            <div className="flex gap-2">
                                {appointment.status !== 'cancelled' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleStatusChange('cancelled')}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </Button>
                                )}

                                {appointment.status !== 'confirmed' && appointment.status !== 'completed' && (
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        size="sm"
                                        onClick={() => handleStatusChange('confirmed')}
                                        disabled={isLoading}
                                    >
                                        Confirm
                                    </Button>
                                )}

                                {appointment.status === 'confirmed' && (
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        size="sm"
                                        onClick={() => handleStatusChange('completed')}
                                        disabled={isLoading}
                                    >
                                        Complete
                                    </Button>
                                )}
                            </div>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );

    return createPortal(modalContent, document.body);
}
