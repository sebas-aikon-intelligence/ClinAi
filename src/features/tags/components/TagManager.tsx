'use client';

import React, { useState } from 'react';
import { useTags } from '../hooks/useTags';
import { createTag, updateTag, deleteTag } from '../actions/tagActions';
import { TagBadge } from './TagBadge';
import { Loader2, Plus, Edit2, Trash2, X } from 'lucide-react';
import { CreateTagInput } from '../types';
import { cn } from '@/lib/utils';

const COLORS = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#06B6D4', // Cyan
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#64748B', // Slate
];

export function TagManager() {
    const { tags, isLoading, refreshTags } = useTags();
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<CreateTagInput>({ name: '', color: COLORS[0], type: 'general' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (isEditing === 'new') {
                await createTag(editForm);
            } else if (isEditing) {
                await updateTag(isEditing, editForm);
            }
            await refreshTags();
            setIsEditing(null);
            setEditForm({ name: '', color: COLORS[0], type: 'general' });
        } catch (error) {
            console.error('Failed to save tag', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEdit = (tag?: any) => {
        if (tag) {
            setIsEditing(tag.id);
            setEditForm({ name: tag.name, color: tag.color, type: tag.type });
        } else {
            setIsEditing('new');
            setEditForm({ name: '', color: COLORS[0], type: 'general' });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta etiqueta?')) return;
        setIsSubmitting(true);
        await deleteTag(id);
        await refreshTags();
        setIsSubmitting(false);
    };

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-slate-400" /></div>;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-800">Gestionar Etiquetas</h2>
                <button
                    onClick={() => startEdit()}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Nueva Etiqueta
                </button>
            </div>

            <div className="divide-y divide-slate-100">
                {tags.map(tag => (
                    <div key={tag.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <TagBadge tag={tag} />
                        <div className="flex gap-2">
                            <button
                                onClick={() => startEdit(tag)}
                                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(tag.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                {tags.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        No hay etiquetas creadas aún.
                    </div>
                )}
            </div>

            {/* Edit Modal / Slide-over could go here, but using inline form for simplicity or a simple absolute overlay */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold">
                                {isEditing === 'new' ? 'Nueva Etiqueta' : 'Editar Etiqueta'}
                            </h3>
                            <button onClick={() => setIsEditing(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.name}
                                    onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                    placeholder="Ej. VIP, Deudor, Nuevo"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                                <div className="flex flex-wrap gap-2">
                                    {COLORS.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setEditForm(prev => ({ ...prev, color }))}
                                            className={cn(
                                                "w-8 h-8 rounded-full transition-all ring-2 ring-offset-2",
                                                editForm.color === color ? "ring-slate-400 scale-110" : "ring-transparent hover:scale-105"
                                            )}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(null)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
