import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";

import { getToken } from "../token/client-token.storage";
import { config } from "./config";

interface ApiResponse<T> {
  statusCode?: number;
  error?: boolean;
  errors?: string[] | Record<string, string[]>;
  message?: string;
  response?: {
    data: T | null;
  };
}


const service: AxiosInstance = axios.create({
  baseURL: config.base_url.base,
  timeout: config.request_timeout,
});

// Request
service.interceptors.request.use(
  async (config: any) => {
    const token = await getToken();
    console.log('🔍 DEBUG: Making API request to:', config.url);
    console.log('🔍 DEBUG: Token available:', !!token);
    console.log('🔍 DEBUG: Token preview:', token ? token.substring(0, 20) + '...' : 'No token');

    // Set Auth token
    if (token != null) {
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }

    // Setup request for POST
    if (config.method === "post" && (config.headers as any)["Content-Type"] === "application/x-www-form-urlencoded") {
      config.data = JSON.stringify(config.data);
    }
    
    // Debug FormData requests and ensure proper Content-Type
    if ((config.method === "post" || config.method === "put") && config.data instanceof FormData) {
      console.log('🔍 DEBUG: Axios interceptor - FormData detected for', config.method.toUpperCase());
      console.log('🔍 DEBUG: Axios interceptor - URL:', config.url);
      console.log('🔍 DEBUG: Axios interceptor - Headers before fix:', config.headers);
      
      // Remove Content-Type header to let axios set it automatically for FormData
      delete (config.headers as any)["Content-Type"];
      
      console.log('🔍 DEBUG: Axios interceptor - Headers after fix:', config.headers);
    }

    // Setup request for GET
    if (config.method === "get" && config.params) {
      let url = config.url as string;
      url += "?";
      const keys = Object.keys(config.params);
      for (const key of keys) {
        if (config.params[key] !== void 0 && config.params[key] !== null) {
          url += `${key}=${encodeURIComponent(config.params[key])}&`;
        }
      }
      url = url.substring(0, url.length - 1);
      config.params = {};
      config.url = url;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
 service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    const data = response.data;
    console.log('🔍 DEBUG: Raw API response:', data);
    console.log('🔍 DEBUG: Response type:', typeof data);
    console.log('🔍 DEBUG: Is array?', Array.isArray(data));
    
    // If the response is directly an array (like the users API), return it
    if (Array.isArray(data)) {
      console.log('🔍 DEBUG: Returning array data directly:', data.length, 'items');
      return data;
    }
    
    // If it's an object with statusCode (standard API response format)
    if (data && typeof data === 'object' && data.statusCode === 200 && !data.error) {
      if (data.response?.data !== null) {
        let responseData = data.response.data;
        console.log('🔍 DEBUG: Returning data from response.data:', responseData);
        return responseData;
      } else {
        console.log('🔍 DEBUG: No data available in response');
        return Promise.reject('No data available');
      }
    } else if (data && data.statusCode == 401) {
      console.log('🔍 DEBUG: 401 Unauthorized - redirecting to login');
      window.location.href = "/auth/login";
      window.location.reload();
    } else {
      console.log('🔍 DEBUG: Unexpected response:', data);
      return Promise.reject(data?.message || 'Unexpected response structure');
    }
  },
  (error: AxiosError<ApiResponse<any>>) => {
    console.error('🔍 DEBUG: API request failed:', error);
    let errorMessage = 'An unexpected error occurred';
    if (error.response) {
      const data = error.response.data;
      console.error('🔍 DEBUG: Error response data:', data);

      if (data.message) {
        errorMessage = data.message;
      } else if (data.errors) {
        if (Array.isArray(data.errors)) {
          errorMessage = data.errors.join(', ');
        } else {
          errorMessage = Object.values(data.errors).flat().join(', ');
        }
      } else {
        errorMessage = 'An unexpected error structure was received';
      }
    }

    return Promise.reject(errorMessage);
  }
); 

/* service.interceptors.response.use(
  (response: AxiosResponse<any>) => {

    // ✅ Allow file downloads to pass through untouched
    if (response.config.responseType === "blob") {
      return response.data;
    }

    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    }

    if (data && typeof data === "object" && data.statusCode === 200 && !data.error) {
      return data.response?.data ?? null;
    }

    if (data?.statusCode === 401) {
      window.location.href = "/auth/login";
      window.location.reload();
    }

    return Promise.reject(data?.message || "Unexpected response structure");
  },
) */


export { service };
