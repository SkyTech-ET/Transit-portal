import axios from "axios";
import type { IServiceRequest, IStageOverview } from "./serviceRequests.types";

// Use environment variable for flexibility
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://transitportal.skytechet.com/api";

/**
 * Fetches all service requests from the backend
 */
export const getAllServiceRequests = async (): Promise<{ data: IServiceRequest[] }> => {
  const res = await axios.get(`${API_BASE}/service-requests`);
  return { data: res.data };
};

/**
 * Fetches stage overview data from the backend
 */
export const getAllStageOverview = async (): Promise<{ data: IStageOverview[] }> => {
  const res = await axios.get(`${API_BASE}/stage-overview`);
  return { data: res.data };
};

/**
 * Combines both requests and stages into one unified call for Zustand
 */
export const getServiceRequestsData = async () => {
  const [requestsRes, stagesRes] = await Promise.all([
    getAllServiceRequests(),
    getAllStageOverview(),
  ]);

  return {
    requests: requestsRes,
    stages: stagesRes,
  };
};
