import { create } from "zustand";
import { notification } from 'antd';
import { RecordStatus } from "../common/common.types";
import { ISubscriptionState, ISubscriptionPayload, SubscriptionStore, ISubscriptionTableRow } from "./subscription.types";
import { addSubscription, deleteSubscription, getSubscription, getSubscriptions, updateAccStatus, updateReqStatus, updateSubscription } from "./subscription.endpoints";
import { usePermissionStore } from "../utils";
import { redirect } from 'next/navigation'
import { subscriptionRoutes } from "./subscription.routes";
const defaultInitState: ISubscriptionState = {
    error: null,
    searchTerm: '',
    loading: false,
    subscriptions: [],
    listLoading: false,
    subscription: null,
    success: false,
    filteredSubscriptions: [],
    currentPage: 1,  
    totalPages: 1 
};


export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
    ...defaultInitState,
    addSubscription: async (payload: ISubscriptionPayload) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            addSubscription(payload)
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
    updateSubscription: async (payload: ISubscriptionPayload, id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            updateSubscription(payload)
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

    updateAccStatus: async (payload: ISubscriptionPayload, id: number) => {
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

    updateReqStatus: async (payload: ISubscriptionPayload, id: number) => {
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
    deleteSubscription: async (id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            deleteSubscription(id)
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
    getSubscription: async (id: number) => {
        set({ listLoading: true, error: null });
        return new Promise((resolve, reject) => {
            getSubscription(id)
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
    getSubscriptions: async (status: RecordStatus, pageNumber: number = 1) => {
        set({ listLoading: true, error: null, filteredSubscriptions: [] });
        return new Promise((resolve, reject) => {
            getSubscriptions(status,pageNumber)
                .then((res: any) => {
                    if (!res.errors) {

                        let response = [] as ISubscriptionTableRow[];
                        const subscriptions = res.subscriptions || []; 
                        subscriptions.forEach((item: any) =>
                            response.push({
                                organization: {
                                    orgName: item.organization?.orgName,
                                    orgAddress: item.organization?.orgAddress,
                                },
                                user: {
                                    userEmail: item.user?.userEmail,
                                    userFirstName: item.user?.userFirstName,
                                    userLastName: item.user?.userLastName,
                                    userPhoneNumber: item.user?.userPhoneNumber,
                                },
                                subscription: {
                                    id: item.subscription?.id,
                                    planName: item.subscription?.planName,
                                    price: item.subscription?.price,
                                    effectiveDateFrom: item.subscription?.effectiveDateFrom,
                                    effectiveDateTo: item.subscription?.effectiveDateTo,
                                    recordStatus: item.subscription?.recordStatus,
                                    accountStatus: item.subscription?.accountStatus,
                                    requestStatus: item.subscription?.requestStatus,
                                },
                            }))
                        set({subscriptions: response,filteredSubscriptions:response,listLoading: false,
                            currentPage: pageNumber, 
                            totalPages: res.totalPages || 1, 
                         });
                    } else {
                        set({ subscriptions: [], filteredSubscriptions: [], listLoading: false, error: null
                            ,currentPage: 1,  // Reset to page 1 if there was an error
                            totalPages: 1, 
                         });
                    }
                    resolve(res)
                })
                .catch((error: any) => {
                    set((state) => ({
                        subscriptions: [], filteredSubscriptions: [], listLoading: false,
                        error: error || "Failed to fetch Subscriptions.", currentPage: 1,  // Reset to page 1 if there was an error
                        totalPages: 1, 
                    }));
                    reject(error)
                });
        })
    },

    setSearchTerm: (searchTerm: string) => {
        set({ searchTerm });
        set((state) => ({
            filteredSubscriptions: state.subscriptions.filter(subscription =>
            subscription.organization.orgAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subscription.organization.orgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subscription.subscription.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subscription.user.userFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subscription.user.userLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subscription.user.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
            //subscription.subscription.price.toLowerCase().includes(searchTerm.toLowerCase()) 
          )
        }));
      },


}));