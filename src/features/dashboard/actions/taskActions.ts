'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Task {
    id: string;
    title: string;
    patient_id: string | null;
    assigned_to: string | null;
    due_date: string | null;
    status: 'todo' | 'in_progress' | 'done';
    created_at: string;
    patients?: { full_name: string } | null;
    profiles?: { full_name: string } | null;
}

export interface Patient {
    id: string;
    full_name: string;
    contact_info?: {
        email?: string;
        phone?: string;
    };
}

export interface Profile {
    id: string;
    full_name: string;
    role: string;
}

export async function getTasks(): Promise<Task[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('tasks')
        .select(`
            *,
            patients (full_name),
            profiles (full_name)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }

    return data || [];
}

export async function getPatients(): Promise<Patient[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('patients')
        .select('id, full_name, contact_info')
        .order('full_name', { ascending: true });

    if (error) {
        console.error('Error fetching patients:', error);
        return [];
    }

    return data || [];
}

export async function getProfiles(): Promise<Profile[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .order('full_name', { ascending: true });

    if (error) {
        console.error('Error fetching profiles:', error);
        return [];
    }

    return data || [];
}

export async function createTask(
    title: string,
    patientId?: string | null,
    assignedTo?: string | null,
    dueDate?: string | null,
    status?: 'todo' | 'in_progress' | 'done'
): Promise<Task | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('tasks')
        .insert({
            title,
            status: status || 'todo',
            patient_id: patientId || null,
            assigned_to: assignedTo || null,
            due_date: dueDate || null
        })
        .select(`
            *,
            patients (full_name),
            profiles (full_name)
        `)
        .single();

    if (error) {
        console.error('Error creating task:', error);
        return null;
    }

    revalidatePath('/dashboard');
    return data;
}

export async function updateTaskStatus(taskId: string, newStatus: 'todo' | 'in_progress' | 'done'): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

    if (error) {
        console.error('Error updating task:', error);
        return false;
    }

    revalidatePath('/dashboard');
    return true;
}

export async function toggleTaskComplete(taskId: string, currentStatus: string): Promise<boolean> {
    const supabase = await createClient();

    const newStatus = currentStatus === 'done' ? 'todo' : 'done';

    const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

    if (error) {
        console.error('Error updating task:', error);
        return false;
    }

    revalidatePath('/dashboard');
    return true;
}

export async function deleteTask(taskId: string): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

    if (error) {
        console.error('Error deleting task:', error);
        return false;
    }

    revalidatePath('/dashboard');
    return true;
}
