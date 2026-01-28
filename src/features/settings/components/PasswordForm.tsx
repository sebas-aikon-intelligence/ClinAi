'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updatePassword } from '../actions/settingsActions';
import { toast } from 'sonner';
import { Lock, Loader2 } from 'lucide-react';

export function PasswordForm() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            const result = await updatePassword(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
                // Optional: Reset form
                const form = document.getElementById('password-form') as HTMLFormElement;
                form?.reset();
            }
        } catch (error) {
            toast.error('Error inesperado');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GlassCard className="p-8 max-w-2xl bg-white/70 mt-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-amber-100 rounded-full text-amber-600">
                    <Lock className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Seguridad</h2>
                    <p className="text-slate-500">Actualiza tu contraseña.</p>
                </div>
            </div>

            <form id="password-form" action={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="password">Nueva Contraseña</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        placeholder="••••••••"
                        className="bg-white/50 border-slate-200"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        minLength={6}
                        placeholder="••••••••"
                        className="bg-white/50 border-slate-200"
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={isLoading} className="bg-amber-600 hover:bg-amber-700 text-white">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Actualizar Contraseña
                    </Button>
                </div>
            </form>
        </GlassCard>
    );
}
