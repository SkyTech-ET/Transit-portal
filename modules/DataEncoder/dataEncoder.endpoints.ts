import http from "@/modules/utils/axios/index";
import { RecordStatus } from "../common/common.types";
import { IDataEncoderPayload } from "./dataEncoder.types";

const dataEncoderEndpoints = Object.freeze({
    base: '/DataEncoders',
    delete: '/DataEncoder/Delete',
    getAll: "/DataEncoder/GetAll",
    create: "/DataEncoder/Create",
    update: "/DataEncoder/Update",
    getById: "/DataEncoder/GetById",
    getByOrgId: "/Banners/GetByOrganizationId",
    //assignSubscription: "/Events/AssignSubscriptions",
});

export const getDataEncoders = (status: RecordStatus = RecordStatus.Active): Promise<Response> => {
  return http.get({url: `${dataEncoderEndpoints.getAll}/${status}` });
};

export const getDataEncoder = (id: number): Promise<Response> => {
  return http.get({ url: dataEncoderEndpoints.getById, params: { Id: id } });
};

export const addDataEncoder = (payload: IDataEncoderPayload): Promise<Response> => {
  return http.post({ url: dataEncoderEndpoints.create, data: payload });
};

export const updateDataEncoder = (payload: IDataEncoderPayload, id: number): Promise<Response> => {
  return http.put({ url: `${dataEncoderEndpoints.update}`, data: { ...payload, id: id } });
};

export const deleteDataEncoder = (id: number): Promise<Response> => {
  return http.delete({ url: dataEncoderEndpoints.delete, params: { id: id } });
};




