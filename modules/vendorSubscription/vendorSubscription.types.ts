import { RecordStatus } from "../common/common.types";

export interface IVendorSubscriptionDetails {
  id: number;
  planName: string;
  price: number;
  effectiveDateFrom: string | Date;
  effectiveDateTo: string | Date;
  recordStatus: number;
  accountStatus: number;
  requestStatus: number;
  subscriptionPackageId: number
}

export interface IVendorSubscriptionPayload {
  id: number;
  organizationId: number;
  subscriptionPackageId:any;
}

export interface IVendorSubscriptionTableRow {
  organizationId?: number;
  vendorSubscription: IVendorSubscriptionDetails;
}

export interface IVendorSubscriptionState {
  loading: boolean;
  searchTerm: string;
  listLoading: boolean;
  success: boolean;
  error: string | null;
  subscription:IVendorSubscriptionDetails|null
  vendorSubscriptions: IVendorSubscriptionTableRow[];
  vendorSubscription: IVendorSubscriptionTableRow | null;
  filteredVendorSubscriptions: IVendorSubscriptionTableRow[];
  currentPage: number;  
  totalPages: number; 
}

export interface IVendorSubscriptionActions {
  addVendorSubscription: (payload: IVendorSubscriptionPayload) => Promise<IVendorSubscriptionDetails>;
  updateVendorSubscription: (payload: IVendorSubscriptionPayload, id: number) => Promise<IVendorSubscriptionDetails>;
  updateAccStatus: (payload: IVendorSubscriptionPayload, id: number) => Promise<IVendorSubscriptionDetails>;
  updateReqStatus: (payload: IVendorSubscriptionPayload, id: number) => Promise<IVendorSubscriptionDetails>;
  deleteVendorSubscription: (id: number, organizationId: number) => Promise<void>;
  getVendorSubscription: (id: number) => Promise<IVendorSubscriptionDetails>;
  setSearchTerm: (searchTerm: string) => void
 getVendorSubscriptions: (id:number,recordStatus: RecordStatus, searchTerm?: string) => Promise<IVendorSubscriptionTableRow[]>;
}

export type VendorSubscriptionStore = IVendorSubscriptionState & IVendorSubscriptionActions;
