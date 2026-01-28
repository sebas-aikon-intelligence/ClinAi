import React, { useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

interface MessageInputProps {
    onSend: (content: string) => void;
    disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || disabled) return;
        onSend(content);
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
            <button type="button" className="p-2 text-slate-400 hover:text-primary-600 hover:bg-slate-50 rounded-full transition-colors">
                <Paperclip className="w-5 h-5" />
            </button>
            <input
                className="flex-1 bg-slate-50 border-transparent focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-50 rounded-xl px-4 py-2.5 transition-all outline-none"
                placeholder="Escribe un mensaje..."
                value={content}
                onChange={e => setContent(e.target.value)}
                disabled={disabled}
            />
            <button
                type="submit"
                disabled={!content.trim() || disabled}
                className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:shadow-none transition-all hover:scale-105 active:scale-95"
            >
                <Send className="w-5 h-5" />
            </button>
        </form>
    );
}
