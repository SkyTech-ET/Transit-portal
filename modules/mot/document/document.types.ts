export interface IDocument {
  id: number;
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

export interface IServiceDocument extends IDocument {
  serviceId: number;
  serviceStageId?: number;
  serviceStage?: IServiceStageExecution;
}

export interface IStageDocument extends IDocument {
  serviceStageId: number;
  serviceStage?: IServiceStageExecution;
}

export interface ICustomerDocument extends IDocument {
  customerId: number;
  customer?: ICustomer;
}

export interface IDocumentUploadRequest {
  file: File;
  documentType: DocumentType;
  description?: string;
  serviceStageId?: number;
}

export interface IDocumentState {
  documents: IDocument[];
  currentDocument: IDocument | null;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
}

export interface IDocumentActions {
  getAllDocuments: () => Promise<void>;
  getServiceDocuments: (serviceId: number) => Promise<void>;
  getStageDocuments: (serviceStageId: number) => Promise<void>;
  getCustomerDocuments: (customerId: number) => Promise<void>;
  uploadServiceDocument: (serviceId: number, request: IDocumentUploadRequest) => Promise<void>;
  uploadStageDocument: (serviceStageId: number, request: IDocumentUploadRequest) => Promise<void>;
  uploadCustomerDocument: (customerId: number, request: IDocumentUploadRequest) => Promise<void>;
  downloadDocument: (documentId: number, category: DocumentCategory) => Promise<void>;
  verifyDocument: (documentId: number, isVerified: boolean, verificationNotes?: string) => Promise<void>;
  deleteDocument: (documentId: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentDocument: (document: IDocument | null) => void;
  setUploadProgress: (progress: number) => void;
}

// Enums
export enum DocumentType {
  Invoice = 1,
  BillOfLading = 2,
  Certificate = 3,
  Permit = 4,
  Photo = 5,
  BusinessLicense = 6,
  TaxCertificate = 7,
  IdentityDocument = 8,
  AddressProof = 9,
  BankStatement = 10,
  Other = 11
}

export enum DocumentCategory {
  Service = 1,
  Stage = 2,
  Customer = 3
}

// Import types
import { IUser } from '../../user/user.types';
import { IServiceStageExecution } from '../service/service.types';
import { ICustomer } from '../customer/customer.types';

