import { create } from "zustand";
import { notification } from 'antd';
import { RecordStatus } from "../common/common.types";
import { IEventState, IEventPayload, EventStore } from "./event.types";
import { addEvent, deleteEvent, getEvent, getEvents, updateEvent} from "./event.endpoints";
import { usePermissionStore } from "../utils";

const defaultInitState: IEventState = {
    error: null,
    searchTerm: '',
    loading: false,
    events: [],
    listLoading: false,
    event: null,
    filteredEvents: []
};

export const useEventStore = create<EventStore>((set) => ({
    ...defaultInitState,
    addEvent: async (payload: FormData) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            addEvent(payload)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Event created successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to create Event." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to create Event.",
                    });
                    reject(error)
                });
        })
    },

    // Update Event
    updateEvent: async (payload: FormData, id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            updateEvent(payload)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Event updated successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to update Event." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to update Event.",
                    });
                    reject(error)
                });
        })
    },

    // Delete Event
    deleteEvent: async (id: number) => {
        set({ loading: true, error: null });
        return new Promise((resolve, reject) => {
            deleteEvent(id)
                .then((res: any) => {
                    set({ loading: false, error: null });
                    notification.open({
                        message: 'Success',
                        type: "success",
                        description: "Event deleted successfully!",
                    });
                    resolve(res)
                })
                .catch((error) => {
                    set({ loading: false, error: error || "Failed to delete Event." });
                    notification.open({
                        message: 'Error',
                        type: "error",
                        description: error || "Failed to delete Event.",
                    });
                    reject(error)
                });
        })
    },

    // Get a single Event
    getEvent: async (id: number) => {
        set({ listLoading: true, error: null });
        return new Promise((resolve, reject) => {
            getEvent(id)
                .then((res: any) => {
                    set({ event: res, listLoading: false, error: null });
                    resolve(res)
                })
                .catch((err) => {
                    set((state) => ({
                        roles: [], listLoading: false,
                        error: err.message || "Failed to fetch Events."
                    }));
                    reject(err)
                });
        })
    },

    // Get Events based on status
    getEvents: async (status: RecordStatus) => {
        set({ listLoading: true, error: null, filteredEvents: [] });
        return new Promise((resolve, reject) => {
            getEvents(status)
                .then((res: any) => {
                    if (!res.errors) {
                        set({ events: res, filteredEvents: res, listLoading: false, error: null });
                    } else {
                        set({ events: [], filteredEvents: [], listLoading: false, error: null });
                    }
                    resolve(res)
                })
                .catch((error: any) => {
                    set((state) => ({
                        events: [], filteredEvents: [], listLoading: false,
                        error: error || "Failed to fetch events."
                    }));
                    reject(error)
                });
        })
    },
}));

export { getEvents };
//export { getServices };

