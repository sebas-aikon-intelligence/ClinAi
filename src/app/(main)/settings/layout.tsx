export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-full bg-slate-50/50">
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
