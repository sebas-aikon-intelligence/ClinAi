'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateAppointmentModal } from '@/features/calendar/components/CreateAppointmentModal';

export function NewAppointmentButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Cita
            </Button>

            <CreateAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
