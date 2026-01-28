import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { ProfileForm } from '@/features/settings/components/ProfileForm';
import { PasswordForm } from '@/features/settings/components/PasswordForm';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <div className="h-full p-6 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Configuración</h1>
                <p className="text-slate-500">Administra tu cuenta y preferencias.</p>
            </div>

            <Suspense fallback={
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
            }>
                <div className="max-w-4xl">
                    <ProfileForm initialData={{
                        firstName: profile?.first_name || '',
                        lastName: profile?.last_name || '',
                        email: user.email || ''
                    }} />

                    <div className="h-8" />

                    <PasswordForm />
                </div>
            </Suspense>
        </div>
    );
}
