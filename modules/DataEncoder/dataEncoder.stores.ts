import { create } from "zustand";
import { notification } from "antd";
import { IDataEncoderPayload, IDataEncoderState, IDataEncoderStore } from "./dataEncoder.types";
import { addDataEncoder, deleteDataEncoder, getDataEncoder, getDataEncoders, updateDataEncoder } from "./dataEncoder.endpoints";


const defaultInitState: IDataEncoderState = {
  dataEncoders: [],
  dataEncoder: null,
  loading: false,
  error: null,
  listLoading: false
};

export const useDataEncoderStore = create<IDataEncoderStore>((set) => ({
  ...defaultInitState,
  addDataEncoder: async (payload: IDataEncoderPayload) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      addDataEncoder(payload)
        .then((res: any) => {
          set({ loading: false, error: null });
          notification.open({
            message: 'Success',
            type: "success",
            description: "DataEncoder created successfully!",
          });
          resolve(res)
        })
        .catch((error: any) => {
          set({ loading: false, error: error || "Failed to create dataEncoder." });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to create dataEncoder.",
          });
          reject(error)
        });
    })
  },
  updateDataEncoder: async (payload: IDataEncoderPayload, id: number) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      updateDataEncoder(payload, id)
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
  deleteDataEncoder: async (id: number) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      deleteDataEncoder(id)
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

  getDataEncoders: async (status) => {
    set({ listLoading: true, error: null });
    return new Promise((resolve, reject) => {
      getDataEncoders(status)
        .then(async (res: any) => {
          if (!res.errors) {
            set({ dataEncoders: res, listLoading: false, error: null });
          } else {
            set({ dataEncoders: [], listLoading: false, error: null });
          }
          resolve(res)
        })
        .catch((err) => {
          set((state) => ({
            dataEncoders: [], listLoading: false, error: err.message || "Failed to fetch privileges.",
          }));
          reject(err)
        });
    })
  },
  getDataEncoder: async (id: number) => {
    set({ listLoading: true, error: null });
    return new Promise((resolve, reject) => {
      getDataEncoder(id)
        .then(async (res: any) => {
          set({ dataEncoder: res, listLoading: false, error: null });
          resolve(res)
        })
        .catch((err) => {
          set((state) => ({
            dataEncoder: null, listLoading: false,
            error: err.message || "Failed to fetch dataEncoder."
          }));
          reject(err)
        });
    })
  },
}));
