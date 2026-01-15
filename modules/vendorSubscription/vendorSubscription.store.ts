import { create } from "zustand";
import { notification } from 'antd';
import { RecordStatus } from "../common/common.types";
import { IVendorSubscriptionState, IVendorSubscriptionPayload, VendorSubscriptionStore, IVendorSubscriptionTableRow } from "./vendorSubscription.types";
import { addVendorSubscription, deleteVendorSubscription, getVendorSubscription, getVendorSubscriptions, updateAccStatus, updateReqStatus, updateVendorSubscription } from "./vendorSubscription.endpoints";
import { usePermissionStore } from "../utils";
import { redirect } from 'next/navigation'
import { vendorSubscriptionRoutes } from "./vendorSubscription.routes";
const defaultInitState: IVendorSubscriptionState = {
    error: null,
    searchTerm: '',
    loading: false,
    vendorSubscriptions: [],
    listLoading: false,
    vendorSubscription: null,
    success: false,
    filteredVendorSubscriptions: [],
    currentPage: 1,  
    totalPages: 1 ,
    subscription:null
};

export const useVendorSubscriptionStore = create<VendorSubscriptionStore>((set) => ({
    ...defaultInitState,
   
    addVendorSubscription: async (payload: IVendorSubscriptionPayload) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            addVendorSubscription(payload)
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
    updateVendorSubscription: async (payload: IVendorSubscriptionPayload, id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            updateVendorSubscription(payload, id)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Subscription updated successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to update Subscription." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to update Subscription.",
                    });
                    reject(error)
                });
        })
    },

    updateAccStatus: async (payload: IVendorSubscriptionPayload, id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            updateAccStatus(payload, id)
                .then((res: any) => {
                    set({ loading: false, error: null,success:true});
                    setTimeout(() => {
                        set({ success:false});
                      }, 1000);
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Subscription updated successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to update Subscription." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to update Subscription.",
                    });
                    reject(error)
                });
        })
    },

    updateReqStatus: async (payload: IVendorSubscriptionPayload, id: number) => {
        set({ loading: true, error: null });

        return new Promise((resolve, reject) => {
            updateReqStatus(payload,id)
                .then((res: any) => {
                    set({ loading: false, error: null,success:true});
                    setTimeout(() => {
                        set({ success:false});
                      }, 1000);
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Subscription updated successfully!",
                    });
                   
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to update Subscription." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to update Subscription.",
                    });
                    reject(error)
                });
        })
    },
    // Delete Subscription
    deleteVendorSubscription: async (id: number, organizationId: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            deleteVendorSubscription(id, organizationId)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Subscription deleted successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to delete Subscription." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to delete Subscription.",
                    });
                    reject(error)
                });
        })
    },

    // Get a single Subscription
    getVendorSubscription: async (id: number) => {
        set({ listLoading: true, error: null });
        return new Promise((resolve, reject) => {
            getVendorSubscription(id)
                .then((res: any) => {
                    set({ subscription: res, listLoading: false, error: null });
                    resolve(res)
                })
                .catch((err) => {
                    set((state) => ({
                        roles: [], listLoading: false,
                        error: err.message || "Failed to fetch Subscriptions."
                    }));
                    reject(err)
                });
        })
    },

    // Get Subscriptions based on status
    getVendorSubscriptions: async (id:number,recordStatus: RecordStatus) => {
        set({ listLoading: true, error: null, filteredVendorSubscriptions: [] });
        return new Promise((resolve, reject) => {
            getVendorSubscriptions(id,recordStatus)
                .then((res: any) => {
                    if (!res.errors) {
                        set({vendorSubscriptions: res,filteredVendorSubscriptions:res,listLoading: false
                         });
                    } else {
                        set({ vendorSubscriptions: [], filteredVendorSubscriptions: [], listLoading: false, error: null
                           
                         });
                    }
                    resolve(res)
                })
                .catch((error: any) => {
                    set((state) => ({
                        subscriptions: [], filteredSubscriptions: [], listLoading: false,
                        error: error || "Failed to fetch Subscriptions."
                    }));
                    reject(error)
                });
        })
    },

    setSearchTerm: (searchTerm: string) => {
        set({ searchTerm });
        set((state) => ({
            filteredVendorSubscriptions: state.vendorSubscriptions.filter(
                vendorSubscription =>
                vendorSubscription.vendorSubscription.planName.toLowerCase().includes(searchTerm.toLowerCase()) 
            //subscription.subscription.price.toLowerCase().includes(searchTerm.toLowerCase()) 
          )
        }));
      },


}));