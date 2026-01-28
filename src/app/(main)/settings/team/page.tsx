'use client';

import { TeamManagement } from '@/features/settings/components/TeamManagement';
import { InviteMemberModal } from '@/features/settings/components/InviteMemberModal';
import { useState } from 'react';

export default function TeamPage() {
    // State lifting for modal if needed, but for now TeamManagement handles state or we pass it down
    // Actually TeamManagement had the state for modal internal or I commented it out. 
    // Let's reimplement TeamManagement to use the modal properly.
    // I will just render TeamManagement and let it handle the modal if I passed it, OR handle it here if I prefer lifting.
    // For simplicity, I'll modify TeamManagement to include the modal.

    // BUT, I wrote TeamManagement to Import the modal (commented out). 
    // I should probably update TeamManagement to actually use it.
    // I will write this page to just wrap TeamManagement, and update TeamManagement in next step to uncomment/use Modal.
    // Wait, I can't easily "update" efficiently without rewriting. 
    // I should have written TeamManagement with the modal imported. 
    // I will update TeamManagement in this same turn if possible or next.

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Gestión de Equipo</h1>
                <p className="text-slate-500">Administra el acceso y roles de tu personal.</p>
            </div>
            <TeamManagement />
            {/* Modal is inside TeamManagement now? No I commented it out. I need to fix TeamManagement. */}
        </div>
    );
}
