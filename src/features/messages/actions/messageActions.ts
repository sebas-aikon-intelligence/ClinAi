'use server';

import { createClient } from '@/utils/supabase/server';
import { Message, MessageTemplate, CreateMessageInput, CreateTemplateInput, MediaType } from '../types';
import { revalidatePath } from 'next/cache';

// Webhook URLs
const N8N_MANUAL_SEND_URL = 'https://aikon-intelligence-n8n.qr3bct.easypanel.host/webhook/telegram-manual-send';
const N8N_MEDIA_SEND_URL = 'https://aikon-intelligence-n8n.qr3bct.easypanel.host/webhook/telegram-media-send';

export async function getMessages(patientId: string): Promise<Message[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('mensajes_n8n')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: true });

    if (error) return [];
    return data;
}

export async function sendMessage(input: CreateMessageInput): Promise<boolean> {
    const supabase = await createClient();

    try {
        // Trigger n8n webhook for manual sending
        // n8n will: 1) Send to Telegram, 2) Save to mensajes_n8n

        // Lookup real channel identifier (e.g., Telegram chat ID)
        let externalChatId = input.patient_id; // Default fallback

        if (input.channel === 'telegram') {
            const { data: channelData } = await supabase
                .from('patient_channels')
                .select('channel_identifier')
                .eq('patient_id', input.patient_id)
                .eq('channel', 'telegram')
                .single();

            if (channelData?.channel_identifier) {
                externalChatId = channelData.channel_identifier;
            } else {
                console.warn('No telegram channel found for patient:', input.patient_id);
                return false;
            }
        }

        const response = await fetch(N8N_MANUAL_SEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: externalChatId, // Real Telegram chat ID
                message: input.content,
                sender_type: 'human',
                channel: input.channel,
                session_id: input.patient_id // Internal UUID for DB reference
            })
        });

        if (!response.ok) {
            console.error('Webhook failed:', await response.text());
            return false;
        }

        revalidatePath('/dashboard/messages');
        return true;
    } catch (webhookError) {
        console.error('Error triggering n8n webhook:', webhookError);
        return false;
    }
}

export async function getTemplates(): Promise<MessageTemplate[]> {
    const supabase = await createClient();
    const { data } = await supabase.from('message_templates').select('*').order('name');
    return data || [];
}

export async function createTemplate(input: CreateTemplateInput): Promise<MessageTemplate | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('message_templates').insert([input]).select().single();
    if (error) return null;
    revalidatePath('/dashboard/messages');
    return data;
}

export async function togglePatientAI(sessionId: string, enabled: boolean): Promise<boolean> {
    const supabase = await createClient();

    // Update patients table directly using telegram_id (which is the session_id)
    const { error } = await supabase
        .from('patients')
        .update({ ai_enabled: enabled })
        .eq('telegram_id', sessionId);

    if (error) {
        console.error('Error toggling AI:', error);
        return false;
    }

    revalidatePath('/dashboard/messages');
    return true;
}

// Get patient settings for a session
export async function getPatientSettings(sessionId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('patients')
        .select('ai_enabled, assigned_to_human, handoff_reason, handoff_at')
        .eq('telegram_id', sessionId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error getting patient settings:', error);
        return null;
    }

    return data || { ai_enabled: true, assigned_to_human: false };
}

// Hand off conversation to human
export async function handoffToHuman(sessionId: string, reason?: string): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('patients')
        .update({
            assigned_to_human: true,
            ai_enabled: false,
            handoff_reason: reason || 'Manual handoff',
            handoff_at: new Date().toISOString()
        })
        .eq('telegram_id', sessionId);

    if (error) {
        console.error('Error handing off to human:', error);
        return false;
    }

    revalidatePath('/dashboard/messages');
    return true;
}

// Return conversation to AI
export async function returnToAI(sessionId: string): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('patients')
        .update({
            assigned_to_human: false,
            ai_enabled: true,
            handoff_reason: null,
            handoff_at: null
        })
        .eq('telegram_id', sessionId);

    if (error) {
        console.error('Error returning to AI:', error);
        return false;
    }

    revalidatePath('/dashboard/messages');
    return true;
}

// Send media message (image, audio, file)
export async function sendMediaMessage(
    sessionId: string,
    channel: string,
    mediaType: MediaType,
    mediaUrl: string,
    caption?: string
): Promise<boolean> {
    const supabase = await createClient();

    try {
        // Lookup real channel identifier (e.g., Telegram chat ID)
        let externalChatId = sessionId;

        if (channel === 'telegram') {
            const { data: channelData } = await supabase
                .from('patient_channels')
                .select('channel_identifier')
                .eq('patient_id', sessionId)
                .eq('channel', 'telegram')
                .single();

            if (channelData?.channel_identifier) {
                externalChatId = channelData.channel_identifier;
            }
        }

        const response = await fetch(N8N_MEDIA_SEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: externalChatId,
                media_type: mediaType,
                media_url: mediaUrl,
                caption: caption || '',
                sender_type: 'human',
                channel: channel,
                session_id: sessionId
            })
        });

        if (!response.ok) {
            console.error('Media webhook failed:', await response.text());
            return false;
        }

        revalidatePath('/dashboard/messages');
        return true;
    } catch (error) {
        console.error('Error sending media:', error);
        return false;
    }
}
