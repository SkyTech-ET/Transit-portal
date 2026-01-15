import { create } from 'zustand';
import { notification } from 'antd';
import { 
  IMessage, 
  IMessageState, 
  IMessageActions, 
  ISendMessageRequest
} from './messaging.types';
import {
  getAllMessages,
  sendMessage,
  getServiceMessages,
  getUserMessages,
  markMessageAsRead,
  getUnreadMessageCount
} from './messaging.endpoints';

const useMessagingStore = create<IMessageState & IMessageActions>((set, get) => ({
  // State
  messages: [],
  currentMessage: null,
  unreadCount: 0,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 20,

  // Actions
  getAllMessages: async (page: number = 1, pageSize: number = 20) => {
    set({ loading: true, error: null });
    try {
      const response = await getAllMessages(page, pageSize);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch messages');
      }
      
      set({ 
        messages: response?.data?.payload || [],
        totalCount: response?.data?.totalCount || 0,
        currentPage: page,
        pageSize: pageSize,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch messages',
        messages: [], // Set empty array on error
        totalCount: 0
      });
      // Don't show notification for empty data, just log the error
      console.warn('Failed to fetch messages:', error.message);
    }
  },

  getServiceMessages: async (serviceId: number, page: number = 1, pageSize: number = 20) => {
    set({ loading: true, error: null });
    try {
      const response = await getServiceMessages(serviceId, page, pageSize);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch messages');
      }
      
      set({ 
        messages: response?.data?.payload || [],
        totalCount: response?.data?.totalCount || 0,
        currentPage: page,
        pageSize: pageSize,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch messages',
        messages: [], // Set empty array on error
        totalCount: 0
      });
      // Don't show notification for empty data, just log the error
      console.warn('Failed to fetch messages:', error.message);
    }
  },

  getUserMessages: async (userId: number, page: number = 1, pageSize: number = 20) => {
    set({ loading: true, error: null });
    try {
      const response = await getUserMessages(userId, page, pageSize);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch messages');
      }
      
      set({ 
        messages: response?.data?.payload || [],
        totalCount: response?.data?.totalCount || 0,
        currentPage: page,
        pageSize: pageSize,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch messages',
        messages: [], // Set empty array on error
        totalCount: 0
      });
      // Don't show notification for empty data, just log the error
      console.warn('Failed to fetch messages:', error.message);
    }
  },

  sendMessage: async (request: ISendMessageRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await sendMessage(request);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to send message');
      }
      
      notification.success({
        message: 'Success',
        description: 'Message sent successfully',
      });
      
      // Refresh messages for the service
      await get().getServiceMessages(request.serviceId);
      set({ loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to send message' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to send message',
      });
    }
  },

  markAsRead: async (messageId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await markMessageAsRead(messageId);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to mark message as read');
      }
      
      // Update message in state
      const messages = get().messages;
      const updatedMessages = messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, isRead: true }
          : msg
      );
      set({ messages: updatedMessages, loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to mark message as read' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to mark message as read',
      });
    }
  },

  getUnreadCount: async (userId: number) => {
    try {
      const response = await getUnreadMessageCount(userId);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch unread count');
      }
      
      set({ 
        unreadCount: response?.data?.payload || 0
      });
    } catch (error: any) {
      console.error('Failed to fetch unread count:', error);
      // Don't show notification for this as it's called frequently
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setCurrentMessage: (message: IMessage | null) => set({ currentMessage: message }),
}));

export default useMessagingStore;

