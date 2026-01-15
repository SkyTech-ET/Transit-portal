import { create } from "zustand";
import { notification } from "antd";
import { getServiceDocuments, deleteDocument } from "./document.endpoints";

export interface DocumentUI {
  id: number;
  name: string;
  type: number;
  uploadedAt: string;
  size: string;
  sizeBytes: number;
  filePath: string;
  status: "Pending" | "Approved";
}

interface DocumentState {
  documents: DocumentUI[];
  loading: boolean;
  fetchDocuments: (serviceId: number) => Promise<void>;
  removeDocument: (id: number) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  loading: false,

  fetchDocuments: async (serviceId: number) => {
    set({ loading: true });
    try {
      const res = await getServiceDocuments(serviceId);

      if (res.error || !res.response?.data) {
        set({ documents: [], loading: false });
        return;
      }

      const normalized = res.response.data.map((d: any) => ({
        id: d.id,
        name: d.originalFileName,
        type: d.documentType,
        uploadedAt: d.registeredDate.split("T")[0],
        sizeBytes: d.fileSizeBytes,
        size: `${Math.round(d.fileSizeBytes / 1024)} KB`,
        filePath: d.filePath,
        status: d.isVerified ? "Approved" : "Pending",
      }));

      set({ documents: normalized, loading: false });
    } catch {
      set({ loading: false });
      notification.error({
        message: "Error",
        description: "Failed to load documents",
      });
    }
  },

  removeDocument: async (id) => {
    try {
      await deleteDocument(id);
      set((state) => ({
        documents: state.documents.filter((d) => d.id !== id),
      }));
    } catch {
      notification.error({
        message: "Error",
        description: "Failed to delete document",
      });
    }
  },
}));
