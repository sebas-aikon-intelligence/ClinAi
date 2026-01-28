'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError(authError.message);
                setIsLoading(false);
                return;
            }

            if (data.session) {
                router.push('/dashboard');
                router.refresh();
            }
        } catch (err) {
            setError('Error inesperado al iniciar sesión');
            setIsLoading(false);
        }
    };

    return (
        <GlassCard className="w-full max-w-md mx-auto p-8 border-white/20">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-luxury-700 to-luxury-900">
                    Bienvenido
                </h1>
                <p className="text-luxury-600">Accede a tu panel clínico de alta precisión</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-luxury-800 ml-1">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-400 group-focus-within:text-luxury-600 transition-colors" />
                        <input
                            type="email"
                            placeholder="admin@clinai.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-luxury-900 placeholder:text-luxury-300 focus:outline-none focus:ring-2 focus:ring-luxury-400/50 focus:bg-white/10 transition-all"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-luxury-600 to-luxury-500 hover:from-luxury-700 hover:to-luxury-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-luxury-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Ingresar
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                <div className="text-center text-sm text-luxury-600">
                    ¿No tienes cuenta?{' '}
                    <Link href="/signup" className="font-semibold text-luxury-800 hover:text-luxury-900 underline decoration-luxury-300 hover:decoration-luxury-500 underline-offset-4 transition-all">
                        Solicitar acceso
                    </Link>
                </div>
            </form>
        </GlassCard>
    );
}

