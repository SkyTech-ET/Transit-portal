import { create } from 'zustand';
import { notification } from 'antd';
import { 
  INotification, 
  INotificationState, 
  INotificationActions 
} from './notification.types';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
  deleteNotification,
  getUnreadNotificationCount
} from './notification.endpoints';

const useNotificationStore = create<INotificationState & INotificationActions>((set, get) => ({
  // State
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  // Actions
  getNotifications: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await getNotifications(userId);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to fetch notifications');
      }
      
      set({ 
        notifications: response?.data?.payload || [],
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch notifications' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to fetch notifications',
      });
    }
  },

  markAsRead: async (notificationId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await markNotificationAsRead(notificationId);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to mark notification as read');
      }
      
      // Update notification in state
      const notifications = get().notifications;
      const updatedNotifications = notifications.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true, readDate: new Date().toISOString() }
          : notif
      );
      
      // Update unread count
      const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
      
      set({ 
        notifications: updatedNotifications,
        unreadCount,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to mark notification as read' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to mark notification as read',
      });
    }
  },

  markAllAsRead: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await markAllNotificationsAsRead(userId);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to mark all notifications as read');
      }
      
      // Update all notifications in state
      const notifications = get().notifications;
      const updatedNotifications = notifications.map(notif => ({
        ...notif,
        isRead: true,
        readDate: new Date().toISOString()
      }));
      
      set({ 
        notifications: updatedNotifications,
        unreadCount: 0,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to mark all notifications as read' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to mark all notifications as read',
      });
    }
  },

  createNotification: async (notificationData: Omit<INotification, 'id' | 'createdDate'>) => {
    set({ loading: true, error: null });
    try {
      const response = await createNotification(notificationData);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to create notification');
      }
      
      // Add new notification to state
      const newNotification = {
        ...notificationData,
        id: response?.data?.payload?.id || Date.now(),
        createdDate: new Date().toISOString()
      };
      
      const notifications = get().notifications;
      const updatedNotifications = [newNotification, ...notifications];
      const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
      
      set({ 
        notifications: updatedNotifications,
        unreadCount,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to create notification' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to create notification',
      });
    }
  },

  deleteNotification: async (notificationId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await deleteNotification(notificationId);
      if (response?.data?.isError) {
        throw new Error(response.data.message || 'Failed to delete notification');
      }
      
      // Remove notification from state
      const notifications = get().notifications;
      const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
      const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
      
      set({ 
        notifications: updatedNotifications,
        unreadCount,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to delete notification' 
      });
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to delete notification',
      });
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));

export default useNotificationStore;








