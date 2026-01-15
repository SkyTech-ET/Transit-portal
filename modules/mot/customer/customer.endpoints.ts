import http from '@/modules/utils/axios';
import { ICustomer, ICustomerPayload, ICustomerFilters, ICustomerApprovalRequest, DocumentType } from './customer.types';

const customerEndpoints = Object.freeze({
  getAll: '/User/GetAll',
  getById: '/User/GetById',
  create: '/User/Create',
  update: '/User/Update',
  delete: '/User/Delete',
  getPendingApprovals: '/Assessor/customers/pending-approval',
  approve: '/Assessor/customers',
  getDocuments: '/Customer/documents',
  uploadDocument: '/Document/customer',
});

export const getAllCustomers = (filters?: ICustomerFilters): Promise<Response> => {
  return http.get({ 
    url: customerEndpoints.getAll, 
    params: filters 
  });
};

export const getCustomerById = (id: number): Promise<Response> => {
  return http.get({ 
    url: `${customerEndpoints.getById}/${id}` 
  });
};

export const createCustomer = (payload: ICustomerPayload): Promise<Response> => {
  return http.post({ 
    url: customerEndpoints.create, 
    data: payload 
  });
};

export const updateCustomer = (id: number, payload: Partial<ICustomerPayload>): Promise<Response> => {
  return http.put({ 
    url: `${customerEndpoints.update}/${id}`, 
    data: payload 
  });
};

export const deleteCustomer = (id: number): Promise<Response> => {
  return http.delete({ 
    url: `${customerEndpoints.delete}/${id}` 
  });
};

export const getPendingCustomerApprovals = (): Promise<Response> => {
  return http.get({ 
    url: customerEndpoints.getPendingApprovals 
  });
};

export const approveCustomer = (customerId: number, request: ICustomerApprovalRequest): Promise<Response> => {
  return http.put({ 
    url: `${customerEndpoints.approve}/${customerId}/approve`, 
    data: request 
  });
};

export const getCustomerDocuments = (customerId: number): Promise<Response> => {
  return http.get({ 
    url: `${customerEndpoints.getDocuments}/${customerId}` 
  });
};

export const uploadCustomerDocument = (
  customerId: number, 
  file: File, 
  documentType: DocumentType, 
  description?: string
): Promise<Response> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType.toString());
  if (description) {
    formData.append('description', description);
  }

  return http.post({ 
    url: `${customerEndpoints.uploadDocument}/${customerId}/upload`, 
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};

