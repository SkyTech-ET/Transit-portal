"use client";

import { useEffect } from "react";
import { Table, Tag, Space, Button } from "antd";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import { useDocumentStore } from "@/modules/document/document.store";

export default function CustomerDocumentListPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { documents, fetchDocuments, loading } = useDocumentStore();

  useEffect(() => {
    fetchDocuments(Number(serviceId));
  }, [serviceId, fetchDocuments]);

  return (
    <div style={{ background: "#FFF", padding: 24, borderRadius: 8 }}>
      <h2>My Documents</h2>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={documents}
        columns={[
          { title: "Document Name", dataIndex: "name" },
          {
            title: "Status",
            dataIndex: "status",
            render: (s) => (
              <Tag color={s === "Approved" ? "green" : "orange"}>{s}</Tag>
            ),
          },
          { title: "Uploaded On", dataIndex: "uploadedAt" },
          {
            title: "Actions",
            render: (_, r) => (
              <Space>
                <Button
                  icon={<EyeOutlined />}
                  onClick={() =>
                    window.open(
                      `${process.env.NEXT_PUBLIC_API_BASE_URL}/${r.filePath}`,
                      "_blank"
                    )
                  }
                />
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() =>
                    window.open(
                      `${process.env.NEXT_PUBLIC_API_BASE_URL}/${r.filePath}`
                    )
                  }
                />
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
}
