import { IRole } from "../role/role.types";
import { RecordStatus } from "../common/common.types";
import { IVendor } from "../vendor/vendor.types";

export interface IUser {
  recordStatus: any;
  userRoles: boolean;
  isSuperAdmin: any;
  profilePhoto: any;
  id: number;
  email: string;
  roles: IRole[];
  lastName: string;
  username: string;
  firstName: string;
  phoneNumber: string;
  organizationId: IVendor;
  organization: IVendor;
}


export interface IUserPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: number;
  organization: IVendor[];

  organizationId: number;
  roles: number[];
  currentPage: number;
  totalPage: number;
}

export interface IAdditionalParam {
  userId: any | null,
  roles: any[]
  orgId: any | null
}

export type IUserState = {
  users: IUser[];
  loading: boolean;
  orgUsers: IUser[];
  user: IUser | null;
  currentUser: IUser | null;
  searchTerm: string;
  error: string | null;
  listLoading: boolean;
  filteredUsers: IUser[];
  additionalParam: IAdditionalParam | null
  currentPage: number;  
  totalPages: number; 
};

export type IUserActions = {
  addUser: (payload: IUserPayload) => Promise<void>;
  updateUser: (payload: IUserPayload, id: number) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;

  getUsers: (status: RecordStatus, pageNumber?: number,searchTerm?: string) => Promise<any>;
  getUsersByOrg: (id: number, status: RecordStatus) => Promise<any>;
  getUser: (id: number) => Promise<any>;
  setSearchTerm: (searchTerm: string) => void
  setAdditionalParams: (params: IAdditionalParam) => void;
};

export type IUserStore = IUserState & IUserActions;
