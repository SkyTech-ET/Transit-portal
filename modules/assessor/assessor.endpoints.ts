import http from "@/modules/utils/axios";
import { IService } from "@/modules/mot/service/service.types";

export const getAssessorDashboard = async () => {
  return http.get({
    url: "/Assessor/GetDashboard",
  });
};

export const getPendingCustomerApprovals = async () =>
  http.get({ url: "/Assessor/GetPendingCustomerApprovals" });

export const approveCustomer = async (payload: any) =>
  http.put({ url: "/Assessor/ApproveCustomer", data: payload });

export const getPendingServiceReviews = async () => {
  const res = await http.get({
    url: "/Assessor/GetPendingServiceReviews",
  });

  const response = res;

  console.log("ENDPOINT RESPONSE:", response);

  if (Array.isArray(response)) return response;
  if (response) return [response];

  return [];
};





export const reviewService = async (payload: any) =>
  http.put({ url: "/Assessor/ReviewService", data: payload });

export const getServicesUnderOversight = async () =>
  http.get({ url: "/Assessor/GetServicesUnderOversight" });

export const addComplianceFeedback = async (payload: any) =>
  http.post({ url: "/Assessor/AddComplianceFeedback", data: payload });

export const getComplianceIssues = async () =>
  http.get({ url: "/Assessor/GetComplianceIssues" });
/**
 * Reject a customer
 */
export const rejectCustomer = async (approvalId: number, reason?: string) => {
  return http.post({
    url: "/Assessor/RejectCustomer",
    data: {
      id: approvalId,
      reason: reason ?? null,
    },
  });
};

/**
 * Request revision
 */
export const requestCustomerRevision = async (
  approvalId: number,
  notes: string
) => {
  return http.post({
    url: "/Assessor/RequestCustomerRevision",
    data: {
      id: approvalId,
      notes,
    },
  });
};
