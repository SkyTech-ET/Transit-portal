import http from "@/modules/utils/axios";

import { IRole, IRolePayload } from "./role.types";
import { RecordStatus } from "../common/common.types";

const roleEndpoints = Object.freeze({
  getAll: "/Roles/GetAll",
  getById: "/Roles/GetById",

  create: "/Roles/Create",
  update: "/Roles/Update",
  delete: "/Roles/Delete",
});


export const getRoles = (status: RecordStatus = RecordStatus.Active): Promise<Response> => {
  return http.get({ url: `${roleEndpoints.getAll}/${status}` });
};

export const getRole = (id: number): Promise<Response> => {
  return http.get({ url: `${roleEndpoints.getById}/${id}` });
};

export const addRole = (payload: IRolePayload): Promise<Response> => {
  return http.post({ url: roleEndpoints.create, data: payload });
};

export const updateRole = (payload: IRolePayload, id: number): Promise<Response> => {
  return http.put({ url: `${roleEndpoints.update}`, data: { ...payload, id: id } });
};

export const deleteRole = (id: number): Promise<Response> => {
  return http.delete({ url: roleEndpoints.delete, params: { id: id } });
};