import http from "@/modules/utils/axios/index";
import { IEmployeeFilters, IEmployeePayload } from "./employees.types";

const employeeEndpoints = Object.freeze({
  getAll: "/Employee/GetAll",
  create: "/Employee/Create",
  update: "/Employee/Update",
  delete: "/Employee/Delete",
});

export const getEmployees = (filters?: IEmployeeFilters) =>
  http.get({ url: employeeEndpoints.getAll, params: filters });

export const createEmployee = (payload: IEmployeePayload) =>
  http.post({ url: employeeEndpoints.create, data: payload });

export const updateEmployee = (id: number, payload: IEmployeePayload) =>
  http.put({ url: `${employeeEndpoints.update}/${id}`, data: payload });

export const deleteEmployee = (id: number) =>
  http.delete({ url: `${employeeEndpoints.delete}/${id}` });
