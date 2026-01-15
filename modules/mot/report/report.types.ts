export interface IServiceStatisticsReport {
  totalServices: number;
  completedServices: number;
  pendingServices: number;
  inProgressServices: number;
  rejectedServices: number;
  averageProcessingTime: number;
  completionRate: number;
  startDate?: string;
  endDate?: string;
}

export interface IMonthlyServiceReport {
  year: number;
  month: number;
  totalServices: number;
  completedServices: number;
  pendingServices: number;
  inProgressServices: number;
  rejectedServices: number;
  completionRate: number;
}

export interface ICustomerStatisticsReport {
  totalCustomers: number;
  verifiedCustomers: number;
  pendingCustomers: number;
  verificationRate: number;
  startDate?: string;
  endDate?: string;
}

export interface ISystemReport {
  totalServices: number;
  completedServices: number;
  totalCustomers: number;
  verifiedCustomers: number;
  totalDocuments: number;
  totalMessages: number;
  serviceCompletionRate: number;
  customerVerificationRate: number;
  startDate?: string;
  endDate?: string;
  generatedDate: string;
}

export interface IReportFilters {
  startDate?: string;
  endDate?: string;
  year?: number;
  month?: number;
  status?: number;
}

export interface IReportState {
  serviceStatistics: IServiceStatisticsReport | null;
  monthlyReports: IMonthlyServiceReport[];
  customerStatistics: ICustomerStatisticsReport | null;
  systemReport: ISystemReport | null;
  loading: boolean;
  error: string | null;
}

export interface IReportActions {
  getServiceStatistics: (filters?: IReportFilters) => Promise<void>;
  getMonthlyReport: (year: number, month?: number) => Promise<void>;
  getCustomerStatistics: (filters?: IReportFilters) => Promise<void>;
  getSystemReport: (filters?: IReportFilters) => Promise<void>;
}

export type IReportStore = IReportState & IReportActions;

