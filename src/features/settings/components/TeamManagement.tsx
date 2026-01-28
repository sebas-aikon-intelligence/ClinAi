'use client';

import React, { useState } from 'react';
import { User, Mail, Shield, Plus, MoreVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InviteMemberModal } from './InviteMemberModal';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'doctor' | 'staff';
    status: 'active' | 'invited';
    avatar?: string;
}

// Mock data for MVP
const MOCK_TEAM: TeamMember[] = [
    { id: '1', name: 'Dr. Juan Pérez', email: 'juan@clinai.com', role: 'admin', status: 'active' },
    { id: '2', name: 'Dra. Ana López', email: 'ana@clinai.com', role: 'doctor', status: 'active' },
    { id: '3', name: 'María Garcia', email: 'maria@clinai.com', role: 'staff', status: 'invited' },
];

export function TeamManagement() {
    const [members, setMembers] = useState(MOCK_TEAM);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    const handleDelete = (id: string) => {
        if (!confirm('¿Eliminar miembro del equipo?')) return;
        setMembers(prev => prev.filter(m => m.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Miembros del Equipo</h2>
                <button
                    onClick={() => setIsInviteOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg shadow-primary-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Invitar Miembro
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map(member => (
                    <div key={member.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-primary-200 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-lg">
                                {member.avatar ? (
                                    <img src={member.avatar} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    member.name[0]
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{member.name}</h3>
                                <p className="text-sm text-slate-500">{member.email}</p>
                                <div className="flex gap-2 mt-1">
                                    <span className={cn(
                                        "text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider",
                                        member.role === 'admin' ? "bg-purple-100 text-purple-700" :
                                            member.role === 'doctor' ? "bg-blue-100 text-blue-700" :
                                                "bg-slate-100 text-slate-700"
                                    )}>
                                        {member.role}
                                    </span>
                                    {member.status === 'invited' && (
                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 uppercase tracking-wider">
                                            Pendiente
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => handleDelete(member.id)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <InviteMemberModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
        </div>
    );
}
