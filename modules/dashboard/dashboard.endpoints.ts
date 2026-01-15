// modules/dashboard/dashboard.endpoints.ts
import type {
  IServiceSummary,
  IServiceRequest,
  INotification,
  IDocument,
} from "./dashboard.types";

export const getDashboardData = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const summary: IServiceSummary = {
    ongoing: 3,
    pending: 1,
    completed: 1,
    total: 5,
  };

  const requests: IServiceRequest[] = [
    {
      id: "#SRV-2025-001",
      type: "Multimodal",
      status: "In Progress",
      executor: "Mike Johnson",
      updatedAt: "2 hours ago",
    },
  ];

  const notifications: INotification[] = [
    {
      message: "Inspection scheduled for Service #SRV-2025-001",
      timeAgo: "30 minutes ago",
    },
  ];

  const documents: IDocument[] = [
    {
      name: "Import_Declaration_001.pdf",
      size: "2.4 MB",
      type: "pdf",
    },
  ];

  // Return in axios-like response structure
  return {
    summary: { data: summary },
    requests: { data: requests },
    notifications: { data: notifications },
    documents: { data: documents },
  };
};
