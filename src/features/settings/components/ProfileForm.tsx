'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProfile } from '../actions/settingsActions';
import { toast } from 'sonner';
import { User, Loader2 } from 'lucide-react';

interface ProfileFormProps {
    initialData: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            const result = await updateProfile(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
            }
        } catch (error) {
            toast.error('Error inesperado');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GlassCard className="p-8 max-w-2xl bg-white/70">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-primary-100 rounded-full text-primary-600">
                    <User className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Perfil de Usuario</h2>
                    <p className="text-slate-500">Actualiza tu información personal.</p>
                </div>
            </div>

            <form action={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            defaultValue={initialData.firstName}
                            required
                            className="bg-white/50 border-slate-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            defaultValue={initialData.lastName}
                            required
                            className="bg-white/50 border-slate-200"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        defaultValue={initialData.email}
                        disabled
                        className="bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-400">El email no se puede cambiar directamente.</p>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={isLoading} className="bg-primary-600 hover:bg-primary-700">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Guardar Cambios
                    </Button>
                </div>
            </form>
        </GlassCard>
    );
}
