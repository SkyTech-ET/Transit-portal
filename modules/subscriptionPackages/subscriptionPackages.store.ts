import { create } from "zustand";
import { notification } from 'antd';
import { RecordStatus } from "../common/common.types";
import { ISubscriptionPackageState, ISubscriptionPackagePayload, SubscriptionPackageStore } from "./subscriptionPackages.types";
import { addSubscriptionPackage, getSubscriptionPackages,updateSubscriptionPackage,deleteSubscriptionPackage,getSubscriptionPackage } from "./subscriptionPackages.endpoints";
import { usePermissionStore } from "../utils";
const defaultInitState: ISubscriptionPackageState = {
    error: null,
    searchTerm: '',
    loading: false,
    subscriptionPackages: [],
    listLoading: false,
    subscriptionPackage: null,
    filteredSubscriptionPackages: [],
};


export const useSubscriptionPackagesStore = create<SubscriptionPackageStore>((set) => ({
    ...defaultInitState,
    addSubscriptionPackage: async (payload: ISubscriptionPackagePayload) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            addSubscriptionPackage(payload)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Subscription created successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to create Subscription." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to create Subscription.",
                    });
                    reject(error)
                });
        })
    },

      // Update Subscription
    updateSubscriptionPackage: async (payload: ISubscriptionPackagePayload, id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            updateSubscriptionPackage(payload, id)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Subscription Package updated successfully!",
                    });
                    resolve(res) 
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to update Subscription Package." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to update Subscription Package.",
                    });
                    reject(error)
                });
        })
    },
    // Delete Subscription
    deleteSubscriptionPackage: async (id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            deleteSubscriptionPackage(id)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Subscription Package deleted successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to delete Subscription Package." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to delete Subscription Package.",
                    });
                    reject(error)
                });
        })
    },

    // Get a single Subscription
    getSubscriptionPackage: async (id: number) => {
        set({ listLoading: true, error: null });
        return new Promise((resolve, reject) => {
            getSubscriptionPackage(id)
                .then((res: any) => {
                    set({ subscriptionPackage: res, listLoading: false, error: null });
                    resolve(res)
                })
                .catch((err) => {
                    set((state) => ({
                        roles: [], listLoading: false,
                        error: err.message || "Failed to fetch Subscription Package."
                    }));
                    reject(err)
                });
        })
    },
    getSubscriptionPackages: async (status: RecordStatus) => {
        set({ listLoading: true, error: null, filteredSubscriptionPackages: [] });
        return new Promise((resolve, reject) => {
            getSubscriptionPackages(status)
                .then((res: any) => {
                    if (!res.errors) {
                        set({ subscriptionPackages: res, filteredSubscriptionPackages: res, listLoading: false, error: null });
                    } else {
                        set({ subscriptionPackages: [], filteredSubscriptionPackages: [], listLoading: false, error: null });
                    }
                    resolve(res)
                })
                .catch((error: any) => {
                    set((state) => ({
                        subscriptionPackages: [], filteredSubscriptionPackages: [], listLoading: false,
                        error: error || "Failed to fetch Subscriptions."
                    }));
                    reject(error)
                });
        })
    },




}));