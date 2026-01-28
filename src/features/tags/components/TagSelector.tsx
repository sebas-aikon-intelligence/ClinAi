'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Tag } from '../types';
import { TagBadge } from './TagBadge';
import { Plus, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTags } from '../hooks/useTags';

interface TagSelectorProps {
    selectedTagIds: string[];
    onSelect: (tagId: string) => void;
    onRemove: (tagId: string) => void;
    className?: string;
}

export function TagSelector({ selectedTagIds, onSelect, onRemove, className }: TagSelectorProps) {
    const { tags, isLoading } = useTags();
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedTags = tags.filter(tag => selectedTagIds.includes(tag.id));

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map(tag => (
                    <TagBadge key={tag.id} tag={tag} onRemove={() => onRemove(tag.id)} />
                ))}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-dashed border-slate-300 text-slate-500 text-sm hover:border-primary-400 hover:text-primary-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Etiqueta
                </button>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 z-50 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-2 px-2 py-1.5 border-b border-slate-100 mb-2">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar etiqueta..."
                            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-1">
                        {isLoading ? (
                            <div className="p-2 text-center text-xs text-slate-400">Cargando...</div>
                        ) : filteredTags.length === 0 ? (
                            <div className="p-2 text-center text-xs text-slate-400">No se encontraron etiquetas</div>
                        ) : (
                            filteredTags.map(tag => {
                                const isSelected = selectedTagIds.includes(tag.id);
                                return (
                                    <button
                                        key={tag.id}
                                        onClick={() => {
                                            if (isSelected) onRemove(tag.id);
                                            else onSelect(tag.id);
                                            setSearch('');
                                        }}
                                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors text-left"
                                    >
                                        <TagBadge tag={tag} size="sm" />
                                        {isSelected && <Check className="w-3 h-3 text-primary-600" />}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
