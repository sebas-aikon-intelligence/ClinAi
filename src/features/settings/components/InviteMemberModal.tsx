'use client';

import React, { useState } from 'react';
import { X, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('staff');

    if (!isOpen) return null;

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success(`Invitación enviada a ${email}`);
        setIsLoading(false);
        onClose();
        setEmail('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 animate-in zoom-in-95 duration-200 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6 text-center">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Invitar Miembro</h2>
                    <p className="text-sm text-slate-500">Envía una invitación por correo electrónico.</p>
                </div>

                <form onSubmit={handleInvite} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
                        <input
                            type="email"
                            required
                            placeholder="colaborador@clinai.com"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1">Rol</label>
                        <select
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
                            value={role}
                            onChange={e => setRole(e.target.value)}
                        >
                            <option value="staff">Staff / Asistente</option>
                            <option value="doctor">Doctor / Especialista</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Enviar Invitación'}
                    </button>
                </form>
            </div>
        </div>
    );
}
