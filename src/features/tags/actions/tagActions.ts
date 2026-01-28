'use server';

import { createClient } from '@/utils/supabase/server';
import { Tag, CreateTagInput, UpdateTagInput } from '../types';
import { revalidatePath } from 'next/cache';

export async function getTags(): Promise<Tag[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching tags:', error);
        return [];
    }

    return data || [];
}

export async function createTag(input: CreateTagInput): Promise<Tag | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('tags')
        .insert([input])
        .select()
        .single();

    if (error) {
        console.error('Error creating tag:', error);
        return null;
    }

    revalidatePath('/settings/tags');
    return data;
}

export async function updateTag(id: string, input: UpdateTagInput): Promise<Tag | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('tags')
        .update(input)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating tag:', error);
        return null;
    }

    revalidatePath('/settings/tags');
    return data;
}

export async function deleteTag(id: string): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting tag:', error);
        return false;
    }

    revalidatePath('/settings/tags');
    return true;
}

export async function assignTagToPatient(patientId: string, tagId: string): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase
        .from('patient_tags')
        .insert([{ patient_id: patientId, tag_id: tagId }]);

    if (error) {
        console.error('Error assigning tag:', error);
        return false;
    }

    revalidatePath('/dashboard/patients');
    return true;
}

export async function removeTagFromPatient(patientId: string, tagId: string): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase
        .from('patient_tags')
        .delete()
        .match({ patient_id: patientId, tag_id: tagId });

    if (error) {
        console.error('Error removing tag:', error);
        return false;
    }

    revalidatePath('/dashboard/patients');
    return true;
}
