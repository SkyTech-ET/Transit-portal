import axios from "axios";
import type { ICustomer, ICustomerPayload } from "./customer.types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getAllCustomers = async (): Promise<{ data: ICustomer[] }> => {
  const res = await axios.get(`${API_BASE}/customers`);
  return { data: res.data };
};

export const addCustomer = async (payload: ICustomerPayload): Promise<{ data: ICustomer }> => {
  const res = await axios.post(`${API_BASE}/customers`, payload);
  return { data: res.data };
};
