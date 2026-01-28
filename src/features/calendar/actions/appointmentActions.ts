'use server';

import { createClient } from '@/utils/supabase/server';
import { Appointment, CreateAppointmentInput, UpdateAppointmentInput } from '../types';
import { revalidatePath } from 'next/cache';

export async function getAppointments(startDate?: Date, endDate?: Date): Promise<Appointment[]> {
    const supabase = await createClient();

    let query = supabase
        .from('appointments')
        .select('*')
        .order('start_time', { ascending: true });

    if (startDate) {
        query = query.gte('start_time', startDate.toISOString());
    }

    if (endDate) {
        query = query.lte('end_time', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }

    return data as Appointment[];
}

export async function createAppointment(input: CreateAppointmentInput): Promise<Appointment | null> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Not authenticated');
    }

    // Prepare appointment data - only include defined values
    const appointmentData: Record<string, unknown> = {
        start_time: input.start_time.toISOString(),
        end_time: input.end_time.toISOString(),
        status: 'confirmed',
        doctor_id: user.id // Assign current user as doctor
    };

    // Add optional fields only if provided
    if (input.patient_id) appointmentData.patient_id = input.patient_id;
    if (input.title) appointmentData.title = input.title;
    if (input.type) appointmentData.type = input.type;
    if (input.notes) appointmentData.notes = input.notes;

    const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

    if (error) {
        console.error('Error creating appointment (DB):', error);
        throw new Error(`Database error: ${error.message}`);
    }

    revalidatePath('/dashboard/calendar');
    return data as Appointment;
}

export async function updateAppointment(id: string, input: UpdateAppointmentInput): Promise<Appointment | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('appointments')
        .update(input)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating appointment:', error);
        throw new Error(error.message);
    }

    revalidatePath('/dashboard/calendar');
    return data as Appointment;
}

export async function deleteAppointment(id: string): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting appointment:', error);
        return false;
    }

    revalidatePath('/dashboard/calendar');
    return true;
}
