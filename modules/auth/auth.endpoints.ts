import { IUser } from "../user/user.types";
import http from "@/modules/utils/axios/index";
import { IPasswordPayload, ILogin } from "./auth.types";

const authEndpoints = Object.freeze({
  signup: "/User/Create",
  login: "/User/Login",
  resetPassword: "/Password/ResetPassword",
  forgotPassword: "/Password/ForgotPassword",
  changePassword: "/Password/ChangePassword",
});

export const login = (payload: ILogin): Promise<Response> => {
  return http.post({ url: authEndpoints.login, data: payload });
};

export const signup = async (user: IUser): Promise<Response> => {
  return http.post({ url: authEndpoints.signup, data: user });
};

export const forgotPassword = async (payload: IPasswordPayload): Promise<Response> => {
  return http.post({ url: authEndpoints.forgotPassword, data: payload });
};

export const changePassword = async (payload: IPasswordPayload): Promise<Response> => {
  return http.post({ url: authEndpoints.changePassword, data: payload });
};

export const resetPassword = async (payload: IPasswordPayload): Promise<Response> => {
  let request = { 'username': payload.username, "password": payload.newPassword }
  return http.post({ url: authEndpoints.resetPassword, data: request });
};
