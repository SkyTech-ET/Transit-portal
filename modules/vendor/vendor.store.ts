import { create } from "zustand";
import { notification } from 'antd';
import { RecordStatus } from "../common/common.types";
import { IVendor, IVendorPackagePayload, IVendorState, VendorStore } from "./vendor.types";
import { addVendor, assignSubscription, updateAccStatus, deleteVendor, getVendor,getVendors, getVendorsSort, updateVendor } from "./vendor.endpoints";

const defaultInitState: IVendorState = {
  error: null,
  searchTerm: '',
  loading: false,
  vendors: [],
  listLoading: false,
  vendor: null,
  filteredVendors: [],
  currentPage: 1,
  success: false,
  totalPages: 1,
};

export const useVendorStore = create<VendorStore>((set) => ({
  ...defaultInitState,
  addVendor: async (payload: FormData) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      addVendor(payload)
        .then((res: any) => {
          set({ loading: false, error: null });
          notification.open({
            message: 'Success',
            type: "success",
            description: "Vendor created successfully!",
          });
          resolve(res)
        })
        .catch((error: any) => {
          set({ loading: false, error: error || "Failed to create vendor." });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to create vendor.",
          });
          reject(error)
        });
    })
  },


  updateVendor: async (payload: FormData) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      updateVendor(payload)
        .then((res: any) => {
          set({ loading: false, error: null });
          notification.open({
            message: 'Success',
            type: "success",
            description: "Vendor updated successfully!",
          });
          resolve(res)
        })
        .catch((error: any) => {
          set({
            loading: false,
            error: error || "Failed to update vendor.",
          });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to update vendor.",
          });
          reject(error)
        });
    })
  },
  updateAccStatus: async (payload: IVendor, id: number) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      updateAccStatus(payload, id)
        .then((res: any) => {
          set({ loading: false, error: null, success: true });
          setTimeout(() => {
            set({ success: false });
          }, 1000);
          notification.open({
            message: 'Success',
            type: "success",
            description: "Vendor updated successfully!",
          });
          resolve(res)
        })
        .catch((error) => {
          set({ loading: false, error: error || "Failed to update Vendor." });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to update Vendor.",
          });
          reject(error)
        });
    })
  },
  deleteVendor: async (id: number) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      deleteVendor(id)
        .then((res: any) => {
          set({ loading: false, error: null });
          notification.open({
            message: 'Success',
            type: "success",
            description: "Vendor deleted successfully!",
          });
          resolve(res)
        })
        .catch((error: any) => {
          set({
            loading: false,
            error: error || "Failed to delete vendor.",
          });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to delete vendor.",
          });
          reject(error)
        });
    })
  },
  assignSubscription: async (payload: IVendorPackagePayload) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      assignSubscription(payload)
        .then((res: any) => {
          set({ loading: false, error: null });
          notification.open({
            message: 'Success',
            type: "success",
            description: "Subscription added successfully!",
          });
          resolve(res)
        })
        .catch((error: any) => {
          set({
            loading: false,
            error: error || "Failed to add subscription.",
          });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to update subscription.",
          });
          reject(error)
        });
    })
  },

  getVendors: async (status: RecordStatus) => {
    set({ listLoading: true, error: null });
    return new Promise((resolve, reject) => {
      getVendors(status)
        .then(async (res: any) => {
          if (!res.errors) {
            const organizations = res || [];
            set({ 
              
              vendors: organizations, filteredVendors: organizations, listLoading: false, error: null
            
            });
          } else {
            set({ vendors: [], filteredVendors: [], listLoading: false, error: null,  });
          }
          resolve(res);
        })
        .catch((err) => {
          set((state) => ({
            vendors: [], filteredVendors: [], listLoading: false,
            error: err.message || "Failed to fetch vendors."
          }));
          reject(err)
        });
    });
  },

  getVendorsSort: async (status: RecordStatus, pageNumber: number = 1) => {
    set({ listLoading: true, error: null });
    return new Promise((resolve, reject) => {
      getVendorsSort(status, pageNumber)
        .then(async (res: any) => {
          if (!res.errors) {
            const organizations = res.organizations || [];
            set({

              vendors: organizations, filteredVendors: organizations, listLoading: false, error: null
              ,
              currentPage: pageNumber,
              totalPages: res.totalPages || 1,

            });
          } else {
            set({
              vendors: [], filteredVendors: [], listLoading: false, error: null, currentPage: 1,
              totalPages: 1,
            });
          }
          resolve(res);
        })
        .catch((err) => {
          set({
            vendors: [], filteredVendors: [], listLoading: false,
            error: err.message || "Failed to fetch vendors.", currentPage: 1,
            totalPages: 1,
          });
          reject(err)
        });
    });
  },
  getVendor: async (id: number) => {
    set({ listLoading: true, error: null });
    return new Promise((resolve, reject) => {
      getVendor(id)
        .then(async (res: any) => {
          set({ vendor: res, listLoading: false, error: null });
          console.log("ven res",res);
          resolve(res)
        })
        .catch((err) => {
          set((state) => ({
            vendor: null, listLoading: false,
            error: err.message || "Failed to fetch vendor.",
          }));
          reject(err)
        });

    })
  },
  setSearchTerm: (searchTerm: string) => {
    set({ searchTerm });
    set((state) => ({
      filteredVendors: state.vendors.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.state.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }));
  },
}));
