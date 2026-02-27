import { create } from "zustand";
import { notification } from "antd";
import {
  getAssessorDashboard,
  getPendingCustomerApprovals,
  approveCustomer,
  getPendingServiceReviews,
  reviewService,
  addComplianceFeedback,
  rejectCustomer as apiRejectCustomer,
  requestCustomerRevision as apiRequestCustomerRevision,
  assignServiceApi 

} from "@/modules/assessor/assessor.endpoints";

export interface IAssessorDashboard {
  pendingCustomerApprovals: number;
  pendingServiceReviews: number;
  servicesUnderOversight: number;
  completedReviewsToday: number;
  recentCustomerApprovals: any[];
  recentServiceReviews: any[];
}

interface IAssessorState {
  dashboard: IAssessorDashboard | null;
  pendingCustomers: any[];
  pendingServiceReviews: any[];
  loading: boolean;
  error: string | null;

  getDashboard: () => Promise<void>;
  getPendingCustomers: () => Promise<void>;
  getPendingServiceReviews: () => Promise<void>;
  approveCustomer: (customerId: number) => Promise<void>;
  reviewService: (payload: {
    serviceId: number;
    status: number;
    comments?: string;
  }) => Promise<void>;
  addComplianceFeedback: (payload: {
    serviceId: number;
    feedback: string;
  }) => Promise<void>;
}

export const useAssessorStore = create<IAssessorState>((set, get) => ({
  dashboard: null,
  pendingCustomers: [],
  pendingServiceReviews: [],
  loading: false,
  error: null,

  // ================= DASHBOARD =================
  getDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getAssessorDashboard();
      set({
        dashboard:  res,
        loading: false,
      });
    } catch (err: any) {
      set({ loading: false, error: err });
      notification.error({
        message: "Error",
        description: "Failed to load assessor dashboard",
      });
    }
  },

  // ================= CUSTOMER APPROVALS =================
  getPendingCustomers: async () => {
    set({ loading: true });
    try {
      const res = await getPendingCustomerApprovals();
      const data = res;
      set({
        pendingCustomers: data ?? [],
        loading: false,
      });
    } catch {
      set({ loading: false });
      notification.error({
        message: "Error",
        description: "Failed to load pending customers",
      });
    }
  },

  // ================= SERVICE REVIEWS =================
getPendingServiceReviews: async () => {
  set({ loading: true });
  try {
    const res = await getPendingServiceReviews();

    // res is ALREADY IService[]
    set({
      pendingServiceReviews: Array.isArray(res) ? res : [],
      loading: false,
    });
  } catch {
    set({ loading: false });
    notification.error({
      message: "Error",
      description: "Failed to load pending service reviews",
    });
  }
},


  // ================= APPROVE CUSTOMER =================
approveCustomer: async (customerId: number) => {
  set({ loading: true });
  try {
    await approveCustomer({ 
      customerId, 
      isApproved: true, 
      notes: null 
    });
    notification.success({
      message: "Approved",
      description: "Customer approved successfully",
    });
    await get().getPendingCustomers(); // refresh list
  } catch (err) {
    console.error(err);
    notification.error({
      message: "Error",
      description: "Failed to approve customer",
    });
  } finally {
    set({ loading: false });
  }
},

/// ================= REJECT CUSTOMER =================
rejectCustomer: async (customerId: number, reason?: string) => {
  set({ loading: true });
  try {
    await apiRejectCustomer(customerId, reason);
    notification.success({
      message: "Rejected",
      description: "Customer rejected successfully",
    });
    await get().getPendingCustomers();
  } catch (err) {
    console.error(err);
    notification.error({
      message: "Error",
      description: "Failed to reject customer",
    });
  } finally {
    set({ loading: false });
  }
},

// ================= REQUEST REVISION =================
requestRevision: async (customerId: number, notes: string) => {
  set({ loading: true });
  try {
    await apiRequestCustomerRevision(customerId, notes);
    notification.success({
      message: "Revision Requested",
      description: "Customer requested to update details.",
    });
    await get().getPendingCustomers();
  } catch (err) {
    console.error(err);
    notification.error({
      message: "Error",
      description: "Failed to request revision",
    });
  } finally {
    set({ loading: false });
  }
},



  // ================= REVIEW SERVICE =================
  reviewService: async (payload) => {
    try {
      await reviewService(payload);
      notification.success({
        message: "Success",
        description: "Service reviewed successfully",
      });

      // remove reviewed service from list
      set({
        pendingServiceReviews: get().pendingServiceReviews.filter(
          (s) => s.id !== payload.serviceId
        ),
      });
    } catch {
      notification.error({
        message: "Error",
        description: "Failed to review service",
      });
    }
  },

  // ================= COMPLIANCE FEEDBACK =================
  addComplianceFeedback: async (payload) => {
    try {
      await addComplianceFeedback(payload);
      notification.success({
        message: "Success",
        description: "Compliance feedback added",
      });
    } catch {
      notification.error({
        message: "Error",
        description: "Failed to add compliance feedback",
      });
    }
  },
}));


assignService: async (payload: {
  serviceId: number;
  assignedCaseExecutorId: number;
  assignedAssessorId: number;
  assignmentNotes?: string | null;
}) => {
  set({ loading: true });
  try {
    const updated = await assignServiceApi(payload);

    set({ currentService: updated, loading: false });

    notification.success({
      message: "Service Assigned",
      description: "Service assigned successfully",
    });
  } catch (err) {
    console.error(err);
    set({ loading: false });
    notification.error({
      message: "Error",
      description: "Failed to assign service",
    });
    throw err;
  }
};