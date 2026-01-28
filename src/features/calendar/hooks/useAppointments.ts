'use client';

import { useState, useEffect } from 'react';
import { Appointment } from '../types';
import { getAppointments } from '../actions/appointmentActions';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export function useAppointments(initialAppointments: Appointment[] = []) {
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Fetch initial appointments (can be used for refresh or date range change)
    const fetchAppointments = async (start?: Date, end?: Date) => {
        setIsLoading(true);
        try {
            const data = await getAppointments(start, end);
            setAppointments(data);
        } catch (error) {
            console.error('Error in fetchAppointments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Realtime subscription
    useEffect(() => {
        const channel = supabase
            .channel('appointments-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'appointments',
                },
                (payload) => {
                    console.log('Realtime update:', payload);

                    if (payload.eventType === 'INSERT') {
                        setAppointments((prev) => [...prev, payload.new as Appointment]);
                    } else if (payload.eventType === 'UPDATE') {
                        setAppointments((prev) =>
                            prev.map((app) => app.id === payload.new.id ? payload.new as Appointment : app)
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setAppointments((prev) =>
                            prev.filter((app) => app.id !== payload.old.id)
                        );
                    }

                    router.refresh(); // Also refresh server components if they depend on data
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, router]);

    return {
        appointments,
        fetchAppointments,
        isLoading
    };
}
