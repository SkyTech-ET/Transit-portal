import http from "@/modules/utils/axios";
import { RecordStatus } from "../common/common.types";


const tagEndpoints = Object.freeze({
    base: "/Tags",
    delete: "/Tags/Delete",
    getAll: "/Tags/GetAll",
    create: "/Tags/Create",
    update: "/Tags/Update",
    getById: "/Tags/GetById",
});

export const getTags = (recordStatus: RecordStatus = RecordStatus.Active): Promise<Response> => {
    return http.get({ url: `${tagEndpoints.getAll}`,params:{recordStatus}});
};

export const getTag = (id: number): Promise<Response> => {
    return http.get({ url: `${tagEndpoints.getById}`, params: { id } });
};

export const addTag = (payload: any): Promise<Response> => {
    return http.post({ url: tagEndpoints.create, data: payload });
  };
  
  export const updateTag = (payload: any): Promise<Response> => {
    return http.put({ url: `${tagEndpoints.update}`, data: { ...payload } });
  };


export const deleteTag = (id: number): Promise<Response> => {
    return http.delete({ url: tagEndpoints.delete, params: { id: id } });
};
