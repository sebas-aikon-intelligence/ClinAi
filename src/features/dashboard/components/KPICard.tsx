import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon: LucideIcon;
    color?: 'luxury' | 'mint' | 'gold';
}

export function KPICard({
    title,
    value,
    change,
    trend = 'neutral',
    icon: Icon,
    color = 'luxury'
}: KPICardProps) {
    const colorMap = {
        luxury: 'text-primary-600 bg-primary-50 ring-1 ring-primary-100',
        mint: 'text-status-success bg-status-success/10 ring-1 ring-status-success/20',
        gold: 'text-status-warning bg-status-warning/10 ring-1 ring-status-warning/20',
    };

    return (
        <GlassCard className="relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-xl backdrop-blur-md shadow-sm", colorMap[color])}>
                    <Icon className="w-6 h-6" />
                </div>
                {change && (
                    <span className={cn(
                        "text-sm font-medium px-2 py-1 rounded-lg",
                        trend === 'up' ? "bg-status-success/10 text-status-success" :
                            trend === 'down' ? "bg-status-error/10 text-status-error" : "bg-slate-100 text-slate-600"
                    )}>
                        {change}
                    </span>
                )}
            </div>

            <div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
            </div>
        </GlassCard>
    );
}
