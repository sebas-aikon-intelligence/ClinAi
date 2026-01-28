'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Sparkles, Send, Mic } from 'lucide-react';

interface Message {
    role: 'assistant' | 'user';
    text: string;
    suggestion?: string;
}

export function AICommandCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', text: 'Hola Doctor, ¿en qué puedo ayudarle hoy?', suggestion: 'Resumen de pacientes de hoy' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (!inputValue.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text: inputValue, suggestion: undefined }]);
        setInputValue('');

        // Simulate bot response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Entendido. Estoy procesando su solicitud...', suggestion: undefined }]);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ${isOpen ? 'w-96' : 'w-16'}`}>
            {isOpen ? (
                <GlassCard className="h-[500px] border-primary-200 shadow-2xl shadow-slate-200/50 p-0 overflow-hidden">
                    <div className="flex flex-col h-full bg-white/50 backdrop-blur-sm">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-white/20 bg-white/40 backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary-600" />
                                <h3 className="font-semibold text-slate-900">ClinAi Copilot</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                ✕
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-primary-100' : 'bg-slate-200'
                                        }`}>
                                        {msg.role === 'assistant' ? (
                                            <Sparkles className="w-4 h-4 text-primary-600" />
                                        ) : (
                                            <span className="text-xs font-bold text-slate-600">YO</span>
                                        )}
                                    </div>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm border ${msg.role === 'assistant'
                                        ? 'bg-white text-slate-700 border-slate-100 rounded-tl-none'
                                        : 'bg-primary-600 text-white border-primary-600 rounded-tr-none'
                                        }`}>
                                        {msg.text}
                                        {msg.suggestion && (
                                            <span className="text-xs text-slate-400 mt-2 block pt-2 border-t border-slate-100">
                                                Sugerencia: "{msg.suggestion}"
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/40 backdrop-blur-md border-t border-white/20">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Escriba un comando..."
                                    className="w-full bg-white/80 border border-white/40 rounded-xl py-3 pl-4 pr-20 
                                               focus:outline-none focus:ring-2 focus:ring-primary-400/50 
                                               placeholder:text-slate-400 font-medium text-slate-700 shadow-inner"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                    <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                                        <Mic className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleSend}
                                        disabled={!inputValue.trim()}
                                        className="p-1.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed
                                                   rounded-lg transition-colors text-white shadow-md shadow-primary-500/20"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 flex items-center justify-center shadow-xl shadow-primary-600/30 hover:scale-110 transition-transform animate-bounce-subtle text-white"
                >
                    <Sparkles className="w-6 h-6" />
                </button>
            )}
        </div>
    );
}
