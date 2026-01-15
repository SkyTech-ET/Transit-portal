export interface ICustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  status: "Active" | "Pending" | "Inactive";
  avatar?: string;
}

export interface ICustomerPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  status: string;
}

export interface ICustomerFilters {
  search?: string;
}

export interface ICustomerStore {
  customers: ICustomer[];
  loading: boolean;
  getCustomers: () => Promise<void>;
}
