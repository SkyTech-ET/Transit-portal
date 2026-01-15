import { ISubscriptionPackage } from "../subscriptionPackages";
import { ITag } from "../tag";
import { RecordStatus } from "../common/common.types";

export interface IVendor {
  accountStatus: number;
  id: number;
  name: string;
  city: string;
  state: string;
  description: string;
  address: string;
  logoPath: string;
  recordStatus: number;
  organizationName: any;
  approvedOrders: number,
  numberOfOrders: number,
  numberOfPackages: number,
  numberOfUsers: number
  managerialEmailAddress: string | null
  subscriptionPackages: ISubscriptionPackage[]
  invoiceColumnNames: string
  subscriptions: ISubscriptionPackage[]
  tags: ITag[]

  //subscription: ISubscription | null
}


export interface IVendorPayload {
  name: string;
  city: string;
  state: string;
  description: string;
  address: string;
  logoPath: string;
  id: number | undefined
  managerialEmailAddress: string | null
  invoiceColumns: string
  recordStatus: undefined;
  currentPage: number;  
  totalPages: number; 
  organizationName: any;
  approvedOrders: number,
  numberOfOrders: number,
  numberOfPackages: number,
  numberOfUsers: number
}

export interface IVendorState {
  loading: boolean;
  searchTerm: string;
  listLoading: boolean
  error: string | null;
  vendors: IVendor[];
  vendor: IVendor | null| undefined;
  filteredVendors: IVendor[]
  currentPage: number;  
  totalPages: number; 
  success: boolean;
}

export interface IVendorPackagePayload {
  id: number,
  subscriptions: number[]
}

export interface IVendorActions {
  getVendors: (status: RecordStatus) => Promise<any>;
  getVendorsSort: (status: RecordStatus, pageNumber?: number,) => Promise<any>;
  getVendor: (id: number) => Promise<any>;
  updateAccStatus: (payload: IVendor, id: number) => Promise<IVendor>;

  addVendor: (payload: FormData) => Promise<any>;
  updateVendor: (payload: FormData, id:number) => Promise<any>;
  assignSubscription: (payload: IVendorPackagePayload) => Promise<any>;

  deleteVendor: (id: number) => Promise<any>;
  setSearchTerm: (searchTerm: string) => void
}

export type VendorStore = IVendorState & IVendorActions;
