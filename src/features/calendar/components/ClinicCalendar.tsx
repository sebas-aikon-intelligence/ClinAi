'use client';

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { useAppointments } from '../hooks/useAppointments';
import { AppointmentModal } from './AppointmentModal';
import { CreateAppointmentModal } from './CreateAppointmentModal';
import { Appointment } from '../types';
import './calendar.css'; // Custom styles if needed

export function ClinicCalendar() {
    const { appointments, refresh } = useAppointments();
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

    const handleEventClick = (info: any) => {
        const appointment = appointments.find(a => a.id === info.event.id);
        if (appointment) setSelectedAppointment(appointment);
    };

    const handleDateClick = (info: any) => {
        setSelectedDate(info.dateStr); // For creating new appointment
        // setIsCreateOpen(true); // Optional: Auto open on click. Or just selection.
    };

    const handleSelect = (info: any) => {
        setSelectedDate(info.startStr);
        setIsCreateOpen(true);
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 h-[calc(100vh-140px)]">
            <style jsx global>{`
        .fc {
          height: 100%;
          font-family: inherit;
        }
        .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          color: #1e293b;
        }
        .fc-button-primary {
          background-color: #ffffff !important;
          border-color: #e2e8f0 !important;
          color: #475569 !important;
          font-weight: 500 !important;
          text-transform: capitalize !important;
          padding: 0.5rem 1rem !important;
          border-radius: 0.75rem !important;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
        }
        .fc-button-primary:hover {
          background-color: #f8fafc !important;
        }
        .fc-button-active {
            background-color: #eff6ff !important;
            color: #2563eb !important;
            border-color: #bfdbfe !important;
        }
        .fc-daygrid-day-number {
             color: #64748b;
             font-weight: 500;
        }
        .fc-col-header-cell-cushion {
            color: #64748b;
            font-weight: 600;
            text-transform: capitalize;
            padding: 1rem 0 !important;
        }
      `}</style>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                locale={esLocale}
                events={appointments.map(a => ({
                    id: a.id,
                    title: a.title,
                    start: a.start,
                    end: a.end,
                    backgroundColor: '#eff6ff',
                    borderColor: '#3b82f6',
                    textColor: '#1e40af',
                    className: 'rounded-md shadow-sm border-l-4 border-l-primary-500 font-medium px-1'
                }))}
                eventClick={handleEventClick}
                selectable={true}
                select={handleSelect}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={false}
                nowIndicator
            />

            <AppointmentModal
                appointment={selectedAppointment}
                onClose={() => {
                    setSelectedAppointment(null);
                    refresh();
                }}
            />

            <CreateAppointmentModal
                isOpen={isCreateOpen}
                onClose={() => {
                    setIsCreateOpen(false);
                    refresh();
                }}
                initialDateTime={selectedDate}
            />
        </div>
    );
}
