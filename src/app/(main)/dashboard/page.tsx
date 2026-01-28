import { createClient } from '@/lib/supabase/server';
import { KPICard } from '@/features/dashboard/components/KPICard';
import { TodayTimeline } from '@/features/dashboard/components/TodayTimeline';
import { RevenueChart } from '@/features/dashboard/components/RevenueChart';
import { TasksList } from '@/features/dashboard/components/TasksList';
import { AICommandCenter } from '@/features/dashboard/components/AICommandCenter';
import { getTasks, getPatients, getProfiles } from '@/features/dashboard/actions/taskActions';
import { DollarSign, CalendarCheck, Users, ClipboardList } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch today's appointments
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      id, 
      start_time, 
      status, 
      type, 
      patients (full_name, avatar_url)
    `)
    .gte('start_time', today.toISOString())
    .lt('start_time', tomorrow.toISOString())
    .order('start_time', { ascending: true });

  // Fetch patient count
  const { count: patientCount } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true });

  // Fetch tasks
  const tasks = await getTasks();
  const patients = await getPatients();
  const profiles = await getProfiles();
  const pendingTasksCount = tasks.filter(t => t.status !== 'done').length;

  // Calculate KPIs
  const todayAppointments = appointments?.length || 0;
  const confirmedAppointments = appointments?.filter(a => a.status === 'confirmed').length || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 mb-2">
            Panel de Control
          </h1>
          <p className="text-slate-600 text-lg">Bienvenido Dr. Pérez, esto es lo que pasa hoy.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Sistema Operativo
          </span>
        </div>
      </div>

      {/* KPIs - Meaningful Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Ingresos del Mes"
          value="$45,200"
          change="+12.5%"
          trend="up"
          icon={DollarSign}
          color="gold"
        />
        <KPICard
          title="Citas de Hoy"
          value={String(todayAppointments)}
          change={`${confirmedAppointments} confirmadas`}
          trend="neutral"
          icon={CalendarCheck}
          color="luxury"
        />
        <KPICard
          title="Tareas Pendientes"
          value={String(pendingTasksCount)}
          change="Por completar"
          trend="neutral"
          icon={ClipboardList}
          color="mint"
        />
        <KPICard
          title="Pacientes Activos"
          value={patientCount?.toLocaleString() || '0'}
          change="Total registrados"
          trend="neutral"
          icon={Users}
          color="luxury"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts & Tasks (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Revenue Chart */}
          <RevenueChart />

          {/* Tasks List */}
          <TasksList initialTasks={tasks} patients={patients} profiles={profiles} />
        </div>

        {/* Right Column - Today Timeline (1 col) */}
        <div className="lg:col-span-1">
          <TodayTimeline appointments={appointments || []} />
        </div>
      </div>

      <AICommandCenter />
    </div>
  )
}
