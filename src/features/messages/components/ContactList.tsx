'use client';

import React from 'react';
import { Conversation, ChannelType } from '../types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Channel badge colors
const channelColors: Record<ChannelType, string> = {
    whatsapp: 'bg-green-500',
    telegram: 'bg-blue-500',
    instagram: 'bg-pink-500',
    email: 'bg-amber-500',
    sms: 'bg-purple-500'
};

interface ContactListProps {
    conversations: Conversation[];
    selectedPatientId?: string;
    onSelect: (patientId: string) => void;
    isLoading?: boolean;
}

export function ContactList({ conversations, selectedPatientId, onSelect, isLoading }: ContactListProps) {
    if (isLoading) {
        return (
            <div className="w-full md:w-80 border-r border-slate-200 bg-white flex flex-col h-full">
                <div className="p-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-800">Conversaciones</h2>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse text-slate-400">Cargando...</div>
                </div>
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="w-full md:w-80 border-r border-slate-200 bg-white flex flex-col h-full">
                <div className="p-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-800">Conversaciones</h2>
                </div>
                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm p-4 text-center">
                    No hay conversaciones que coincidan con los filtros
                </div>
            </div>
        );
    }

    return (
        <div className="w-full md:w-80 border-r border-slate-200 bg-white flex flex-col h-full">
            <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-800">Conversaciones</h2>
                <p className="text-xs text-slate-500">{conversations.length} contactos</p>
            </div>

            <div className="overflow-y-auto flex-1">
                {conversations.map(conv => (
                    <button
                        key={conv.patient_id}
                        onClick={() => onSelect(conv.patient_id)}
                        className={cn(
                            "w-full p-3 flex items-start gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 cursor-pointer relative",
                            selectedPatientId === conv.patient_id && "bg-primary-50 hover:bg-primary-100 border-l-4 border-l-primary-500"
                        )}
                    >
                        {/* Avatar with channel indicator */}
                        <div className="relative shrink-0">
                            {conv.patient_avatar ? (
                                <img
                                    src={conv.patient_avatar}
                                    alt={conv.patient_name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                                    {conv.patient_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                            )}
                            {/* Channel indicator */}
                            <div className={cn(
                                "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white",
                                channelColors[conv.channel]
                            )} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                                <span className={cn(
                                    "font-semibold text-slate-800 truncate text-sm",
                                    conv.unread_count > 0 && "font-bold"
                                )}>
                                    {conv.patient_name}
                                </span>
                                <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                                    {formatDistanceToNow(new Date(conv.last_message_at), {
                                        addSuffix: false,
                                        locale: es
                                    })}
                                </span>
                            </div>
                            <p className={cn(
                                "text-xs truncate max-w-[180px]",
                                conv.unread_count > 0 ? "text-slate-700 font-medium" : "text-slate-500"
                            )}>
                                {conv.last_message_direction === 'outbound' && (
                                    <span className="text-primary-500">Tú: </span>
                                )}
                                {conv.last_message || 'Sin mensajes'}
                            </p>
                        </div>

                        {/* Unread badge */}
                        {conv.unread_count > 0 && (
                            <div className="shrink-0">
                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center inline-block">
                                    {conv.unread_count > 99 ? '99+' : conv.unread_count}
                                </span>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
