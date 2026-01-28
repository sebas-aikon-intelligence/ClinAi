export interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    address?: string;
    birth_date?: string;
    pipeline_stage: 'lead' | 'contacted' | 'scheduled' | 'active' | 'inactive';
    created_at: string;
    [key: string]: any; // For other dynamic fields if any
}

export interface PatientFile {
    id: string;
    patient_id: string;
    file_name: string;
    file_url: string;
    file_type: string;
    uploaded_at: string;
}

export interface Prescription {
    id: string;
    patient_id: string;
    medication: string;
    dosage: string;
    instructions: string;
    created_by: string;
    created_at: string;
    sent_via?: 'email' | 'whatsapp' | 'both';
}

export interface Activity {
    id: string;
    patient_id: string;
    type: 'note' | 'call' | 'email' | 'appointment' | 'status_change' | 'file_upload';
    description: string;
    metadata?: any;
    created_at: string;
}

export type CreatePatientInput = Omit<Patient, 'id' | 'created_at'>;
export type UpdatePatientInput = Partial<CreatePatientInput>;
