import { create } from 'zustand';
import { notification } from 'antd';
import { 
  IDocument, 
  IDocumentState, 
  IDocumentActions, 
  IDocumentUploadRequest,
  DocumentCategory
} from './document.types';
import {
  uploadServiceDocument,
  uploadStageDocument,
  uploadCustomerDocument,
  getServiceDocuments,
  getStageDocuments,
  getCustomerDocuments,
  getAllDocuments,
  downloadDocument,
  verifyDocument,
  deleteDocument
} from './document.endpoints';

const useDocumentStore = create<IDocumentState & IDocumentActions>((set, get) => ({
  // State
  documents: [],
  currentDocument: null,
  loading: false,
  error: null,
  uploadProgress: 0,

  // Actions
  getAllDocuments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllDocuments();
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch documents');
      }
      
      set({ 
        documents: response?.data?.payload || [],
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch documents' 
      });
      // Don't show notification for empty data, just log the error
      console.warn('Failed to fetch documents:', error.message);
    }
  },

  getServiceDocuments: async (serviceId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await getServiceDocuments(serviceId);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch service documents');
      }
      
      set({ 
        documents: response?.data?.payload || [],
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch service documents',
        documents: [] // Set empty array on error
      });
      // Don't show notification for empty data, just log the error
      console.warn('Failed to fetch service documents:', error.message);
    }
  },

  getStageDocuments: async (serviceStageId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await getStageDocuments(serviceStageId);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch stage documents');
      }
      
      set({ 
        documents: response?.data?.payload || [],
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch stage documents',
        documents: [] // Set empty array on error
      });
      // Don't show notification for empty data, just log the error
      console.warn('Failed to fetch stage documents:', error.message);
    }
  },

  getCustomerDocuments: async (customerId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await getCustomerDocuments(customerId);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch customer documents');
      }
      
      set({ 
        documents: response?.data?.payload || [],
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch customer documents',
        documents: [] // Set empty array on error
      });
      // Don't show notification for empty data, just log the error
      console.warn('Failed to fetch customer documents:', error.message);
    }
  },

  uploadServiceDocument: async (serviceId: number, request: IDocumentUploadRequest) => {
    set({ loading: true, error: null, uploadProgress: 0 });
    try {
      const response = await uploadServiceDocument(serviceId, request);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to upload document');
      }
      
      notification.success({
        message: 'Success',
        description: 'Document uploaded successfully',
      });
      
      // Refresh service documents
      await get().getServiceDocuments(serviceId);
      set({ loading: false, uploadProgress: 100 });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to upload document',
        uploadProgress: 0
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to upload document',
      });
    }
  },

  uploadStageDocument: async (serviceStageId: number, request: IDocumentUploadRequest) => {
    set({ loading: true, error: null, uploadProgress: 0 });
    try {
      const response = await uploadStageDocument(serviceStageId, request);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to upload document');
      }
      
      notification.success({
        message: 'Success',
        description: 'Document uploaded successfully',
      });
      
      // Refresh stage documents
      await get().getStageDocuments(serviceStageId);
      set({ loading: false, uploadProgress: 100 });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to upload document',
        uploadProgress: 0
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to upload document',
      });
    }
  },

  uploadCustomerDocument: async (customerId: number, request: IDocumentUploadRequest) => {
    set({ loading: true, error: null, uploadProgress: 0 });
    try {
      const response = await uploadCustomerDocument(customerId, request);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to upload document');
      }
      
      notification.success({
        message: 'Success',
        description: 'Document uploaded successfully',
      });
      
      // Refresh customer documents
      await get().getCustomerDocuments(customerId);
      set({ loading: false, uploadProgress: 100 });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to upload document',
        uploadProgress: 0
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to upload document',
      });
    }
  },

  downloadDocument: async (documentId: number, category: DocumentCategory) => {
    set({ loading: true, error: null });
    try {
      const response = await downloadDocument(documentId, category);
      
      // Create blob and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `document_${documentId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      set({ loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to download document' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to download document',
      });
    }
  },

  verifyDocument: async (documentId: number, isVerified: boolean, verificationNotes?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await verifyDocument(documentId, isVerified, verificationNotes);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to verify document');
      }
      
      notification.success({
        message: 'Success',
        description: isVerified ? 'Document verified successfully' : 'Document verification updated',
      });
      
      // Update document in state
      const documents = get().documents;
      const updatedDocuments = documents.map(doc => 
        doc.id === documentId 
          ? { ...doc, isVerified, verificationNotes }
          : doc
      );
      set({ documents: updatedDocuments, loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to verify document' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to verify document',
      });
    }
  },

  deleteDocument: async (documentId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await deleteDocument(documentId);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to delete document');
      }
      
      notification.success({
        message: 'Success',
        description: 'Document deleted successfully',
      });
      
      // Remove document from state
      const documents = get().documents;
      const updatedDocuments = documents.filter(doc => doc.id !== documentId);
      set({ documents: updatedDocuments, loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to delete document' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to delete document',
      });
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setCurrentDocument: (document: IDocument | null) => set({ currentDocument: document }),
  setUploadProgress: (progress: number) => set({ uploadProgress: progress }),
}));

export default useDocumentStore;

