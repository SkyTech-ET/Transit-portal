export interface IEmployee {
  id: number;
  name: string;
  employeeCode: string;
  position: string;
  department: string;
  status: "Active" | "Inactive" | "On Leave";
  email: string;
  avatarUrl?: string;
}

export interface IEmployeePayload {
  name: string;
  position: string;
  department: string;
  status: string;
  email: string;
}

export interface IEmployeeFilters {
  search?: string;
  department?: string;
  page?: number;
  pageSize?: number;
}

export interface IEmployeeState {
  employees: IEmployee[];
  loading: boolean;
  error: string | null;
}

export interface IEmployeeActions {
  getEmployees: (filters?: IEmployeeFilters) => Promise<void>;
  createEmployee: (payload: IEmployeePayload) => Promise<void>;
  updateEmployee: (id: number, payload: IEmployeePayload) => Promise<void>;
  deleteEmployee: (id: number) => Promise<void>;
}

export type IEmployeeStore = IEmployeeState & IEmployeeActions;
