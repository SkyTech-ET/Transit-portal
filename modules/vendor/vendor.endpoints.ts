import http from "@/modules/utils/axios/index";
import { RecordStatus } from "../common/common.types";
import { IVendor, IVendorPackagePayload } from "./vendor.types";

const vendorEndpoints = Object.freeze({
  delete: '/Organazations/Delete',
  getAll: "/Organazations/GetAll",
  create: "/Organazations/Create",
  update: '/Organazations/Update',
  getById: '/Organazations/GetById',
  assignSubscription: "/Organazations/AssignSubscriptions",
  getAllSort: "/Organazations/GetAllSortData",
});

export const getVendors = (status: RecordStatus = RecordStatus.Active): Promise<Response> => {
  return http.get({ url: `${vendorEndpoints.getAll}`,params:{status } });
};
export const getVendorsSort = (recordStatus: RecordStatus = RecordStatus.Active,pageNumber: number = 1): Promise<Response> => {
  return http.get({ url: `${vendorEndpoints.getAllSort}`,params: { recordStatus:recordStatus ,pageNumber:pageNumber} });
};

export const getVendor = (id: number): Promise<Response> => {
  return http.get({ url: `${vendorEndpoints.getById}`, params:{id} });
};

export const addVendor = (payload: FormData): Promise<Response> => {
  return http.post({ url: vendorEndpoints.create, data: payload, 'headersType': 'multipart/form-data' });
};

export const updateVendor = (payload: FormData): Promise<Response> => {
  return http.put({ url: `${vendorEndpoints.update}`, data: payload, 'headersType': 'multipart/form-data' });
};
export const updateAccStatus = (payload: IVendor, id: number): Promise<Response> => {
  return http.put({ url: `${vendorEndpoints.update}`, data: { ...payload, id:id } });
};
export const assignSubscription = (payload: IVendorPackagePayload): Promise<Response> => {
  return http.put({ url: `${vendorEndpoints.assignSubscription}`, data: payload });
};

export const deleteVendor = (id: number): Promise<Response> => {
  return http.delete({ url: `${vendorEndpoints.delete}`,params:{id} });
};
