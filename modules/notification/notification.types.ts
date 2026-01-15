export type NotificationType =
  | 'System'
  | 'Alert'
  | 'Assigned'
  | 'Message';

export interface CreateNotificationDTO {
  title: string;
  description: string;
  type: NotificationType;
  userIds?: number[];   // for bulk
}

export interface NotificationDTO {
  id: number;
  title: string;
  description: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}
