import { create } from "zustand";
import { notification } from "antd";
import {
  getDataEncoderDashboard,
  getAllCustomers,
} from "./data-encoder.endpoints";
import { DataEncoderDashboardDTO, CustomerDTO } from "./data-encoder.types";
import { createCustomer as createCustomerApi, updateCustomer as updateCustomerApi } from "./data-encoder.endpoints";

interface DataEncoderState {
  dashboard: DataEncoderDashboardDTO | null;
  customers: CustomerDTO[];
  loading: boolean;
  error: string | null;
  

  getDashboard: () => Promise<void>;
  getCustomers: (recordStatus: number) => Promise<void>;
  createCustomer: (formData: FormData) => Promise<void>;
  updateCustomer: (formData: FormData) => Promise<void>;
}

export const useDataEncoderStore = create<DataEncoderState>((set, get) => ({
  dashboard: null,
  customers: [],
  loading: false,
  error: null,

  /* ================= DASHBOARD ================= */
  getDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getDataEncoderDashboard();
      set({ dashboard: res, loading: false });
    } catch (error) {
      set({ loading: false, error: "Failed to load dashboard" });
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
      set({ loading: false });
      notification.error({
        message: "Error",
        description: "Failed to load customers",
      });
    }
  },

  createCustomer: async (formData: FormData) => {
    set({ loading: true });
    try {
      await createCustomerApi(formData);
      set({ loading: false });

      notification.success({
        message: "Success",
        description: "Customer created successfully",
      });
    } catch (error) {
      set({ loading: false });

      notification.error({
        message: "Error",
        description: "Failed to create customer",
      });

      throw error;
    }
  },

   /* ================= UPDATE ================= */
  updateCustomer: async (formData: FormData) => {
  set({ loading: true });
  try {
    await updateCustomerApi(formData); // treat as "create user from customer"

    // Optionally update local customer list
    const customers = get().customers;
    const id = Number(formData.get("Id"));
    const updatedCustomers = customers.map((c) =>
      c.id === id ? { ...c, ...Object.fromEntries(formData) } : c
    );

    set({ customers: updatedCustomers, loading: false });

    notification.success({
      message: "Success",
      description: "Customer user created successfully",
    });
  } catch (error) {
    set({ loading: false });
    notification.error({
      message: "Error",
      description: "Failed to create customer user",
    });
    throw error;
  }
}
}));


