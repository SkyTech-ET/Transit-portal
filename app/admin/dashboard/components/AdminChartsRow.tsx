import WeeklyStaffChart from "./WeeklyStaffChart";
import ServiceRequestPieChart from "./ServiceRequestPieChart";
export default function AdminChartsRow({
  barData,
  dashboard,
}: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <WeeklyStaffChart data={barData} />

      <ServiceRequestPieChart
        completed={dashboard?.completedServices ?? 0}
        pending={dashboard?.pendingServices ?? 0}
      />
    </div>
  );
}
