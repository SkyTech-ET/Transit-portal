"use client";

import { useEffect, useState } from "react";
import { Table, Spin, Tag } from "antd";
import { useServiceStore } from "@/modules/mot/service/service.store";
import { useUserStore } from "@/modules/user";
import { IService, ServiceType } from "@/modules/mot/service/service.types";
import { getServiceDocuments } from "@/modules/document/document.endpoints";

interface DocumentUI {
  id: number;
  name: string;
  uploadedAt: string;
  size: string;
  status: "Pending" | "Approved";
  filePath: string;
}

export default function CustomerDocumentListPage() {
  const currentUser = useUserStore((s) => s.currentUser);
  const getCustomerServices = useServiceStore((s) => s.getCustomerServices);

  const [services, setServices] = useState<IService[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // documents grouped by serviceId
  const [documentsMap, setDocumentsMap] = useState<Record<number, DocumentUI[]>>(
    {}
  );

  // loading state per service row
  const [loadingDocs, setLoadingDocs] = useState<Record<number, boolean>>({});

  // keep track of expanded rows
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      if (!currentUser?.id) return;

      setLoadingServices(true);
      const fetched = await getCustomerServices(currentUser.id, 2);

      console.log("✅ Services Loaded (Documents Page):", fetched);

      setServices(fetched);
      setLoadingServices(false);
    };

    loadServices();
  }, [currentUser, getCustomerServices]);

  // fetch documents for ONE service
  const loadDocumentsForService = async (serviceId: number) => {
    if (documentsMap[serviceId]) return;

    setLoadingDocs((prev) => ({ ...prev, [serviceId]: true }));

    try {
      const res = await getServiceDocuments(serviceId);

      console.log(`📄 Documents for service ${serviceId}:`, res);

      const docs: DocumentUI[] =
        res.map((d: any) => ({
          id: d.id,
          name: d.originalFileName,
          uploadedAt: d.registeredDate.split("T")[0],
          size: `${Math.round(d.fileSizeBytes / 1024)} KB`,
          status: d.isVerified ? "Approved" : "Pending",
          filePath: d.filePath.replace(/\\/g, "/"),
        })) || [];

      setDocumentsMap((prev) => ({ ...prev, [serviceId]: docs }));

      // Force re-render of expanded row
      if (!expandedRowKeys.includes(serviceId)) {
        setExpandedRowKeys((prev) => [...prev, serviceId]);
      }
    } catch (err) {
      console.error("❌ Failed loading documents:", err);
      setDocumentsMap((prev) => ({ ...prev, [serviceId]: [] }));
    } finally {
      setLoadingDocs((prev) => ({ ...prev, [serviceId]: false }));
    }
  };

  const renderDocuments = (serviceId: number) => {
    const docs = documentsMap[serviceId];
    const isLoading = loadingDocs[serviceId];

    if (isLoading) return <Spin />;

    if (!docs || docs.length === 0) {
      return (
        <div className="text-gray-400 italic py-3">
          No documents uploaded for this service.
        </div>
      );
    }

    return (
      <Table
        rowKey="id"
        size="small"
        pagination={false}
        dataSource={docs}
        columns={[
          { title: "Document Name", dataIndex: "name" },
          { title: "Uploaded On", dataIndex: "uploadedAt" },
          { title: "Size", dataIndex: "size" },

          {
  title: "Action",
  render: (_: any, r: DocumentUI) => {
    const BASE_URL = "https://transitportal.skytechet.com";
    // Replace any backslashes in the file path
    const fileUrl = `${BASE_URL}/${r.filePath.replace(/\\/g, "/")}`;

    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        View
      </a>
    );
  },
},
        ]}
      />
    );
  };

  if (loadingServices) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ background: "#FFF", padding: 24, borderRadius: 8 }}>
      <h2 className="text-xl font-semibold mb-4">My Documents</h2>

      <Table
        rowKey="id"
        dataSource={services}
        expandable={{
          expandedRowKeys,
          onExpand: (expanded, record) => {
            if (expanded) loadDocumentsForService(record.id);
            setExpandedRowKeys((prev) =>
              expanded
                ? [...prev, record.id]
                : prev.filter((k) => k !== record.id)
            );
          },
          expandedRowRender: (record) => renderDocuments(record.id),
        }}
        columns={[
          {
            title: "Service Number",
            dataIndex: "serviceNumber",
          },
          {
            title: "Service Type",
            dataIndex: "serviceType",
            render: (type: ServiceType) => (
              <Tag color={type === ServiceType.Multimodal ? "cyan" : "purple"}>
                {ServiceType[type]}
              </Tag>
            ),
          },
          {
            title: "Registered Date",
            dataIndex: "registeredDate",
            render: (d: string) => new Date(d).toLocaleDateString(),
          },
        ]}
      />
    </div>
  );
}