import http from "@/modules/utils/axios";
import { IReportPayload } from "./report.types";
import { RecordStatus } from "../common/common.types";

const reportEndpoints = Object.freeze({
    getByOrg: "Dashboard/Organization",
    getAll: "Dashboard/View",
    getByOrgSort: "Dashboard/OrganizationSort",
    getAllSort: "Dashboard/ViewSort",
});

export const getAllReport = (payload: IReportPayload): Promise<Response> => {
    let params = payload as any
    delete params.organizationId
    return http.get({ url: reportEndpoints.getAll});
};

export const getReportsByOrg = (orgId: number): Promise<Response> => {
    return http.get({ url: `${reportEndpoints.getByOrg}/${orgId}`});
};
export const getAllReportSort = (payload: IReportPayload): Promise<Response> => {
    let params = payload as any
    delete params.organizationId
    return http.get({ url: reportEndpoints.getAllSort});
};

export const getReportsByOrgSort = (orgId: number): Promise<Response> => {
    return http.get({ url: `${reportEndpoints.getByOrgSort}/${orgId}`});
};