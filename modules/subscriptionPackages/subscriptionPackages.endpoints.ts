import http from "@/modules/utils/axios";
import { RecordStatus } from "../common/common.types";

const subscriptionEndpoints = Object.freeze({
    base: '/SubscriptionPackages',
    getAll: "/SubscriptionPackages/GetAllPublicSubscriptionPackages",
    create: "/SubscriptionPackages/CreateSubscriptionPackage",
    getById:'/SubscriptionPackages/GetById',
    update:'/SubscriptionPackages/Update',
    delete:'/SubscriptionPackages/Delete',
});

export const getSubscriptionPackages = (recordStatus: RecordStatus = RecordStatus.Active): Promise<Response> => {
    //return http.get({ url: subscriptionEndpoints.getAll });
    return http.get({ url: `${subscriptionEndpoints.getAll}`,params: { recordStatus } });

};



export const addSubscriptionPackage = (payload: any): Promise<Response> => {
    return http.post({ url: subscriptionEndpoints.create, data: payload });
  };
  
  export const getSubscriptionPackage = (id: number): Promise<Response> => {
    return http.get({ url: `${subscriptionEndpoints.getById}`, params: { id } });
};
 
export const updateSubscriptionPackage = (payload: any, id: number): Promise<Response> => {
    return http.put({ url: `${subscriptionEndpoints.update}`, data: { ...payload, id:id } });
  };

export const deleteSubscriptionPackage = (id: number): Promise<Response> => {
    return http.delete({ url: subscriptionEndpoints.delete, params: { id: id } });
};

