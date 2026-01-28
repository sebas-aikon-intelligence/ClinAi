export interface Appointment {
    id: string;
    title: string;
    start: string; // ISO String
    end: string;
    patient_id: string;
    notes?: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'noshow';
    specialist?: string;
    created_at?: string;
    extendedProps?: any; // For FullCalendar compatibility if needed
}

export type CreateAppointmentInput = Omit<Appointment, 'id' | 'created_at' | 'extendedProps'>;
export type UpdateAppointmentInput = Partial<CreateAppointmentInput>;
