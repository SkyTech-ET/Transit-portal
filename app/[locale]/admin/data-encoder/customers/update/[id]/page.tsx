"use client";

import { useEffect, useState } from "react";
import { Spin, Empty, Card, Row, Col, Typography, Button, Tag, Modal, Form, Input, Select, Radio, Upload, message, Divider } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useDataEncoderStore } from "@/modules/data-encoder/data-encoder.store";
import { useRoleStore } from "@/modules/role/role.store";
import { RecordStatus } from "@/modules/common/common.types";

const { Title, Text } = Typography;

export default function UpdateCustomerPage() {
  const { customers, loading, getCustomers, updateCustomer } = useDataEncoderStore();
  const { roles, getRoles } = useRoleStore();
  const [submitting, setSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [form] = Form.useForm();

  // Load customers and roles
  useEffect(() => {
    if (customers.length === 0) getCustomers(RecordStatus.Active);
    if (roles.length === 0) getRoles(RecordStatus.Active);
  }, [customers.length, roles.length, getCustomers, getRoles]);

  const openUpdateModal = (customer: any) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);

    // Prefill form
    form.setFieldsValue({
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
      email: customer.email || "",
      phone: customer.contactPhone || "",
      username: customer.username || "",
      password: "", // leave empty for security
      businessName: customer.businessName || "",
      tinNumber: customer.tinNumber || "",
      businessType: customer.businessType || "",
      contactPhone: customer.contactPhone || "",
      contactEmail: customer.contactEmail || "",
      isSuperAdmin: customer.isSuperAdmin || false,
      roles: customer.roles?.map((r: any) => r.id) || [],
      businessAddress: customer.businessAddress || "",
      businessLicense: customer.businessLicense || "",
      profileFile: null,
      identityProofFile: null,
      businessAddressFile: null,
      businessLicenseFile: null,
      taxDocumentationFile: null,
    });
  };

  const closeModal = () => {
    setSelectedCustomer(null);
    setIsModalOpen(false);
    form.resetFields();
  };

  const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);

  const handleSubmit = async (values: any) => {
    if (!selectedCustomer) return;

    const formData = new FormData();
    formData.append("Id", selectedCustomer.id.toString());
    formData.append("FirstName", values.firstName);
    formData.append("LastName", values.lastName);
    formData.append("Email", values.email);
    formData.append("Phone", values.phone);
    formData.append("UserName", values.username);
    formData.append("Password", values.password || "");
    formData.append("BusinessName", values.businessName);
    formData.append("TINNumber", values.tinNumber);
    formData.append("BusinessType", values.businessType);
    formData.append("BusinessAddress", values.businessAddress);
    formData.append("BusinessLicense", values.businessLicense);
    formData.append("ContactPhone", values.contactPhone);
    formData.append("ContactEmail", values.contactEmail);
    formData.append("Roles", values.roles?.toString() || "");
    formData.append("IsSuperAdmin", values.isSuperAdmin ? "true" : "false");
    formData.append("RecordStatus", RecordStatus.Active.toString());

    // File uploads
    const filesMapping: [string, string][] = [
      ["ProfileFile", "profileFile"],
      ["IdentityProofFile", "identityProofFile"],
      ["BusinessAddressFile", "businessAddressFile"],
      ["BusinessLicenseFile", "businessLicenseFile"],
      ["TaxDocumentationFile", "taxDocumentationFile"],
    ];
    filesMapping.forEach(([key, fieldName]) => {
      const files = values[fieldName];
      if (files && files.length > 0) {
        formData.append(key, files[0].originFileObj);
      }
    });

    try {
      setSubmitting(true);
      await updateCustomer(formData);
      message.success("Customer updated successfully!");
      closeModal();
    } catch (err) {
      message.error("Failed to update customer. Ensure all required fields are uploaded.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Spin size="large" />
      </div>
    );
  }

  const filteredCustomers = customers.filter((c) => c.userId === 0);

  if (filteredCustomers.length === 0) return <Empty description="No customers to update" />;

  return (
    <div className="p-8">
      <Title level={4} className="mb-6">Customers without Users</Title>

      <Row gutter={[16, 16]}>
        {filteredCustomers.map((customer) => (
          <Col xs={24} sm={12} lg={8} key={customer.id}>
            <Card bordered={false} className="rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-3">
                <Text strong className="text-lg">{customer.businessName}</Text>
                {customer.isVerified && <Tag color="green">Verified</Tag>}
              </div>

              <div className="text-sm text-gray-700 space-y-1">
                <div><strong>TIN:</strong> {customer.tinNumber}</div>
                <div><strong>Contact:</strong> {customer.contactPerson}</div>
                <div><strong>Email:</strong> {customer.contactEmail}</div>
              </div>

              <div className="mt-4 flex gap-3">
                <Button type="primary" className="flex-1" onClick={() => openUpdateModal(customer)}>
                  Update Customer
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Update Modal */}
      <Modal
        title={`Update Customer - ${selectedCustomer?.businessName}`}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={800}
      >
        {selectedCustomer && (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {/* BASIC INFO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                <Input />
              </Form.Item>
              <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, min: 6, message: "Password must be at least 6 characters" }]}
              >
                <Input.Password placeholder="Enter new password" />
              </Form.Item>
              <Form.Item name="contactPhone" label="Contact Phone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="contactEmail" label="Contact Email" rules={[{ required: true, type: "email" }]}>
                <Input />
              </Form.Item>
            </div>

            {/* BUSINESS INFO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Form.Item name="businessName" label="Business Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="tinNumber" label="TIN Number" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="businessType" label="Business Type" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="businessAddress" label="Business Address" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="businessLicense" label="Business License" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </div>

            {/* ROLES & ADMIN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Form.Item name="roles" label="Role" rules={[{ required: true }]}>
                <Select placeholder="Select role">
                  {roles.map((role: any) => (
                    <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="isSuperAdmin" label="Super Admin">
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </div>

            {/* FILE UPLOADS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {[
                ["profileFile", "Profile Photo"],
                ["identityProofFile", "Identity Proof"],
                ["businessAddressFile", "Business Address File"],
                ["businessLicenseFile", "Business License File"],
                ["taxDocumentationFile", "Tax Documentation File"],
              ].map(([name, label]) => (
                <Form.Item
                  key={name}
                  name={name}
                  label={label}
                  valuePropName="file"
                  getValueFromEvent={normFile}
                  rules={[{ required: true }]}
                >
                  <Upload beforeUpload={() => false} maxCount={1}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Form.Item>
              ))}
            </div>

            <div className="flex gap-2 mt-6 justify-end">
              <Button type="primary" htmlType="submit" loading={submitting}>
                Update Customer
              </Button>
              <Button onClick={closeModal}>Cancel</Button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
}