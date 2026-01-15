import { create } from "zustand";
import { notification } from 'antd';
import { RecordStatus } from "../common/common.types";
import { ITagState, ITagPayload, TagStore } from "./tag.types";
import { addTag, deleteTag, getTag, getTags, updateTag } from "./tag.endpoints";
import { usePermissionStore } from "../utils";
const defaultInitState: ITagState = {
    error: null,
    searchTerm: '',
    loading: false,
    tags: [],
    listLoading: false,
    tag: null,
    filteredTags: [],
};


export const useTagStore = create<TagStore>((set) => ({
    ...defaultInitState,
    addTag: async (payload: ITagPayload) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            addTag(payload)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Tag created successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to create Tag." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to create Tag.",
                    });
                    reject(error)
                });
        })
    },


    // Update Tag
    updateTag: async (payload: ITagPayload, id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            updateTag(payload)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Tag updated successfully!",
                    });
                    resolve(res) 
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to update Tag." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to update Tag.",
                    });
                    reject(error)
                });
        })
    },
    // Delete Tag
    deleteTag: async (id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            deleteTag(id)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Tag deleted successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to delete Tag." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to delete Tag.",
                    });
                    reject(error)
                });
        })
    },

    // Get a single Tag
    getTag: async (id: number) => {
        set({ listLoading: true, error: null });
        return new Promise((resolve, reject) => {
            getTag(id)
                .then((res: any) => {
                    set({ tag: res, listLoading: false, error: null });
                    resolve(res)
                })
                .catch((err) => {
                    set((state) => ({
                        roles: [], listLoading: false,
                        error: err.message || "Failed to fetch Tag."
                    }));
                    reject(err)
                });
        })
    },

    // Get Tags based on status
    getTags: async (status: RecordStatus) => {
        set({ listLoading: true, error: null, filteredTags: [] });
        return new Promise((resolve, reject) => {
            getTags(status)
                .then((res: any) => {
                    if (!res.errors) {
                        set({ tags: res, filteredTags: res, listLoading: false, error: null });
                    } else {
                        set({ tags: [], filteredTags: [], listLoading: false, error: null });
                    }
                    resolve(res)
                })
                .catch((error: any) => {
                    set((state) => ({
                        tags: [], filteredTags: [], listLoading: false,
                        error: error || "Failed to fetch Tags."
                    }));
                    reject(error)
                });
        })
    },




}));