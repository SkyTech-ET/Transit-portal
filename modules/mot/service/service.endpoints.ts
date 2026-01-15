import http from "@/modules/utils/axios";
import { RecordStatus } from "../../common/common.types";
import { IServiceFilters, IServicePayload, IService, DocumentType } from "./service.types";
import axios from "axios";
import { config } from "@/modules/utils/axios//config";
import { getToken } from "@/modules/utils/token/client-token.storage";

const serviceEndpoints = Object.freeze({
  base: "/Service",
  getAll: "/Service/GetAll",
  getById: "/Service/GetById",
  create: "/Service/Create",
  createCustomer: "/Customer/services",
  update: "/Service/Update",
  delete: "/Service/Delete",
  updateStatus: "/Service/UpdateStatus",
  assign: "/Service/Assign",
  assignExecutor: "/Manager/AssignExecutor",
  getStages: "/Service/GetStages",
  updateStageStatus: "/Service/UpdateStageStatus",
  getMyServices: "/Customer/services",
  getServiceDetails: "/Customer/services",
  getCustomerServices: '/Customer/GetMyServices',
  getAssignedServices: "/CaseExecutor/GetAssignedServices",
  getAssignedServiceById: "/CaseExecutor/GetAssignedServiceById",
  downloadStageDocument: "/CaseExecutor/DownloadStageDocument",
  setRiskLevel: "/CaseExecutor/SetRiskLevel",
  addStageComment: "/CaseExecutor/AddStageComment",
  uploadCustomerStageDocument: "/Customer/UploadStageDocument",

});

export const getAllServices = (/* recordStatus: RecordStatus = RecordStatus.Active, filters?: IServiceFilters*/ ): Promise<Response> => {
  return http.get({ 
    url: `${serviceEndpoints.getAll}`, 
    //params: filters || {} 
  });
};

export const getServiceById = (id: number) => {
  return http.get({ 
    url: `${serviceEndpoints.getById}/${id}`,
   });
};

export const createService = (payload: IServicePayload): Promise<Response> => {
  return http.post({ url: serviceEndpoints.create, data: payload });
};

export const updateService = (id: number, payload: Partial<IServicePayload>): Promise<Response> => {
  return http.put({ url: `${serviceEndpoints.update}/${id}`, data: payload });
};

export const deleteService = (id: number): Promise<Response> => {
  return http.delete({ url: `${serviceEndpoints.delete}/${id}` });
};

/* export const getServicesByRecordStatus = (recordStatus: number): Promise<IService[]> => {
  return http
    .get({
      url: `${serviceEndpoints.getAll}/${recordStatus}`,
    })
    .then((res: any) => {
      return res?.data?.response?.data || [];
    });
}; */

// Fetch services for a specific customer
export const apiGetCustomerServices = (customerId: number, recordStatus?: number, filters?: IServiceFilters) => {
  return http.get({
    url: `/Customer/GetMyServices`,
    params: { UserId: customerId, recordStatus, ...filters },
  });
};

export const getServiceStages = (serviceId: number) => {
  return http.get({
    url: "/Service/GetStages",
    params: { serviceId }, 
  });
};
export const updateStageStatus = (stageId: number, status: string) => {
  return http.put({
    url: serviceEndpoints.updateStageStatus,
    data: { stageId, status },
  });
}

export const getAssignedServices = (id: number, recordStatus?: number, filters?: IServiceFilters) => {
  return http.get({
    url: serviceEndpoints.getAssignedServices,
    params: { AssignedCaseExecutorId: id, recordStatus, ...filters },
  });
};


export const getAssignedServiceById = (
  serviceId: number,
  executorId: number
) => {
  return http.get({
    url: "/CaseExecutor/GetAssignedServiceById",
    params: {
      Id: serviceId,
      AssignedCaseExecutorId: executorId,
    },
  });
};

export const downloadStageDocument = async (documentId: number) => {
  const token = await getToken();

  const response = await axios.get(
    `${config.base_url.base}/CaseExecutor/DownloadStageDocument`,
    {
      params: { documentId },
      responseType: "arraybuffer", // 🔥
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export const setRiskLevel = ( serviceId: number, riskLevel: number, riskNotes?: string | null ) => {
  return http.put({
    url: serviceEndpoints.setRiskLevel,
    data: {
      serviceId,
      riskLevel,
      riskNotes,
    },
  });
};

export const addStageComment = (serviceId: number, stageId: number, comment: string, commentType: number | null = null, isInternal: true, isVisibleToCustomer: boolean) => {
  return http.post({
    url: serviceEndpoints.addStageComment,
    data: {
      serviceId,
      stageId,
      comment,
      commentType,
      isInternal,
      isVisibleToCustomer,
  },
});
};


export const uploadCustomerStageDocument = (serviceId: number, stageExecutionId: number, file: File, documentType: DocumentType) => {
  const fd = new FormData();
  fd.append("serviceId", String(serviceId));
  fd.append("stageId", String(stageExecutionId));
  fd.append("documentType", String(documentType));
  fd.append("File", file);

  return http.post({
    url: serviceEndpoints.uploadCustomerStageDocument,
    data: fd,
  });
};


export const createStageTransport = (data: FormData) =>
  http.post({
    url: "/StageTransport/Create",
    data,
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getStageTransportsByStageId = (serviceStageId: number) =>
  http.get({
    url: "/StageTransport/GetAllStageTransportsByServiceStageId",
    params: { ServiceStageId: serviceStageId },
  });

export const getStageTransportById = (id: number) =>
  http.get({
    url: "/StageTransport/GetStageTransportsById",
    params: { Id: id },
  });










