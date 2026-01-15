import http from "@/modules/utils/axios/index";
import { RecordStatus } from "../common/common.types";
import { IServicePayload } from "./service.types";

const serviceEndpoints = Object.freeze({
    base: '/Services',
    delete: '/Services/Delete',
    getAll: "/Services/GetAll",
    create: "/Services/Create",
    update: "/Services/Update",
    getById: "/Services/GetById",
    getByOrgId: "/Services/GetByOrganizationId",
    //assignSubscription: "/Events/AssignSubscriptions",
});

export const getServices = (orgId: number, recordStatus: RecordStatus = RecordStatus.Active): Promise<Response> => {
    return http.get({ url: `${serviceEndpoints.getByOrgId}/${orgId}`,params: { recordStatus } });
};

export const getService = (id: number): Promise<Response> => {
    return http.get({ url: `${serviceEndpoints.getById}`, params: { id } });
};

export const addService = (payload: any): Promise<Response> => {
    return http.post({ url: serviceEndpoints.create, data: payload });
  };
  
  export const updateService = (payload: any, id: number): Promise<Response> => {
    return http.put({ url: `${serviceEndpoints.update}`, data: { ...payload, id: id } });
  };


export const deleteService = (id: number): Promise<Response> => {
    return http.delete({ url: serviceEndpoints.delete, params: { id: id } });
};
