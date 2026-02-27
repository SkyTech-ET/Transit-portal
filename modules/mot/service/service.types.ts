export interface IService {
  id: number;
  serviceNumber: string;
  itemDescription: string;
  routeCategory: string;
  declaredValue: number;
  taxCategory: string;
  countryOfOrigin: string;
  serviceType: ServiceType;
  status: ServiceStatus;
  riskLevel: RiskLevel;
  customerId: number;
  assignedCaseExecutorId?: number;
  assignedAssessorId?: number;
  createdByDataEncoderId: number;
  customer?: IUser;
  assignedCaseExecutor?: IUser;
  assignedAssessor?: IUser;
  createdByDataEncoder?: IUser;
  stages?: IServiceStageExecution[];
  currentStage?: number | null;
  documents?: IServiceDocument[];
  messages?: IServiceMessage[];
  registeredDate: string;
  lastUpdateDate: string;
}

export interface IServiceStageExecution {
  id: number;
  serviceId: number;
  stage: ServiceStage;
  status: StageStatus;
  startDate?: string;
  endDate?: string;
  notes?: string;
  assignedUserId?: number;
  assignedUser?: IUser;
  documents?: IStageDocument[];
  stageComments?: {
    comment: string;
    createdDate: string;
    isVisibleToCustomer: boolean;
  }[];
  riskLevel?: RiskLevel;
  stageId: number;
  stageName: string;
  stageExecutorRole: "CaseExecutor" | "Assessor" | "DataEncoder" | "SuperAdmin";
  completedAt?: string | null;
  updatedAt?: string | null;
  updatedByUserId?: number | null;
}

export interface IServiceDocument {
  id: number;
  serviceId: number;
  fileName: string;
  filePath: string;
  originalFileName: string;
  fileExtension: string;
  fileSize: number;
  contentType: string;
  documentType: DocumentType;
  uploadedByUserId: number;
  uploadedByUser?: IUser;
  serviceStageId?: number;
  serviceStage?: IServiceStageExecution;
  description?: string;
  isVerified: boolean;
  verificationNotes?: string;
  uploadedDate: string;
}

export interface IServiceMessage {
  id: number;
  serviceId: number;
  senderId: number;
  sender?: IUser;
  recipientId?: number;
  recipient?: IUser;
  subject: string;
  content: string;
  type: MessageType;
  isRead: boolean;
  sentDate: string;
}

export interface IStageDocument {
  id: number;
  serviceStageId: number;
  fileName: string;
  filePath: string;
  originalFileName: string;
  fileExtension: string;
  fileSize: number;
  contentType: string;
  documentType: DocumentType;
  uploadedByUserId: number;
  uploadedByUser?: IUser;
  verifiedByUserId?: number;
  verifiedByUser?: IUser;
  description?: string;
  isRequired: boolean;
  isVerified: boolean;
  verificationNotes?: string;
  uploadedDate: string;

  uploadedBy: "Customer" | "CaseExecutor";
}

export interface IServicePayload {
  serviceNumber?: string;
  itemDescription: string;
  routeCategory: string;
  declaredValue: number;
  taxCategory: string;
  countryOfOrigin: string;
  serviceType: ServiceType;
  customerId: number;
  assignedCaseExecutorId?: number;
  assignedAssessorId?: number;
}

export interface IServiceAssignmentPayload {
  serviceId: number;
  assignedCaseExecutorId: number;
  assignedAssessorId: number;
  assignmentNotes?: string | null;
}

export interface IServiceState {
  services: IService[];
  currentService: IService | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  stageExecutions: IServiceStageExecution[];
  stages: ServiceStage[];
  stageTransports: IStageTransport[];
  stageTransportLoading: boolean;
}

export interface IServiceActions {
  getAllServices: (filters?: IServiceFilters) => Promise<void>;
  getServiceById: (id: number) => Promise<void>;
  createService: (payload: IServicePayload) => Promise<any>;
  createCustomerService: (payload: IServicePayload) => Promise<void>;
  updateService: (id: number, payload: Partial<IServicePayload>) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
  updateServiceStatus: (id: number, status: ServiceStatus) => Promise<void>;
  /* assignService: (serviceId: number, assignedCaseExecutorId: number, assignedAssessorId: number, assignmentNotes?: string | null) => Promise<void>; */
  assignService: (payload: IServiceAssignmentPayload) => Promise<void>;
  getServiceStages: (serviceId: number) => Promise<void>;
  updateStageStatus: (stageId: number, status: StageStatus, comments?: string | null) => Promise<void>;
  getMyServices: (status?: number) => Promise<void>;
  getServiceDetails: (serviceId: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentService: (service: IService | null) => void; 
  getCustomerServices: (customerId: number, recordStatus?: number, filters?: IServiceFilters) => Promise<IService[]>;
  uploadStageDocument: (serviceId: number, stageExecutionId: number, file: File, documentType: DocumentType ) => Promise<any>; 
  getAssignedServices: (id: number, recordStatus?: number, filters?: IServiceFilters) => Promise<IService[]>;
  getAssignedServiceById: (serviceId: number, executorId: number) => Promise<void>;
  downloadStageDocument: (documentId: number, fileName: string) => Promise<void>;
  setRiskLevel: (serviceId: number, riskLevel: number, riskNotes?: string | null ) => Promise<void>;
  addStageComment: (serviceId: number, stageId: number, comment: string, isInternal?: boolean, isVisibleToCustomer?: boolean ) => Promise<void>;
  uploadCustomerStageDocument: (serviceId: number, stageExecutionId: number, file: File, documentType: DocumentType) => Promise<any>;
  createStageTransport: (data: FormData) => Promise<void>;
  getStageTransportsByStageId: (serviceStageId: number) => Promise<IStageTransport[]>;

}


export interface IStageTransport {
  id: number;
  fullName: string;
  licenceDocument: string;
  plateNumber: string;
  phoneNumber: string;
  productUnit: number;
  productAmount: number;
  serviceStageId: number;
  startDate: string;
  endDate: string;
  registeredDate: string;
}


export interface IServiceFilters {
  status?: ServiceStatus;
  serviceType?: ServiceType;
  riskLevel?: RiskLevel;
  customerId?: number;
  assignedCaseExecutorId?: number;
  assignedAssessorId?: number;
  createdByDataEncoderId?: number;
  search?: string;
  page?: number;
  pageSize?: number;
  recordStatus?: number;
}

// Enums
export enum ServiceType {
  Multimodal = 1,
  Unimodal = 2
}

export enum ServiceStatus {
  Draft = 1,
  Submitted = 2,
  UnderReview = 3,
  Approved = 4,
  InProgress = 5,
  Completed = 6,
  Rejected = 7,
  Cancelled = 8,
  Pending = 9
}

export enum ServiceStage {
  PrepaymentInvoice = 1,
  TransitPermission=2,
  Amendment=3,
  DropRisk = 4,
  DeliveryOrder = 5,
  WarehouseStatus=6,
  Inspection = 7,
  AssessmentandTaxPayment=8,
  Emergency = 9,
  ExitandStoragePayment = 10,
  Transportation = 11,
  LocalPermission = 12, // Unimodal only
  Arrival = 13, // Unimodal only
  Clearance = 14,
}

export enum StageStatus {
  NotStarted = 1,
  Pending = 2,
  InProgress = 3,
  Completed = 4,
  Blocked = 5,
  NeedsReview = 6
}

export enum RiskLevel {
  Blue = 1,
  Green = 2,
  Yellow = 3,
  Red = 4
}

export enum DocumentType {
  Invoice = 1,
  BillOfLading = 2,
  Certificate = 3,
  Permit = 4,
  Photo = 5,
  Other = 6
}

export enum MessageType {
  General = 1,
  StatusUpdate = 2,
  DocumentRequest = 3,
  Emergency = 4
}


export type IServiceStore = IServiceActions;
// Import IUser from user module
import { IUser } from '../../user/user.types';




