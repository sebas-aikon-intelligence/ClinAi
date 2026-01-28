'use client';

import React, { useState } from 'react';
import { Patient } from '@/features/patients/types';
import { ContactList } from '@/features/messages/components/ContactList';
import { ChatWindow } from '@/features/messages/components/ChatWindow';
import { MessageInput } from '@/features/messages/components/MessageInput';
import { useMessages } from '@/features/messages/hooks/useMessages';

interface MessagesViewProps {
    patients: Patient[];
}

export default function MessagesView({ patients }: MessagesViewProps) {
    const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(patients[0]?.id);
    const { messages, isLoading, send } = useMessages(selectedPatientId);

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
            <ContactList
                patients={patients}
                selectedPatientId={selectedPatientId}
                onSelect={setSelectedPatientId}
            />

            <div className="flex-1 flex flex-col bg-slate-50 relative">
                {selectedPatientId ? (
                    <>
                        {/* Header */}
                        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm z-10">
                            <h3 className="font-bold text-slate-800">
                                {patients.find(p => p.id === selectedPatientId)?.first_name} {patients.find(p => p.id === selectedPatientId)?.last_name}
                            </h3>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">WhatsApp</span>
                            </div>
                        </div>

                        <ChatWindow messages={messages} isLoading={isLoading} />

                        <MessageInput onSend={text => send(text, 'whatsapp')} disabled={isLoading} />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400">
                        Selecciona un contacto para iniciar el chat
                    </div>
                )}
            </div>
        </div>
    );
}
