import http from "@/modules/utils/axios/index";
import { RecordStatus } from "../common/common.types";
import { IEventPayload } from "./event.types";

const eventEndpoints = Object.freeze({
    base: '/Events',
    delete: '/Events/Delete',
    getAll: "/Events/GetAll",
    getAllS: "/Services/GetByOrganizationId",
    create: "/Events/Create",
    update: "/Events/Update",
    getById: "/Events/GetById",
    getByOrgId: "/Events/GetByOrganizationId",
    //assignSubscription: "/Events/AssignSubscriptions",
});

export const getEvents = (recordStatus: RecordStatus = RecordStatus.Active): Promise<Response> => {
    return http.get({ url: `${eventEndpoints.getAll}`,params: { recordStatus } });
};

export const getEvent = (id: number): Promise<Response> => {
    return http.get({ url: `${eventEndpoints.getById}`, params: { id } });
};

export const addEvent = (payload: FormData): Promise<Response> => {
    return http.post({ url: eventEndpoints.create, data: payload, 'headersType': 'multipart/form-data' });
};
 
export const updateEvent = (payload: FormData): Promise<Response> => {
    return http.put({ url: `${eventEndpoints.update}`, data: payload, 'headersType': 'multipart/form-data' });
};

export const deleteEvent = (id: number): Promise<Response> => {
    return http.delete({ url: eventEndpoints.delete, params: { id: id } });
};


export const getServices = (orgId: number, status: RecordStatus = RecordStatus.Active): Promise<any> => {
    return http.get({ url: `${eventEndpoints.getAllS}/${orgId}/${status}` });
    
};


