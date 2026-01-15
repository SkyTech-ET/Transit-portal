import { RecordStatus } from "../common/common.types";

export interface IPrivilege {
  id: number;
  action: string;
  description: string;
  recordStatus: number;
}

export interface IPrivilegePayload {
  name: string;
  description: string;
  recordStatus: number;
}


export interface IPrivilegeState {
  privileges: IPrivilege[];
  privilege: IPrivilege | null;
  error: string | null;
  loading: boolean;
  listLoading: boolean
}

export interface IPrivilegeActions {
  addPrivilege: (payload: IPrivilegePayload) => Promise<void>;
  updatePrivilege: (payload: IPrivilegePayload, id: number) => Promise<void>;

  deletePrivilege: (id: number) => Promise<void>;

  getPrivileges: (status: RecordStatus) => Promise<any>;
  getPrivilege: (id: number) => Promise<any>;

}

export type IPrivilegeStore = IPrivilegeState & IPrivilegeActions;
