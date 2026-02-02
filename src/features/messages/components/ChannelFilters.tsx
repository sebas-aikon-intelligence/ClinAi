'use client';

import React from 'react';
import { MessagesFilter, ChannelType } from '../types';
import { Search, Bot, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

// Channel icons - using Lucide icons
const channelConfig: Record<ChannelType | 'all', { label: string; color: string; icon: string }> = {
    all: { label: 'Todos', color: 'bg-slate-500', icon: '📬' },
    whatsapp: { label: 'WhatsApp', color: 'bg-green-500', icon: '💬' },
    telegram: { label: 'Telegram', color: 'bg-blue-500', icon: '✈️' },
    instagram: { label: 'Instagram', color: 'bg-pink-500', icon: '📸' },
    email: { label: 'Email', color: 'bg-amber-500', icon: '📧' },
    sms: { label: 'SMS', color: 'bg-purple-500', icon: '📱' }
};

interface ChannelFiltersProps {
    filter: MessagesFilter;
    onFilterChange: (filter: MessagesFilter) => void;
    unreadCount: number;
}

export function ChannelFilters({ filter, onFilterChange, unreadCount }: ChannelFiltersProps) {
    const channels: (ChannelType | 'all')[] = ['all', 'whatsapp', 'telegram', 'instagram', 'email', 'sms'];

    return (
        <div className="h-full flex flex-col bg-white border-r border-slate-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Inbox</h2>
                <p className="text-xs text-slate-500">Gestiona tus conversaciones</p>
            </div>

            {/* Search */}
            <div className="p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar contacto..."
                        value={filter.search}
                        onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                    />
                </div>
            </div>

            {/* Status Filter */}
            <div className="px-3 pb-3">
                <div className="flex rounded-lg bg-slate-100 p-1">
                    <button
                        onClick={() => onFilterChange({ ...filter, status: 'all' })}
                        className={cn(
                            "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                            filter.status === 'all'
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => onFilterChange({ ...filter, status: 'unread' })}
                        className={cn(
                            "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1",
                            filter.status === 'unread'
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        No leídos
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Assignment Filter (Human vs AI) */}
            <div className="px-3 pb-3">
                <p className="px-1 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Asignación</p>
                <div className="flex rounded-lg bg-slate-100 p-1">
                    <button
                        onClick={() => onFilterChange({ ...filter, assignedTo: 'all' })}
                        className={cn(
                            "flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1",
                            filter.assignedTo === 'all'
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <Users className="w-3 h-3" />
                        Todos
                    </button>
                    <button
                        onClick={() => onFilterChange({ ...filter, assignedTo: 'human' })}
                        className={cn(
                            "flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1",
                            filter.assignedTo === 'human'
                                ? "bg-amber-100 text-amber-700 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <User className="w-3 h-3" />
                        Humano
                    </button>
                    <button
                        onClick={() => onFilterChange({ ...filter, assignedTo: 'ai' })}
                        className={cn(
                            "flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1",
                            filter.assignedTo === 'ai'
                                ? "bg-green-100 text-green-700 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <Bot className="w-3 h-3" />
                        IA
                    </button>
                </div>
            </div>

            {/* Channels */}
            <div className="flex-1 overflow-y-auto px-2">
                <p className="px-2 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Canales</p>
                <div className="space-y-1">
                    {channels.map((channel) => {
                        const config = channelConfig[channel];
                        const isActive = filter.channel === channel;

                        return (
                            <button
                                key={channel}
                                onClick={() => onFilterChange({ ...filter, channel })}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer",
                                    isActive
                                        ? "bg-primary-50 text-primary-700 border border-primary-200"
                                        : "hover:bg-slate-50 text-slate-600"
                                )}
                            >
                                <span className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm",
                                    config.color
                                )}>
                                    {config.icon}
                                </span>
                                <span className="text-sm font-medium">{config.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* AI Toggle Info */}
            <div className="p-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Bot className="w-4 h-4" />
                    <span>IA activa por defecto</span>
                </div>
            </div>
        </div>
    );
}
