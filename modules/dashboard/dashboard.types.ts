// modules/dashboard/dashboard.types.ts

export interface IServiceSummary {
  ongoing: number;
  pending: number;
  completed: number;
  total: number;
}

export interface IServiceRequest {
  id: string;
  type: string;
  status: string;
  executor: string;
  updatedAt: string;
}

export interface INotification {
  message: string;
  timeAgo: string;
}

export interface IDocument {
  name: string;
  size: string;
  type: string;
}
