import { IUser } from "../user/user.types";

export interface ILogin {
  username: string;
  password: string;
}

export interface IPasswordPayload {
  username: string;
  password: string;
  newPassword: string;
  confirmPassword: string
}



export type AuthState = {
  loading: boolean;
  user: IUser | null;
  error: string | null;
  //currentUser: IUser | null
};

export type AuthActions = {
  logout: () => Promise<void>;
  login: (payload: ILogin) => Promise<void>;
  signUp: (payload: IUser) => Promise<void>;
  forgotPassword: (payload: IPasswordPayload) => Promise<void>;
  updatePassword: (payload: IPasswordPayload) => Promise<void>;
  resetPassword: (payload: IPasswordPayload) => Promise<void>;
};

export type AuthStore = AuthState & AuthActions;
