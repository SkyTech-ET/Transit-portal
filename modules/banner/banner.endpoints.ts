import http from "@/modules/utils/axios/index";
import { RecordStatus } from "../common/common.types";
import { IBannerPayload } from "./banner.types";

const bannerEndpoints = Object.freeze({
    base: '/Banners',
    delete: '/Banners/Delete',
    getAll: "/Banners/GetAll",
    create: "/Banners/Create",
    update: "/Banners/Update",
    getById: "/Banners/GetById",
    getByOrgId: "/Banners/GetByOrganizationId",
    //assignSubscription: "/Events/AssignSubscriptions",
});

export const getBanners = (orgId: number, recordStatus: RecordStatus = RecordStatus.Active): Promise<Response> => {
    return http.get({ url: `${bannerEndpoints.getByOrgId}/${orgId}`,params: {recordStatus }  });
};

export const getBanner = (id: number): Promise<Response> => {
    return http.get({ url: `${bannerEndpoints.getById}`, params: { id } });
};

export const addBanner = (payload: FormData): Promise<Response> => {
    return http.post({ url: bannerEndpoints.create, data: payload, 'headersType': 'multipart/form-data' });
};
 
export const updateBanner = (payload: FormData): Promise<Response> => {
    return http.put({ url: `${bannerEndpoints.update}`, data: payload, 'headersType': 'multipart/form-data' });
};

export const deleteBanner = (id: number): Promise<Response> => {
    return http.delete({ url: bannerEndpoints.delete, params: { id: id } });
};




