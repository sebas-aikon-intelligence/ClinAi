'use client';

import React, { useState, useEffect } from 'react';
import { ChannelFilters } from './ChannelFilters';
import { ContactList } from './ContactList';
import { ChatWindow } from './ChatWindow';
import { MessageInput } from './MessageInput';
import { useConversations } from '../hooks/useConversations';
import { useMessages } from '../hooks/useMessages';
import { Conversation, ChannelType } from '../types';
import { Menu, X, ArrowLeft, Bot, BotOff, User, Phone, Mail, UserCheck, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Channel config for header badge
const channelConfig: Record<ChannelType, { label: string; color: string }> = {
    whatsapp: { label: 'WhatsApp', color: 'bg-green-100 text-green-700' },
    telegram: { label: 'Telegram', color: 'bg-blue-100 text-blue-700' },
    instagram: { label: 'Instagram', color: 'bg-pink-100 text-pink-700' },
    email: { label: 'Email', color: 'bg-amber-100 text-amber-700' },
    sms: { label: 'SMS', color: 'bg-purple-100 text-purple-700' }
};

export default function MessagesView() {
    const { conversations, isLoading, filter, setFilter, markAsRead, toggleAI, handoffToHuman, returnToAI } = useConversations();
    const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>();
    const [mobileView, setMobileView] = useState<'filters' | 'contacts' | 'chat'>('contacts');
    const [showFiltersOnDesktop, setShowFiltersOnDesktop] = useState(true);

    const { messages, templates, isLoading: messagesLoading, send } = useMessages(selectedPatientId);

    // Find current conversation
    const currentConversation = conversations.find(c => c.patient_id === selectedPatientId);

    // Total unread count
    const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

    // Mark as read when selecting conversation
    const handleSelectConversation = (patientId: string) => {
        setSelectedPatientId(patientId);
        markAsRead(patientId);
        setMobileView('chat');
    };

    // Auto-select first conversation on desktop
    useEffect(() => {
        if (!selectedPatientId && conversations.length > 0 && window.innerWidth >= 768) {
            setSelectedPatientId(conversations[0].patient_id);
        }
    }, [conversations, selectedPatientId]);

    return (
        <div className="h-[calc(100vh-120px)] flex bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Column 1: Filters (hidden on mobile, toggleable on desktop) */}
            <div className={cn(
                "hidden lg:flex flex-col w-56 shrink-0 transition-all",
                !showFiltersOnDesktop && "lg:hidden"
            )}>
                <ChannelFilters
                    filter={filter}
                    onFilterChange={setFilter}
                    unreadCount={totalUnread}
                />
            </div>

            {/* Column 2: Contacts List */}
            <div className={cn(
                "flex flex-col border-l border-slate-200",
                // Mobile: show only when contacts view is active
                mobileView === 'contacts' ? "flex w-full md:w-80" : "hidden md:flex md:w-80"
            )}>
                {/* Mobile header */}
                <div className="md:hidden flex items-center justify-between p-3 border-b border-slate-100">
                    <button
                        onClick={() => setMobileView('filters')}
                        className="p-2 rounded-lg hover:bg-slate-100"
                    >
                        <Menu className="w-5 h-5 text-slate-600" />
                    </button>
                    <h2 className="font-bold text-slate-800">Mensajes</h2>
                    <div className="w-9" /> {/* Spacer */}
                </div>

                <ContactList
                    conversations={conversations}
                    selectedPatientId={selectedPatientId}
                    onSelect={handleSelectConversation}
                    isLoading={isLoading}
                />
            </div>

            {/* Column 3: Chat Window */}
            <div className={cn(
                "flex-1 flex flex-col bg-slate-50 border-l border-slate-200",
                // Mobile: show only when chat view is active
                mobileView === 'chat' ? "flex" : "hidden md:flex"
            )}>
                {selectedPatientId && currentConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                {/* Back button on mobile */}
                                <button
                                    onClick={() => setMobileView('contacts')}
                                    className="md:hidden p-2 rounded-lg hover:bg-slate-100"
                                >
                                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                                </button>

                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                                    {currentConversation.patient_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>

                                {/* Name and channel */}
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">
                                        {currentConversation.patient_name}
                                    </h3>
                                    <span className={cn(
                                        "px-2 py-0.5 text-xs rounded-full font-medium",
                                        channelConfig[currentConversation.channel].color
                                    )}>
                                        {channelConfig[currentConversation.channel].label}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Handoff indicator */}
                                {currentConversation.assigned_to_human && (
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span>Requiere atención</span>
                                    </div>
                                )}

                                {/* AI Toggle / Return to AI button */}
                                {currentConversation.assigned_to_human ? (
                                    <button
                                        onClick={() => returnToAI(currentConversation.patient_id)}
                                        className="p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200"
                                    >
                                        <Bot className="w-4 h-4" /> Devolver a IA
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => toggleAI(currentConversation.patient_id, !currentConversation.ai_enabled)}
                                            className={cn(
                                                "p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium",
                                                currentConversation.ai_enabled
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                            )}
                                        >
                                            {currentConversation.ai_enabled ? (
                                                <><Bot className="w-4 h-4" /> IA On</>
                                            ) : (
                                                <><BotOff className="w-4 h-4" /> IA Off</>
                                            )}
                                        </button>
                                        {/* Manual handoff button */}
                                        <button
                                            onClick={() => handoffToHuman(currentConversation.patient_id, 'Manual handoff')}
                                            className="p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-600 hover:bg-amber-100"
                                            title="Pasar a humano"
                                        >
                                            <UserCheck className="w-4 h-4" />
                                        </button>
                                    </>
                                )}

                                {/* View profile */}
                                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                                    <User className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <ChatWindow messages={messages} isLoading={messagesLoading} />

                        {/* Input */}
                        <MessageInput
                            onSend={(text) => send(text, currentConversation.channel)}
                            templates={templates}
                            disabled={messagesLoading}
                            aiEnabled={currentConversation.ai_enabled}
                            onToggleAI={() => toggleAI(currentConversation.patient_id, !currentConversation.ai_enabled)}
                            sessionId={currentConversation.patient_id}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-gradient-to-b from-slate-50 to-slate-100">
                        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-lg font-medium text-slate-500">Selecciona una conversación</p>
                        <p className="text-sm text-slate-400">Elige un contacto de la lista para ver los mensajes</p>
                    </div>
                )}
            </div>

            {/* Mobile Filters Overlay */}
            {mobileView === 'filters' && (
                <div className="md:hidden fixed inset-0 z-50 bg-black/50">
                    <div className="w-72 h-full bg-white shadow-xl">
                        <div className="flex items-center justify-between p-3 border-b border-slate-100">
                            <h2 className="font-bold text-slate-800">Filtros</h2>
                            <button
                                onClick={() => setMobileView('contacts')}
                                className="p-2 rounded-lg hover:bg-slate-100"
                            >
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>
                        <ChannelFilters
                            filter={filter}
                            onFilterChange={(f) => {
                                setFilter(f);
                                setMobileView('contacts');
                            }}
                            unreadCount={totalUnread}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
