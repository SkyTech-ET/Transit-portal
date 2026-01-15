import { create } from "zustand";
import { checkFieldValue } from "../utils";
// import { RecordStatus } from "../common/common.types";
import { IContact, IContactState, IContactStore } from "./contact.types";
import { addContact,getContacts } from "./contact.endpoints";
import { notification } from "antd";
import { RecordStatus } from "../common/common.types";

const defaultInitState: IContactState = {
  contacts: [],
  contact: null,
  error: null,
  searchTerm: "",
  loading: false,
  showSuccessNotification: false,
  showErrorNotification: false,
  contactListLoading: false,
  filteredContacts: [],
};

export const useContactStore = create<IContactStore>((set) => ({
  ...defaultInitState,
  addContact: async (payload: IContact) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      addContact(payload)
        .then((res: any) => {
          set({ loading: false, error: null, showSuccessNotification: true });

          setTimeout(() => {
            set({ showSuccessNotification: false });
          }, 5000);

          resolve(res);
        })
        .catch((error) => {
          set({
            loading: false,
            showErrorNotification: true,
            error: error || "Failed to create Contact.",
          });
          setTimeout(() => {
            set({ showErrorNotification: false });
          }, 5000);
          reject(error);
        });
    });
  },
  getContacts: async () => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
        getContacts()
            .then((res: any) => {
                set({ contacts: res, loading: false, error: null });
                resolve(res);
            })
            .catch((error) => {
                set({ loading: false, error: error || "Failed to fetch contacts." });
                notification.open({
                    message: 'Error',
                    type: "error",
                    description: error || "Failed to fetch contacts.",
                });
                reject(error);
            });
    });
},
}));
