"use client";

import {
  Form,
  Input,
  Button,
  Upload,
  DatePicker,
  message,
  Card,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { createCustomer } from "@/modules/customers/customer.api";

export default function CreateCustomerPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (values[key] instanceof Date) {
          formData.append(key, values[key].toISOString());
        } else {
          formData.append(key, values[key]);
        }
      });

      formData.append("CreatedByDataEncoderId", "1");

      await createCustomer(formData);
      message.success("Customer created successfully");
      form.resetFields();
    } catch {
      message.error("Failed to create customer");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = (field: string) => ({
    beforeUpload: () => false,
    maxCount: 1,
    onChange: (info: any) =>
      form.setFieldValue(field, info.file.originFileObj),
  });

  const required = [{ required: true, message: "Required" }];

  return (
    <Card title="Create Customer">
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        {/* BUSINESS */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="BusinessName" label="Business Name" rules={required}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="TINNumber" label="TIN Number" rules={required}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="BusinessLicense"
          label="Business License"
          rules={required}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="BusinessAddress"
          label="Business Address"
          rules={required}
        >
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="City" label="City" rules={required}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="State" label="State" rules={required}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="PostalCode" label="Postal Code" rules={required}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="ImportLicenseExpiry"
          label="Import License Expiry"
          rules={required}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* CONTACT */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="ContactPerson" label="Contact Person" rules={required}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="ContactPhone" label="Contact Phone" rules={required}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="ContactEmail" label="Contact Email" rules={required}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* USER */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="FirstName" label="First Name" rules={required}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="LastName" label="Last Name" rules={required}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="Email" label="Email" rules={required}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* FILE UPLOADS (PARALLEL GRID) */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="BusinessLicenseFile"
              label="Business License File"
              rules={[{ required: true, message: "File required" }]}
            >
              <Upload {...uploadProps("BusinessLicenseFile")}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="BusinessAddressFile"
              label="Business Address Proof"
              rules={[{ required: true, message: "File required" }]}
            >
              <Upload {...uploadProps("BusinessAddressFile")}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="TaxDocumentationFile"
              label="Tax Documentation"
              rules={[{ required: true, message: "File required" }]}
            >
              <Upload {...uploadProps("TaxDocumentationFile")}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="IdentityProofFile"
              label="Identity Proof"
              rules={[{ required: true, message: "File required" }]}
            >
              <Upload {...uploadProps("IdentityProofFile")}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Button type="primary" htmlType="submit" loading={loading}>
          Create Customer
        </Button>
      </Form>
    </Card>
  );
}
