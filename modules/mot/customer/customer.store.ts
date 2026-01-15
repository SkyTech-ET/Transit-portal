import { create } from 'zustand';
import { notification } from 'antd';
import { 
  ICustomer, 
  ICustomerState, 
  ICustomerActions, 
  ICustomerPayload, 
  ICustomerFilters,
  ICustomerApprovalRequest,
  DocumentType
} from './customer.types';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getPendingCustomerApprovals,
  approveCustomer,
  getCustomerDocuments,
  uploadCustomerDocument
} from './customer.endpoints';

const useCustomerStore = create<ICustomerState & ICustomerActions>((set, get) => ({
  // State
  customers: [],
  currentCustomer: null,
  pendingCustomers: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,

  // Actions
  getAllCustomers: async (filters?: ICustomerFilters) => {
    set({ loading: true, error: null });
    try {
      const response = await getAllCustomers(filters);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch customers');
      }
      
      set({ 
        customers: response?.data?.payload || [],
        totalCount: response?.data?.totalCount || 0,
        currentPage: filters?.page || 1,
        pageSize: filters?.pageSize || 10,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch customers',
        customers: [], // Set empty array on error
        totalCount: 0
      });
      // Don't show notification for empty data, just log the error
      console.warn('Failed to fetch customers:', error.message);
    }
  },

  getCustomerById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await getCustomerById(id);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch customer');
      }
      
      set({ 
        currentCustomer: response?.data?.payload,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch customer' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to fetch customer',
      });
    }
  },

  createCustomer: async (payload: ICustomerPayload) => {
    set({ loading: true, error: null });
    try {
      const response = await createCustomer(payload);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to create customer');
      }
      
      notification.success({
        message: 'Success',
        description: 'Customer created successfully',
      });
      
      // Refresh customers list
      await get().getAllCustomers();
      set({ loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to create customer' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to create customer',
      });
    }
  },

  updateCustomer: async (id: number, payload: Partial<ICustomerPayload>) => {
    set({ loading: true, error: null });
    try {
      const response = await updateCustomer(id, payload);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to update customer');
      }
      
      notification.success({
        message: 'Success',
        description: 'Customer updated successfully',
      });
      
      // Refresh customers list
      await get().getAllCustomers();
      set({ loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to update customer' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to update customer',
      });
    }
  },

  deleteCustomer: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await deleteCustomer(id);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to delete customer');
      }
      
      notification.success({
        message: 'Success',
        description: 'Customer deleted successfully',
      });
      
      // Refresh customers list
      await get().getAllCustomers();
      set({ loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to delete customer' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to delete customer',
      });
    }
  },

  getPendingCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getPendingCustomerApprovals();
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch pending customers');
      }
      
      set({ 
        pendingCustomers: response?.data?.payload || [],
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch pending customers' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to fetch pending customers',
      });
    }
  },

  approveCustomer: async (customerId: number, request: ICustomerApprovalRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await approveCustomer(customerId, request);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to approve customer');
      }
      
      notification.success({
        message: 'Success',
        description: request.isApproved ? 'Customer approved successfully' : 'Customer rejected',
      });
      
      // Refresh pending customers list
      await get().getPendingCustomers();
      set({ loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to approve customer' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to approve customer',
      });
    }
  },

  getCustomerDocuments: async (customerId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await getCustomerDocuments(customerId);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch customer documents');
      }
      
      // Update current customer with documents
      const currentCustomer = get().currentCustomer;
      if (currentCustomer && currentCustomer.id === customerId) {
        set({ 
          currentCustomer: {
            ...currentCustomer,
            documents: response?.data?.payload || []
          },
          loading: false 
        });
      } else {
        set({ loading: false });
      }
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch customer documents' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to fetch customer documents',
      });
    }
  },

  uploadCustomerDocument: async (customerId: number, file: File, documentType: DocumentType, description?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await uploadCustomerDocument(customerId, file, documentType, description);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to upload document');
      }
      
      notification.success({
        message: 'Success',
        description: 'Document uploaded successfully',
      });
      
      // Refresh customer documents
      await get().getCustomerDocuments(customerId);
      set({ loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to upload document' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to upload document',
      });
    }
  },

  

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setCurrentCustomer: (customer: ICustomer | null) => set({ currentCustomer: customer }),
}));

export default useCustomerStore;

