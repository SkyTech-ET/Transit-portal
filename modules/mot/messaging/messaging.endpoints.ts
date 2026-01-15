import http from '@/modules/utils/axios';
import { ISendMessageRequest } from './messaging.types';

const messagingEndpoints = Object.freeze({
  send: '/Messaging/send',
  getAllMessages: '/Messaging',
  getServiceMessages: '/Messaging/service',
  getUserMessages: '/Messaging/user',
  markAsRead: '/Messaging/mark-read',
  getUnreadCount: '/Messaging/unread-count',
});

export const getAllMessages = (
  page: number = 1, 
  pageSize: number = 20
): Promise<Response> => {
  return http.get({ 
    url: messagingEndpoints.getAllMessages, 
    params: { page, pageSize }
  });
};

export const sendMessage = (request: ISendMessageRequest): Promise<Response> => {
  return http.post({ 
    url: messagingEndpoints.send, 
    data: request 
  });
};

export const getServiceMessages = (
  serviceId: number, 
  page: number = 1, 
  pageSize: number = 20
): Promise<Response> => {
  return http.get({ 
    url: `${messagingEndpoints.getServiceMessages}/${serviceId}`, 
    params: { page, pageSize }
  });
};

export const getUserMessages = (
  userId: number, 
  page: number = 1, 
  pageSize: number = 20
): Promise<Response> => {
  return http.get({ 
    url: `${messagingEndpoints.getUserMessages}/${userId}`, 
    params: { page, pageSize }
  });
};

export const markMessageAsRead = (messageId: number): Promise<Response> => {
  return http.put({ 
    url: `${messagingEndpoints.markAsRead}/${messageId}` 
  });
};

export const getUnreadMessageCount = (userId: number): Promise<Response> => {
  return http.get({ 
    url: `${messagingEndpoints.getUnreadCount}/${userId}` 
  });
};

