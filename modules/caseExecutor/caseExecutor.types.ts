export interface IServiceSummary {
  notStarted: number;
  pending: number;
  completed: number;
}

export interface ITasksSummary {
  stagesAwaitingUpdate: number;
}

export interface IServiceAlerts {
  flaggedRisks: number;
}

export interface IMessageSummary {
  newMessages: number;
}

export interface IDocumentUploads {
  unAttachedDocs: number;
}

export interface IWorkSummary {
  totalAssigned: number;
  completed: number;
  timeSpentToday: string; 
  issuesRaised: number;
}

export interface IServiceOverview {
  multimodal: number;
  unimodal: number;
}

export interface IActivityLogItem {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

export interface INotificationItem {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

export interface IDashboardResponse {
  serviceSummary: IServiceSummary;
  taskSummary: ITasksSummary;
  serviceAlerts: IServiceAlerts;
  messages: IMessageSummary;
  uploads: IDocumentUploads;
  workSummary: IWorkSummary;
  activityLog: IActivityLogItem[];
  notifications: INotificationItem[];
}
