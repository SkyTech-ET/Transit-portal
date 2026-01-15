"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/modules/caseExecutor";

export default function DashboardPage() {
  const router = useRouter();
  const { dashboard, fetchDashboard, loading } = useDashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const assigned = dashboard?.serviceSummary || { notStarted: 0, pending: 0, completed: 0 };
  const tasks = dashboard?.taskSummary || { stagesAwaitingUpdate: 0 };
  const alerts = dashboard?.serviceAlerts || { flaggedRisks: 0 };
  const messages = dashboard?.messages || { newMessages: 0 };
  const uploads = dashboard?.uploads || { unAttachedDocs: 0 };
  const work = dashboard?.workSummary || { totalAssigned: 0, completed: 0, timeSpentToday: "0h 0m", issuesRaised: 0 };

  const goToServiceCategories = (mode: number) => {
    router.push(`/admin/caseExecutor/service-categories?mode=${mode}`);
  };

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-semibold">Dashboard Overview</h2>

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="font-semibold text-sm">Assigned Services</div>
          <div className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Not Started</span>
              <span className="text-blue-600 font-semibold">{assigned.notStarted}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending</span>
              <span className="text-yellow-500 font-semibold">{assigned.pending}</span>
            </div>
            <div className="flex justify-between">
              <span>Completed</span>
              <span className="text-green-600 font-semibold">{assigned.completed}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="font-semibold text-sm">Today's Tasks</div>
          <div className="mt-4 text-blue-600 text-2xl font-bold">{tasks.stagesAwaitingUpdate}</div>
          <div className="text-xs text-gray-500">Stages awaiting update</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="font-semibold text-sm text-red-500">Service Alerts</div>
          <div className="mt-4 text-red-500 text-2xl font-bold">{alerts.flaggedRisks}</div>
          <div className="text-xs text-gray-500">Blockers or flagged risks</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="font-semibold text-sm">Message Notifications</div>
          <div className="mt-4 text-blue-600 text-2xl font-bold">{messages.newMessages}</div>
          <div className="text-xs text-gray-500">New chats/messages</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="font-semibold text-sm">Document Uploads</div>
          <div className="mt-4 text-blue-600 text-2xl font-bold">{uploads.unAttachedDocs}</div>
          <div className="text-xs text-gray-500">Unattached required docs</div>
        </div>
      </div>

      {/* SERVICE OVERVIEW */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Service Overview</h3>
        <div className="grid grid-cols-2 gap-5">
          {/* Multimodal */}
          <div
            className="rounded-xl p-6 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 cursor-pointer"
            onClick={() => goToServiceCategories(2)}
          >
            <div className="font-semibold text-blue-700 flex items-center gap-2">
              <span className="text-xl">📦</span> Multimodal Services
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <button className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm shadow hover:bg-blue-700">
              View Multimodal
            </button>
          </div>

          {/* Unimodal */}
          <div
            className="rounded-xl p-6 bg-gradient-to-r from-green-100 to-green-50 border border-green-200 cursor-pointer"
            onClick={() => goToServiceCategories(1)}
          >
            <div className="font-semibold text-green-700 flex items-center gap-2">
              <span className="text-xl">🔗</span> Unimodal Services
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <button className="mt-4 px-4 py-2 rounded-lg bg-green-600 text-white text-sm shadow hover:bg-green-700">
              View Unimodal
            </button>
          </div>
        </div>
      </div>

      {/* WORK SUMMARY */}
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Work Summary</h3>
          <a className="text-blue-600 text-sm font-medium cursor-pointer">View Detailed Summary →</a>
        </div>

        <div className="grid grid-cols-4 gap-5 mt-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500">Total Assigned</div>
            <div className="text-2xl text-blue-600 font-bold mt-2">{work.totalAssigned}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500">Completed</div>
            <div className="text-2xl text-green-600 font-bold mt-2">{work.completed}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500">Time Spent (Today)</div>
            <div className="text-2xl text-blue-600 font-bold mt-2">{work.timeSpentToday}</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500">Issues Raised</div>
            <div className="text-2xl text-red-500 font-bold mt-2">{work.issuesRaised}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
