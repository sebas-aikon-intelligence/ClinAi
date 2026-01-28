'use client';

import React, { useState, useEffect } from 'react';
import { useMessages } from '@/features/messages/hooks/useMessages';
import { createTemplate } from '@/features/messages/actions/messageActions';
import { MessageTemplate } from '@/features/messages/types';
import { Plus, Search, FileText, Loader2, Copy } from 'lucide-react';
import { toast } from 'sonner';

export function TemplatesManager() {
    const { templates, isLoading } = useMessages(); // Reusing hook which fetches templates
    const [localTemplates, setLocalTemplates] = useState<MessageTemplate[]>([]);
    const [search, setSearch] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ name: '', content: '' });

    useEffect(() => {
        setLocalTemplates(templates);
    }, [templates]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const created = await createTemplate(newTemplate);
        if (created) {
            setLocalTemplates(prev => [...prev, created]);
            setIsCreating(false);
            setNewTemplate({ name: '', content: '' });
            toast.success('Plantilla creada');
        } else {
            toast.error('Error al crear plantilla');
        }
    };

    const filtered = localTemplates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Plantillas de Mensajes</h2>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg shadow-primary-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Plantilla
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    placeholder="Buscar plantillas..."
                    className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-primary-100 shadow-md animate-in slide-in-from-top-4 space-y-4">
                    <h3 className="font-bold text-slate-800">Nueva Plantilla</h3>
                    <input
                        required
                        placeholder="Nombre (ej. Recordatorio Cita)"
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                        value={newTemplate.name}
                        onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    />
                    <textarea
                        required
                        placeholder="Contenido del mensaje..."
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200 h-24 resize-none"
                        value={newTemplate.content}
                        onChange={e => setNewTemplate({ ...newTemplate, content: e.target.value })}
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Guardar</button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading && localTemplates.length === 0 ? (
                    <div className="col-span-full flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>
                ) : filtered.map(template => (
                    <div key={template.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary-500" />
                                <h3 className="font-bold text-slate-800">{template.name}</h3>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(template.content);
                                    toast.success('Copiado al portapapeles');
                                }}
                                className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                title="Copiar contenido"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {template.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
