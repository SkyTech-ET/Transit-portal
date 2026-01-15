import http from "@/modules/utils/axios";
import { IPrivilegePayload } from "./privilege.types";
import { RecordStatus } from "../common/common.types";

const privilegeEndpoints = Object.freeze({
  base: "/Privilege",
  getAll: "/Privilege/GetAll",
  getById: "/Privilege/GetById",

  create: "/Privilege/Create",
  update: "/Privilege/Update",
  delete: "/Privilege/Delete"
});

export const getPrivileges = (status: RecordStatus = RecordStatus.Active): Promise<Response> => {
  return http.get({url: `${privilegeEndpoints.getAll}/${status}` });
};

export const getPrivilege = (id: number): Promise<Response> => {
  return http.get({ url: privilegeEndpoints.getById, params: { Id: id } });
};

export const addPrivilege = (payload: IPrivilegePayload): Promise<Response> => {
  return http.post({ url: privilegeEndpoints.create, data: payload });
};

export const updatePrivilege = (payload: IPrivilegePayload, id: number): Promise<Response> => {
  return http.put({ url: `${privilegeEndpoints.update}`, data: { ...payload, id: id } });
};

export const deletePrivilege = (id: number): Promise<Response> => {
  return http.delete({ url: privilegeEndpoints.delete, params: { id: id } });
};
