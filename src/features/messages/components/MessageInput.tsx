'use client';

import React, { useState } from 'react';
import { Send, Paperclip, Mic, FileText, Image, Bot, BotOff, Smile } from 'lucide-react';
import { MessageTemplate } from '../types';
import { cn } from '@/lib/utils';

interface MessageInputProps {
    onSend: (content: string) => void;
    onSendTemplate?: (template: MessageTemplate) => void;
    templates?: MessageTemplate[];
    disabled?: boolean;
    aiEnabled?: boolean;
    onToggleAI?: () => void;
}

export function MessageInput({
    onSend,
    onSendTemplate,
    templates = [],
    disabled,
    aiEnabled = true,
    onToggleAI
}: MessageInputProps) {
    const [content, setContent] = useState('');
    const [showTemplates, setShowTemplates] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || disabled) return;
        onSend(content);
        setContent('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="bg-white border-t border-slate-100">
            {/* Templates dropdown */}
            {showTemplates && templates.length > 0 && (
                <div className="p-2 border-b border-slate-100 max-h-48 overflow-y-auto">
                    <p className="text-xs font-semibold text-slate-400 px-2 mb-2">Plantillas rápidas</p>
                    <div className="space-y-1">
                        {templates.map(template => (
                            <button
                                key={template.id}
                                onClick={() => {
                                    if (onSendTemplate) {
                                        onSendTemplate(template);
                                    } else {
                                        setContent(template.content);
                                    }
                                    setShowTemplates(false);
                                }}
                                className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <p className="text-sm font-medium text-slate-700">{template.name}</p>
                                <p className="text-xs text-slate-500 truncate">{template.content}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Attach menu */}
            {showAttachMenu && (
                <div className="p-2 border-b border-slate-100 flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 text-sm">
                        <Image className="w-4 h-4" /> Imagen
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 text-sm">
                        <FileText className="w-4 h-4" /> Archivo
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 text-sm">
                        <Mic className="w-4 h-4" /> Audio
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-3 flex items-end gap-2">
                {/* Attachment button */}
                <button
                    type="button"
                    onClick={() => { setShowAttachMenu(!showAttachMenu); setShowTemplates(false); }}
                    className={cn(
                        "p-2.5 rounded-full transition-all",
                        showAttachMenu
                            ? "bg-primary-100 text-primary-600"
                            : "text-slate-400 hover:text-primary-600 hover:bg-slate-50"
                    )}
                >
                    <Paperclip className="w-5 h-5" />
                </button>

                {/* Templates button */}
                <button
                    type="button"
                    onClick={() => { setShowTemplates(!showTemplates); setShowAttachMenu(false); }}
                    className={cn(
                        "p-2.5 rounded-full transition-all",
                        showTemplates
                            ? "bg-primary-100 text-primary-600"
                            : "text-slate-400 hover:text-primary-600 hover:bg-slate-50"
                    )}
                >
                    <FileText className="w-5 h-5" />
                </button>

                {/* Text input */}
                <div className="flex-1 relative">
                    <textarea
                        className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-primary-200 focus:ring-2 focus:ring-primary-50 rounded-xl px-4 py-2.5 transition-all outline-none resize-none text-sm max-h-32"
                        placeholder="Escribe un mensaje..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        rows={1}
                    />
                </div>

                {/* AI Toggle */}
                {onToggleAI && (
                    <button
                        type="button"
                        onClick={onToggleAI}
                        className={cn(
                            "p-2.5 rounded-full transition-all",
                            aiEnabled
                                ? "bg-green-100 text-green-600 hover:bg-green-200"
                                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        )}
                        title={aiEnabled ? "IA activa - click para desactivar" : "IA inactiva - click para activar"}
                    >
                        {aiEnabled ? <Bot className="w-5 h-5" /> : <BotOff className="w-5 h-5" />}
                    </button>
                )}

                {/* Send button */}
                <button
                    type="submit"
                    disabled={!content.trim() || disabled}
                    className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:shadow-none transition-all hover:scale-105 active:scale-95"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
