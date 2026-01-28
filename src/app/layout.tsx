import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClinAi - Luxury Clinical Management',
  description: 'The premier SaaS for modern health clinics.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen relative overflow-x-hidden bg-slate-50")}>
        {/* Ambient Mesh Background */}
        <div className="mesh-container">
          <div className="mesh-orb mesh-orb-1" />
          <div className="mesh-orb mesh-orb-2" />
          <div className="mesh-orb mesh-orb-3" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl" /> {/* Overlay to soften mesh */}
        </div>

        <main className="relative z-10 min-h-screen">
          {children}
        </main>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
