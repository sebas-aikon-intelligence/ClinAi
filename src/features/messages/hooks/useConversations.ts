'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { TelegramConversation, ChatMessage } from '../types';

export function useConversations() {
  const [conversations, setConversations] = useState<TelegramConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchConversations = useCallback(async () => {
    const { data, error } = await supabase
      .from('telegram_conversations')
      .select('*')
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return;
    }

    setConversations(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchConversations();

    // Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel('telegram_conversations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'telegram_conversations',
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchConversations]);

  const toggleAI = async (conversationId: string, enabled: boolean) => {
    const { error } = await supabase
      .from('telegram_conversations')
      .update({ is_ai_enabled: enabled })
      .eq('id', conversationId);

    if (error) {
      console.error('Error toggling AI:', error);
      return false;
    }

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, is_ai_enabled: enabled } : c
      )
    );
    return true;
  };

  return { conversations, loading, toggleAI, refetch: fetchConversations };
}

export function useMessages(sessionId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const fetchMessages = useCallback(async () => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('n8n_chat_histories')
      .select('*')
      .eq('session_id', sessionId)
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
      return;
    }

    setMessages(data || []);
    setLoading(false);
  }, [sessionId, supabase]);

  useEffect(() => {
    fetchMessages();

    if (!sessionId) return;

    // Suscribirse a nuevos mensajes en tiempo real
    const channel = supabase
      .channel(`messages_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'n8n_chat_histories',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, supabase, fetchMessages]);

  return { messages, loading, refetch: fetchMessages };
}
