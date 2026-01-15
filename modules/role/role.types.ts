import { RecordStatus } from "../common/common.types";
import { IPrivilege } from "../privilege/privilege.types";

export interface IRole {
  name: any;
  roleId: number;
  id: number;
  roleName: string;
  description: string;
  recordStatus: number;
  privileges?: IPrivilege[];
}

export interface IRolePayload {
  name: string;
  description: string;
  recordStatus: number;
  privileges?: number[];
}



export interface IRoleState {
  roles: IRole[];
  role: IRole | null;
  error: string | null;
  loading: boolean;
  listLoading: boolean
}

export interface IRoleActions {
  addRole: (payload: IRolePayload) => Promise<any>;
  updateRole: (payload: IRolePayload, id: number) => Promise<any>;
  deleteRole: (id: number) => Promise<any>;

  getRole: (id: number) => Promise<any>;
  getRoles: (status: RecordStatus) => Promise<any>;
}

export type IRoleStore = IRoleState & IRoleActions;