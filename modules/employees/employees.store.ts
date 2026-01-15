import { create } from "zustand";
import { message } from "antd";
import {
  IEmployeeStore,
  IEmployee,
  IEmployeePayload,
  IEmployeeFilters,
} from "./employees.types";
import * as employeeEndpoints from "./employees.endpoints";

export const useEmployeeStore = create<IEmployeeStore>((set, get) => ({
  employees: [],
  loading: false,
  error: null,

  getEmployees: async (filters?: IEmployeeFilters) => {
    set({ loading: true, error: null });
    try {
      const response = await employeeEndpoints.getEmployees(filters);
      const data = await response.json();
      const employees = data.response?.data || [];
      set({ employees, loading: false });
    } catch (error: any) {
      message.error("Failed to fetch employees");
      set({ loading: false, error: error.message });
    }
  },

  createEmployee: async (payload: IEmployeePayload) => {
    set({ loading: true });
    try {
      const response = await employeeEndpoints.createEmployee(payload);
      const data = await response.json();
      const newEmployee = data.response?.data as IEmployee;
      set((state) => ({
        employees: [newEmployee, ...state.employees],
        loading: false,
      }));
      message.success("Employee added successfully");
    } catch (error: any) {
      set({ loading: false });
      message.error("Failed to add employee");
    }
  },

  updateEmployee: async (id: number, payload: IEmployeePayload) => {
    set({ loading: true });
    try {
      const response = await employeeEndpoints.updateEmployee(id, payload);
      const data = await response.json();
      const updated = data.response?.data as IEmployee;
      set((state) => ({
        employees: state.employees.map((e) =>
          e.id === id ? updated : e
        ),
        loading: false,
      }));
      message.success("Employee updated");
    } catch (error: any) {
      set({ loading: false });
      message.error("Failed to update employee");
    }
  },

  deleteEmployee: async (id: number) => {
    set({ loading: true });
    try {
      await employeeEndpoints.deleteEmployee(id);
      set((state) => ({
        employees: state.employees.filter((e) => e.id !== id),
        loading: false,
      }));
      message.success("Employee deleted");
    } catch (error: any) {
      set({ loading: false });
      message.error("Failed to delete employee");
    }
  },
}));
