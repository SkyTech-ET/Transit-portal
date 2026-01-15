import { create } from 'zustand';
import { notification as antdNotification } from 'antd';
import {
  getUserNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
  sendBulkNotification,
} from './notification.endpoints';
import { NotificationDTO, CreateNotificationDTO } from './notification.types';
import http from '@/modules/utils/axios';

interface NotificationState {
  notifications: NotificationDTO[];
  unreadCount: number;
  loading: boolean;

  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  create: (payload: CreateNotificationDTO) => Promise<void>;
  sendBulk: (payload: CreateNotificationDTO) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    const res = await http.get({
      url: '/Notification/GetUserNotifications',
    });

    set({ notifications: res.data ?? [] });
  },

  fetchUnreadCount: async () => {
    const res = await http.get({
      url: '//Notification/GetUnreadCount',
    });

    set({ unreadCount: res.data ?? 0 });
  },
  
  /* ================= ACTIONS ================= */

  markAsRead: async (id) => {
    await markNotificationAsRead(id);
  },

  markAllAsRead: async () => {
    await markAllNotificationsAsRead();
  },

  /* ================= CREATE ================= */

  create: async (payload) => {
    try {
      await createNotification(payload);
      antdNotification.success({
        message: 'Notification created',
      });
    } catch {
      antdNotification.error({
        message: 'Failed to create notification',
      });
    }
  },

  sendBulk: async (payload) => {
    try {
      await sendBulkNotification(payload);
      antdNotification.success({
        message: 'Bulk notification sent',
      });
    } catch {
      antdNotification.error({
        message: 'Failed to send bulk notification',
      });
    }
  },
}));


