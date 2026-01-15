import { RecordStatus } from "../common/common.types";

export interface IDataEncoder {
  id: number;
  businessName:string;
tinNumber:string;
businessLicense:string;
businessAddress:string;
city:string;
state:string;
postalCode:string;
contactPerson:string;
contactPhone:string;
contactEmail:string;
businessType:string;
importLicense:string;
importLicenseExpiry:string;
userId:number;

}

export interface IDataEncoderPayload {
businessName:string;
tinNumber:string;
businessLicense:string;
businessAddress:string;
city:string;
state:string;
postalCode:string;
contactPerson:string;
contactPhone:string;
contactEmail:string;
businessType:string;
importLicense:string;
importLicenseExpiry:string;
}


export interface IDataEncoderState {
  dataEncoders: IDataEncoder[];
  dataEncoder: IDataEncoder | null;
  error: string | null;
  loading: boolean;
  listLoading: boolean
}

export interface IDataEncoderActions {
  addDataEncoder: (payload: IDataEncoderPayload) => Promise<void>;
  updateDataEncoder: (payload: IDataEncoderPayload, id: number) => Promise<void>;

  deleteDataEncoder: (id: number) => Promise<void>;

  getDataEncoders: (status: RecordStatus) => Promise<any>;
  getDataEncoder: (id: number) => Promise<any>;

}

export type IDataEncoderStore = IDataEncoderState & IDataEncoderActions;
