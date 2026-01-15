import http from '@/modules/utils/axios';
import { CreateNotificationDTO } from './notification.types';

/* ================= GET ================= */

export const getUserNotifications = () =>
  http.get({
    url: '/Notification/GetUserNotifications',
  });

export const getUnreadCount = () =>
  http.get({
    url: '/Notification/GetUnreadCount',
  });

/* ================= POST ================= */

export const markNotificationAsRead = (notificationId: number) =>
  http.post({
    url: '/Notification/MarkNotificationAsRead',
    data: { notificationId },
  });

export const markAllNotificationsAsRead = () =>
  http.post({
    url: '/Notification/MarkAllNotificationsAsRead',
  });

export const createNotification = (payload: CreateNotificationDTO) =>
  http.post({
    url: '/Notification/CreateNotification',
    data: payload,
  });

export const sendBulkNotification = (payload: CreateNotificationDTO) =>
  http.post({
    url: '/Notification/SendBulkNotification',
    data: payload,
  });
