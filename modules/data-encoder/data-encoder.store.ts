import { create } from "zustand";
import { notification } from "antd";
import {
  getDataEncoderDashboard,
  getAllCustomers,
} from "./data-encoder.endpoints";
import { DataEncoderDashboardDTO, CustomerDTO } from "./data-encoder.types";

interface DataEncoderState {
  dashboard: DataEncoderDashboardDTO | null;
  customers: CustomerDTO[];
  loading: boolean;
  error: string | null;
  

  getDashboard: () => Promise<void>;
  getCustomers: (recordStatus: number) => Promise<void>;
}

export const useDataEncoderStore = create<DataEncoderState>((set) => ({
  dashboard: null,
  customers: [],
  loading: false,
  error: null,

  /* ================= DASHBOARD ================= */
  getDashboard: async () => {
   
  set({ loading: true, error: null });

  try {
    const res = await getDataEncoderDashboard();

    // LOG IT TEMPORARILY
    console.log("Data Encoder Dashboard Response:", res);

    set({
      dashboard: res,
      loading: false,
    });
  } catch (error) {
    console.error("Dashboard fetch failed:", error);

    set({
      loading: false,
      error: "Failed to load dashboard",
    });

    notification.error({
      message: "Dashboard Error",
      description: "Failed to load Data Encoder dashboard",
    });
  }


  },

  /* ================= CUSTOMERS ================= */
   getCustomers: async (recordStatus: number) => {
    set({ loading: true });
    try {
      const data = await getAllCustomers(recordStatus);
      set({ customers: data ?? [], loading: false });
    } catch (err) {
      console.error(err);
      set({ loading: false });
      notification.error({
        message: "Error",
        description: "Failed to load customers",
      });
    }
  },
}));
