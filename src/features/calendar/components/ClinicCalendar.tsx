'use client';

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Appointment } from '../types';
import { useAppointments } from '../hooks/useAppointments';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import esLocale from '@fullcalendar/core/locales/es';
import { CreateAppointmentModal } from './CreateAppointmentModal';
import { AppointmentModal } from './AppointmentModal';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClinicCalendarProps {
    initialAppointments: Appointment[];
}

export function ClinicCalendar({ initialAppointments }: ClinicCalendarProps) {
    const { appointments } = useAppointments(initialAppointments);
    const calendarRef = React.useRef<FullCalendar>(null);
    const [title, setTitle] = useState('');
    const [view, setView] = useState('dayGridMonth');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    // Transform appointments to FullCalendar events
    const events = appointments.map(app => ({
        id: app.id,
        title: app.title ?? 'Sin título',
        start: app.start_time,
        end: app.end_time,
        backgroundColor: getEventColor(app.type),
        borderColor: getEventColor(app.type),
        extendedProps: { ...app }
    }));

    function getEventColor(type: string | null | undefined): string {
        switch (type) {
            case 'consultation': return '#3B82F6'; // Blue
            case 'follow_up': return '#8B5CF6'; // Purple
            case 'procedure': return '#EF4444'; // Red
            case 'emergency': return '#F59E0B'; // Amber
            default: return '#64748B'; // Slate
        }
    }

    const handleDateClick = (arg: any) => {
        setSelectedDate(arg.date);
        setIsCreateModalOpen(true);
    };

    const handleEventClick = (arg: any) => {
        const appointment = {
            id: arg.event.id,
            title: arg.event.title,
            start_time: arg.event.startStr,
            end_time: arg.event.endStr,
            ...arg.event.extendedProps
        } as Appointment;

        setSelectedAppointment(appointment);
    };

    const handleDatesSet = (arg: any) => {
        setTitle(arg.view.title);
        setView(arg.view.type);
    };

    const goNext = () => {
        calendarRef.current?.getApi().next();
    };

    const goPrev = () => {
        calendarRef.current?.getApi().prev();
    };

    const goToday = () => {
        calendarRef.current?.getApi().today();
    };

    const changeView = (newView: string) => {
        calendarRef.current?.getApi().changeView(newView);
        setView(newView);
    };

    return (
        <GlassCard className="p-6 h-full flex flex-col border-white/40 shadow-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)' }}>
            {/* Custom Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-800 capitalize w-64">{title}</h2>
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <Button variant="ghost" size="sm" onClick={goPrev} className="h-8 w-8 p-0 hover:bg-white hover:text-primary-600 rounded-md">
                            {'<'}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={goToday} className="h-8 px-3 text-xs font-semibold hover:bg-white hover:text-primary-600 rounded-md">
                            Hoy
                        </Button>
                        <Button variant="ghost" size="sm" onClick={goNext} className="h-8 w-8 p-0 hover:bg-white hover:text-primary-600 rounded-md">
                            {'>'}
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => changeView('dayGridMonth')}
                            className={cn(
                                "h-8 px-3 text-xs font-medium rounded-md transition-all",
                                view === 'dayGridMonth' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            Mes
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => changeView('timeGridWeek')}
                            className={cn(
                                "h-8 px-3 text-xs font-medium rounded-md transition-all",
                                view === 'timeGridWeek' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            Semana
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => changeView('timeGridDay')}
                            className={cn(
                                "h-8 px-3 text-xs font-medium rounded-md transition-all",
                                view === 'timeGridDay' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            Día
                        </Button>
                    </div>
                </div>
            </div>

            <div className="calendar-wrapper flex-1 bg-white rounded-xl border border-slate-200" style={{ minHeight: '600px' }}>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={false}
                    locale={esLocale}
                    height="auto"
                    contentHeight={550}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    events={events}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    datesSet={handleDatesSet}
                    slotMinTime="07:00:00"
                    slotMaxTime="20:00:00"
                    allDaySlot={false}
                    eventClassNames="rounded-md border-0 shadow-sm opacity-90 hover:opacity-100 transition-opacity cursor-pointer font-medium text-xs px-2 py-1"
                    eventContent={(eventInfo) => {
                        const colors = {
                            consultation: 'bg-primary-500 text-white',
                            follow_up: 'bg-blue-500 text-white',
                            procedure: 'bg-purple-500 text-white',
                            emergency: 'bg-red-500 text-white'
                        };
                        const type = eventInfo.event.extendedProps.type || 'consultation';
                        return (
                            <div className={`flex flex-col overflow-hidden h-full ${colors[type as keyof typeof colors] || colors.consultation}`}>
                                <span className="truncate font-semibold text-[11px]">{eventInfo.event.title}</span>
                                <span className="truncate text-[9px] opacity-90">{eventInfo.timeText}</span>
                            </div>
                        )
                    }}
                    dayHeaderContent={(args) => {
                        return <span className="sidebar-text font-semibold text-slate-500 uppercase text-xs tracking-wider">{args.text}</span>
                    }}
                    dayCellContent={(args) => {
                        return (
                            <div className="w-full flex justify-center pt-1">
                                <span className={cn(
                                    "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                                    args.isToday ? "bg-primary-600 text-white" : "text-slate-700 hover:bg-slate-100"
                                )}>
                                    {args.dayNumberText}
                                </span>
                            </div>
                        )
                    }}
                />
            </div>

            <CreateAppointmentModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                initialDate={selectedDate}
            />

            <AppointmentModal
                isOpen={!!selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
                appointment={selectedAppointment}
            />

            <style jsx global>{`
                /* ULTRA-SPECIFIC FULLCALENDAR OVERRIDES */
                div.fc.fc-media-screen table thead tr th.fc-col-header-cell,
                div.fc.fc-media-screen table tbody tr td.fc-daygrid-day,
                div.fc.fc-media-screen table tbody tr td.fc-timegrid-col {
                    border: 2px solid #94a3b8 !important;
                }
                
                div.fc.fc-media-screen .fc-scrollgrid {
                    border: 3px solid #475569 !important;
                    border-radius: 12px !important;
                    overflow: hidden !important;
                    background: #ffffff !important;
                }
                
                div.fc.fc-media-screen table.fc-scrollgrid-sync-table thead tr th.fc-col-header-cell {
                    background-color: #e2e8f0 !important;
                    border-bottom: 3px solid #64748b !important;
                    font-weight: 700 !important;
                    color: #1e293b !important;
                    font-size: 13px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.5px !important;
                }
                
                div.fc.fc-media-screen table tbody tr td.fc-daygrid-day {
                    background-color: #ffffff !important;
                    min-height: 120px !important;
                }
                
                div.fc.fc-media-screen table tbody tr td.fc-day-today {
                    background-color: #dbeafe !important;
                }
                
                div.fc.fc-media-screen .fc-daygrid-day-frame {
                    min-height: 100px !important;
                    padding: 4px !important;
                }
                
                div.fc.fc-media-screen .fc-daygrid-day-top {
                    display: flex !important;
                    justify-content: center !important;
                    padding: 8px !important;
                }
                
                div.fc.fc-media-screen .fc-daygrid-day-number {
                    color: #0f172a !important;
                    font-weight: 700 !important;
                    font-size: 16px !important;
                    padding: 6px 10px !important;
                }
                
                div.fc.fc-media-screen .fc-day-today .fc-daygrid-day-number {
                    background-color: #2563eb !important;
                    color: #ffffff !important;
                    border-radius: 50% !important;
                    width: 32px !important;
                    height: 32px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                
                div.fc.fc-media-screen .fc-day-other .fc-daygrid-day-number {
                    color: #cbd5e1 !important;
                }
                
                /* TIME GRID (WEEK/DAY VIEW) */
                div.fc.fc-media-screen .fc-timegrid-slot {
                    height: 50px !important;
                    border-bottom: 1px solid #cbd5e1 !important;
                    background: #ffffff !important;
                }
                
                div.fc.fc-media-screen .fc-timegrid-axis-cushion {
                    color: #475569 !important;
                    font-weight: 600 !important;
                }
                
                div.fc.fc-media-screen .fc-timegrid-col {
                    background: #ffffff !important;
                }
                
                /* ENSURE EVENTS ARE MAXIMALLY VISIBLE */
                div.fc.fc-media-screen .fc-event {
                    border: none !important;
                    padding: 6px 8px !important;
                    margin: 3px !important;
                    border-radius: 6px !important;
                    font-weight: 600 !important;
                    font-size: 12px !important;
                    cursor: pointer !important;
                    opacity: 1 !important;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                }
                
                div.fc.fc-media-screen .fc-daygrid-event {
                    margin: 2px 4px !important;
                }
                
                div.fc.fc-media-screen .fc-event-title {
                    color: white !important;
                    font-weight: 600 !important;
                }
                
                div.fc.fc-media-screen .fc-event-time {
                    color: white !important;
                    opacity: 0.9 !important;
                }
             `}</style>
        </GlassCard>
    );
}
