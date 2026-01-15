import http from "@/modules/utils/axios";
import { RecordStatus } from "../common/common.types";
import { IVendorSubscriptionPayload } from "./vendorSubscription.types";

const vendorSubscriptionEndpoints = Object.freeze({
    base: '/Subscriptions',
    delete: '/Subscriptions/Delete',
    getAll: "/Subscriptions/GetAll",
    create: "/Subscriptions/CreateSubscription",
    update: "/Subscriptions/Update",
    updateRecStatus:"/Subscriptions/UpdateRequestStatus",
    updateAccStatus: "/Subscriptions/UpdateAccountStatus",
    getById: "/Subscriptions/GetById",
    getByOrgId: "/Subscriptions/GetSubscriptionHistory",
    //assignSubscription: "/Events/AssignSubscriptions",
});

export const getVendorSubscriptions = (id:number,recordStatus: RecordStatus = RecordStatus.Active): Promise<Response> => {
    
    return http.get({ url: `${vendorSubscriptionEndpoints.getByOrgId}/${id}`,params: {recordStatus} });
};

export const getVendorSubscription = (id: number): Promise<Response> => {
    return http.get({ url: `${vendorSubscriptionEndpoints.getById}`, params: { id } });
}

export const addVendorSubscription = (payload: any): Promise<Response> => {
    return http.post({ url: vendorSubscriptionEndpoints.create, data: payload });
  };
  
  export const updateVendorSubscription = (payload: any, id:number): Promise<Response> => {
    return http.put({ url: `${vendorSubscriptionEndpoints.update}`, data: { ...payload, id } });
  };

  export const updateAccStatus = (payload: any, id: number): Promise<Response> => {
    return http.put({ url: `${vendorSubscriptionEndpoints.updateAccStatus}`, data: { ...payload, id:id } });
  };

  export const updateReqStatus = (payload: any,id: number): Promise<Response> => {
    return http.put({ url: `${vendorSubscriptionEndpoints.updateRecStatus}`, data: { ...payload, id:id } });
  };


export const deleteVendorSubscription = (id: number, organizationId: number): Promise<Response> => {
    return http.delete({ url: vendorSubscriptionEndpoints.delete, params: { id: id ,organizationId:organizationId} });
};
