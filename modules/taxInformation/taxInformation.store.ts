// modules/taxInformation/taxInformation.store.ts
import { create } from "zustand";
import { getTaxInformation } from "./taxInformation.endpoints";
import { ITaxItem } from "./taxInformation.types";

interface ITaxStore {
  items: ITaxItem[];
  loading: boolean;
  fetchTaxInfo: () => Promise<void>;
}

export const useTaxInformationStore = create<ITaxStore>((set) => ({
  items: [],
  loading: false,

  fetchTaxInfo: async () => {
    set({ loading: true });
    try {
      const { data } = await getTaxInformation();
      set({ items: data, loading: false });
    } catch (error) {
      console.error("Error loading tax information:", error);
      set({ loading: false });
    }
  },
}));
