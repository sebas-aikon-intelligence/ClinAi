import { Sidebar } from '@/components/layout/Sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
