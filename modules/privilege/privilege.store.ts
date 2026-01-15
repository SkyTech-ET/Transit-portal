import { create } from "zustand";
import { notification } from "antd";
import { IPrivilegePayload, IPrivilegeState, IPrivilegeStore } from "./privilege.types";
import { addPrivilege, deletePrivilege, getPrivilege, getPrivileges, updatePrivilege } from "./privilege.endpoints";


const defaultInitState: IPrivilegeState = {
  privileges: [],
  privilege: null,
  loading: false,
  error: null,
  listLoading: false
};

export const usePrivilegeStore = create<IPrivilegeStore>((set) => ({
  ...defaultInitState,
  addPrivilege: async (payload: IPrivilegePayload) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      addPrivilege(payload)
        .then((res: any) => {
          set({ loading: false, error: null });
          notification.open({
            message: 'Success',
            type: "success",
            description: "Privilege created successfully!",
          });
          resolve(res)
        })
        .catch((error: any) => {
          set({ loading: false, error: error || "Failed to create privilege." });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to create privilege.",
          });
          reject(error)
        });
    })
  },
  updatePrivilege: async (payload: IPrivilegePayload, id: number) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      updatePrivilege(payload, id)
        .then((res: any) => {
          set({ loading: false, error: null });
          notification.open({
            message: 'Success',
            type: "success",
            description: "Privilege updated successfully!",
          });
          resolve(res)
        })
        .catch((error: any) => {
          set({ loading: false, error: error || "Failed to update privilege." });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to update privilege.",
          });
          reject(error)
        });
    })
  },
  deletePrivilege: async (id: number) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      deletePrivilege(id)
        .then((res: any) => {
          set({ loading: false, error: null });
          notification.open({
            message: 'Success',
            type: "success",
            description: "Privilege deleted successfully!",
          });
          resolve(res)
        })
        .catch((error: any) => {
          set({ loading: false, error: error || "Failed to delete privilege." });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to delete privilege.",
          });
          reject(error)
        });
    })
  },

  getPrivileges: async (status) => {
    set({ listLoading: true, error: null });
    return new Promise((resolve, reject) => {
      getPrivileges(status)
        .then(async (res: any) => {
          if (!res.errors) {
            set({ privileges: res, listLoading: false, error: null });
          } else {
            set({ privileges: [], listLoading: false, error: null });
          }
          resolve(res)
        })
        .catch((err) => {
          set((state) => ({
            privileges: [], listLoading: false, error: err.message || "Failed to fetch privileges.",
          }));
          reject(err)
        });
    })
  },
  getPrivilege: async (id: number) => {
    set({ listLoading: true, error: null });
    return new Promise((resolve, reject) => {
      getPrivilege(id)
        .then(async (res: any) => {
          set({ privilege: res, listLoading: false, error: null });
          resolve(res)
        })
        .catch((err) => {
          set((state) => ({
            privilege: null, listLoading: false,
            error: err.message || "Failed to fetch privilege."
          }));
          reject(err)
        });
    })
  },
}));
