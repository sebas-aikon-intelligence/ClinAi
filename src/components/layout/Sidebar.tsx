'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    Calendar,
    MessageSquare,
    CreditCard,
    CheckSquare,
    Settings,
    LogOut,
    Activity
} from 'lucide-react';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/patients', label: 'Pacientes', icon: Users },
    { href: '/dashboard/calendar', label: 'Calendario', icon: Calendar },
    { href: '/dashboard/messages', label: 'Mensajes', icon: MessageSquare },
    { href: '/dashboard/finance', label: 'Finanzas', icon: CreditCard },
    { href: '/dashboard/tasks', label: 'Tareas', icon: CheckSquare },
    { href: '/settings', label: 'Configuración', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-4 top-4 bottom-4 w-64 glass-panel rounded-2xl flex flex-col z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-800 tracking-tight">
                    VeterinarIA
                </span>
            </div>

            <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
                {menuItems.map((item) => {
                    // Check if path starts with item.href (for active state on subpages)
                    // Exception for dashboard root to avoid always being active
                    const isActive = item.href === '/dashboard'
                        ? pathname === item.href
                        : pathname.startsWith(item.href);

                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium",
                                isActive
                                    ? "bg-primary-50 text-primary-700 border border-primary-100"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            )}
                        >
                            <Icon className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"
                            )} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all">
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}
