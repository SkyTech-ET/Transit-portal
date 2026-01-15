import http from '@/modules/utils/axios';
import { IDocumentUploadRequest, DocumentCategory } from './document.types';

const documentEndpoints = Object.freeze({
  uploadServiceDocument: '/Document/service',
  uploadStageDocument: '/Document/stage',
  uploadCustomerDocument: '/Document/customer',
  getServiceDocuments: '/Document/service',
  getStageDocuments: '/Document/stage',
  getCustomerDocuments: '/Document/customer',
  getAllDocuments: '/Document',
  downloadDocument: '/Document/download',
  verifyDocument: '/Document/verify',
  deleteDocument: '/Document/delete',
});

export const uploadServiceDocument = (
  serviceId: number,
  request: IDocumentUploadRequest
): Promise<Response> => {
  const formData = new FormData();
  formData.append('file', request.file);
  formData.append('documentType', request.documentType.toString());
  if (request.description) {
    formData.append('description', request.description);
  }
  if (request.serviceStageId) {
    formData.append('serviceStageId', request.serviceStageId.toString());
  }

  return http.post({
    url: `${documentEndpoints.uploadServiceDocument}/${serviceId}/upload`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};

export const uploadStageDocument = (
  serviceStageId: number,
  request: IDocumentUploadRequest
): Promise<Response> => {
  const formData = new FormData();
  formData.append('file', request.file);
  formData.append('documentType', request.documentType.toString());
  if (request.description) {
    formData.append('description', request.description);
  }

  return http.post({
    url: `${documentEndpoints.uploadStageDocument}/${serviceStageId}/upload`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};

export const uploadCustomerDocument = (
  customerId: number,
  request: IDocumentUploadRequest
): Promise<Response> => {
  const formData = new FormData();
  formData.append('file', request.file);
  formData.append('documentType', request.documentType.toString());
  if (request.description) {
    formData.append('description', request.description);
  }

  return http.post({
    url: `${documentEndpoints.uploadCustomerDocument}/${customerId}/upload`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};

export const getServiceDocuments = (serviceId: number): Promise<Response> => {
  return http.get({
    url: `${documentEndpoints.getServiceDocuments}/${serviceId}`
  });
};

export const getStageDocuments = (serviceStageId: number): Promise<Response> => {
  return http.get({
    url: `${documentEndpoints.getStageDocuments}/${serviceStageId}`
  });
};

export const getCustomerDocuments = (customerId: number): Promise<Response> => {
  return http.get({
    url: `${documentEndpoints.getCustomerDocuments}/${customerId}`
  });
};

export const getAllDocuments = (): Promise<Response> => {
  return http.get({
    url: documentEndpoints.getAllDocuments
  });
};

export const downloadDocument = (documentId: number, category: DocumentCategory): Promise<Response> => {
  return http.get({
    url: `${documentEndpoints.downloadDocument}/${documentId}`,
    params: { category },
    responseType: 'blob'
  });
};

export const verifyDocument = (
  documentId: number,
  isVerified: boolean,
  verificationNotes?: string
): Promise<Response> => {
  return http.put({
    url: `${documentEndpoints.verifyDocument}/${documentId}`,
    data: { isVerified, verificationNotes }
  });
};

export const deleteDocument = (documentId: number): Promise<Response> => {
  return http.delete({
    url: `${documentEndpoints.deleteDocument}/${documentId}`
  });
};