import React from 'react';
import { MessageCircle, Mail, Phone, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
    phone?: string;
    email?: string;
    className?: string;
    onAction?: (action: string) => void;
}

export function QuickActions({ phone, email, className, onAction }: QuickActionsProps) {
    const actions = [
        {
            id: 'whatsapp',
            label: 'WhatsApp',
            icon: MessageCircle,
            color: 'bg-green-500 hover:bg-green-600',
            onClick: () => window.open(`https://wa.me/${phone?.replace(/\D/g, '')}`, '_blank')
        },
        {
            id: 'email',
            label: 'Email',
            icon: Mail,
            color: 'bg-blue-500 hover:bg-blue-600',
            onClick: () => window.location.href = `mailto:${email}`
        },
        {
            id: 'call',
            label: 'Llamar',
            icon: Phone,
            color: 'bg-indigo-500 hover:bg-indigo-600',
            onClick: () => window.location.href = `tel:${phone}`
        },
        {
            id: 'schedule',
            label: 'Agendar',
            icon: Calendar,
            color: 'bg-purple-500 hover:bg-purple-600',
            onClick: () => onAction?.('schedule')
        }
    ];

    return (
        <div className={cn("flex gap-2", className)}>
            {actions.map(action => (
                <button
                    key={action.id}
                    onClick={action.onClick}
                    className={cn(
                        "p-2 rounded-full text-white shadow-lg shadow-black/5 transition-all hover:scale-110",
                        action.color
                    )}
                    title={action.label}
                >
                    <action.icon className="w-4 h-4" />
                </button>
            ))}
        </div>
    );
}
