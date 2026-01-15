import { RecordStatus } from "../common/common.types";

export interface IOrganization {
  orgName: string;
  orgAddress: string;
}

export interface IUser {
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  userPhoneNumber: string;
}

export interface ISubscriptionBase {
  id: number;
  planName: string;
  price: number;
  effectiveDateFrom: string | Date;
  effectiveDateTo: string | Date;
  recordStatus: number;
  accountStatus: number;
  requestStatus: number;

}

export interface ISubscriptionDetails extends ISubscriptionBase {}

export interface ISubscriptionPayload extends ISubscriptionBase {
  organizationId: number;
}

export interface ISubscriptionTableRow {
  user: IUser;
  organizationId?: number;
  organization: IOrganization;
  subscription: ISubscriptionDetails;
}

export interface ISubscriptionState {
  loading: boolean;
  searchTerm: string;
  listLoading: boolean;
  success: boolean;
  error: string | null;
  subscriptions: ISubscriptionTableRow[];
  subscription: ISubscriptionTableRow | null;
  filteredSubscriptions: ISubscriptionTableRow[];
  currentPage: number;  
  totalPages: number; 
}

export interface ISubscriptionActions {
  addSubscription: (payload: ISubscriptionPayload) => Promise<ISubscriptionDetails>;
  updateSubscription: (payload: ISubscriptionPayload, id: number) => Promise<ISubscriptionDetails>;
  updateAccStatus: (payload: ISubscriptionPayload, id: number) => Promise<ISubscriptionDetails>;
  updateReqStatus: (payload: ISubscriptionPayload, id: number) => Promise<ISubscriptionDetails>;
  deleteSubscription: (id: number) => Promise<void>;
  getSubscription: (id: number) => Promise<ISubscriptionDetails>;
  setSearchTerm: (searchTerm: string) => void
  getSubscriptions: (status: RecordStatus,pageNumber?: number, searchTerm?: string) => Promise<ISubscriptionTableRow[]>;
}

export type SubscriptionStore = ISubscriptionState & ISubscriptionActions;
