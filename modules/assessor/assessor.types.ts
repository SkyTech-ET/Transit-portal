

export interface IAssessorDashboard {
  pendingCustomerApprovals: number;
  pendingServiceReviews: number;
  servicesUnderOversight: number;
  completedReviewsToday: number;

  recentCustomerApprovals: any[];
  recentServiceReviews: IRecentServiceReview[];
}

export interface IRecentServiceReview {
  id: number;
  serviceNumber: string;
  itemDescription: string;
  routeCategory: string;
  declaredValue: number;
  taxCategory: string;
  countryOfOrigin: string;
  serviceType: number;
  status: number;
  riskLevel: number;
  registeredDate: string;
}

export interface IPendingCustomerApproval {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  registeredDate: string;
}

export interface IPendingServiceReview {
  id: number;
  serviceNumber: string;
  itemDescription: string;
  registeredDate: string;
}

export interface IComplianceIssue {
  id: number;
  serviceNumber: string;
  issue: string;
}
