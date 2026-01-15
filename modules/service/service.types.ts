//import { ISubscription } from "../subscription";
import { RecordStatus } from "../common/common.types";

export interface IService {
  id: number;
  Name: string;
  description: string;
  rating: number;
  recordStatus:   number;
  organizationId: number;
  userId:number;
  
}



export interface IServicePayload {
    id: number;
    Name: string;
    description: string;
    rating: number;
    recordStatus:  undefined;
    organizationId: number;
    userId:number;
}

export interface IServiceState {
  loading: boolean;
  searchTerm: string;
  listLoading: boolean
  error: string | null;
  services: IService[];
  service: IService | null;
  filteredServices: IService[]
 // invoiceColumns: any[]
}

export interface IServiceActions {
  addService: (payload: IServicePayload) => Promise<any>;

  updateService: (payload: IServicePayload, id: number) => Promise<any>;
  deleteService: (id: number) => Promise<any>;

  getService: (id: number) => Promise<any>;
  getServices: (orgId:number,status: RecordStatus, searchTerm?: string) => Promise<any>;
}

export type ServiceStore = IServiceState & IServiceActions;
