'use server';

import { createClient } from '@/utils/supabase/server';
import { Appointment, CreateAppointmentInput, UpdateAppointmentInput } from '../types';
import { revalidatePath } from 'next/cache';

export async function getAppointments(start?: string, end?: string): Promise<Appointment[]> {
    const supabase = await createClient();
    let query = supabase.from('appointments').select('*');

    if (start) query = query.gte('start', start);
    if (end) query = query.lte('end', end);

    const { data, error } = await query;
    if (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }
    return data || [];
}

export async function createAppointment(input: CreateAppointmentInput): Promise<Appointment | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('appointments').insert([input]).select().single();

    if (error) {
        console.error('Error creating appointment:', error);
        return null;
    }

    revalidatePath('/dashboard/calendar');
    return data;
}

export async function updateAppointment(id: string, input: UpdateAppointmentInput): Promise<Appointment | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('appointments').update(input).eq('id', id).select().single();

    if (error) return null;

    revalidatePath('/dashboard/calendar');
    return data;
}

export async function deleteAppointment(id: string): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase.from('appointments').delete().eq('id', id);

    if (error) return false;

    revalidatePath('/dashboard/calendar');
    return true;
}
