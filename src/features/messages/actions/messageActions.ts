'use server';

import { createClient } from '@/utils/supabase/server';
import { Message, MessageTemplate, CreateMessageInput, CreateTemplateInput } from '../types';
import { revalidatePath } from 'next/cache';

export async function getMessages(patientId: string): Promise<Message[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: true });

    if (error) return [];
    return data;
}

export async function sendMessage(input: CreateMessageInput): Promise<Message | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('messages').insert([input]).select().single();

    if (error) {
        console.error('Error sending message:', error);
        return null;
    }

    // Here we would trigger n8n or external API
    revalidatePath('/dashboard/messages');
    return data;
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
