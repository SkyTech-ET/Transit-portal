import { config } from "./config";
import { service } from "./service";

const { default_headers } = config;

const http = (option: any) => {
  const { url, method, params, data, headersType, responseType } = option;
  return service({
    url: url,
    method,
    params,
    data,
    responseType: responseType,
    headers: {
      "Content-Type": headersType || default_headers,
    },
  });
};
export const fetchServiceById = async (id: number): Promise<Response> => {
  const url = `/Service/${id}`;
  return service({
    url,
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};


export default {
  get: <T = any>(option: any) => {
    return http({ method: "get", ...option }) as unknown as T;
  },
  post: <T = any>(option: any) => {
    return http({ method: "post", ...option }) as unknown as T;
  },
  delete: <T = any>(option: any) => {
    return http({ method: "delete", ...option }) as unknown as T;
  },
  put: <T = any>(option: any) => {
    return http({ method: "put", ...option }) as unknown as T;
  },
};
