import { create } from 'zustand';
import { notification } from 'antd';
import { 
  IDashboardStore,
  IManagerDashboard,
  ICaseExecutorDashboard,
  IAssessorDashboard,
  IDataEncoderDashboard
} from './dashboard.types';
import {
  getManagerDashboard,
  getCaseExecutorDashboard,
  getAssessorDashboard,
  getDataEncoderDashboard
} from './dashboard.endpoints';

const useDashboardStore = create<IDashboardStore>((set, get) => ({
  // State
  managerDashboard: null,
  caseExecutorDashboard: null,
  assessorDashboard: null,
  dataEncoderDashboard: null,
  loading: false,
  error: null,

  // Actions
  getManagerDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getManagerDashboard();
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch manager dashboard');
      }
      
      set({ 
        managerDashboard: response?.data?.payload as IManagerDashboard,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch manager dashboard' 
      });
      console.error('Failed to fetch manager dashboard:', error.message);
    }
  },

  getCaseExecutorDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getCaseExecutorDashboard();
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch case executor dashboard');
      }
      
      set({ 
        caseExecutorDashboard: response?.data?.payload as ICaseExecutorDashboard,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch case executor dashboard' 
      });
      console.error('Failed to fetch case executor dashboard:', error.message);
    }
  },

  getAssessorDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAssessorDashboard();
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch assessor dashboard');
      }
      
      set({ 
        assessorDashboard: response?.data?.payload as IAssessorDashboard,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch assessor dashboard' 
      });
      console.error('Failed to fetch assessor dashboard:', error.message);
    }
  },

  getDataEncoderDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getDataEncoderDashboard();
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch data encoder dashboard');
      }
      
      set({ 
        dataEncoderDashboard: response?.data?.payload as IDataEncoderDashboard,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch data encoder dashboard' 
      });
      console.error('Failed to fetch data encoder dashboard:', error.message);
    }
  },
}));

export default useDashboardStore;

