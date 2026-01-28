export interface Appointment {
    id: string;
    patient_id?: string | null;
    doctor_id?: string | null;
    title?: string | null;
    start_time: string;
    end_time: string;
    type?: 'consultation' | 'follow_up' | 'procedure' | 'emergency' | null;
    status: 'pending' | 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
    notes?: string | null;
    created_at: string;
}

export interface CreateAppointmentInput {
    patient_id?: string | null;
    doctor_id?: string | null;
    title?: string | null;
    start_time: Date;
    end_time: Date;
    type?: Appointment['type'];
    notes?: string | null;
}

export interface UpdateAppointmentInput extends Partial<CreateAppointmentInput> {
    status?: Appointment['status'];
}

export type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';

