'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  Search, Send, Bot, User, MoreVertical,
  CheckCheck, Loader2, Power, MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConversations, useMessages } from '@/features/messages/hooks/useConversations';
import { sendManualMessage } from '@/features/messages/services/telegramService';
import type { TelegramConversation } from '@/features/messages/types';

export default function MessagesPage() {
  const { conversations, loading: loadingConversations, toggleAI } = useConversations();
  const [selectedConversation, setSelectedConversation] = useState<TelegramConversation | null>(null);
  const { messages, loading: loadingMessages } = useMessages(selectedConversation?.telegram_chat_id || null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [togglingAI, setTogglingAI] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);

  // Auto-scroll solo cuando llega un mensaje nuevo en tiempo real
  useEffect(() => {
    // Si es la primera carga, no hacemos scroll automático
    if (isInitialLoadRef.current) {
      if (messages.length > 0) {
        isInitialLoadRef.current = false;
        prevMessagesLengthRef.current = messages.length;
      }
      return;
    }

    // Solo scroll automático si llegó un mensaje nuevo (realtime)
    if (messages.length > prevMessagesLengthRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  // Seleccionar primera conversación al cargar
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  // Resetear scroll refs cuando cambia la conversación
  useEffect(() => {
    isInitialLoadRef.current = true;
    prevMessagesLengthRef.current = 0;
  }, [selectedConversation?.id]);

  const handleToggleAI = async () => {
    if (!selectedConversation) return;
    setTogglingAI(true);
    const success = await toggleAI(selectedConversation.id, !selectedConversation.is_ai_enabled);
    if (success) {
      setSelectedConversation((prev) =>
        prev ? { ...prev, is_ai_enabled: !prev.is_ai_enabled } : null
      );
    }
    setTogglingAI(false);
  };

  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim() || sending) return;

    setSending(true);
    const success = await sendManualMessage({
      chat_id: selectedConversation.telegram_chat_id,
      message: newMessage.trim(),
    });

    if (success) {
      setNewMessage('');
    }
    setSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
    }
  };

  // Extraer solo el texto del mensaje, ignorando metadata
  const parseMessageContent = (content: string): string => {
    // Si el contenido tiene el formato "Mensaje: X\nId: Y\nNombre: Z\nFecha: W"
    // extraemos solo la parte después de "Mensaje: " hasta el siguiente \n
    if (content.startsWith('Mensaje:')) {
      const lines = content.split('\n');
      const messageLine = lines[0];
      // Extraer el texto después de "Mensaje: "
      return messageLine.replace('Mensaje:', '').trim();
    }
    // Si no tiene ese formato, devolver el contenido tal cual
    return content;
  };

  const getLastMessage = (chatId: string) => {
    // Esto es simplificado - idealmente vendría pre-cargado
    return 'Conversación activa';
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Sidebar - Lista de Conversaciones */}
      <GlassCard className="w-1/3 flex flex-col p-0 overflow-hidden border-white/30">
        <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-luxury-900">Telegram</h2>
            <div className="flex items-center gap-2 text-xs text-luxury-500">
              <span className="w-2 h-2 bg-mint-500 rounded-full animate-pulse"></span>
              Realtime
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-400" />
            <input
              type="text"
              placeholder="Buscar conversación..."
              className="w-full bg-white/10 border border-white/20 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-luxury-400/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingConversations ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-luxury-500" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-luxury-500">
              <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">Sin conversaciones</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={cn(
                  "p-4 border-b border-white/5 cursor-pointer hover:bg-white/10 transition-colors",
                  selectedConversation?.id === conv.id ? "bg-white/20 shadow-inner" : ""
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                      {(conv.customer_name || 'C').charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-luxury-900 truncate">
                          {conv.customer_name || `Chat ${conv.telegram_chat_id}`}
                        </h3>
                        {conv.is_ai_enabled ? (
                          <Bot className="w-3.5 h-3.5 text-mint-600" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-amber-600" />
                        )}
                      </div>
                      <p className="text-xs text-luxury-500 truncate">
                        {conv.customer_username ? `@${conv.customer_username}` : getLastMessage(conv.telegram_chat_id)}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-luxury-400">
                    {formatTime(conv.last_message_at)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col rounded-3xl bg-white/40 border border-white/30 shadow-xl overflow-hidden">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/10 backdrop-blur-md flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                  {(selectedConversation.customer_name || 'C').charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-luxury-900">
                    {selectedConversation.customer_name || `Chat ${selectedConversation.telegram_chat_id}`}
                  </h3>
                  <span className="text-xs text-luxury-500">
                    ID: {selectedConversation.telegram_chat_id}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Toggle AI */}
                <button
                  onClick={handleToggleAI}
                  disabled={togglingAI}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    selectedConversation.is_ai_enabled
                      ? "bg-mint-100 text-mint-700 hover:bg-mint-200"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  )}
                >
                  {togglingAI ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : selectedConversation.is_ai_enabled ? (
                    <Bot className="w-3.5 h-3.5" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                  {selectedConversation.is_ai_enabled ? 'IA Activa' : 'Modo Manual'}
                </button>

                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors text-luxury-500">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/5"
              style={{ minHeight: 0, willChange: 'scroll-position', WebkitOverflowScrolling: 'touch' }}
            >
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-luxury-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-luxury-500">
                  <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                  <p>Sin mensajes en esta conversación</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col max-w-[75%]",
                      msg.message.type === 'ai' ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div className="flex items-end gap-2">
                      {msg.message.type === 'human' && (
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "p-3 rounded-2xl text-sm whitespace-pre-wrap",
                          msg.message.type === 'ai'
                            ? "bg-gradient-to-br from-luxury-600 to-luxury-700 text-white rounded-tr-sm"
                            : "bg-white/60 border border-white/40 text-luxury-900 rounded-tl-sm"
                        )}
                      >
                        {parseMessageContent(msg.message.content)}
                      </div>
                      {msg.message.type === 'ai' && (
                        <div className="w-6 h-6 rounded-full bg-mint-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 mt-1 px-8",
                      msg.message.type === 'ai' ? "justify-end" : "justify-start"
                    )}>
                      {msg.message.type === 'ai' && (
                        <CheckCheck className="w-3 h-3 text-mint-500" />
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-white/10 backdrop-blur-md">
              {!selectedConversation.is_ai_enabled ? (
                <>
                  <div className="bg-white/40 border border-white/30 rounded-2xl p-2 flex items-end gap-2 shadow-inner focus-within:ring-2 focus-within:ring-luxury-400/30 transition-all">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe un mensaje manual..."
                      className="flex-1 bg-transparent border-none focus:outline-none text-luxury-900 placeholder:text-luxury-400 resize-none py-2 max-h-32 text-sm"
                      rows={1}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className={cn(
                        "p-2 rounded-xl transition-colors shadow-lg",
                        newMessage.trim() && !sending
                          ? "bg-luxury-600 text-white hover:bg-luxury-700 shadow-luxury-500/20"
                          : "bg-luxury-300 text-luxury-500 cursor-not-allowed"
                      )}
                    >
                      {sending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-[10px] text-amber-600 flex items-center justify-center gap-1">
                      <User className="w-3 h-3" />
                      Modo manual activo - Los mensajes serán enviados por ti
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-mint-50 rounded-full text-mint-700 text-sm">
                    <Bot className="w-4 h-4" />
                    <span>La IA está respondiendo automáticamente</span>
                    <button
                      onClick={handleToggleAI}
                      className="ml-2 flex items-center gap-1 text-xs bg-white/50 px-2 py-1 rounded-full hover:bg-white/80 transition-colors"
                    >
                      <Power className="w-3 h-3" />
                      Tomar control
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-luxury-500">
            <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg font-medium">Selecciona una conversación</p>
            <p className="text-sm opacity-70">Los mensajes aparecerán aquí</p>
          </div>
        )}
      </div>
    </div>
  );
}
