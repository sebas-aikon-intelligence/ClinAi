'use client';

import React, { useState, useTransition } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Plus, Loader2, Trash2, User, Clock } from 'lucide-react';
import { toggleTaskComplete, deleteTask, updateTaskStatus, type Task, type Patient, type Profile } from '../actions/taskActions';
import { CreateTaskModal } from './CreateTaskModal';

interface TasksListProps {
    initialTasks: Task[];
    patients: Patient[];
    profiles: Profile[];
}

const STATUS_OPTIONS = [
    { value: 'todo', label: 'Por Hacer', color: 'bg-slate-200 text-slate-700' },
    { value: 'in_progress', label: 'En Progreso', color: 'bg-amber-100 text-amber-700' },
    { value: 'done', label: 'Completado', color: 'bg-emerald-100 text-emerald-700' }
] as const;

export function TasksList({ initialTasks, patients, profiles }: TasksListProps) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const pendingTasks = tasks.filter(t => t.status !== 'done');
    const completedTasks = tasks.filter(t => t.status === 'done');

    const handleTaskCreated = (newTask: unknown) => {
        setTasks(prev => [newTask as Task, ...prev]);
    };

    const handleStatusChange = (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
        startTransition(async () => {
            const success = await updateTaskStatus(taskId, newStatus);
            if (success) {
                setTasks(prev => prev.map(t =>
                    t.id === taskId ? { ...t, status: newStatus } : t
                ));
            }
        });
    };

    const handleToggleComplete = (taskId: string, currentStatus: string) => {
        startTransition(async () => {
            const success = await toggleTaskComplete(taskId, currentStatus);
            if (success) {
                setTasks(prev => prev.map(t =>
                    t.id === taskId
                        ? { ...t, status: currentStatus === 'done' ? 'todo' : 'done' as const }
                        : t
                ));
            }
        });
    };

    const handleDeleteTask = (taskId: string) => {
        startTransition(async () => {
            const success = await deleteTask(taskId);
            if (success) {
                setTasks(prev => prev.filter(t => t.id !== taskId));
            }
        });
    };

    const formatDueDate = (date: string | null) => {
        if (!date) return null;
        const d = new Date(date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (d.toDateString() === today.toDateString()) return 'Hoy';
        if (d.toDateString() === tomorrow.toDateString()) return 'Mañana';
        return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    };

    const getStatusStyle = (status: string) => {
        return STATUS_OPTIONS.find(s => s.value === status)?.color || 'bg-slate-200 text-slate-700';
    };

    return (
        <>
            <GlassCard className="h-full">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900">
                        Tareas Pendientes
                    </h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="p-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white 
                                   shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 
                                   transition-all duration-200 hover:scale-105"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                    {pendingTasks.length === 0 && (
                        <div className="text-center py-12 text-slate-400">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                                <Clock className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="font-medium">No hay tareas pendientes</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-sky-500 hover:text-sky-600 text-sm mt-2 font-medium"
                            >
                                + Crear una nueva tarea
                            </button>
                        </div>
                    )}

                    {pendingTasks.map((task) => (
                        <div
                            key={task.id}
                            className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 backdrop-blur-sm 
                                       hover:bg-white/80 border border-white/40 transition-all group"
                        >
                            <button
                                onClick={() => handleToggleComplete(task.id, task.status)}
                                className="mt-0.5 text-slate-300 hover:text-sky-500 transition-colors disabled:opacity-50"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Circle className="w-5 h-5" strokeWidth={2} />
                                )}
                            </button>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800">{task.title.split('\n---\n')[0]}</p>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    {/* Custom Status Pill */}
                                    <div className="relative group/status">
                                        <button
                                            className={cn(
                                                "text-xs px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1",
                                                getStatusStyle(task.status)
                                            )}
                                            onClick={() => {
                                                const currentIndex = STATUS_OPTIONS.findIndex(s => s.value === task.status);
                                                const nextIndex = (currentIndex + 1) % STATUS_OPTIONS.length;
                                                handleStatusChange(task.id, STATUS_OPTIONS[nextIndex].value);
                                            }}
                                            disabled={isPending}
                                        >
                                            {STATUS_OPTIONS.find(s => s.value === task.status)?.label}
                                        </button>
                                    </div>

                                    {task.patients?.full_name && (
                                        <span className="text-xs text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {task.patients.full_name}
                                        </span>
                                    )}
                                    {task.profiles?.full_name && (
                                        <span className="text-xs text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full font-medium">
                                            → {task.profiles.full_name}
                                        </span>
                                    )}
                                    {task.due_date && (
                                        <span className="text-xs text-slate-500 font-medium">
                                            📅 {formatDueDate(task.due_date)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 
                                           hover:bg-red-50 rounded-lg transition-all"
                                disabled={isPending}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {completedTasks.length > 0 && (
                        <div className="pt-4 mt-4 border-t border-slate-200/50">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                ✓ Completadas ({completedTasks.length})
                            </p>
                            {completedTasks.slice(0, 3).map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center gap-3 p-2.5 rounded-xl group hover:bg-white/40 transition-colors"
                                >
                                    <button
                                        onClick={() => handleToggleComplete(task.id, task.status)}
                                        className="text-emerald-500 hover:text-slate-400 transition-colors"
                                        disabled={isPending}
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                    </button>
                                    <p className="text-sm text-slate-400 line-through flex-1">
                                        {task.title.split('\n---\n')[0]}
                                    </p>
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                                        disabled={isPending}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </GlassCard>

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                patients={patients}
                profiles={profiles}
                onTaskCreated={handleTaskCreated}
            />
        </>
    );
}
