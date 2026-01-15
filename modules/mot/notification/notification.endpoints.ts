import http from '@/modules/utils/axios';
import { INotification } from './notification.types';

const notificationEndpoints = Object.freeze({
  getNotifications: '/Notification/GetNotifications',
  markAsRead: '/Notification/MarkAsRead',
  markAllAsRead: '/Notification/MarkAllAsRead',
  create: '/Notification/Create',
  delete: '/Notification/Delete',
  getUnreadCount: '/Notification/GetUnreadCount',
});

export const getNotifications = (userId: number): Promise<Response> => {
  return http.get({ 
    url: `${notificationEndpoints.getNotifications}/${userId}` 
  });
};

export const markNotificationAsRead = (notificationId: number): Promise<Response> => {
  return http.put({ 
    url: `${notificationEndpoints.markAsRead}/${notificationId}` 
  });
};

export const markAllNotificationsAsRead = (userId: number): Promise<Response> => {
  return http.put({ 
    url: `${notificationEndpoints.markAllAsRead}/${userId}` 
  });
};

export const createNotification = (notification: Omit<INotification, 'id' | 'createdDate'>): Promise<Response> => {
  return http.post({ 
    url: notificationEndpoints.create, 
    data: notification 
  });
};

export const deleteNotification = (notificationId: number): Promise<Response> => {
  return http.delete({ 
    url: `${notificationEndpoints.delete}/${notificationId}` 
  });
};

export const getUnreadNotificationCount = (userId: number): Promise<Response> => {
  return http.get({ 
    url: `${notificationEndpoints.getUnreadCount}/${userId}` 
  });
};

