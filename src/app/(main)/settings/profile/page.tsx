import { ProfileForm } from '@/features/settings/components/ProfileForm';
import { getProfile } from '@/features/settings/actions/settingsActions';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
    const profile = await getProfile();

    if (!profile) {
        redirect('/login');
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Mi Perfil</h1>
                <p className="text-slate-500">Gestiona tu información personal y cuenta.</p>
            </div>
            <ProfileForm initialData={profile} />
        </div>
    );
}
