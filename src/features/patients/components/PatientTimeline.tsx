import React from 'react';
import { Activity } from '../types';
import { FileText, Phone, Mail, Calendar, Activity as ActivityIcon, Upload } from 'lucide-react';

interface PatientTimelineProps {
    activities: Activity[];
}

export function PatientTimeline({ activities }: PatientTimelineProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'note': return FileText;
            case 'call': return Phone;
            case 'email': return Mail;
            case 'appointment': return Calendar;
            case 'file_upload': return Upload;
            default: return ActivityIcon;
        }
    };

    return (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {activities.map((activity, index) => {
                const Icon = getIcon(activity.type);
                return (
                    <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <Icon className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                                <div className="font-bold text-slate-900 capitalize">{activity.type.replace('_', ' ')}</div>
                                <time className="font-caveat font-medium text-slate-500 text-xs">
                                    {new Date(activity.created_at).toLocaleString()}
                                </time>
                            </div>
                            <div className="text-slate-500 text-sm">
                                {activity.description}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
