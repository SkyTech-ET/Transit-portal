export interface INotification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  relatedEntityId?: number;
  relatedEntityType?: string;
  createdDate: string;
  readDate?: string;
}

export interface INotificationState {
  notifications: INotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export interface INotificationActions {
  getNotifications: (userId: number) => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: (userId: number) => Promise<void>;
  createNotification: (notification: Omit<INotification, 'id' | 'createdDate'>) => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Enums
export enum NotificationType {
  ServiceUpdate = 1,
  DocumentUpload = 2,
  StatusChange = 3,
  MessageReceived = 4,
  CustomerApproval = 5,
  StageCompletion = 6,
  Emergency = 7,
  SystemAlert = 8
}

export enum RelatedEntityType {
  Service = 'Service',
  Customer = 'Customer',
  Document = 'Document',
  Message = 'Message',
  Stage = 'Stage'
}








