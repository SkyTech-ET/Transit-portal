import { create } from "zustand";
import { notification } from "antd";
import {  IService, 
          IServiceFilters, 
          IServicePayload, 
          IServiceState, 
          IServiceActions, 
          StageStatus, 
          RiskLevel,
          DocumentType,
          IStageTransport,  } from "./service.types";

import { 
  getAllServices as apiGetAllServices, 
  getServiceById, 
  createService, 
  updateService, 
  deleteService, 
  apiGetCustomerServices, 
  updateStageStatus, 
  getAssignedServices as apiGetAssignedServices, 
  getAssignedServiceById, 
  downloadStageDocument, 
  setRiskLevel,
  addStageComment as apiAddStageComment,
  uploadCustomerStageDocument as apiUploadCustomerStageDocument,
  createStageTransport,
  getStageTransportsByStageId } from "./service.endpoints";

import http from "@/modules/utils/axios";
import { comment } from "postcss";

const defaultInitState: IServiceState = {
  services: [],
  currentService: null,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  stageExecutions: [],
  stages: [],
  stageTransports: [],
  stageTransportLoading: false,
};

export const useServiceStore = create<IServiceState & IServiceActions>((set, get) => ({
  ...defaultInitState,

  getAllServices: async (filters?: IServiceFilters) => {
    set({ loading: true, error: null });
    try {
      const res = await apiGetAllServices(); // recordStatus = 2
      console.log("Raw API response:", res); // 🔍 inspect in DevTools

      // Adjust according to API response shape
      // In your case, the data is in res.data.response.data
      const services = res || [];

      set({
        services,
        loading: false,
        error: null,
        totalCount: services.length
      });

      return services;
    } catch (error: any) {
      set({ loading: false, error: error.message || "Failed to fetch services." });
      notification.error({ message: "Error", description: error.message || "Failed to fetch services." });
      return [];
    }
  },

  getServiceById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const res = await http.get({
        url: `/Service/GetById`,
        params: { Id: id }, // backend expects ?Id=6
      });
        
      const service = res/* ?.data?.response?.data */ || null;

      set({ currentService: service, loading: false });
      return service;
    } catch (error: any) {
      set({ loading: false, error: error.message || "Failed to load service." });
      return null;
    }
  },


  createService: async (payload: IServicePayload) => {
  set({ loading: true, error: null });
  try {
    await createService(payload); // ❌ no return

    notification.success({
      message: "Success",
      description: "Service created successfully!",
    });

    set({ loading: false });
  } catch (error: any) {
    set({ loading: false, error: error.message || "Failed to create service." });

    notification.error({
      message: "Error",
      description: error.message || "Failed to create service.",
    });
  }
},



  updateService: async (id: number, payload: Partial<IServicePayload>) => {
    set({ loading: true, error: null });
    try {
      const res = await updateService(id, payload);
      notification.success({ message: "Success", description: "Service updated successfully!" });
      set({ loading: false });
      return res;
    } catch (error: any) {
      set({ loading: false, error: error.message || "Failed to update service." });
      notification.error({ message: "Error", description: error.message || "Failed to update service." });
      return null;
    }
  },

  deleteService: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const res = await deleteService(id);
      notification.success({ message: "Success", description: "Service deleted successfully!" });
      set({ loading: false });
      return res;
    } catch (error: any) {
      set({ loading: false, error: error.message || "Failed to delete service." });
      notification.error({ message: "Error", description: error.message || "Failed to delete service." });
      return null;
    }
  },

  getServiceStages: async (serviceId: number) => {
  set({ loading: true, error: null });

  try {
    const res = await http.get({
      url: `Service/GetStages`,
      params: { serviceId }, // backend wants this name
    });

    const stages = res/* ?.data?.response?.data  */|| [];
    

    const current = useServiceStore.getState().currentService || {};

    set({
      currentService: { ...current, stages },
      loading: false,
    });

    return stages;
  } catch (error: any) {
    set({ loading: false, error: error.message || "Failed to load stages." });
    notification.error({ message: "Error fetching service stages" });
    return [];
  }
},

 
  getCustomerServices: async (customerId: number, recordStatus?: number, filters?: IServiceFilters) => {
  set({ loading: true, error: null });
  try {
    const res = await apiGetCustomerServices(customerId, recordStatus, filters);
    const services: IService[] = res || [];
    set({
      services,
      loading: false,
      error: null,
      totalCount: services.length
    });
    return services;
  } catch (error: any) {
    set({ loading: false, error: error.message || "Failed to fetch customer services." });
    return [];
  }
},

updateStageStatus: async (
  stageId: number,
  status: StageStatus,
  comments?: string | null
): Promise<void> => {
  try {
    await http.put({
  url: "/Service/UpdateStageStatus",
  data: {
    stageId,
    status,
    comments: comments || null,
  },
});
  } catch (error) {
    console.error("Error updating stage status:", error);
    throw error;
  }
},


  uploadStageDocument: async (
  serviceId: number,
  stageExecutionId: number,
  file: File,
  documentType: DocumentType
) => {
  set({ loading: true, error: null });

  try {
    const fd = new FormData();
    fd.append("serviceId", String(serviceId));
    fd.append("stageId", String(stageExecutionId));
    fd.append("documentType", String(documentType));
    fd.append("File", file);

    console.log("🚀 Uploading document via CaseExecutor/UploadStageDocument");
    Array.from(fd.entries()).forEach(p => console.log("📦", p));

    const response = await http.post({
      url: "/CaseExecutor/UploadStageDocument",
      data: fd,
    });

    if (response?.data?.isError) {
      throw new Error(response.data.message || "Failed to upload document");
    }

    notification.success({
      message: "Success",
      description: "Document uploaded successfully",
    });

    // Refresh stages
    await get().getServiceStages(serviceId);

    set({ loading: false });
    return response;
  } catch (error: any) {
    set({ loading: false, error: error.message || "Failed to upload document" });
    notification.error({
      message: "Error",
      description: error.message || "Failed to upload document",
    });
  }
},

uploadCustomerStageDocument: async (
  serviceId,
  stageExecutionId,
  file,
  documentType
) => {
  set({ loading: true, error: null });

  try {
    await apiUploadCustomerStageDocument(
      serviceId,
      stageExecutionId,
      file,
      documentType
    );

    notification.success({
      message: "Success",
      description: "Document uploaded successfully",
    });

    // refresh data
    await get().getServiceStages(serviceId);
    await get().getServiceById(serviceId);

    set({ loading: false });
  } catch (error: any) {
    set({
      loading: false,
      error: error.message || "Upload failed",
    });

    notification.error({
      message: "Error",
      description: error.message || "Upload failed",
    });

    throw error;
  }
},


  getAssignedServices: async (
  id: number,
  recordStatus?: number,
  filters?: IServiceFilters
) => {
  set({ loading: true, error: null });

   console.log("🔥 store.getAssignedServices called", id);

  try {
    const res = await apiGetAssignedServices(id, recordStatus, filters);

    const services: IService[] = res  /*  ?.data?.response?.data */   || [];

    
  console.log("store.getAssignedServices response", res);


    set({
      services,
      loading: false,
      error: null,
      totalCount: services.length,
    });

    return services;
  } catch (error: any) {
    set({
      loading: false,
      error: error.message || "Failed to fetch assigned services.",
    });
    return [];
  }
},


getAssignedServiceById: async (
  serviceId: number,
  executorId: number
) => {
  set({ loading: true, error: null });

  try {
    const res = await getAssignedServiceById(serviceId, executorId);

    const service: IService =
      res?.data?.response?.data ?? null;

    set({
      currentService: service,
      loading: false,
    });

    return service;
  } catch (error: any) {
    set({
      loading: false,
      error: error.message || "Failed to fetch assigned service.",
    });
    return null;
  }
},



downloadStageDocument: async (documentId: number, fileName?: string) => {
  try {
    // Fetch the file as a blob
    const blob = await http.get({
      url: "/CaseExecutor/DownloadStageDocument",
      params: { documentId },
      responseType: "blob", // 🔥 important for binary files
    });
  

    // 🔍 Debug info
    console.log("📦 Blob type:", blob.type);
    console.log("📦 Blob size:", blob.size);

    // Create a URL and trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || `document_${documentId}.jpg`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("❌ Download failed", err);
  }
},


setRiskLevel: async (
  serviceId: number,
  riskLevel: RiskLevel,
  riskNotes?: string | null
) => {
  set({ loading: true, error: null });

  try {
    await setRiskLevel(serviceId, riskLevel, riskNotes);

    notification.success({
      message: "Success",
      description: "Risk level updated successfully",
    });

    // Optional refresh if you want updated service data
    await get().getServiceById(serviceId);

    set({ loading: false });
  } catch (error: any) {
    set({
      loading: false,
      error: error.message || "Failed to set risk level",
    });

    notification.error({
      message: "Error",
      description: error.message || "Failed to set risk level",
    });

    throw error;
  }
},


addStageComment: async (
  serviceId: number,
  stageId: number,
  comment: string,
  isInternal = true,
  isVisibleToCustomer = true
) => {
  set({ loading: true, error: null });

  try {
    await apiAddStageComment(
      serviceId,
      stageId,
      comment,
      null,
      isInternal,
      isVisibleToCustomer
    );

    notification.success({
      message: "Success",
      description: "Comment added successfully",
    });

    // 🔄 Refresh stages so UI updates immediately
    await get().getServiceStages(serviceId);

    set({ loading: false });
  } catch (error: any) {
    set({
      loading: false,
      error: error.message || "Failed to add comment",
    });

    notification.error({
      message: "Error",
      description: error.message || "Failed to add comment",
    });

    throw error;
  }
},


  createStageTransport: async (formData: FormData) => {
  set({ stageTransportLoading: true, error: null });

  try {
    await createStageTransport(formData);

    notification.success({
      message: "Success",
      description: "Transportation data saved successfully",
    });

    set({ stageTransportLoading: false });
  } catch (error: any) {
    set({
      stageTransportLoading: false,
      error: error.message || "Failed to save transport data",
    });

    notification.error({
      message: "Error",
      description: error.message || "Failed to save transport data",
    });

    throw error;
  }
},

getStageTransportsByStageId: async (serviceStageId: number) => {
  set({ stageTransportLoading: true, error: null });

  try {
    const res: any = await getStageTransportsByStageId(serviceStageId);

    const transports: IStageTransport[] =
      res/* ?.response?.data ?? [] */;

      console.log("📦 Raw transport API response:", res);
      console.log("📦 Parsed transports:", transports);
      

    const latestTransport =
    transports.length > 0
    ? [...transports].sort(
        (a, b) =>
          new Date(b.registeredDate ?? b.startDate).getTime() -
          new Date(a.registeredDate ?? a.startDate).getTime()
      )[0]
    : null;

set({
  stageTransports: latestTransport ? [latestTransport] : [],
  stageTransportLoading: false,
});


    return transports;
  } catch (error: any) {
    set({
      stageTransports: [],
      stageTransportLoading: false,
      error: error.message || "Failed to load transport data",
    });

    return [];
  }
},

  

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setCurrentService: (service: IService | null) => set({ currentService: service })
}));
