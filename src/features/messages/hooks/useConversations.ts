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
  handoffToHuman: (sessionId: string, reason?: string) => Promise<void>;
  returnToAI: (sessionId: string) => Promise<void>;
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
    search: '',
    assignedTo: 'all'
  });

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();

    // Get all messages with patient info via JOIN (including AI settings)
    const { data: messagesData, error: messagesError } = await supabase
      .from('mensajes_n8n')
      .select(`
        id,
        session_id,
        message,
        created_at,
        read_at,
        channel,
        patients!fk_mensajes_patient(full_name, email, phone, ai_enabled, assigned_to_human, handoff_reason, handoff_at)
      `)
      .order('created_at', { ascending: false });

    if (messagesError) {
      console.error('Error fetching conversations:', messagesError);
      setIsLoading(false);
      return;
    }

    // Group by session_id and get latest message + unread count
    const conversationMap = new Map<string, Conversation>();

    (messagesData || []).forEach((msg: N8nMessage) => {
      const sessionId = msg.session_id;
      if (!sessionId || !msg.message) return;

      const existing = conversationMap.get(sessionId);
      const messageContent = msg.message.content || '';
      const messageType = msg.message.type;
      const isInbound = messageType === 'human';
      const isUnread = isInbound && !msg.read_at;

      // Get patient data from JOIN (includes AI settings)
      const patientData = (msg as unknown as { patients: {
        full_name?: string;
        email?: string;
        phone?: string;
        avatar_url?: string;
        ai_enabled?: boolean;
        assigned_to_human?: boolean;
        handoff_reason?: string | null;
        handoff_at?: string | null;
      } | null }).patients;

      // Get AI settings from patient (with defaults)
      const aiEnabled = patientData?.ai_enabled ?? true;
      const assignedToHuman = patientData?.assigned_to_human ?? false;
      const handoffReason = patientData?.handoff_reason ?? null;
      const handoffAt = patientData?.handoff_at ?? null;

      if (!existing) {
        // Use patient name from JOIN, fallback to session_id
        const patientName = patientData?.full_name || `Chat ${sessionId.substring(0, 8)}...`;

        conversationMap.set(sessionId, {
          patient_id: sessionId, // Using session_id as the conversation ID
          patient_name: patientName,
          patient_avatar: patientData?.avatar_url,
          last_message: messageContent.substring(0, 100),
          last_message_at: msg.created_at,
          last_message_direction: isInbound ? 'inbound' : 'outbound',
          channel: (msg.channel as ChannelType) || 'telegram',
          unread_count: isUnread ? 1 : 0,
          ai_enabled: aiEnabled,
          assigned_to_human: assignedToHuman,
          handoff_reason: handoffReason,
          handoff_at: handoffAt
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
    // Filter by assignment (human vs AI)
    if (filter.assignedTo === 'human') {
      result = result.filter(c => c.assigned_to_human);
    } else if (filter.assignedTo === 'ai') {
      result = result.filter(c => !c.assigned_to_human);
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
  const toggleAI = async (sessionId: string, enabled: boolean) => {
    // Optimistic update
    setConversations(prev =>
      prev.map(c =>
        c.patient_id === sessionId
          ? { ...c, ai_enabled: enabled }
          : c
      )
    );

    // Call server action
    const { togglePatientAI } = await import('../actions/messageActions');
    const success = await togglePatientAI(sessionId, enabled);

    // Revert if failed
    if (!success) {
      setConversations(prev =>
        prev.map(c =>
          c.patient_id === sessionId
            ? { ...c, ai_enabled: !enabled }
            : c
        )
      );
    }
  };

  // Hand off conversation to human
  const handoffToHuman = async (sessionId: string, reason?: string) => {
    // Optimistic update
    setConversations(prev =>
      prev.map(c =>
        c.patient_id === sessionId
          ? {
              ...c,
              assigned_to_human: true,
              ai_enabled: false,
              handoff_reason: reason || 'Manual handoff',
              handoff_at: new Date().toISOString()
            }
          : c
      )
    );

    // Call server action
    const { handoffToHuman: handoffAction } = await import('../actions/messageActions');
    const success = await handoffAction(sessionId, reason);

    // Revert if failed
    if (!success) {
      setConversations(prev =>
        prev.map(c =>
          c.patient_id === sessionId
            ? { ...c, assigned_to_human: false, ai_enabled: true }
            : c
        )
      );
    }
  };

  // Return conversation to AI
  const returnToAI = async (sessionId: string) => {
    // Optimistic update
    setConversations(prev =>
      prev.map(c =>
        c.patient_id === sessionId
          ? {
              ...c,
              assigned_to_human: false,
              ai_enabled: true,
              handoff_reason: null,
              handoff_at: null
            }
          : c
      )
    );

    // Call server action
    const { returnToAI: returnAction } = await import('../actions/messageActions');
    const success = await returnAction(sessionId);

    // Revert if failed
    if (!success) {
      setConversations(prev =>
        prev.map(c =>
          c.patient_id === sessionId
            ? { ...c, assigned_to_human: true, ai_enabled: false }
            : c
        )
      );
    }
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
    toggleAI,
    handoffToHuman,
    returnToAI
  };
}
