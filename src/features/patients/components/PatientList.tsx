import { GlassCard } from '@/components/ui/GlassCard';
import { Search, Filter, MoreHorizontal, Phone, Mail, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PatientList({ patients }: { patients: any[] }) {
    return (
        <div className="space-y-6">
            {/* Controls */}
            <GlassCard className="flex flex-col md:flex-row justify-between items-center gap-4 py-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar paciente por nombre, ID o teléfono..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-200 placeholder:text-slate-400"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filtrar
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl shadow-lg shadow-primary-500/20 hover:from-primary-700 hover:to-primary-600 transition-all">
                        + Nuevo Paciente
                    </button>
                </div>
            </GlassCard>

            {/* Table */}
            <GlassCard className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/50">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Paciente</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Estado</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Última Visita</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Tratamiento</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {patients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-primary-700 font-bold", patient.avatar_url || 'bg-primary-100')}>
                                                {patient.full_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{patient.full_name}</p>
                                                <p className="text-sm text-slate-500">ID: {patient.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium border bg-status-success/10 text-status-success border-status-success/20"
                                        )}>
                                            Activo
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            --
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-800 text-sm font-medium">
                                        {patient.medical_history_summary || 'Sin historial'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                                                <Phone className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                                                <Mail className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}
