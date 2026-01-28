
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();

    // 1. Get or Create User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 2. Get or Create Patient
    let patientId;
    const { data: patients } = await supabase.from('patients').select('id').limit(1);

    if (patients && patients.length > 0) {
        patientId = patients[0].id;
    } else {
        const { data: newPatient, error: patientError } = await supabase.from('patients').insert({
            first_name: 'Test',
            last_name: 'Patient',
            email: 'test@patient.com',
            phone: '555-0000',
            status: 'active',
            pipeline_stage: 'lead'
        }).select().single();

        if (patientError) return NextResponse.json({ error: patientError }, { status: 500 });
        patientId = newPatient.id;
    }

    // 3. Create Appointments
    const now = new Date();
    const appointments = [
        {
            title: 'Consulta General',
            start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0).toISOString(),
            end_time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0).toISOString(),
            patient_id: patientId,
            type: 'consultation',
            status: 'scheduled',
            created_by: user.id
        },
        {
            title: 'Limpieza Dental',
            start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 0).toISOString(),
            end_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12, 0).toISOString(),
            patient_id: patientId,
            type: 'procedure',
            status: 'confirmed',
            created_by: user.id
        },
        {
            title: 'Revisión Resultados',
            start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 14, 0).toISOString(), // +2 days
            end_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 14, 30).toISOString(),
            patient_id: patientId,
            type: 'follow_up',
            status: 'scheduled',
            created_by: user.id
        },
        {
            title: 'Urgencia Dolor',
            start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 16, 0).toISOString(), // +3 days
            end_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 17, 0).toISOString(),
            patient_id: patientId,
            type: 'emergency',
            status: 'scheduled',
            created_by: user.id
        },
        {
            title: 'Consulta Seguimiento',
            start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0).toISOString(), // Same day
            end_time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 30).toISOString(),
            patient_id: patientId,
            type: 'follow_up',
            status: 'completed',
            created_by: user.id
        }
    ];

    const { data, error } = await supabase.from('appointments').insert(appointments).select();

    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json({ success: true, count: data.length });
}
