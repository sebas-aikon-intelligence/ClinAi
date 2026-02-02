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

    // Convert Date objects to ISO strings for Supabase
    const updateData: Record<string, unknown> = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.notes !== undefined) updateData.notes = input.notes;
    if (input.type !== undefined) updateData.type = input.type;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.patient_id !== undefined) updateData.patient_id = input.patient_id;
    if (input.doctor_id !== undefined) updateData.doctor_id = input.doctor_id;
    if (input.start_time !== undefined) {
        updateData.start_time = input.start_time instanceof Date
            ? input.start_time.toISOString()
            : input.start_time;
    }
    if (input.end_time !== undefined) {
        updateData.end_time = input.end_time instanceof Date
            ? input.end_time.toISOString()
            : input.end_time;
    }

    const { data, error } = await supabase
        .from('appointments')
        .update(updateData)
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
