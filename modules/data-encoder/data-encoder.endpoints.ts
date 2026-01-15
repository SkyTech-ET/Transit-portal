import http from "@/modules/utils/axios";

/* ================= DASHBOARD ================= */

export const getDataEncoderDashboard = async () => {
  return http.get({
    url: "/DataEncoder/GetDashboard",
  });
};

/* ================= CUSTOMERS ================= */

export const getAllCustomers = async (recordStatus: number) => {
  return http.get({
    url: `/DataEncoder/GetAllCustomers/${recordStatus}`,
  });
};

/*export const createCustomer = async (payload: any) => {
  return http.post({
    url: "/DataEncoder/CreateCustomer",
    data: payload,
  });
}; */
export const createCustomer = async (formData: FormData) => {
  return http.post({
    url: "/DataEncoder/CreateCustomer",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateCustomer = async (payload: any) => {
  return http.put({
    url: "/DataEncoder/UpdateCustomer",
    data: payload,
  });
};
