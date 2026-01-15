import { create } from 'zustand';
import { notification } from 'antd';
import { 
  IReportStore, 
  IReportFilters,
  IServiceStatisticsReport,
  IMonthlyServiceReport,
  ICustomerStatisticsReport,
  ISystemReport
} from './report.types';
import {
  getServiceStatistics,
  getMonthlyReport,
  getCustomerStatistics,
  getSystemReport
} from './report.endpoints';

const useReportStore = create<IReportStore>((set, get) => ({
  // State
  serviceStatistics: null,
  monthlyReports: [],
  customerStatistics: null,
  systemReport: null,
  loading: false,
  error: null,

  // Actions
  getServiceStatistics: async (filters?: IReportFilters) => {
    set({ loading: true, error: null });
    try {
      const response = await getServiceStatistics(filters);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch service statistics');
      }
      
      set({ 
        serviceStatistics: response?.data?.payload as IServiceStatisticsReport,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch service statistics' 
      });
      console.error('Failed to fetch service statistics:', error.message);
    }
  },

  getMonthlyReport: async (year: number, month?: number) => {
    set({ loading: true, error: null });
    try {
      const response = await getMonthlyReport(year, month);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch monthly report');
      }
      
      set({ 
        monthlyReports: response?.data?.payload as IMonthlyServiceReport[] || [],
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch monthly report' 
      });
      console.error('Failed to fetch monthly report:', error.message);
    }
  },

  getCustomerStatistics: async (filters?: IReportFilters) => {
    set({ loading: true, error: null });
    try {
      const response = await getCustomerStatistics(filters);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch customer statistics');
      }
      
      set({ 
        customerStatistics: response?.data?.payload as ICustomerStatisticsReport,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch customer statistics' 
      });
      console.error('Failed to fetch customer statistics:', error.message);
    }
  },

  getSystemReport: async (filters?: IReportFilters) => {
    set({ loading: true, error: null });
    try {
      const response = await getSystemReport(filters);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch system report');
      }
      
      set({ 
        systemReport: response?.data?.payload as ISystemReport,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch system report' 
      });
      console.error('Failed to fetch system report:', error.message);
    }
  },
}));

export default useReportStore;

