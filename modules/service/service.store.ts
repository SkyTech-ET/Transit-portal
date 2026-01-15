import { create } from "zustand";
import { notification } from 'antd';
import { RecordStatus } from "../common/common.types";
import { IServiceState, IServicePayload, ServiceStore } from "./service.types";
import { addService, deleteService, getService, getServices, updateService } from "./service.endpoints";
import { usePermissionStore } from "../utils";
const defaultInitState: IServiceState = {
    error: null,
    searchTerm: '',
    loading: false,
    services: [],
    listLoading: false,
    service: null,
    filteredServices: [],
};


export const useServiceStore = create<ServiceStore>((set) => ({
    ...defaultInitState,
    addService: async (payload: IServicePayload) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            addService(payload)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Service created successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to create Service." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to create Service.",
                    });
                    reject(error)
                });
        })
    },


    // Update Service
    updateService: async (payload: IServicePayload, id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            updateService(payload, id)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Service updated successfully!",
                    });
                    resolve(res) 
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to update Service." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to update Service.",
                    });
                    reject(error)
                });
        })
    },
    // Delete Service
    deleteService: async (id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            deleteService(id)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Service deleted successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to delete Service." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to delete Service.",
                    });
                    reject(error)
                });
        })
    },

    // Get a single Service
    getService: async (id: number) => {
        set({ listLoading: true, error: null });
        return new Promise((resolve, reject) => {
            getService(id)
                .then((res: any) => {
                    set({ service: res, listLoading: false, error: null });
                    resolve(res)
                })
                .catch((err) => {
                    set((state) => ({
                        roles: [], listLoading: false,
                        error: err.message || "Failed to fetch Services."
                    }));
                    reject(err)
                });
        })
    },

    // Get Services based on status
    getServices: async (orgId: number, status: RecordStatus) => {
        set({ listLoading: true, error: null, filteredServices: [] });
        return new Promise((resolve, reject) => {
            getServices(orgId, status)
                .then((res: any) => {
                    if (!res.errors) {
                        set({ services: res, filteredServices: res, listLoading: false, error: null });
                    } else {
                        set({ services: [], filteredServices: [], listLoading: false, error: null });
                    }
                    resolve(res)
                })
                .catch((error: any) => {
                    set((state) => ({
                        services: [], filteredServices: [], listLoading: false,
                        error: error || "Failed to fetch services."
                    }));
                    reject(error)
                });
        })
    },




}));