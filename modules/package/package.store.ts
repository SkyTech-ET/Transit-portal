import { notification } from 'antd'
import {create} from "zustand"
import { RecordStatus } from '../common/common.types'
import { IPackageState,PackageStore } from './package.types'
import { addPackage,deletePackage,getPackage,getPackages,getPackagesByOrg,updatePackage } from './package.endpoints'

const defaultInitState:IPackageState={
    error: null,
    searchTerm:'',
    loading:false,
    packages:[],
    orgPackages:[],
    listLoading:false,
    packageInd:null,
    filteredPackages:[],
}

export const usePackageStore = create<PackageStore>((set) => ({
    ...defaultInitState,
    addPackage: async (payload: FormData) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            addPackage(payload)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Package created successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to create Package." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to create Package.",
                    });
                    reject(error)
                });
        })
    },

    // Update Package
    updatePackage: async (payload: FormData, id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            updatePackage(payload)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Package updated successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to update Package." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to update Package.",
                    });
                    reject(error)
                });
        })
    },

    // Delete Package
    deletePackage: async (id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            deletePackage(id)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Package deleted successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to delete Package." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to delete Package.",
                    });
                    reject(error)
                });
        })
    },

    // Get a single Package
    getPackage: async (id: number) => {
        set({ listLoading: true, error: null });
        return new Promise((resolve, reject) => {
            getPackage(id)
                .then((res: any) => {
                    set({ packageInd: res, listLoading: false, error: null });
                    resolve(res)
                })
                .catch((err) => {
                    set((state) => ({
                        roles: [], listLoading: false,
                        error: err.message || "Failed to fetch Package."
                    }));
                    reject(err)
                });
        })
    },

    // Get Packages based on status
    getPackages: async (orgId: number, status: RecordStatus) => {
        set({ listLoading: true, error: null, filteredPackages: [] });
        return new Promise((resolve, reject) => {
            getPackages(orgId, status)
                .then((res: any) => {
                    if (!res.errors) {
                        set({ packages: res, filteredPackages: res, listLoading: false, error: null });
                    } else {
                        set({ packages: [], filteredPackages: [], listLoading: false, error: null });
                    }
                    resolve(res)
                })
                .catch((error: any) => {
                    set((state) => ({
                        events: [], filteredEvents: [], listLoading: false,
                        error: error || "Failed to fetch Packages."
                    }));
                    reject(error)
                });
        })
    },
    getPackagesByOrg: async (orgId: number, status: RecordStatus) => {
        set({ listLoading: true, error: null, filteredPackages: [] });
        return new Promise((resolve, reject) => {
          getPackagesByOrg(orgId, status)
            .then((res: any) => {
              if (!res.errors) {
                set({ orgPackages: res, filteredPackages: res, listLoading: false, error: null });
              } else {
                set({ orgPackages: [], filteredPackages: [], listLoading: false, error: null });
              }
              resolve(res)
            })
            .catch((error: any) => {
              set((state) => ({
                users: [], filteredPackages: [], listLoading: false,
                error: error || "Failed to fetch users by organization."
              }));
              reject(error)
            });
        })
      },
}));