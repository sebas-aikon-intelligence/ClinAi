import { Suspense } from 'react';
import { getPatients } from '@/features/patients/actions/patientActions';
import { PatientsView } from '@/features/patients/components/PatientsView';
import { Loader2 } from 'lucide-react';

export default async function PatientsPage() {
    const patients = await getPatients();

    return (
        <div className="h-full p-6">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>}>
                <PatientsView initialPatients={patients} />
            </Suspense>
        </div>
    );
}
