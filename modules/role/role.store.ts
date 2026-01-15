import { create } from "zustand";
import { notification } from "antd";
import { RecordStatus } from "../common/common.types";
import { IRolePayload, IRoleState, IRoleStore } from "./role.types";
import { addRole, deleteRole, getRole, getRoles, updateRole } from "./role.endpoints";

const defaultInitState: IRoleState = {
  roles: [],
  role: null,
  error: null,
  loading: false,
  listLoading: false
};


export const useRoleStore = create<IRoleStore>((set) => ({
  ...defaultInitState,
  addRole: async (payload: IRolePayload) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      addRole(payload)
        .then((res: any) => {
          set({ loading: false, error: null });
          notification.open({
            message: 'Success',
            type: "success",
            description: "Role created successfully!",
          });
          resolve(res)
        })
        .catch((error) => {
          set({ loading: false, error: error || "Failed to create role." });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to create role.",
          });
          reject(error)
        });
    })
  },
  updateRole: async (payload: IRolePayload, id: number) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      updateRole(payload, id)
        .then((res: any) => {
          set({ loading: false, error: null });
          notification.open({
            message: 'Success',
            type: "success",
            description: "Role updated successfully!",
          });
          resolve(res)
        })
        .catch((error) => {
          set({ loading: false, error: error || "Failed to update role." });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to update role.",
          });
          reject(error)
        });
    })
  },
  deleteRole: async (id: number) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      deleteRole(id)
        .then((res: any) => {
          set({ loading: false, error: null });
          notification.open({
            message: 'Success',
            type: "success",
            description: "Role deleted successfully!",
          });
          resolve(res)
        })
        .catch((error) => {
          set({ loading: false, error: error || "Failed to delete role." });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to delete role.",
          });
          reject(error)
        });
    })
  },

  getRole: async (id: number) => {
    set({ listLoading: true, error: null });
    return new Promise((resolve, reject) => {
      getRole(id)
        .then((res: any) => {
          set({ role: res, listLoading: false, error: null });
          resolve(res)
        })
        .catch((err) => {
          set((state) => ({
            roles: [], listLoading: false,
            error: err.message || "Failed to fetch roles."
          }));
          reject(err)
        });
    })
  },
  getRoles: async (status: RecordStatus) => {
    set({ listLoading: true, error: null });
    return new Promise((resolve, reject) => {
      getRoles(status)
        .then(async (res: any) => {
          if (!res.errors) {
            set({ roles: res, listLoading: false, error: null });
          } else {
            set({ roles: [], listLoading: false, error: null });
          }
          resolve(res)
        })
        .catch((err) => {
          set((state) => ({
            roles: [], listLoading: false,
            error: err.message || "Failed to fetch roles."
          }));
          reject(err)
        });
    })
  },
}));
