import { create } from "zustand";
import { getAllCustomers, addCustomer } from "./customer.endpoints";
import { ICustomer, ICustomerStore, ICustomerPayload } from "./customer.types";

interface ExtendedCustomerStore extends ICustomerStore {
  createCustomer: (data: ICustomerPayload) => Promise<void>;
}

export const useCustomerStore = create<ExtendedCustomerStore>((set, get) => ({
  customers: [],
  loading: false,

  getCustomers: async () => {
    set({ loading: true });
    try {
      const response = await getAllCustomers();
      set({ customers: response.data, loading: false });
    } catch (error) {
      console.error("Failed to load customers:", error);
      set({ loading: false });
    }
  },

  createCustomer: async (data: ICustomerPayload) => {
    set({ loading: true });
    try {
      const response = await addCustomer(data);

      // Append the newly added customer to the existing state
      const currentCustomers = get().customers;
      set({
        customers: [response.data, ...currentCustomers],
        loading: false,
      });
    } catch (error) {
      console.error("Failed to add customer:", error);
      set({ loading: false });
    }
  },
}));
