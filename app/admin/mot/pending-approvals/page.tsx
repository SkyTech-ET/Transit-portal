"use client";

import React, { useEffect, useState } from "react";
import { Card, Table, Button, Space, Tag, Typography, Empty, Modal, Form, Input, Select, message, Badge } from "antd";
import { CheckCircle, XCircle, Eye, Clock, User, FileText, Calendar } from "lucide-react";
import { usePermissionStore } from "@/modules/utils";
import { useCustomerStore } from "@/modules/mot/customer";
import permission from "@/modules/utils/permission/permission";

const { TextArea } = Input;
const { Option } = Select;

const PendingApprovalsPage = () => {
  const { checkPermission, permissions } = usePermissionStore();
  const { pendingCustomers, loading, getPendingCustomers, approveCustomer } = useCustomerStore();
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadPendingApprovals();
  }, []);

  const loadPendingApprovals = async () => {
    await getPendingCustomers();
  };

  const handleViewDetails = (approval: PendingApproval) => {
    setSelectedApproval(approval);
    setModalVisible(true);
  };

  const handleAction = (approval: PendingApproval, type: 'approve' | 'reject') => {
    setSelectedApproval(approval);
    setActionType(type);
    setActionModalVisible(true);
    form.resetFields();
  };

  const handleSubmitAction = async (values: any) => {
    if (!selectedApproval) return;
    
    try {
      await approveCustomer(selectedApproval.id, {
        isApproved: actionType === 'approve',
        notes: values.notes || '',
      });
      
      message.success(`Customer ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`);
      setActionModalVisible(false);
      setModalVisible(false);
      form.resetFields();
      await loadPendingApprovals();
    } catch (error: any) {
      message.error(error.message || 'Failed to process approval');
    }
  };

  const getStatusColor = (isVerified: boolean) => {
    return isVerified ? 'green' : 'orange';
  };

  const pendingCount = pendingCustomers.length;

  const columns = [
    {
      title: "Business Name",
      dataIndex: "businessName",
      key: "businessName",
      width: 150,
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      key: "contactPerson",
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "contactEmail",
      key: "contactEmail",
      width: 150,
    },
    {
      title: "Phone",
      dataIndex: "contactPhone",
      key: "contactPhone",
      width: 120,
    },
    {
      title: "TIN Number",
      dataIndex: "tinNumber",
      key: "tinNumber",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "isVerified",
      key: "isVerified",
      width: 100,
      render: (isVerified: boolean) => (
        <Tag color={getStatusColor(isVerified)}>
          {isVerified ? 'VERIFIED' : 'PENDING'}
        </Tag>
      ),
    },
    {
      title: "Registered Date",
      dataIndex: "registeredDate",
      key: "registeredDate",
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            icon={<Eye size={16} />}
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
          {!record.isVerified && checkPermission(permissions, permission.motCustomer.approve) && (
            <>
              <Button
                type="primary"
                icon={<CheckCircle size={16} />}
                onClick={() => handleAction(record, 'approve')}
              >
                Approve
              </Button>
              <Button
                danger
                icon={<XCircle size={16} />}
                onClick={() => handleAction(record, 'reject')}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock size={24} className="text-orange-600" />
        <Typography.Title level={2} className="mb-0">
          Pending Approvals
          <Badge count={pendingCount} style={{ marginLeft: 8 }} />
        </Typography.Title>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
            </div>
            <Clock className="text-orange-600" size={24} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-600">{pendingCount}</p>
            </div>
            <FileText className="text-gray-600" size={24} />
          </div>
        </Card>
      </div>

      <Card bordered>
        <Table
          dataSource={pendingCustomers}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No pending approvals found"
              />
            ),
          }}
        />
      </Card>

      {/* Details Modal */}
      <Modal
        title="Approval Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedApproval && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Business Name:</strong> {selectedApproval.businessName}
              </div>
              <div>
                <strong>Contact Person:</strong> {selectedApproval.contactPerson}
              </div>
              <div>
                <strong>Email:</strong> {selectedApproval.contactEmail}
              </div>
              <div>
                <strong>Phone:</strong> {selectedApproval.contactPhone}
              </div>
              <div>
                <strong>TIN Number:</strong> {selectedApproval.tinNumber}
              </div>
              <div>
                <strong>Business License:</strong> {selectedApproval.businessLicense}
              </div>
              <div>
                <strong>Status:</strong> 
                <Tag color={getStatusColor(selectedApproval.isVerified)} className="ml-2">
                  {selectedApproval.isVerified ? 'VERIFIED' : 'PENDING'}
                </Tag>
              </div>
              <div>
                <strong>Registered Date:</strong> {new Date(selectedApproval.registeredDate).toLocaleString()}
              </div>
              <div>
                <strong>Business Address:</strong> {selectedApproval.businessAddress}
              </div>
              <div>
                <strong>City:</strong> {selectedApproval.city}
              </div>
              <div>
                <strong>State:</strong> {selectedApproval.state}
              </div>
              <div>
                <strong>Postal Code:</strong> {selectedApproval.postalCode}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Action Modal */}
      <Modal
        title={`${actionType === 'approve' ? 'Approve' : 'Reject'} Customer`}
        open={actionModalVisible}
        onCancel={() => setActionModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitAction}
        >
          <Form.Item
            label="Notes"
            name="notes"
            rules={[{ required: actionType === 'reject', message: 'Please provide a reason for rejection' }]}
          >
            <TextArea
              rows={4}
              placeholder={actionType === 'approve' ? 'Optional approval notes...' : 'Please provide reason for rejection...'}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </Button>
              <Button onClick={() => setActionModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PendingApprovalsPage;











