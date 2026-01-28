'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

    return {
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        email: user.email || ''
    };
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    // Email update requires separate auth flow in Supabase usually, so skipping for now or just updating profile metadata

    const { error } = await supabase
        .from('profiles')
        .update({
            first_name: firstName,
            last_name: lastName,
        })
        .eq('id', user.id);

    if (error) {
        console.error('Error updating profile:', error);
        return { error: 'Error al actualizar perfil' };
    }

    revalidatePath('/dashboard/settings');
    return { success: 'Perfil actualizado correctamente' };
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient();

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
        return { error: 'Las contraseñas no coinciden' };
    }

    if (password.length < 6) {
        return { error: 'La contraseña debe tener al menos 6 caracteres' };
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        console.error('Error updating password:', error);
        return { error: 'Error al actualizar contraseña' };
    }

    return { success: 'Contraseña actualizada correctamente' };
}
