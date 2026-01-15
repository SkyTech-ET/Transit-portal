"use client";

import { useEffect, useState } from "react";
import { Table, Tag, Spin, message } from "antd";
import { useRouter } from "next/navigation";
import { getPendingServiceReviews } from "@/modules/assessor/assessor.endpoints";
import { IService } from "@/modules/mot/service/service.types";

export default function ServiceListPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

 const fetchServices = async () => {
  setLoading(true);
  try {
    const data = await getPendingServiceReviews();

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format");
    }

    setServices(data);
  } catch (err) {
    console.error("Fetch error:", err);
    message.error("Failed to load services");
    setServices([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchServices();
  }, []);

  const columns = [
    {
      title: "Service Number",
      dataIndex: "serviceNumber",
    },
    {
      title: "Customer Name",
      render: (_: any, record: any) =>
        `${record.customer?.firstName ?? ""} ${record.customer?.lastName ?? ""}`,
    },
    {
      title: "Item Description",
      dataIndex: "itemDescription",
    },
    {
      title: "Route Category",
      dataIndex: "routeCategory",
    },
    {
      title: "Status",
      render: () => <Tag color="blue">Pending Review</Tag>,
    },
  ];

  if (loading) return <Spin />;

  return (
    <Table
      columns={columns}
      dataSource={services}
      rowKey="id"
      pagination={false}
      onRow={(record) => ({
        onClick: () =>
          router.push(`/admin/assessor/service-request/${record.id}`),
        style: { cursor: "pointer" },
      })}
    />
  );
}
