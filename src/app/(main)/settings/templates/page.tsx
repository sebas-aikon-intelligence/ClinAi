'use client';

import { TemplatesManager } from '@/features/settings/components/TemplatesManager';

export default function TemplatesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Plantillas de Respuesta</h1>
                <p className="text-slate-500">Estandariza tus comunicaciones frecuentes.</p>
            </div>
            <TemplatesManager />
        </div>
    );
}
