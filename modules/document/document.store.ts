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

export interface ServiceDocumentsGroup {
  serviceId: number;
  serviceName: string;
  documents: DocumentUI[];
}

interface DocumentState {
  documents: DocumentUI[];

  // ✅ NEW: grouped documents for customer view
  serviceDocuments: ServiceDocumentsGroup[];

  loading: boolean;

  fetchDocuments: (serviceId: number) => Promise<void>;

  // ✅ NEW: fetch documents for MANY services
  fetchDocumentsForServices: (
    services: { id: number; name: string }[]
  ) => Promise<void>;

  removeDocument: (id: number) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  serviceDocuments: [],
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

  fetchDocumentsForServices: async (services) => {
  const grouped: ServiceDocumentsGroup[] = [];

  for (const service of services) {
    try {
      console.log("📡 Fetching documents for service:", service.id);

      const res = await getServiceDocuments(service.id);

      console.log("📦 RAW RESPONSE:", res);

      const documents = res || [];

      grouped.push({
        serviceId: service.id,
        serviceName: service.name,
        documents,
      });

      console.log(
        `✅ Loaded ${documents.length} documents for service ${service.id}`
      );
    } catch (err) {
      console.error("❌ Failed to fetch docs for service", service.id, err);

      grouped.push({
        serviceId: service.id,
        serviceName: service.name,
        documents: [],
      });
    }
  }

  set({ serviceDocuments: grouped });
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
