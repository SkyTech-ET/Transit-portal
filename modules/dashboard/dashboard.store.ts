// modules/dashboard/dashboard.store.ts
import { create } from "zustand";
import { getDashboardData } from "./dashboard.endpoints";
import {
  IServiceSummary,
  IServiceRequest,
  INotification,
  IDocument,
} from "./dashboard.types";

interface IDashboardStore {
  summary: IServiceSummary | null;
  requests: IServiceRequest[];
  notifications: INotification[];
  documents: IDocument[];
  loading: boolean;
  fetchDashboard: () => Promise<void>;
}

export const useDashboardStore = create<IDashboardStore>((set) => ({
  summary: null,
  requests: [],
  notifications: [],
  documents: [],
  loading: false,

  fetchDashboard: async () => {
    set({ loading: true });
    try {
      const { summary, requests, notifications, documents } =
        await getDashboardData();

      set({
        summary: summary.data,
        requests: requests.data,
        notifications: notifications.data,
        documents: documents.data,
        loading: false,
      });
    } catch (err) {
      console.error("Dashboard data fetch failed:", err);
      set({ loading: false });
    }
  },
}));
