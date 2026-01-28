import { Sidebar } from '@/components/layout/Sidebar';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-72 p-8 min-h-screen">
        <div className="w-full h-full max-w-7xl mx-auto pt-6 pb-12">
          {children}
        </div>
      </main>
    </div>
  )
}
