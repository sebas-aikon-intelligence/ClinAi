import { Suspense } from 'react';
import { getPatients } from '@/features/patients/actions/patientActions';
import MessagesView from '@/features/messages/components/MessagesView';
import { Loader2 } from 'lucide-react';

export default async function MessagesPage() {
  const patients = await getPatients();

  return (
    <div className="h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Mensajeria</h1>
        <p className="text-slate-500">Comunicate con tus pacientes via WhatsApp.</p>
      </div>
      <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>}>
        <MessagesView patients={patients} />
      </Suspense>
    </div>
  );
}
