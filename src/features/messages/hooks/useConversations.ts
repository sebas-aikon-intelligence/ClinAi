'use client';

import { useState, useEffect, useCallback } from 'react';
import { Conversation, MessagesFilter } from '../types';
import { createClient } from '@/utils/supabase/client';

interface ConversationsResult {
  conversations: Conversation[];
  isLoading: boolean;
  filter: MessagesFilter;
  setFilter: (filter: MessagesFilter) => void;
  markAsRead: (patientId: string) => Promise<void>;
  toggleAI: (patientId: string, enabled: boolean) => void;
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

    // Get latest message per patient with unread count
    const { data, error } = await supabase
      .from('mensajes_n8n')
      .select(`
                patient_id,
                content,
                direction,
                channel,
                created_at,
                read_at,
                patients!inner (
                    id,
                    full_name,
                    first_name,
                    last_name,
                    avatar_url
                )
            `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      setIsLoading(false);
      return;
    }

    // Group by patient and get latest message + unread count
    const conversationMap = new Map<string, Conversation>();

    (data || []).forEach((msg: any) => {
      const patientId = msg.patient_id;
      if (!patientId) return;

      const existing = conversationMap.get(patientId);
      const isUnread = msg.direction === 'inbound' && !msg.read_at;

      if (!existing) {
        const patient = msg.patients;
        const patientName = patient?.full_name ||
          `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim() ||
          'Sin nombre';

        conversationMap.set(patientId, {
          patient_id: patientId,
          patient_name: patientName,
          patient_avatar: patient?.avatar_url,
          last_message: msg.content || '',
          last_message_at: msg.created_at,
          last_message_direction: msg.direction,
          channel: msg.channel || 'whatsapp',
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
      result = result.filter(c => c.patient_name.toLowerCase().includes(search));
    }

    // Sort by last message (most recent first)
    result.sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());

    setConversations(result);
    setIsLoading(false);
  }, [filter]);

  // Mark messages as read
  const markAsRead = async (patientId: string) => {
    const supabase = createClient();

    await supabase
      .from('mensajes_n8n')
      .update({ read_at: new Date().toISOString() })
      .eq('patient_id', patientId)
      .is('read_at', null)
      .eq('direction', 'inbound');

    // Update local state
    setConversations(prev =>
      prev.map(c =>
        c.patient_id === patientId
          ? { ...c, unread_count: 0 }
          : c
      )
    );
  };

  // Toggle AI for a conversation
  const toggleAI = (patientId: string, enabled: boolean) => {
    setConversations(prev =>
      prev.map(c =>
        c.patient_id === patientId
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
