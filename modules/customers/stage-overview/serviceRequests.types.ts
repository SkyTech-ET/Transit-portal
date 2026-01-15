export interface IServiceRequest {
  id: string;
  customer: string;
  type: "Multimodal" | "Unimodal";
  status: "Pending" | "Ongoing" | "Completed" | "Blocked";
  requestedOn: string;
  executor: {
    name: string;
    avatar?: string;
  };
  updates: string;
}

export interface IStageOverview {
  staffName: string;
  role: string;
  stage: string;
  action: string;
  time: string;
  status: "Done" | "Pending";
  notes?: string;
  file?: string;
}

export interface IServiceRequestStore {
  requests: IServiceRequest[];
  stages: IStageOverview[];
  loading: boolean;
  getAllRequests: () => Promise<void>;
}


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
}

export interface IServicePayload {
  serviceNumber: string;
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

export interface IServiceState {
  services: IService[];
  currentService: IService | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export interface IServiceActions {
  getAllServices: (filters?: IServiceFilters) => Promise<void>;
  getServiceById: (id: number) => Promise<void>;
  createService: (payload: IServicePayload) => Promise<void>;
  createCustomerService: (payload: IServicePayload) => Promise<void>;
  updateService: (id: number, payload: Partial<IServicePayload>) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
  updateServiceStatus: (id: number, status: ServiceStatus) => Promise<void>;
  assignService: (id: number, userId: number, role: 'caseExecutor' | 'assessor') => Promise<void>;
  getServiceStages: (serviceId: number) => Promise<void>;
  updateStageStatus: (stageId: number, status: StageStatus, notes?: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentService: (service: IService | null) => void;
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
  Cancelled = 8
}

export enum ServiceStage {
  PrepaymentInvoice = 1,
  DropRisk = 2,
  DeliveryOrder = 3,
  Inspection = 4,
  Emergency = 5,
  Exit = 6,
  Transportation = 7,
  Clearance = 8,
  LocalPermission = 9,
  Arrival = 10,
  StoreSettlement = 11
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

// Import IUser from user module
import { IUser } from '../../user/user.types';

