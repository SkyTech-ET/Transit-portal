import http from "@/modules/utils/axios";
import { RecordStatus } from "../common/common.types";

const userEndpoints = Object.freeze({
  base: "/User",
  getAll: "/User/GetAll",
  getById: "/User/GetById",
  getByOrgId: "/User/GetByOrganization",

  create: "/User/Create",
  update: "/User/Update",
  delete: "/User/Delete",
});


export const getUsers = (recordStatus: RecordStatus = RecordStatus.Active, pageNumber: number = 1): Promise<Response> => {
  return http.get({ url: `${userEndpoints.getAll}/${recordStatus}`, params: { pageNumber: pageNumber } });
};

export const getUsersByOrg = (id: number, recordStatus: RecordStatus = RecordStatus.Active): Promise<Response> => {
  return http.get({ url: `${userEndpoints.getByOrgId}/${id}`,params: { recordStatus } });
};

export const getUser = (id: number): Promise<Response> => {
  return http.get({ url: userEndpoints.getById, params: { Id: id } });
};

export const addUser = (payload: any): Promise<Response> => {
  // Create FormData for multipart form submission
  const formData = new FormData();
  
  console.log('🔍 DEBUG: Creating FormData with payload:', payload);
  
  // Add all fields to FormData
  Object.keys(payload).forEach(key => {
    if (payload[key] !== null && payload[key] !== undefined) {
      if (key === 'ProfileFile' && payload[key] instanceof File) {
        console.log('🔍 DEBUG: Adding file to FormData:', key, payload[key]);
        formData.append(key, payload[key]);
      } else if (Array.isArray(payload[key])) {
        // Handle arrays (like Roles)
        console.log('🔍 DEBUG: Adding array to FormData:', key, payload[key]);
        payload[key].forEach((item: any) => {
          formData.append(key, item);
        });
      } else {
        console.log('🔍 DEBUG: Adding field to FormData:', key, payload[key]);
        formData.append(key, payload[key]);
      }
    }
  });
  
  // Log FormData contents
  console.log('🔍 DEBUG: FormData entries:');
  formData.forEach((value, key) => {
    console.log('🔍 DEBUG: FormData entry:', key, value);
  });
  
  return http.post({ 
    url: userEndpoints.create, 
    data: formData
    // Don't set Content-Type manually - let axios handle it for FormData
  });
};

export const updateUser = (payload: any, id: number): Promise<Response> => {
  // Create FormData for multipart form submission (same as create)
  const formData = new FormData();
  
  console.log('🔍 DEBUG: Creating FormData for update with payload:', payload);
  console.log('🔍 DEBUG: Update user ID:', id);
  
  // Add all fields to FormData
  Object.keys(payload).forEach(key => {
    if (payload[key] !== null && payload[key] !== undefined) {
      if (key === 'ProfileFile') {
        // Handle ProfileFile specially - it could be a File or an array (existing photo)
        if (payload[key] instanceof File) {
          console.log('🔍 DEBUG: Adding file to FormData for update:', key, payload[key]);
          formData.append(key, payload[key]);
        } else if (Array.isArray(payload[key]) && payload[key].length > 0) {
          // If it's an array (existing photo), don't add it to FormData for update
          console.log('🔍 DEBUG: Skipping existing photo array for update:', key, payload[key]);
        } else {
          console.log('🔍 DEBUG: Adding ProfileFile field to FormData for update:', key, payload[key]);
          formData.append(key, payload[key]);
        }
      } else if (Array.isArray(payload[key])) {
        // Handle arrays (like Roles)
        console.log('🔍 DEBUG: Adding array to FormData for update:', key, payload[key]);
        payload[key].forEach((item: any) => {
          formData.append(key, item);
        });
      } else {
        console.log('🔍 DEBUG: Adding field to FormData for update:', key, payload[key]);
        formData.append(key, payload[key]);
      }
    }
  });
  
  // Add the user ID for update
  formData.append('id', id.toString());
  
  // Log FormData contents
  console.log('🔍 DEBUG: FormData entries for update:');
  formData.forEach((value, key) => {
    console.log('🔍 DEBUG: FormData entry for update:', key, value);
  });
  
  return http.put({ 
    url: `${userEndpoints.update}`, 
    data: formData
    // Don't set Content-Type manually - let axios handle it for FormData
  });
};

export const deleteUser = (id: number): Promise<Response> => {
  return http.delete({ url: userEndpoints.delete, params: { id: id } });
};