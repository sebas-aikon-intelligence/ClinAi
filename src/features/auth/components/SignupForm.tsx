'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Mail, Lock, Loader2, ArrowRight, User, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SignupForm() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate auth for now
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        router.push('/dashboard');
    };

    return (
        <GlassCard className="w-full max-w-md mx-auto p-8 border-white/20">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-luxury-700 to-mint-600">
                    Unirse a ClinAi
                </h1>
                <p className="text-luxury-600">Gestión de excelencia para su clínica</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-luxury-800 ml-1">Nombre Completo</label>
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-400 group-focus-within:text-luxury-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Dr. Juan Pérez"
                            className="w-full bg-white/5 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-luxury-900 placeholder:text-luxury-300 focus:outline-none focus:ring-2 focus:ring-luxury-400/50 focus:bg-white/10 transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-luxury-800 ml-1">Especialidad</label>
                    <div className="relative group">
                        <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-400 group-focus-within:text-luxury-600 transition-colors" />
                        <select
                            className="w-full bg-white/5 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-luxury-900 focus:outline-none focus:ring-2 focus:ring-luxury-400/50 focus:bg-white/10 transition-all appearance-none"
                            required
                        >
                            <option value="" disabled selected>Seleccionar especialidad</option>
                            <option value="odontologia">Odontología</option>
                            <option value="dermatologia">Dermatología</option>
                            <option value="pediatria">Pediatría</option>
                            <option value="ginecologia">Ginecología</option>
                            <option value="oftalmologia">Oftalmología</option>
                            <option value="otro">Otra</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-luxury-800 ml-1">Email Profesional</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-400 group-focus-within:text-luxury-600 transition-colors" />
                        <input
                            type="email"
                            placeholder="contacto@clinica.com"
                            className="w-full bg-white/5 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-luxury-900 placeholder:text-luxury-300 focus:outline-none focus:ring-2 focus:ring-luxury-400/50 focus:bg-white/10 transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-luxury-800 ml-1">Contraseña</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-400 group-focus-within:text-luxury-600 transition-colors" />
                        <input
                            type="password"
                            placeholder="Min. 8 caracteres"
                            className="w-full bg-white/5 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-luxury-900 placeholder:text-luxury-300 focus:outline-none focus:ring-2 focus:ring-luxury-400/50 focus:bg-white/10 transition-all"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-gradient-to-r from-mint-600 to-mint-500 hover:from-mint-700 hover:to-mint-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-mint-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Crear Clínica
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                <div className="text-center text-sm text-luxury-600">
                    ¿Ya tiene cuenta?{' '}
                    <Link href="/login" className="font-semibold text-luxury-800 hover:text-luxury-900 underline decoration-luxury-300 hover:decoration-luxury-500 underline-offset-4 transition-all">
                        Iniciar sesión
                    </Link>
                </div>
            </form>
        </GlassCard>
    );
}
