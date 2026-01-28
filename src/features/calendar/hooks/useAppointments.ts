'use client';

import { useState, useEffect, useCallback } from 'react';
import { Appointment } from '../types';
import { getAppointments } from '../actions/appointmentActions';
import { createClient } from '@/utils/supabase/client';

export function useAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAppointments = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getAppointments(); // Retrieve all for now or current month
            setAppointments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();

        const supabase = createClient();
        const channel = supabase
            .channel('appointments-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
                fetchAppointments();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchAppointments]);

    return { appointments, isLoading, refresh: fetchAppointments };
}
