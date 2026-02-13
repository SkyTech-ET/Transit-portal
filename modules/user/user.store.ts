import { create } from "zustand";
import { notification } from "antd";
import { RecordStatus } from "../common/common.types";
import { IAdditionalParam, IUserPayload, IUserState, IUserStore, IUser } from "./user.types";
import { addUser, deleteUser, getUser, getUsers, getUsersByOrg, updateUser  } from "./user.endpoint";
import { checkFieldValue } from "../utils";


//const storedUser: IUser | null = JSON.parse(localStorage.getItem("user") || "null");


let storedUser: IUser | null = null;

if (typeof window !== "undefined") {
  try {
    storedUser = JSON.parse(localStorage.getItem("transit-portal-user") || "null");
  } catch {
    storedUser = null;
  }
}


const defaultInitState: IUserState = {
  users: [],
  user: storedUser,
  currentUser: storedUser,
  error: null,
  orgUsers: [],
  searchTerm: '',
  loading: false,
  filteredUsers: [],
  listLoading: false,
  additionalParam: null,
  currentPage: 1,  
  totalPages: 1    
};

export const useUserStore = create<IUserStore>((set) => ({
  ...defaultInitState,
  addUser: async (payload: IUserPayload) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      set({ loading: true, error: null });
   // Payload is already in the correct format from the form
      addUser(payload)
        .then((res: any) => {
          set({ loading: false, error: null });
          notification.open({
            message: 'Success',
            type: "success",
            description: "User created successfully!",
          });
          resolve(res)
        })
        .catch((error: any) => {
          set({ loading: false, error: error || "Failed to create user." });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to create user.",
          });
          reject(error)
        });
    })
  },
  updateUser: async (payload: IUserPayload, id: number) => {
    set({ loading: true, error: null });
    let request = payload as any
    if (!checkFieldValue(request, 'organizationId')) {
      request.organizationId = useUserStore.getState().additionalParam?.orgId
    }
    // Ensure Roles is always an array
    if (request.Roles && !Array.isArray(request.Roles)) {
      request.Roles = [request.Roles]
    }
    return new Promise((resolve, reject) => {
      updateUser(payload, id)
        .then((res: any) => {
          set({ loading: false, error: null });
          notification.open({
            message: 'Success',
            type: "success",
            description: "User updated successfully!",
          });
          resolve(res)
        })
        .catch((error: any) => {
          set({ loading: false, error: error || "Failed to update user." });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to update user.",
          });
          reject(error)
        });
    })
  },
  deleteUser: async (id: number) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      deleteUser(id)
        .then((res: any) => {
          set({ loading: false, error: null });
          notification.open({
            message: 'Success',
            type: "success",
            description: "User deleted successfully!",
          });
          resolve(res)
        })
        .catch((error: any) => {
          set({ loading: false, error: error || "Failed to delete user." });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to delete user.",
          });
          reject(error)
        });
    })
  },

  getUsers: async (status: RecordStatus, pageNumber: number = 1) => {
    console.log('🔍 DEBUG: getUsers called with status:', status, 'pageNumber:', pageNumber);
    set({ listLoading: true, error: null, filteredUsers: [] });
  
    return new Promise((resolve, reject) => {
      console.log('🔍 DEBUG: About to call getUsers API...');
      getUsers(status, pageNumber) 
        .then((res: any) => {
          console.log('🔍 DEBUG: API response received in user store:', res);
          console.log('🔍 DEBUG: Response type:', typeof res);
          console.log('🔍 DEBUG: Is array?', Array.isArray(res));
          
          // The API returns the data directly as an array
          if (Array.isArray(res)) {
            const users = res || [];
            const pageSize = 10;
            const totalPages = Math.ceil(users.length / pageSize);
            console.log('🔍 DEBUG: Users extracted from array:', users.length, 'users');
            console.log('🔍 DEBUG: Total pages calculated:', totalPages);
            set({
              users: users,
              filteredUsers: users,
              listLoading: false,
              error: null,
              currentPage: pageNumber, 
              totalPages: totalPages,
            });
          } else {
            console.log('🔍 DEBUG: Unexpected response format:', res);
            set({
              users: [],
              filteredUsers: [],
              listLoading: false,
              error: null,
              currentPage: 1,  
              totalPages: 1,   
            });
          }
          resolve(res);
        })
        .catch((error: any) => {
          console.error('🔍 DEBUG: API call failed in user store:', error);
          set({
            users: [],
            filteredUsers: [],
            listLoading: false,
            error: error || "Failed to fetch users.",
            currentPage: 1, 
            totalPages: 1,   
          });
          // Don't show notification for empty data, just log the error
          console.warn('Failed to fetch users:', error);
          reject(error);
        });
    });
  },
  



  getUsersByOrg: async (id: number, status: RecordStatus) => {
    set({ listLoading: true, error: null, filteredUsers: [] });
    return new Promise((resolve, reject) => {
      getUsersByOrg(id, status)
        .then((res: any) => {
          if (!res.errors) {
            set({ orgUsers: res, filteredUsers: res, listLoading: false, error: null });
          } else {
            set({ orgUsers: [], filteredUsers: [], listLoading: false, error: null });
          }
          resolve(res)
        })
        .catch((error: any) => {
          set((state) => ({
            users: [], filteredUsers: [], listLoading: false,
            error: error || "Failed to fetch users by organization."
          }));
          // Don't show notification for empty data, just log the error
          console.warn('Failed to fetch users by organization:', error);
          reject(error)
        });
    })
  },
  getUser: async (id: number) => {
    set({ listLoading: true, error: null });
    return new Promise((resolve, reject) => {
      getUser(id)
        .then((res: any) => {
          let userRes = res;
          if (res.roles != null && res.roles.length > 0) {
            userRes.roles = res.roles.map((r: any) => r.id)
          }
          set({ user: userRes, listLoading: false, error: null });
          resolve(res)
        })
        .catch((error: any) => {
          set((state) => ({
            user: null, listLoading: false,
            error: error || "Failed to fetch user."
          }));
          reject(error)
        });
    })
  },
  setSearchTerm: (searchTerm: string) => {
    set({ searchTerm });
    set((state) => ({
      filteredUsers: state.users.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }));
  },
  setAdditionalParams(params: IAdditionalParam) {
    set({ additionalParam: { orgId: params.orgId, userId: params.userId, roles: params.roles } })
  },
}));
