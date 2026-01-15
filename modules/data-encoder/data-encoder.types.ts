// Common API wrapper (same idea as Assessor)
export interface ApiResponse<T> {
  statusCode: number;
  error: boolean;
  errors: string[];
  message: string;
  response: {
    data: T;
  };
}

/* ================= DASHBOARD ================= */

export interface DataEncoderDashboardDTO {
  pendingApprovals: number;
  draftRequests: number;
  submittedServices: number;
  approvalRate: number;

  recentActivities: RecentActivityDTO[];
  pendingTasks: PendingTaskDTO[];
}

export interface RecentActivityDTO {
  title: string;
  description: string;
  createdAt?: string;
}

export interface PendingTaskDTO {
  title: string;
  description: string;
  status: "Urgent" | "Pending" | "In Progress";
}

/* ================= CUSTOMERS ================= */

export interface CustomerDTO {
  id: number;
  businessName: string;
  tinNumber: string;
  businessLicense: string;
  businessAddress: string;
  city: string;
  state: string;
  postalCode: string;

  contactPerson: string;
  contactPhone: string;
  contactEmail: string;

  businessType: string;
  importLicense: string;
  importLicenseExpiry: string;

  isVerified: boolean;
  verifiedAt: string | null;
  verifiedByUserId: number | null;
  verificationNotes: string | null;

  userId: number;
}
