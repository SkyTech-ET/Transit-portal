export interface ICustomer {
  roles: any;
  id: number;
  userId: number;
  businessName: string;
  businessType: string;
  businessLicense: string;
  taxId: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  businessAddress: string;
  isVerified: boolean;
  verificationNotes?: string;
  verifiedByUserId?: number;
  verifiedByUser?: IUser;
  verifiedDate?: string;
  createdByDataEncoderId: number;
  createdByDataEncoder?: IUser;
  user?: IUser;
  documents?: ICustomerDocument[];
  services?: IService[];
  registeredDate: string;
  lastUpdateDate: string;
}

export interface ICustomerDocument {
  id: number;
  customerId: number;
  fileName: string;
  filePath: string;
  originalFileName: string;
  fileExtension: string;
  fileSize: number;
  contentType: string;
  documentType: DocumentType;
  uploadedByUserId: number;
  uploadedByUser?: IUser;
  description?: string;
  isVerified: boolean;
  verificationNotes?: string;
  uploadedDate: string;
}

export interface ICustomerPayload {
  userId: number;
  businessName: string;
  businessType: string;
  businessLicense: string;
  taxId: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  businessAddress: string;
}

export interface ICustomerApprovalRequest {
  isApproved: boolean;
  verificationNotes?: string;
}

export interface ICustomerState {
  customers: ICustomer[];
  currentCustomer: ICustomer | null;
  pendingCustomers: ICustomer[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export interface ICustomerActions {
  getAllCustomers: (filters?: ICustomerFilters) => Promise<void>;
  getCustomerById: (id: number) => Promise<void>;
  createCustomer: (payload: ICustomerPayload) => Promise<void>;
  updateCustomer: (id: number, payload: Partial<ICustomerPayload>) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
  getPendingCustomers: () => Promise<void>;
  approveCustomer: (customerId: number, request: ICustomerApprovalRequest) => Promise<void>;
  getCustomerDocuments: (customerId: number) => Promise<void>;
  uploadCustomerDocument: (customerId: number, file: File, documentType: DocumentType, description?: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentCustomer: (customer: ICustomer | null) => void;
}

export interface ICustomerFilters {
  isVerified?: boolean;
  businessType?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

// Enums
export enum DocumentType {
  BusinessLicense = 1,
  TaxCertificate = 2,
  IdentityDocument = 3,
  AddressProof = 4,
  BankStatement = 5,
  Other = 6
}

// Import types
import { IUser } from '../../user/user.types';
import { IService } from '../service/service.types';

