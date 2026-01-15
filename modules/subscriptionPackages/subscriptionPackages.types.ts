//import { ISubscription } from "../subscription";
import { RecordStatus } from "../common/common.types";

export interface ISubscriptionPackage {
  id: number;
  planName: string;
  price: number;
  discount: number;
  numberOfMonths: number;
 
}



export interface ISubscriptionPackagePayload {
     
    id: number;
    planName: string;
    price: number;
    discount: number;
    numberOfMonths: number;
   
}

export interface ISubscriptionPackageState {
  loading: boolean;
  searchTerm: string;
  listLoading: boolean
  error: string | null;
  subscriptionPackages: ISubscriptionPackage[];
  subscriptionPackage: ISubscriptionPackage | null;
  filteredSubscriptionPackages: ISubscriptionPackage[]
}

export interface ISubscriptionPackageActions {
  addSubscriptionPackage: (payload: ISubscriptionPackagePayload) => Promise<any>;
  updateSubscriptionPackage: (payload: ISubscriptionPackagePayload, id: number) => Promise<any>;
  deleteSubscriptionPackage: (id: number) => Promise<any>;

  getSubscriptionPackage: (id: number) => Promise<any>;
 getSubscriptionPackages: (status: RecordStatus, searchTerm?: string) => Promise<any>;
}

export type SubscriptionPackageStore = ISubscriptionPackageState & ISubscriptionPackageActions;
