"use client";

import React, { useEffect, useState } from "react";
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, InputNumber, message } from "antd";
import { Plus, Edit, Trash2, Eye, Truck } from "lucide-react";
import { useServiceStore, ServiceStatus, ServiceType, RiskLevel } from "@/modules/mot/service";
import { useRouter } from "next/navigation";
import { usePermissionStore } from "@/modules/utils";
import permission from "@/modules/utils/permission/permission";

const { Option } = Select;

const ServicesPage = () => {
  const router = useRouter();
  const { checkPermission, permissions } = usePermissionStore();
  const { 
    services, 
    loading, 
    getAllServices, 
    deleteService, 
    updateServiceStatus,
    assignService 
  } = useServiceStore();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    status: undefined,
    serviceType: undefined,
    riskLevel: undefined,
    search: "",
  });

  useEffect(() => {
    getAllServices(filters);
  }, [filters]);

  const handleCreate = () => {
    setEditingService(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingService(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this service?",
      content: "This action cannot be undone.",
      onOk: () => deleteService(id),
    });
  };

  const handleStatusChange = (id: number, status: ServiceStatus) => {
    updateServiceStatus(id, status);
  };

  const handleAssign = (id: number, userId: number, role: 'caseExecutor' | 'assessor') => {
    assignService(id, userId, role);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      // Handle form submission
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  /* const getStatusColor = (status: ServiceStatus) => {
    const colors = {
      [ServiceStatus.Draft]: 'default',
      [ServiceStatus.Submitted]: 'processing',
      [ServiceStatus.UnderReview]: 'warning',
      [ServiceStatus.Approved]: 'success',
      [ServiceStatus.InProgress]: 'processing',
      [ServiceStatus.Completed]: 'success',
      [ServiceStatus.Rejected]: 'error',
      [ServiceStatus.Cancelled]: 'default',
    };
    return colors[status] || 'default';
  }; */

  const getRiskColor = (risk: RiskLevel) => {
    const colors = {
      [RiskLevel.Blue]: 'blue',
      [RiskLevel.Green]: 'green',
      [RiskLevel.Yellow]: 'yellow',
      [RiskLevel.Red]: 'red',
    };
    return colors[risk] || 'default';
  };

  const columns = [
    {
      title: "Service Number",
      dataIndex: "serviceNumber",
      key: "serviceNumber",
    },
    /* {
      title: "Item Description",
      dataIndex: "itemDescription",
      key: "itemDescription",
      ellipsis: true,
    }, */
    {
      title: "Service Type",
      dataIndex: "serviceType",
      key: "serviceType",
      render: (type: ServiceType) => (
        <Tag color={type === ServiceType.Multimodal ? 'blue' : 'green'}>
          {type === ServiceType.Multimodal ? 'Multimodal' : 'Unimodal'}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: ServiceStatus) => (
        {/* <Tag color={getStatusColor(status)}>
          {Object.keys(ServiceStatus)[Object.values(ServiceStatus).indexOf(status)]}
        </Tag> */}
      ),
    },
    /* {
      title: "Risk Level",
      dataIndex: "riskLevel",
      key: "riskLevel",
      render: (risk: RiskLevel) => (
        <Tag color={getRiskColor(risk)}>
          {Object.keys(RiskLevel)[Object.values(RiskLevel).indexOf(risk)]}
        </Tag>
      ),
    },
    {
      title: "Declared Value",
      dataIndex: "declaredValue",
      key: "declaredValue",
      render: (value: number) => `$${value.toLocaleString()}`,
    }, */
    {
      title: "Customer",
      dataIndex: ["customer", "firstName"],
      key: "customer",
      render: (firstName: string, record: any) => 
        `${firstName} ${record.customer?.lastName || ''}`,
    },
    /* {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          {checkPermission(permissions, permission.motService.getById) && (
            <Button
              type="link"
              icon={<Eye size={16} />}
              onClick={() => router.push(`/admin/mot/services/${record.id}`)}
            >
              View
            </Button>
          )}
          {checkPermission(permissions, permission.motService.update) && (
            <Button
              type="link"
              icon={<Edit size={16} />}
              onClick={() => handleEdit(record)}
            >
              Edit
            </Button>
          )}
          {checkPermission(permissions, permission.motService.delete) && (
            <Button
              type="link"
              danger
              icon={<Trash2 size={16} />}
              onClick={() => handleDelete(record.id)}
            >
              Delete
            </Button>
          )}
        </Space>
      ),
    }, */
  ];

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex items-center gap-2">
            
            <span>All Services Requests</span>
          </div>
        }
        extra={
          checkPermission(permissions, permission.motService.create) && (
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={handleCreate}
            >
              Create Service
            </Button>
          )
        }
      >
        {/* Filters */}
        <div className="mb-4 flex gap-4">
          <Input
            placeholder="Search services..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Status"
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            style={{ width: 150 }}
            allowClear
          >
            {Object.entries(ServiceStatus)
              .filter(([_, value]) => typeof value === 'number')
              .map(([key, value]) => (
                <Option key={value} value={value}>
                  {key}
                </Option>
              ))}
          </Select>
          <Select
            placeholder="Service Type"
            value={filters.serviceType}
            onChange={(value) => setFilters({ ...filters, serviceType: value })}
            style={{ width: 150 }}
            allowClear
          >
            {Object.entries(ServiceType)
              .filter(([_, value]) => typeof value === 'number')
              .map(([key, value]) => (
                <Option key={value} value={value}>
                  {key}
                </Option>
              ))}
          </Select>
          <Select
            placeholder="Risk Level"
            value={filters.riskLevel}
            onChange={(value) => setFilters({ ...filters, riskLevel: value })}
            style={{ width: 150 }}
            allowClear
          >
            {Object.entries(RiskLevel)
              .filter(([_, value]) => typeof value === 'number')
              .map(([key, value]) => (
                <Option key={value} value={value}>
                  {key}
                </Option>
              ))}
          </Select>
        </div>

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
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingService ? "Edit Service" : "Create Service"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="serviceNumber"
              label="Service Number"
              rules={[{ required: true, message: "Please enter service number" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="serviceType"
              label="Service Type"
              rules={[{ required: true, message: "Please select service type" }]}
            >
              <Select>
                {Object.entries(ServiceType)
                  .filter(([_, value]) => typeof value === 'number')
                  .map(([key, value]) => (
                    <Option key={value} value={value}>
                      {key}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="itemDescription"
              label="Item Description"
              rules={[{ required: true, message: "Please enter item description" }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              name="routeCategory"
              label="Route Category"
              rules={[{ required: true, message: "Please enter route category" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="declaredValue"
              label="Declared Value"
              rules={[{ required: true, message: "Please enter declared value" }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            <Form.Item
              name="taxCategory"
              label="Tax Category"
              rules={[{ required: true, message: "Please enter tax category" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="countryOfOrigin"
              label="Country of Origin"
              rules={[{ required: true, message: "Please enter country of origin" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="riskLevel"
              label="Risk Level"
              rules={[{ required: true, message: "Please select risk level" }]}
            >
              <Select>
                {Object.entries(RiskLevel)
                  .filter(([_, value]) => typeof value === 'number')
                  .map(([key, value]) => (
                    <Option key={value} value={value}>
                      {key}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ServicesPage;
