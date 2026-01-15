import { create } from "zustand";
import { getServiceRequestsData } from "./serviceRequests.endpoints";
import { IServiceRequestStore } from "./serviceRequests.types";

export const useServiceRequestsStore = create<IServiceRequestStore>((set) => ({
  requests: [],
  stages: [],
  loading: false,

  getAllRequests: async () => {
    set({ loading: true });
    try {
      const { requests, stages } = await getServiceRequestsData();
      set({
        requests: requests.data,
        stages: stages.data,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to load service requests:", error);
      set({ loading: false });
    }
  },
}));
