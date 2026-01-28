'use client';

import { TagManager } from '@/features/tags/components/TagManager';

export default function TagsPage() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Etiquetas</h1>
                <p className="text-slate-500">Gestiona las etiquetas para clasificar pacientes y conversaciones.</p>
            </div>
            <TagManager />
        </div>
    );
}
