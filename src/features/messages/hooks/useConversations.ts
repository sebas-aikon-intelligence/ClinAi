'use client';

import { useState, useEffect, useCallback } from 'react';
import { Conversation, MessagesFilter, ChannelType } from '../types';
import { createClient } from '@/utils/supabase/client';

interface ConversationsResult {
  conversations: Conversation[];
  isLoading: boolean;
  filter: MessagesFilter;
  setFilter: (filter: MessagesFilter) => void;
  markAsRead: (sessionId: string) => Promise<void>;
  toggleAI: (sessionId: string, enabled: boolean) => void;
}

// Parse n8n message format
interface N8nMessage {
  id: number;
  session_id: string;
  message: {
    type: 'ai' | 'human';
    content: string;
  };
  created_at: string;
  read_at?: string | null;
  channel?: string;
}

export function useConversations(): ConversationsResult {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<MessagesFilter>({
    channel: 'all',
    status: 'all',
    search: ''
  });

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();

    // Get all messages from mensajes_n8n (using session_id as conversation key)
    const { data, error } = await supabase
      .from('mensajes_n8n')
      .select('id, session_id, message, created_at, read_at, channel')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      setIsLoading(false);
      return;
    }

    // Group by session_id and get latest message + unread count
    const conversationMap = new Map<string, Conversation>();

    (data || []).forEach((msg: N8nMessage) => {
      const sessionId = msg.session_id;
      if (!sessionId || !msg.message) return;

      const existing = conversationMap.get(sessionId);
      const messageContent = msg.message.content || '';
      const messageType = msg.message.type;
      const isInbound = messageType === 'human';
      const isUnread = isInbound && !msg.read_at;

      if (!existing) {
        // Create conversation name from session or first message
        const shortSessionId = sessionId.substring(0, 8);

        conversationMap.set(sessionId, {
          patient_id: sessionId, // Using session_id as the conversation ID
          patient_name: `Chat ${shortSessionId}...`, // Display name
          patient_avatar: undefined,
          last_message: messageContent.substring(0, 100),
          last_message_at: msg.created_at,
          last_message_direction: isInbound ? 'inbound' : 'outbound',
          channel: (msg.channel as ChannelType) || 'whatsapp',
          unread_count: isUnread ? 1 : 0,
          ai_enabled: true
        });
      } else if (isUnread) {
        existing.unread_count += 1;
      }
    });

    let result = Array.from(conversationMap.values());

    // Apply filters
    if (filter.channel !== 'all') {
      result = result.filter(c => c.channel === filter.channel);
    }
    if (filter.status === 'unread') {
      result = result.filter(c => c.unread_count > 0);
    } else if (filter.status === 'read') {
      result = result.filter(c => c.unread_count === 0);
    }
    if (filter.search) {
      const search = filter.search.toLowerCase();
      result = result.filter(c =>
        c.patient_name.toLowerCase().includes(search) ||
        c.last_message.toLowerCase().includes(search)
      );
    }

    // Sort by last message (most recent first)
    result.sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());

    setConversations(result);
    setIsLoading(false);
  }, [filter]);

  // Mark messages as read
  const markAsRead = async (sessionId: string) => {
    const supabase = createClient();

    // Mark all human messages in this session as read
    await supabase
      .from('mensajes_n8n')
      .update({ read_at: new Date().toISOString() })
      .eq('session_id', sessionId)
      .is('read_at', null);

    // Update local state
    setConversations(prev =>
      prev.map(c =>
        c.patient_id === sessionId
          ? { ...c, unread_count: 0 }
          : c
      )
    );
  };

  // Toggle AI for a conversation
  const toggleAI = (sessionId: string, enabled: boolean) => {
    setConversations(prev =>
      prev.map(c =>
        c.patient_id === sessionId
          ? { ...c, ai_enabled: enabled }
          : c
      )
    );
  };

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Real-time subscription for new messages
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('conversations-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'mensajes_n8n'
      }, () => {
        // Refetch conversations when new message arrives
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    filter,
    setFilter,
    markAsRead,
    toggleAI
  };
}
