import http from "@/modules/utils/axios/index";
import { RecordStatus } from "../common/common.types";
import { ISubscriptionPayload } from "./subscription.types";

const subscriptionEndpoints = Object.freeze({
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

export const getSubscriptions = (recordStatus: RecordStatus = RecordStatus.Active, pageNumber: number = 1): Promise<Response> => {
    
    return http.get({ url: `${subscriptionEndpoints.getAll}`,params: { recordStatus:recordStatus, pageNumber:pageNumber } });
};

export const getSubscription = (id: number): Promise<Response> => {
    return http.get({ url: `${subscriptionEndpoints.getById}`, params: { id } });
};

export const addSubscription = (payload: any): Promise<Response> => {
    return http.post({ url: subscriptionEndpoints.create, data: payload });
  };
  
  export const updateSubscription = (payload: any): Promise<Response> => {
    return http.put({ url: `${subscriptionEndpoints.update}`, data: { ...payload } });
  };

  export const updateAccStatus = (payload: any, id: number): Promise<Response> => {
    return http.put({ url: `${subscriptionEndpoints.updateAccStatus}`, data: { ...payload, id:id } });
  };

  export const updateReqStatus = (payload: any,id: number): Promise<Response> => {
    return http.put({ url: `${subscriptionEndpoints.updateRecStatus}`, data: { ...payload, id:id } });
  };


export const deleteSubscription = (id: number): Promise<Response> => {
    return http.delete({ url: subscriptionEndpoints.delete, params: { id: id } });
};
