import http from "@/modules/utils/axios";
import { service } from "../utils/axios/service";

export const uploadServiceDocument = async (formData: FormData) =>
  http.post({
    url: "/Document/UploadServiceDocument",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getServiceDocuments = (serviceId: number) => {
  return http.get({
    url: "/Document/GetServiceDocuments",
    params: { serviceId },
  });
};

export const deleteDocument = async (documentId: number) =>
  http.delete({
    url: "/Document/DeleteDocument",
    data: { documentId },
  });

export const verifyDocument = async (documentId: number) =>
  http.post({
    url: "/Document/VerifyDocument",
    data: { documentId },
  });

export const downloadDocument = async (documentId: number) =>
  http.get({
    url: "/Document/DownloadDocument",
    params: { documentId },
    responseType: "blob",
  });
