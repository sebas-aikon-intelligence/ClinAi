'use server';

import { createClient } from '@/utils/supabase/server';
import { Patient, PatientFile, Prescription, Activity, CreatePatientInput, UpdatePatientInput } from '../types';
import { revalidatePath } from 'next/cache';

// --- Patients CRUD ---

export async function getPatients(search?: string): Promise<Patient[]> {
    const supabase = await createClient();
    let query = supabase.from('patients').select('*').order('created_at', { ascending: false });

    if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) {
        console.error('Error fetching patients:', error);
        return [];
    }
    return data || [];
}

export async function getPatientById(id: string): Promise<Patient | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('patients').select('*').eq('id', id).single();

    if (error) {
        console.error('Error fetching patient:', error);
        return null;
    }
    return data;
}

export async function createPatient(input: CreatePatientInput): Promise<Patient | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('patients').insert([input]).select().single();

    if (error) {
        console.error('Error creating patient:', error);
        return null;
    }

    // Log activity
    await createActivity({
        patient_id: data.id,
        type: 'status_change', // Initial create implicitly
        description: 'Paciente creado',
        metadata: { stage: input.pipeline_stage }
    });

    revalidatePath('/dashboard/patients');
    return data;
}

export async function updatePatient(id: string, input: UpdatePatientInput): Promise<Patient | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('patients').update(input).eq('id', id).select().single();

    if (error) {
        console.error('Error updating patient:', error);
        return null;
    }

    revalidatePath('/dashboard/patients');
    revalidatePath(`/dashboard/patients/${id}`);
    return data;
}

export async function deletePatient(id: string): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase.from('patients').delete().eq('id', id);

    if (error) return false;

    revalidatePath('/dashboard/patients');
    return true;
}

export async function updatePipelineStage(id: string, stage: string): Promise<boolean> {
    const result = await updatePatient(id, { pipeline_stage: stage as any });
    if (result) {
        await createActivity({
            patient_id: id,
            type: 'status_change',
            description: `Estado cambiado a ${stage}`,
            metadata: { stage }
        });
        return true;
    }
    return false;
}

// --- Files ---

export async function getPatientFiles(patientId: string): Promise<PatientFile[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('patient_files').select('*').eq('patient_id', patientId).order('uploaded_at', { ascending: false });
    if (error) return [];
    return data || [];
}

export async function uploadFile(patientId: string, formData: FormData): Promise<PatientFile | null> {
    const supabase = await createClient();
    const file = formData.get('file') as File;
    if (!file) return null;

    const fileName = `${patientId}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from('patient-files').upload(fileName, file);

    if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
    }

    const { data: publicUrlData } = supabase.storage.from('patient-files').getPublicUrl(fileName);

    const { data: fileRecord, error: dbError } = await supabase.from('patient_files').insert([{
        patient_id: patientId,
        file_name: file.name,
        file_url: publicUrlData.publicUrl,
        file_type: file.type
    }]).select().single();

    if (dbError) {
        console.error('DB error recording file:', dbError);
        return null;
    }

    await createActivity({
        patient_id: patientId,
        type: 'file_upload',
        description: `Archivo subido: ${file.name}`
    });

    revalidatePath(`/dashboard/patients/${patientId}`);
    return fileRecord;
}

export async function deleteFile(id: string, path: string): Promise<boolean> {
    // Note: path extraction logic might be needed if not stored, but assuming we can pass it or retrieve it
    const supabase = await createClient();
    // Delete from DB first or storage? DB usually safer link
    const { error } = await supabase.from('patient_files').delete().eq('id', id);
    if (error) return false;

    // TODO: Delete from storage bucket using path if available or stored

    revalidatePath('/dashboard/patients'); // Refresh generically
    return true;
}

// --- Prescriptions ---

export async function getPrescriptions(patientId: string): Promise<Prescription[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('patient_prescriptions').select('*').eq('patient_id', patientId).order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
}

export async function createPrescription(patientId: string, input: Omit<Prescription, 'id' | 'patient_id' | 'created_at' | 'created_by'>): Promise<Prescription | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase.from('patient_prescriptions').insert([{
        patient_id: patientId,
        ...input,
        created_by: user?.id
    }]).select().single();

    if (error) return null;

    await createActivity({
        patient_id: patientId,
        type: 'note', // or custom type
        description: `Receta creada: ${input.medication}`
    });

    revalidatePath(`/dashboard/patients/${patientId}`);
    return data;
}

export async function sendPrescription(prescriptionId: string, channel: 'email' | 'whatsapp' | 'both'): Promise<boolean> {
    // Call n8n webhook here (mocked for now)
    console.log(`Sending prescription ${prescriptionId} via ${channel}`);
    // In real implementation: fetch(N8N_WEBHOOK_URL, ...)
    const supabase = await createClient();
    await supabase.from('patient_prescriptions').update({ sent_via: channel }).eq('id', prescriptionId);
    return true;
}

// --- Activities ---

export async function getActivities(patientId: string): Promise<Activity[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('patient_activities').select('*').eq('patient_id', patientId).order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
}

export async function createActivity(input: Omit<Activity, 'id' | 'created_at'>): Promise<Activity | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('patient_activities').insert([input]).select().single();
    if (error) {
        console.error('Error creating activity', error);
        return null;
    }
    return data;
}
