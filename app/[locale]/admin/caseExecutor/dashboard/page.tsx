"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/modules/caseExecutor";

export default function DashboardPage() {
  const router = useRouter();
  const { dashboard, fetchDashboard } = useDashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const assigned = dashboard?.serviceSummary || {
    notStarted: 0,
    pending: 0,
    completed: 0,
  };

  const tasks = dashboard?.taskSummary || { stagesAwaitingUpdate: 0 };
  const alerts = dashboard?.serviceAlerts || { flaggedRisks: 0 };
  const messages = dashboard?.messages || { newMessages: 0 };
  const uploads = dashboard?.uploads || { unAttachedDocs: 0 };

  const work = dashboard?.workSummary || {
    totalAssigned: 0,
    completed: 0,
    timeSpentToday: "0h 0m",
    issuesRaised: 0,
  };

  const goToServiceCategories = (mode: number) => {
    router.push(`/admin/caseExecutor/service-categories?mode=${mode}`);
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-4 sm:p-6 lg:p-8">
      <h2 className="text-[clamp(1.1rem,2.5vw,1.5rem)] font-semibold">
        Dashboard Overview
      </h2>

      {/* ================= TOP SUMMARY ================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <div className="text-sm font-semibold">Assigned Services</div>
          <div className="mt-3 space-y-2 text-sm">
            <Row
              label="Not Started"
              value={assigned.notStarted}
              color="text-blue-600"
            />
            <Row
              label="Pending"
              value={assigned.pending}
              color="text-yellow-500"
            />
            <Row
              label="Completed"
              value={assigned.completed}
              color="text-green-600"
            />
          </div>
        </Card>

        <StatCard
          title="Today's Tasks"
          value={tasks.stagesAwaitingUpdate}
          hint="Stages awaiting update"
          color="text-blue-600"
        />
        <StatCard
          title="Service Alerts"
          value={alerts.flaggedRisks}
          hint="Blockers or flagged risks"
          color="text-red-500"
        />
        <StatCard
          title="Message Notifications"
          value={messages.newMessages}
          hint="New chats/messages"
          color="text-blue-600"
        />
        <StatCard
          title="Document Uploads"
          value={uploads.unAttachedDocs}
          hint="Unattached required docs"
          color="text-blue-600"
        />
      </div>

      {/* ================= SERVICE OVERVIEW ================= */}
      <section>
        <h3 className="mb-3 text-[clamp(1rem,2vw,1.25rem)] font-semibold">
          Service Overview
        </h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <ServiceCard
            title="Multimodal Service"
            icon="📦"
            color="blue"
            onClick={() => goToServiceCategories(2)}
          />

          <ServiceCard
            title="Unimodal Service"
            icon="🔗"
            color="green"
            onClick={() => goToServiceCategories(1)}
          />
        </div>
      </section>

      {/* ================= WORK SUMMARY ================= */}
      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-[clamp(1rem,2vw,1.25rem)] font-semibold">
            Work Summary
          </h3>
          {/* <span className="text-blue-600 text-sm font-medium cursor-pointer">
            View Detailed Summary →
          </span> */}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Total Assigned"
            value={work.totalAssigned}
            color="text-blue-600"
          />
          <SummaryCard
            label="Completed"
            value={work.completed}
            color="text-green-600"
          />
          <SummaryCard
            label="Time Spent (Today)"
            value={work.timeSpentToday}
            color="text-blue-600"
          />
          <SummaryCard
            label="Issues Raised"
            value={work.issuesRaised}
            color="text-red-500"
          />
        </div>
      </section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="truncate">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
  color,
}: {
  title: string;
  value: number;
  hint: string;
  color: string;
}) {
  return (
    <Card>
      <div className="text-sm font-semibold">{title}</div>
      <div
        className={`mt-2 text-[clamp(1.1rem,3vw,1.6rem)] font-bold ${color}`}
      >
        {value}
      </div>
      <div className="text-xs text-gray-500 sm:text-sm">{hint}</div>
    </Card>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="text-xs text-gray-500 sm:text-sm">{label}</div>
      <div
        className={`mt-1 text-[clamp(1.1rem,3vw,1.6rem)] font-bold ${color}`}
      >
        {value}
      </div>
    </div>
  );
}

/* ================= THE IMPORTANT FIX ================= */

function ServiceCard({
  title,
  icon,
  color,
  onClick,
}: {
  title: string;
  icon: string;
  color: "blue" | "green";
  onClick: () => void;
}) {
  const theme =
    color === "blue"
      ? {
          bg: "from-blue-100 to-blue-50 border-blue-200",
          text: "text-blue-700",
          btn: "bg-blue-600 hover:bg-blue-700",
        }
      : {
          bg: "from-green-100 to-green-50 border-green-200",
          text: "text-green-700",
          btn: "bg-green-600 hover:bg-green-700",
        };

  return (
    <div
      onClick={onClick}
      className={`rounded-xl bg-gradient-to-r p-5 sm:p-6 ${theme.bg} cursor-pointer border`}
    >
      {/* RESPONSIVE TITLE */}
      <div className={`flex items-center gap-2 font-semibold ${theme.text}`}>
        <span className="text-[clamp(1rem,3vw,1.4rem)]">{icon}</span>
        <span className="text-[clamp(0.95rem,2.8vw,1.25rem)] leading-tight">
          {title}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-600 sm:text-base">
        Type specific services
      </p>

      {/* RESPONSIVE BUTTON TEXT */}
      <button
        className={`mt-4 min-h-[42px] w-full whitespace-normal break-words rounded-lg px-3 py-2 text-center text-[clamp(0.75rem,2.5vw,1rem)] leading-tight text-white shadow transition sm:w-auto sm:px-4 ${theme.btn} `}
      >
        {title}
      </button>
    </div>
  );
}
