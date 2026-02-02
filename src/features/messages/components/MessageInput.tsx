'use client';

import React, { useState, useRef } from 'react';
import { Send, Paperclip, Mic, FileText, Image, Bot, BotOff, X, Loader2 } from 'lucide-react';
import { MessageTemplate, MediaType } from '../types';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface MessageInputProps {
    onSend: (content: string) => void;
    onSendMedia?: (mediaType: MediaType, mediaUrl: string, caption?: string) => Promise<void>;
    onSendTemplate?: (template: MessageTemplate) => void;
    templates?: MessageTemplate[];
    disabled?: boolean;
    aiEnabled?: boolean;
    onToggleAI?: () => void;
    sessionId?: string;
}

export function MessageInput({
    onSend,
    onSendMedia,
    onSendTemplate,
    templates = [],
    disabled,
    aiEnabled = true,
    onToggleAI,
    sessionId
}: MessageInputProps) {
    const [content, setContent] = useState('');
    const [showTemplates, setShowTemplates] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string | null>(null);

    // File input refs
    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);

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

    // Handle file upload to Supabase Storage
    const handleFileUpload = async (file: File, mediaType: MediaType) => {
        if (!sessionId) {
            toast.error('No hay conversación seleccionada');
            return;
        }

        setIsUploading(true);
        setUploadProgress(`Subiendo ${file.name}...`);
        setShowAttachMenu(false);

        try {
            const supabase = createClient();

            // Generate unique filename
            const timestamp = Date.now();
            const ext = file.name.split('.').pop();
            const filename = `${sessionId}/${timestamp}.${ext}`;
            const bucket = 'message-attachments';

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filename, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                toast.error('Error al subir archivo');
                return;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(filename);

            if (!urlData?.publicUrl) {
                toast.error('Error al obtener URL del archivo');
                return;
            }

            // Send media message via callback
            if (onSendMedia) {
                await onSendMedia(mediaType, urlData.publicUrl, file.name);
                toast.success('Archivo enviado');
            } else {
                // Fallback: send as text with URL
                onSend(`[${mediaType.toUpperCase()}] ${urlData.publicUrl}`);
                toast.success('Archivo subido');
            }
        } catch (error) {
            console.error('File upload error:', error);
            toast.error('Error al subir archivo');
        } finally {
            setIsUploading(false);
            setUploadProgress(null);
        }
    };

    // Handle file input changes
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file, 'image');
        }
        e.target.value = ''; // Reset input
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file, 'file');
        }
        e.target.value = '';
    };

    const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file, 'audio');
        }
        e.target.value = '';
    };

    return (
        <div className="bg-white border-t border-slate-100">
            {/* Hidden file inputs */}
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
            />
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
                className="hidden"
                onChange={handleFileSelect}
            />
            <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleAudioSelect}
            />

            {/* Upload progress */}
            {isUploading && uploadProgress && (
                <div className="p-2 border-b border-slate-100 flex items-center gap-2 text-sm text-slate-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{uploadProgress}</span>
                </div>
            )}

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
                    <button
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 text-sm disabled:opacity-50"
                    >
                        <Image className="w-4 h-4" /> Imagen
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 text-sm disabled:opacity-50"
                    >
                        <FileText className="w-4 h-4" /> Archivo
                    </button>
                    <button
                        onClick={() => audioInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 text-sm disabled:opacity-50"
                    >
                        <Mic className="w-4 h-4" /> Audio
                    </button>
                    <button
                        onClick={() => setShowAttachMenu(false)}
                        className="ml-auto p-2 rounded-lg hover:bg-slate-100 text-slate-400"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-3 flex items-end gap-2">
                {/* Attachment button */}
                <button
                    type="button"
                    onClick={() => { setShowAttachMenu(!showAttachMenu); setShowTemplates(false); }}
                    disabled={isUploading}
                    className={cn(
                        "p-2.5 rounded-full transition-all",
                        showAttachMenu
                            ? "bg-primary-100 text-primary-600"
                            : "text-slate-400 hover:text-primary-600 hover:bg-slate-50",
                        isUploading && "opacity-50"
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
                        disabled={disabled || isUploading}
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
                    disabled={!content.trim() || disabled || isUploading}
                    className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:shadow-none transition-all hover:scale-105 active:scale-95"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
