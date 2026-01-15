import { IService } from '../service/service.types';
import { ICustomer } from '../customer/customer.types';

export interface IManagerDashboard {
  totalServices: number;
  pendingServices: number;
  inProgressServices: number;
  completedServices: number;
  totalCustomers: number;
  verifiedCustomers: number;
  totalStaff: number;
  activeStaff: number;
  recentServices: IService[];
  monthlyServiceStats: IMonthlyServiceStat[];
}

export interface IMonthlyServiceStat {
  year: number;
  month: number;
  totalServices: number;
  completedServices: number;
  completionRate: number;
}

export interface ICaseExecutorDashboard {
  assignedServices: number;
  pendingServices: number;
  completedServices: number;
  blockedStages: number;
  todaysTasks: any[];
  urgentNotifications: any[];
}

export interface IAssessorDashboard {
  pendingCustomerApprovals: number;
  pendingServiceReviews: number;
  servicesUnderOversight: number;
  completedReviewsToday: number;
  recentCustomerApprovals: ICustomer[];
  recentServiceReviews: IService[];
}

export interface IDataEncoderDashboard {
  totalCustomersCreated: number;
  pendingCustomerApprovals: number;
  totalServicesCreated: number;
  pendingServiceApprovals: number;
  draftServices: number;
  recentCustomers: ICustomer[];
  recentServices: IService[];
}

export interface IDashboardState {
  managerDashboard: IManagerDashboard | null;
  caseExecutorDashboard: ICaseExecutorDashboard | null;
  assessorDashboard: IAssessorDashboard | null;
  dataEncoderDashboard: IDataEncoderDashboard | null;
  loading: boolean;
  error: string | null;
}

export interface IDashboardActions {
  getManagerDashboard: () => Promise<void>;
  getCaseExecutorDashboard: () => Promise<void>;
  getAssessorDashboard: () => Promise<void>;
  getDataEncoderDashboard: () => Promise<void>;
}

export type IDashboardStore = IDashboardState & IDashboardActions;

