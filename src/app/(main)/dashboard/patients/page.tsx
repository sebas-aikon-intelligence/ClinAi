import { createClient } from '@/lib/supabase/server';
import { PatientList } from '@/features/patients/components/PatientList';

export default async function PatientsPage() {
    const supabase = await createClient();
    const { data: patients } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-luxury-700 to-luxury-900">
                        Pacientes
                    </h1>
                    <p className="text-luxury-600">Gestiona expedientes y seguimiento clínico.</p>
                </div>
            </div>


            <PatientList patients={patients || []} />
        </div>
    )
}
