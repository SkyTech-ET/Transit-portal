import { create } from "zustand";
import { message } from "antd";
import http from "@/modules/utils/axios";

interface DashboardState {
  dashboard: any;
  loading: boolean;
  fetchDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  dashboard: null,
  loading: false,

  fetchDashboard: async () => {
  set({ loading: true });

  try {
    const res = await http.get({ url: "/CaseExecutor/GetDashboard" });

    console.debug("RAW API response:", res);

    const data = res;

    const mappedDashboard = {
      serviceSummary: {
        notStarted: data.assignedServices,
        pending: data.pendingServices,
        completed: data.completedServices,
      },
      taskSummary: {
        stagesAwaitingUpdate: data.todaysTasks.length,
      },
      serviceAlerts: {
        flaggedRisks: data.blockedStages,
      },
      messages: { newMessages: 0 },
      uploads: { unAttachedDocs: 0 },
      workSummary: {
        totalAssigned:
          data.assignedServices +
          data.pendingServices +
          data.completedServices,
        completed: data.completedServices,
        timeSpentToday: "0h 0m",
        issuesRaised: data.blockedStages,
      },
      notifications: data.urgentNotifications,
    };

    set({ dashboard: mappedDashboard, loading: false });
  } catch (error) {
    console.error("Dashboard fetch failed", error);
    set({ loading: false });
  }
},

}));
