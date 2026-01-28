import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { cn } from '@/lib/utils';
import { Check, CheckCheck } from 'lucide-react';

interface ChatWindowProps {
    messages: Message[];
    isLoading: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (isLoading && messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400 text-sm">
                <p>No hay mensajes. Envía el primero.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
            {messages.map((msg, index) => {
                const isMe = msg.direction === 'outbound';
                return (
                    <div key={msg.id || index} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                        <div className={cn(
                            "max-w-[70%] p-3 rounded-2xl text-sm relative group",
                            isMe
                                ? "bg-primary-600 text-white rounded-tr-none shadow-md shadow-primary-200"
                                : "bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm"
                        )}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <div className={cn(
                                "text-[10px] flex items-center justify-end gap-1 mt-1 opacity-70",
                                isMe ? "text-primary-100" : "text-slate-400"
                            )}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {isMe && (
                                    <span>
                                        {msg.status === 'read' ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>
    );
}
