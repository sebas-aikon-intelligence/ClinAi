export interface Tag {
    id: string;
    name: string;
    color: string;
    type: 'general' | 'status' | 'priority' | string;
    created_at: string;
}

export interface PatientTag {
    patient_id: string;
    tag_id: string;
}

export type CreateTagInput = Omit<Tag, 'id' | 'created_at'>;
export type UpdateTagInput = Partial<CreateTagInput>;
