'use client';

import { useState, useEffect, useCallback } from 'react';
import { Message, MessageTemplate, ChannelType } from '../types';
import { getTemplates } from '../actions/messageActions';
import { createClient } from '@/utils/supabase/client';

// Parse n8n message format to app Message format
interface N8nDbMessage {
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

function parseN8nMessage(dbMsg: N8nDbMessage): Message {
    return {
        id: dbMsg.id.toString(),
        patient_id: dbMsg.session_id,
        content: dbMsg.message?.content || '',
        direction: dbMsg.message?.type === 'human' ? 'inbound' : 'outbound',
        channel: (dbMsg.channel as ChannelType) || 'whatsapp',
        status: 'delivered',
        created_at: dbMsg.created_at,
        read_at: dbMsg.read_at
    };
}

export function useMessages(sessionId?: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [templates, setTemplates] = useState<MessageTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMessages = useCallback(async () => {
        if (!sessionId) return;
        setIsLoading(true);

        const supabase = createClient();
        const { data, error } = await supabase
            .from('mensajes_n8n')
            .select('id, session_id, message, created_at, read_at, channel')
            .eq('session_id', sessionId)
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching messages:', error);
            setIsLoading(false);
            return;
        }

        // Parse n8n format to app format
        const parsedMessages = (data || [])
            .filter((msg: N8nDbMessage) => msg.message?.content)
            .map(parseN8nMessage);

        setMessages(parsedMessages);
        setIsLoading(false);
    }, [sessionId]);

    const fetchTemplates = useCallback(async () => {
        const data = await getTemplates();
        setTemplates(data);
    }, []);

    // Realtime subscription
    useEffect(() => {
        if (!sessionId) return;
        fetchMessages();
        fetchTemplates();

        const supabase = createClient();
        const channel = supabase
            .channel(`messages:${sessionId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'mensajes_n8n',
                filter: `session_id=eq.${sessionId}`
            }, (payload) => {
                const newMsg = payload.new as N8nDbMessage;
                if (newMsg.message?.content) {
                    const parsedMsg = parseN8nMessage(newMsg);

                    // Avoid duplicates: check if message with same content exists recently (within 5 seconds)
                    setMessages(prev => {
                        const isDuplicate = prev.some(existing =>
                            existing.content === parsedMsg.content &&
                            Math.abs(new Date(existing.created_at).getTime() - new Date(parsedMsg.created_at).getTime()) < 5000
                        );

                        if (isDuplicate) {
                            // Replace optimistic message with real one (has proper DB id)
                            return prev.map(msg =>
                                msg.content === parsedMsg.content &&
                                    Math.abs(new Date(msg.created_at).getTime() - new Date(parsedMsg.created_at).getTime()) < 5000
                                    ? parsedMsg
                                    : msg
                            );
                        }

                        return [...prev, parsedMsg];
                    });
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [sessionId, fetchMessages, fetchTemplates]);

    const send = async (content: string, channel: ChannelType) => {
        if (!sessionId) return;

        // Optimistic update
        const tempId = crypto.randomUUID();
        const newMessage: Message = {
            id: tempId,
            patient_id: sessionId,
            content,
            direction: 'outbound',
            channel,
            status: 'sent',
            created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, newMessage]);

        // Call server action
        const { sendMessage } = await import('../actions/messageActions');
        await sendMessage({
            patient_id: sessionId,
            content: content,
            direction: 'outbound',
            channel: channel,
            sent_by: null // Could add user ID here if available
        });
    };

    return { messages, templates, isLoading, send };
}
