export interface IMessage {
  id: number;
  serviceId: number;
  senderId: number;
  sender?: IUser;
  recipientId?: number;
  recipient?: IUser;
  subject: string;
  content: string;
  type: MessageType;
  isRead: boolean;
  sentDate: string;
}

export interface ISendMessageRequest {
  serviceId: number;
  senderId: number;
  recipientId?: number;
  subject: string;
  content: string;
  type: MessageType;
}

export interface IMessageState {
  messages: IMessage[];
  currentMessage: IMessage | null;
  unreadCount: number;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export interface IMessageActions {
  getAllMessages: (page?: number, pageSize?: number) => Promise<void>;
  getServiceMessages: (serviceId: number, page?: number, pageSize?: number) => Promise<void>;
  getUserMessages: (userId: number, page?: number, pageSize?: number) => Promise<void>;
  sendMessage: (request: ISendMessageRequest) => Promise<void>;
  markAsRead: (messageId: number) => Promise<void>;
  getUnreadCount: (userId: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentMessage: (message: IMessage | null) => void;
}

// Enums
export enum MessageType {
  General = 1,
  StatusUpdate = 2,
  DocumentRequest = 3,
  Emergency = 4
}

// Import types
import { IUser } from '../../user/user.types';

