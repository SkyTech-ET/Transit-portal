"use client";

import React, { useEffect, useState } from "react";
import { Card, Table, Button, Space, Tag, message } from "antd";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useServiceStore } from "@/modules/mot/service";
import { useRouter } from "next/navigation";
import { customerRoutes } from "@/modules/mot/customer";

const CustomerServicesPage = () => {
  const router = useRouter();
  const { services, loading, getAllServices, deleteService } = useServiceStore();
  const [filters, setFilters] = useState({
    search: "",
  });

  useEffect(() => {
    getAllServices();
  }, [getAllServices]);

  const handleCreateService = () => {
    router.push(customerRoutes.createService);
  };

  const handleViewService = (id: number) => {
    router.push(`/admin/mot/services/${id}`);
  };

  const handleEditService = (id: number) => {
    router.push(`/admin/mot/services/edit/${id}`);
  };

  const handleDeleteService = async (id: number) => {
    try {
      await deleteService(id);
      message.success("Service deleted successfully");
    } catch (error) {
      message.error("Failed to delete service");
    }
  };

  const columns = [
    {
      title: "Service Number",
      dataIndex: "serviceNumber",
      key: "serviceNumber",
    },
    {
      title: "Item Description",
      dataIndex: "itemDescription",
      key: "itemDescription",
      ellipsis: true,
    },
    {
      title: "Service Type",
      dataIndex: "serviceType",
      key: "serviceType",
      render: (serviceType: number) => {
        const typeMap: { [key: number]: string } = {
          1: "Multimodal",
          2: "Unimodal"
        };
        return <Tag color="blue">{typeMap[serviceType] || "Unknown"}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => {
        const statusMap: { [key: number]: { text: string; color: string } } = {
          1: { text: "Pending", color: "orange" },
          2: { text: "In Progress", color: "blue" },
          3: { text: "Completed", color: "green" },
          4: { text: "Cancelled", color: "red" },
        };
        const statusInfo = statusMap[status] || { text: "Unknown", color: "default" };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<Eye size={14} />}
            onClick={() => handleViewService(record.id)}
          >
            View
          </Button>
          <Button
            size="small"
            icon={<Edit size={14} />}
            onClick={() => handleEditService(record.id)}
          >
            Edit
          </Button>
          <Button
            danger
            size="small"
            icon={<Trash2 size={14} />}
            onClick={() => handleDeleteService(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex justify-between items-center">
            <span>My Services</span>
            <Button
              type="primary"
              icon={<Plus size={18} />}
              onClick={handleCreateService}
            >
              Create New Service
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={services}
          loading={loading}
          rowKey="id"
          pagination={{
            total: services.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} services`,
          }}
        />
      </Card>
    </div>
  );
};

export default CustomerServicesPage;



