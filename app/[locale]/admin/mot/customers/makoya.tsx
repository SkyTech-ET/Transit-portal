"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Form, Input, Button, Upload, Radio, Select, Spin, Empty, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDataEncoderStore } from "@/modules/data-encoder/data-encoder.store";
import { useRoleStore } from "@/modules/role/role.store";
import { RecordStatus } from "@/modules/common/common.types";
import { CustomerDTO } from "@/modules/data-encoder/data-encoder.types";

export default function UpdateCustomerPage() {
  const [form] = Form.useForm();
  const params = useParams();
  const router = useRouter();
  const customerId = Number(params.id);

  const { customers, loading, getCustomers, updateCustomer } = useDataEncoderStore();
  const { roles, getRoles } = useRoleStore();
  const [submitting, setSubmitting] = useState(false);

  // Load customers if not already loaded
  useEffect(() => {
    if (customers.length === 0) getCustomers(RecordStatus.Active);
  }, [customers.length, getCustomers]);

  // Load roles if not loaded
  useEffect(() => {
    if (roles.length === 0) getRoles(RecordStatus.Active);
  }, [roles.length, getRoles]);

  // Find the customer locally
  const customer: CustomerDTO | undefined = useMemo(() => {
    return customers.find((c) => c.id === customerId);
  }, [customers, customerId]);

  // Prefill form when customer is available
  useEffect(() => {
    if (!customer) return;

    form.setFieldsValue({
      //firstName: customer.firstName || "",
      //lastName: customer.lastName || "",
      //email: customer.email || "",
      //phone: customer.phone || "",
      //username: customer.user?.username || "",
      businessName: customer.businessName || "",
      tinNumber: customer.tinNumber || "",
      businessType: customer.businessType || "",
      contactPhone: customer.contactPhone || "",
      contactEmail: customer.contactEmail || "",
      //roles: customer.user?.userRoles?.[0]?.roleId || undefined,
      //isSuperAdmin: customer.isSuperAdmin || false,
    });
  }, [customer, form]);

  // Normalize file uploads
  const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);

  // Handle form submission
  const handleSubmit = async (values: any) => {
    if (!customer) return;

    const formData = new FormData();

    // Core fields
    formData.append("Id", customer.id.toString());
    formData.append("FirstName", values.firstName);
    formData.append("LastName", values.lastName);
    formData.append("Email", values.email);
    formData.append("Phone", values.phone);
    formData.append("UserName", values.username);
    formData.append("Password", values.password || ""); // backend will hash
    formData.append("BusinessName", values.businessName);
    formData.append("TINNumber", values.tinNumber);
    formData.append("BusinessType", values.businessType);
    formData.append("BusinessAddress", values.businessAddress);
    formData.append("BusinessLicense", values.businessLicense);
    formData.append("ContactPhone", values.contactPhone || "");
    formData.append("ContactEmail", values.contactEmail || "");
    formData.append("Roles", values.roles?.toString() || "");
    formData.append("IsSuperAdmin", values.isSuperAdmin ? "true" : "false");
    formData.append("RecordStatus", RecordStatus.Active.toString());

    // File uploads
    [
      ["ProfileFile", "profileFile"],
      ["BusinessAddressFile", "businessAddressFile"],
      ["BusinessLicenseFile", "businessLicenseFile"],
      ["IdentityProofFile", "identityProofFile"],
      ["BusinessAddress", "businessAddress"],
      ["BusinessLicense", "businessLicense"],
      ["TaxDocumentationFile", "taxDocumentationFile"],
    ].forEach(([key, fieldName]) => {
      const files = values[fieldName];
      if (files && files.length > 0) {
        formData.append(key, files[0].originFileObj);
      }
    });

    try {
      setSubmitting(true);
      await updateCustomer(formData);
      message.success("Customer and user updated successfully");
      router.push("/admin/mot/customers/services");
    } catch (err) {
      message.error("Failed to update customer/user");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !customer) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (!customer) return <Empty description="Customer not found" />;

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-6">Update Customer & User</h2>

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
          <Form.Item name="contactPhone" label="Contact Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contactEmail" label="Contact Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ min: 6, message: "Password must be at least 6 characters" }]}
          >
            <Input.Password placeholder="Leave empty to keep current password" />
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
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
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
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  <Form.Item
    name="profileFile"
    label="Profile Photo"
    valuePropName="file"
    getValueFromEvent={normFile}
    rules={[{ required: true }]}
  >
    <Upload beforeUpload={() => false} maxCount={1}>
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  </Form.Item>

  {/* <Form.Item
    name="businessAddress"
    label="Business Address"
    valuePropName="file"
    getValueFromEvent={normFile}
    rules={[{ required: true }]}
  >
    <Upload beforeUpload={() => false} maxCount={1}>
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  </Form.Item>

  <Form.Item
    name="businessLicense"
    label="Business License"
    valuePropName="file"
    getValueFromEvent={normFile}
    rules={[{ required: true }]}
  >
    <Upload beforeUpload={() => false} maxCount={1}>
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  </Form.Item> */}

  <Form.Item
    name="identityProofFile"
    label="Identity Proof"
    valuePropName="file"
    getValueFromEvent={normFile}
    rules={[{ required: true }]}
  >
    <Upload beforeUpload={() => false} maxCount={1}>
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  </Form.Item>

  <Form.Item
    name="businessAddressFile"
    label="Business Address File"
    valuePropName="file"
    getValueFromEvent={normFile}
    rules={[{ required: true }]}
  >
    <Upload beforeUpload={() => false} maxCount={1}>
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  </Form.Item>

  <Form.Item
    name="businessLicenseFile"
    label="Business License File"
    valuePropName="file"
    getValueFromEvent={normFile}
    rules={[{ required: true }]}
  >
    <Upload beforeUpload={() => false} maxCount={1}>
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  </Form.Item>

  <Form.Item
    name="taxDocumentationFile"
    label="Tax Documentation"
    valuePropName="file"
    getValueFromEvent={normFile}
    rules={[{ required: true }]}
  >
    <Upload beforeUpload={() => false} maxCount={1}>
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  </Form.Item>

</div>

        {/* EXISTING FILE LINKS */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-6">
          {customer.businessLicense && (
            <a
              href={`https://transitportal.skytechet.com/${customer.businessLicense}`}
              target="_blank"
              className="text-blue-600"
            >
              View Business License
            </a>
          )}
          {customer.businessAddress && (
            <a
              href={`https://transitportal.skytechet.com/${customer.businessAddress}`}
              target="_blank"
              className="text-blue-600"
            >
              View Business Address
            </a>
          )}
        </div> */}

        {/* ACTIONS */}
        <div className="flex gap-2">
          <Button type="primary" htmlType="submit" loading={submitting}>
            Save Changes
          </Button>
          <Button onClick={() => router.back()}>Cancel</Button>
        </div>
      </Form>
    </div>
  );
}