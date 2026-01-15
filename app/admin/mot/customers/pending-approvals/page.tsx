"use client";

import React, { useEffect, useState } from "react";
import { Card, Table, Button, Space, Tag, Modal, Form, Input, message, Descriptions, Upload } from "antd";
import { CheckCircle, XCircle, Eye, Download } from "lucide-react";
import { useCustomerStore, DocumentType } from "@/modules/mot/customer";
import { useDocumentStore, DocumentCategory } from "@/modules/mot/document";

const { TextArea } = Input;

const PendingApprovalsPage = () => {
  const { 
    pendingCustomers, 
    loading, 
    getPendingCustomers,
    approveCustomer 
  } = useCustomerStore();
  
  const { downloadDocument } = useDocumentStore();
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    getPendingCustomers();
  }, []);

  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer);
    setIsModalVisible(true);
  };

  const handleApprove = (customerId: number, isApproved: boolean) => {
    form.validateFields().then((values) => {
      approveCustomer(customerId, {
        isApproved,
        verificationNotes: values.verificationNotes
      });
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleDownloadDocument = (documentId: number) => {
    downloadDocument(documentId, DocumentCategory.Customer);
  };

  const columns = [
    {
      title: "Business Name",
      dataIndex: "businessName",
      key: "businessName",
    },
    {
      title: "Business Type",
      dataIndex: "businessType",
      key: "businessType",
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      key: "contactPerson",
    },
    {
      title: "Contact Email",
      dataIndex: "contactEmail",
      key: "contactEmail",
    },
    {
      title: "Business License",
      dataIndex: "businessLicense",
      key: "businessLicense",
    },
    {
      title: "Submitted Date",
      dataIndex: "registeredDate",
      key: "registeredDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Documents",
      dataIndex: "documents",
      key: "documents",
      render: (documents: any[]) => (
        <Tag color="blue">
          {documents?.length || 0} documents
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<Eye />}
            onClick={() => handleViewDetails(record)}
          >
            Review
          </Button>
          <Button
            type="link"
            icon={<CheckCircle />}
            onClick={() => handleApprove(record.id, true)}
            style={{ color: 'green' }}
          >
            Approve
          </Button>
          <Button
            type="link"
            icon={<XCircle />}
            onClick={() => handleApprove(record.id, false)}
            style={{ color: 'red' }}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex items-center gap-2">
            <CheckCircle size={20} />
            <span>Pending Customer Approvals</span>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={pendingCustomers}
          loading={loading}
          rowKey="id"
          pagination={{
            total: pendingCustomers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* Customer Review Modal */}
      <Modal
        title="Customer Review & Approval"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
        footer={null}
      >
        {selectedCustomer && (
          <div>
            <Descriptions title="Customer Information" bordered column={2}>
              <Descriptions.Item label="Business Name">
                {selectedCustomer.businessName}
              </Descriptions.Item>
              <Descriptions.Item label="Business Type">
                {selectedCustomer.businessType}
              </Descriptions.Item>
              <Descriptions.Item label="Business License">
                {selectedCustomer.businessLicense}
              </Descriptions.Item>
              <Descriptions.Item label="Tax ID">
                {selectedCustomer.taxId}
              </Descriptions.Item>
              <Descriptions.Item label="Contact Person">
                {selectedCustomer.contactPerson}
              </Descriptions.Item>
              <Descriptions.Item label="Contact Phone">
                {selectedCustomer.contactPhone}
              </Descriptions.Item>
              <Descriptions.Item label="Contact Email">
                {selectedCustomer.contactEmail}
              </Descriptions.Item>
              <Descriptions.Item label="Business Address">
                {selectedCustomer.businessAddress}
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-6">
              <h4>Documents</h4>
              <div className="grid grid-cols-2 gap-4">
                {selectedCustomer.documents?.map((doc: any) => (
                  <Card key={doc.id} size="small">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        <span>{doc.originalFileName}</span>
                      </div>
                      <Button
                        type="link"
                        icon={<Download />}
                        onClick={() => handleDownloadDocument(doc.id)}
                      >
                        Download
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Form form={form} layout="vertical" className="mt-6">
              <Form.Item
                name="verificationNotes"
                label="Verification Notes"
                rules={[{ required: true, message: "Please enter verification notes" }]}
              >
                <TextArea rows={4} placeholder="Enter your verification notes..." />
              </Form.Item>

              <div className="flex justify-end gap-2">
                <Button onClick={() => setIsModalVisible(false)}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<XCircle />}
                  onClick={() => handleApprove(selectedCustomer.id, false)}
                >
                  Reject
                </Button>
                <Button
                  type="primary"
                  icon={<CheckCircle />}
                  onClick={() => handleApprove(selectedCustomer.id, true)}
                >
                  Approve
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PendingApprovalsPage;





