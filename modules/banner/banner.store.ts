import { create } from "zustand";
import { notification } from 'antd';
import { RecordStatus } from "../common/common.types";
import { IBannerState, IBannerPayload, BannerStore } from "./banner.types";
import { addBanner, deleteBanner, getBanner, getBanners, updateBanner} from "./banner.endpoints";
import { usePermissionStore } from "../utils";

const defaultInitState: IBannerState = {
    error: null,
    searchTerm: '',
    loading: false,
    banners: [],
    listLoading: false,
    banner: null,
    filteredBanners: [],
};

export const useBannerStore = create<BannerStore>((set) => ({
    ...defaultInitState,
    addBanner: async (payload: FormData) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            addBanner(payload)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Banner created successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to create Banner." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to create Banner.",
                    });
                    reject(error)
                });
        })
    },

    // Update Banner
    updateBanner: async (payload: FormData, id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            updateBanner(payload)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Banner updated successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to update Banner." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to update Banner.",
                    });
                    reject(error)
                });
        })
    },

    // Delete Banner
    deleteBanner: async (id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            deleteBanner(id)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Banner deleted successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to delete Banner." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to delete Banner.",
                    });
                    reject(error)
                });
        })
    },

    // Get a single Banner
    getBanner: async (id: number) => {
        set({ listLoading: true, error: null });
        return new Promise((resolve, reject) => {
            getBanner(id)
                .then((res: any) => {
                    set({ banner: res, listLoading: false, error: null });
                    resolve(res)
                })
                .catch((err) => {
                    set((state) => ({
                        roles: [], listLoading: false,
                        error: err.message || "Failed to fetch Banner."
                    }));
                    reject(err)
                });
        })
    },

    // Get Banners based on status
    getBanners: async (orgId: number, status: RecordStatus) => {
        set({ listLoading: true, error: null, filteredBanners: [] });
        return new Promise((resolve, reject) => {
            getBanners(orgId, status)
                .then((res: any) => {
                    if (!res.errors) {
                        set({ banners: res, filteredBanners: res, listLoading: false, error: null });
                    } else {
                        set({ banners: [], filteredBanners: [], listLoading: false, error: null });
                    }
                    resolve(res)
                })
                .catch((error: any) => {
                    set((state) => ({
                        events: [], filteredEvents: [], listLoading: false,
                        error: error || "Failed to fetch banners."
                    }));
                    reject(error)
                });
        })
    },
}));

