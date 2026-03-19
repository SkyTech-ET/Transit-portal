import { Users, File, CalendarCheck, Briefcase } from "lucide-react";
import AdminStatCard from "./AdminStatCard";

export default function AdminStatsRow({ dashboard }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <AdminStatCard
        title="Total Services"
        value={dashboard?.services ?? 0}
        icon={<Briefcase size={18} />}
      />

      <AdminStatCard
        title="Pending Services"
        value={dashboard?.pendingServices ?? 0}
        icon={<CalendarCheck size={18} />}
      />

      <AdminStatCard
        title="Completed Services"
        value={dashboard?.completedServices ?? 0}
        icon={<Briefcase size={18} />}
      />

      <AdminStatCard
        title="Delayed Services"
        value={dashboard?.delayedServices ?? 0}
        icon={<Briefcase size={18} />}
      />

      <AdminStatCard
        title="New Tasks"
        value={dashboard?.newTasks ?? 0}
        icon={<Users size={18} />}
      />
    </div>
  );
}
