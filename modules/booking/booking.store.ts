

import { create } from "zustand";
import { notification } from 'antd';
import { RecordStatus } from "../common/common.types";
import { IBookingState, IBookingPayload,IBookingStatusPayload, BookingStore } from "./booking.types";
import { updateBookingStatus, addBooking, deleteBooking, getBooking,getBookingsByOrg, updateBooking } from "./booking.endpoints";
import { usePermissionStore } from "../utils";
 
const defaultInitState: IBookingState = {
    error: null,
    searchTerm: '',
    success: false,
    loading: false,
    bookings: [],
    orgBookings:[],
    listLoading: false,
    booking: null,
    filteredBookings: [],
    currentPage: 1,
    totalPages: 1,
};




export const useBookingStore = create<BookingStore>((set) => ({
    ...defaultInitState,
    addBooking: async (payload: IBookingPayload) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            addBooking(payload)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Booking created successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to create Booking." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to create Booking.",
                    });
                    reject(error)
                });
        })
    },


    // Update Service
    updateBooking: async (payload: IBookingPayload, id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            updateBooking(payload, id)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Booking updated successfully!",
                    });
                    resolve(res) 
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to update Booking." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to update Booking.",
                    });
                    reject(error)
                });
        })
    },
    // Delete Service
    deleteBooking: async (id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            deleteBooking(id)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Booling deleted successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to delete Booking." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to delete Booking.",
                    });
                    reject(error)
                });
        })
    },

    // Get a single Service
    getBooking: async (id: number) => {
        set({ listLoading: true, error: null });
        return new Promise((resolve, reject) => {
            getBooking(id)
                .then((res: any) => {
                    set({ booking: res, listLoading: false, error: null });
                    resolve(res)
                })
                .catch((err) => {
                    set((state) => ({
                        roles: [], listLoading: false,
                        error: err.message || "Failed to fetch Bookings."
                    }));
                    reject(err)
                });
        })
    },

    // // Get Bookings based on status
    // getBookings: async (orgId: number, status: RecordStatus, pageNumber: number = 1) => {
    //     set({ listLoading: true, error: null, filteredBookings: [] });
    //     return new Promise((resolve, reject) => {
    //         getBookings(orgId, status, pageNumber)
    //             .then((res: any) => {
    //                 if (!res.errors) {
    //                     const orders = res.orders|| [];
    //                     set({ 
    //                        bookings: orders, 
    //                        filteredBookings: orders, 
    //                         listLoading: false, 
    //                         error: null,              
    //                         currentPage: pageNumber, 
    //                          totalPages: res.totalPages || 1,  });
    //                 } else {
    //                     set({ bookings: [], filteredBookings: [], listLoading: false, error: null, currentPage: 1,  
    //                         totalPages: 1,});
    //                 }
    //                 resolve(res)
    //             })
    //             .catch((error: any) => {
    //                 set((state) => ({
    //                     bookings: [], filteredBookings: [], listLoading: false,
    //                     error: error || "Failed to fetch bookings.",
    //                     currentPage: 1, 
    //                     totalPages: 1,  
    //                 }));
    //                 reject(error)
    //             });
    //     })
    // },
    getBookingsByOrg: async (orgId: number, status: RecordStatus, pageNumber: number = 1) => {
        set({ listLoading: true, error: null, filteredBookings: [] });
        return new Promise((resolve, reject) => {
          getBookingsByOrg(orgId, status, pageNumber)
            .then((res: any) => {
              if (!res.errors) {
                const orders = res.orders|| [];
                set({ 
                   bookings: orders, 
                   filteredBookings: orders, 
                    listLoading: false, 
                    error: null,              
                    currentPage: pageNumber, 
                     totalPages: res.totalPages || 1,  });
            }else {
                set({ orgBookings: [], filteredBookings: [], listLoading: false, error: null });
              }
              resolve(res)
            })
            .catch((error: any) => {
              set((state) => ({
                users: [], filteredBookings: [], listLoading: false,
                error: error || "Failed to fetch users by organization."
              }));
              reject(error)
            });
        })
      },

    // Update Service
    updateBookingStatus: async (payload: IBookingStatusPayload) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            updateBookingStatus(payload)
                .then((res: any) => {
                    set({ loading: false, error: null,success:true});
                    setTimeout(() => {
                        set({ success:false});
                      }, 1000);
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Booking Status updated successfully!",
                    });
                    resolve(res) 
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to update BookingStatus." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to update BookingStatus.",
                    });
                    reject(error)
                });
        })
    },

}));