"use client";

import React, { useEffect, useState } from "react";
import { useDocumentStore } from "@/modules/mot/document";
import { useCustomerStore } from "@/modules/mot/customer";
import { usePermissionStore } from "@/modules/utils";
import { Card, Table, Button, Space, Tag, Typography, Empty, Select, Upload, message, Modal, Form, Input } from "antd";
import { FileText, Upload as UploadIcon, Download, Eye, Trash2 } from "lucide-react";

const { Title } = Typography;
const { Option } = Select;

const DocumentsPage = () => {
  const { documents, loading, getAllDocuments, deleteDocument } = useDocumentStore();
  const { customers, getAllCustomers } = useCustomerStore();
  const { checkPermission, permissions } = usePermissionStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadForm] = Form.useForm();

  useEffect(() => {
    getAllDocuments();
    getAllCustomers();
  }, [getAllDocuments, getAllCustomers]);

  const handleUploadClick = () => {
    setUploadModalVisible(true);
  };

  const handleUploadSubmit = async (values: any) => {
    try {
      // Here you would implement the actual upload logic
      // For now, just show success message
      message.success('Document uploaded successfully');
      setUploadModalVisible(false);
      uploadForm.resetFields();
      getAllDocuments(); // Refresh the documents list
    } catch (error) {
      message.error('Failed to upload document');
    }
  };

  const handleUploadCancel = () => {
    setUploadModalVisible(false);
    uploadForm.resetFields();
  };

  const handleDelete = (documentId: number) => {
    deleteDocument(documentId)
      .then(() => {
        message.success('Document deleted successfully');
        getAllDocuments();
      })
      .catch(() => {
        message.error('Failed to delete document');
      });
  };

  const columns = [
    {
      title: "Document Name",
      dataIndex: "fileName",
      key: "fileName",
      render: (fileName: string) => (
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-blue-600" />
          <span>{fileName}</span>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "documentType",
      key: "documentType",
      render: (type: number) => {
        const types = {
          1: "Service Document",
          2: "Stage Document", 
          3: "Customer Document"
        };
        return <Tag color="blue">{types[type as keyof typeof types] || "Unknown"}</Tag>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "isVerified",
      key: "isVerified",
      render: (isVerified: boolean) => (
        <Tag color={isVerified ? "green" : "orange"}>
          {isVerified ? "Verified" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Uploaded Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<Eye size={14} />}
            onClick={() => window.open(record.fileUrl, '_blank')}
          >
            View
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<Download size={14} />}
            onClick={() => window.open(record.fileUrl, '_blank')}
          >
            Download
          </Button>
          <Button 
            type="link" 
            size="small" 
            danger
            icon={<Trash2 size={14} />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const filteredDocuments = selectedCategory === "all" 
    ? documents 
    : documents.filter(doc => doc.documentType.toString() === selectedCategory);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="text-blue-600" size={24} />
        <Title level={2} className="mb-0">
          Documents
        </Title>
      </div>

      <Card>
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 200 }}
            >
              <Option value="all">All Documents</Option>
              <Option value="1">Service Documents</Option>
              <Option value="2">Stage Documents</Option>
              <Option value="3">Customer Documents</Option>
            </Select>
          </div>
          <Button 
            type="primary" 
            icon={<UploadIcon size={16} />}
            onClick={handleUploadClick}
          >
            Upload Document
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredDocuments}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} documents`,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No documents found"
              />
            ),
          }}
        />
      </Card>

      {/* Upload Modal */}
      <Modal
        title="Upload Document"
        open={uploadModalVisible}
        onCancel={handleUploadCancel}
        footer={null}
        width={600}
      >
        <Form
          form={uploadForm}
          layout="vertical"
          onFinish={handleUploadSubmit}
        >
          <Form.Item
            name="customerId"
            label="Customer"
            rules={[{ required: true, message: "Please select customer" }]}
          >
            <Select placeholder="Select customer">
              {customers.map((customer) => (
                <Option key={customer.id} value={customer.id}>
                  {customer.contactPerson} ({customer.contactEmail})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="documentType"
            label="Document Type"
            rules={[{ required: true, message: "Please select document type" }]}
          >
            <Select placeholder="Select document type">
              <Option value={1}>Service Document</Option>
              <Option value={2}>Stage Document</Option>
              <Option value={3}>Customer Document</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter document description" />
          </Form.Item>

          <Form.Item
            name="file"
            label="File"
            rules={[{ required: true, message: "Please select a file" }]}
          >
            <Upload
              beforeUpload={() => false} // Prevent auto upload
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              maxCount={1}
            >
              <Button icon={<UploadIcon size={16} />}>
                Select File
              </Button>
            </Upload>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleUploadCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Upload Document
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DocumentsPage;
