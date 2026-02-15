"use client";

import { useEffect } from "react";
import { Spin } from "antd";
import { useReportStore } from "@/modules/report/report.store";
import StatCard from "../components/reports/StatCard";
import MonthlyTable from "../components/reports/MonthlyTable";

export default function ReportsPage() {
  const {
    fetchReports,
    serviceStats,
    customerStats,
    systemReport,
    monthlyReport,
    loading,
  } = useReportStore();

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <Spin size="large" />;

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-xl font-semibold mb-6">System Reports</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Services" value={systemReport?.totalServices ?? 0} />
        <StatCard title="Completed Services" value={systemReport?.completedServices ?? 0} />
        <StatCard title="Total Customers" value={systemReport?.totalCustomers ?? 0} />
        <StatCard title="Verified Customers" value={systemReport?.verifiedCustomers ?? 0} />
      </div>

      {/* Rates */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard
          title="Service Completion Rate"
          value={systemReport?.serviceCompletionRate ?? 0}
          suffix="%"
        />
        <StatCard
          title="Customer Verification Rate"
          value={systemReport?.customerVerificationRate ?? 0}
          suffix="%"
        />
      </div>

      {/* Monthly Report */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-medium mb-4">Monthly Performance</h2>
        <MonthlyTable data={monthlyReport} />
      </div>
    </div>
  );
}
