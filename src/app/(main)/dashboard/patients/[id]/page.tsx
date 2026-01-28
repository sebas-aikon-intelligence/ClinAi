import { Suspense } from 'react';
import { getPatientById, getPatientFiles, getPrescriptions, getActivities } from '@/features/patients/actions/patientActions';
import { getPatientTags } from '@/features/tags/actions/tagActions';
import { PatientDetail } from '@/features/patients/components/PatientDetail';
import { notFound } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    const patient = await getPatientById(id);
    if (!patient) notFound();

    // Parallel data fetching
    const [files, prescriptions, activities, assignedTags] = await Promise.all([
        getPatientFiles(id),
        getPrescriptions(id),
        getActivities(id),
        getPatientTags(id)
    ]);

    return (
        <div className="p-6">
            <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>}>
                <PatientDetail
                    patient={patient}
                    files={files}
                    prescriptions={prescriptions}
                    activities={activities}
                    assignedTags={assignedTags}
                />
            </Suspense>
        </div>
    );
}
