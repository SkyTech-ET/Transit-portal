import { create } from "zustand";
import { notification } from "antd";
import { IUser } from "../user/user.types";
import { deleteTokens, storeToken } from "../utils/token/client-token.storage";
import { removeUserData, setUserData } from "../utils/token/user.storage";
import { AuthState, AuthStore, IPasswordPayload, ILogin } from "./auth.types";
import { forgotPassword, changePassword, resetPassword, login, signup } from "./auth.endpoints";
import { getUserData } from "../utils/token/user.storage";


const storedUser = typeof window !== "undefined"
  ? getUserData()
  : null;



const defaultInitState: AuthState = {
  user: storedUser,
  error: null,
  loading: false,
  //currentUser: storedUser
};

const useAuthStore = create<AuthStore>((set) => ({
  ...defaultInitState,
  login: async (payload: ILogin) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      login(payload)
        .then(async (res: any) => {
          await storeToken({ token: res?.accessToken, refresh_token: res?.refreshToken });
          const user: IUser = {
            id: res.id,
            email: res.email,
            roles: res.roles || [], // Ensure roles array exists
            username: res.username,
            lastName: res.lastName,
            firstName: res.firstName,
            phoneNumber: res.phoneNumber,
            organization: res.organization,
            organizationId: res.organizationId,
            recordStatus: res.recordStatus,
            userRoles: res.userRoles,
            isSuperAdmin: res.isSuperAdmin,
            profilePhoto:res.profilePhoto
          }
          setUserData(user)
          set({ user: user, /* currentUser: user, */ loading: false, error: null });
      

          resolve(res)
        })
        .catch((error: any) => {
          console.log(error)
          set({ loading: false, error: error || "Login failed. Please try again." });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Login failed. Please try again.",
          });
          reject(error)
        });
    })
  },
  logout: async () => {
    set({ loading: true });
    await deleteTokens();
    removeUserData()
    set({ user: null, error: null, loading: false });
  },
  signUp: async (data: IUser) => {
    set({ loading: true, error: null });
    try {
      signup(data)
        .then(async (res: any) => {
        })
        .catch((error: any) => {
          set({
            loading: false,
            error: error || "Login failed. Please try again.",
          });
        });
    } catch (error: any) {
      set({ loading: false, error: error || "Something went wrong." });
    }
  },
  forgotPassword: async (payload: IPasswordPayload) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      forgotPassword(payload)
        .then((res: any) => {
          set({ loading: false, error: null });
          notification.open({
            type: "success",
            message: 'Success',
            description: res.message,
          });
          resolve(res)
        })
        .catch((error: any) => {
          set({ loading: false, error: error || "Failed to reset password." });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to reset password.",
          });
          reject(error)
        });
    })
  },
  updatePassword: async (payload: IPasswordPayload) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      changePassword(payload)
        .then((res: any) => {
          set({ loading: false, error: null });
          notification.open({
            type: "success",
            message: 'Success',
            description: res.message,
          });
          resolve(res)
        })
        .catch((error: any) => {
          set({ loading: false, error: error || "Failed to update password." });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to update password.",
          });
          reject(error)
        });
    })
  },
  resetPassword: async (payload: IPasswordPayload) => {
    set({ loading: true, error: null });
    return new Promise((resolve, reject) => {
      resetPassword(payload)
        .then((res: any) => {
          set({ loading: false, error: null });
          notification.open({
            type: "success",
            message: 'Success',
            description: res.message,
          });
          resolve(res)
        })
        .catch((error: any) => {
          set({ loading: false, error: error || "Failed to reset password." });
          notification.open({
            message: 'Error',
            type: "error",
            description: error || "Failed to reset password.",
          });
          reject(error)
        });
    })
  },
}));

useAuthStore.subscribe((state) => {
  console.log("👀 AUTH STORE CHANGED:", state.user);
});


export default useAuthStore;


