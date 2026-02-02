'use server';

import { createClient } from '@/utils/supabase/server';
import { Message, MessageTemplate, CreateMessageInput, CreateTemplateInput } from '../types';
import { revalidatePath } from 'next/cache';

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
        const webhookUrl = 'https://aikon-intelligence-n8n.qr3bct.easypanel.host/webhook/telegram-manual-send';

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

        const response = await fetch(webhookUrl, {
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

export async function togglePatientAI(patientId: string, enabled: boolean): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase
        .from('patients')
        .update({ ai_enabled: enabled })
        .eq('id', patientId);

    if (error) {
        console.error('Error toggling AI:', error);
        return false;
    }

    revalidatePath('/dashboard/messages');
    return true;
}
