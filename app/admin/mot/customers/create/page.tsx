"use client";

import React, { useState } from "react";
import { Card, Form, Input, Button, Row, Col, Upload, DatePicker } from "antd";
import { ArrowLeft, Save, Upload as UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePermissionStore } from "@/modules/utils";
import { useDataEncoderStore } from "@/modules/data-encoder/data-encoder.store";

const CreateCustomerPage = () => {
  const router = useRouter();
  const { currentUser } = usePermissionStore();
  const { createCustomer, loading } = useDataEncoderStore();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    const formData = new FormData();

    // ================= TEXT FIELDS =================
    formData.append("BusinessName", values.businessName);
    formData.append("TINNumber", values.tinNumber);
    formData.append("City", values.city);
    formData.append("State", values.state);
    formData.append("PostalCode", values.postalCode);
    formData.append("ContactPerson", values.contactPerson);
    formData.append("ContactPhone", values.contactPhone);
    formData.append("ContactEmail", values.contactEmail);
    formData.append("BusinessType", values.businessType);
    formData.append("ImportLicense", values.importLicense);
    formData.append(
      "ImportLicenseExpiry",
      values.importLicenseExpiry.format("YYYY-MM-DD")
    );

    formData.append("Email", values.email);
    formData.append("FirstName", values.firstName);
    formData.append("LastName", values.lastName);
    formData.append("Phone", values.phone);

    // ================= FILES =================
    formData.append(
      "BusinessLicenseFile",
      values.businessLicenseFile.file
    );
    formData.append(
      "BusinessAddressFile",
      values.businessAddressFile.file
    );
    formData.append(
      "TaxDocumentationFile",
      values.taxDocumentationFile.file
    );
    formData.append(
      "IdentityProofFile",
      values.identityProofFile.file
    );

    // ================= SYSTEM FIELD =================
    formData.append(
      "CreatedByDataEncoderId",
      String(currentUser?.id)
    );

    await createCustomer(formData);
    router.push("/admin/mot/customers");
  };

  const beforeUpload = () => false; // prevent auto upload

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex items-center gap-2">
            <ArrowLeft
              className="cursor-pointer"
              onClick={() => router.back()}
            />
            <span>Create Customer</span>
          </div>
        }
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          className="max-w-5xl"
        >
          {/* ================= PERSONAL INFO ================= */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                <Input type="email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* ================= BUSINESS INFO ================= */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="businessName" label="Business Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tinNumber" label="TIN Number" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="businessType" label="Business Type" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="importLicense" label="Import License" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="importLicenseExpiry" label="Import License Expiry" rules={[{ required: true }]}>
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          {/* ================= ADDRESS ================= */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="city" label="City" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="state" label="State" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="postalCode" label="Postal Code" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* ================= CONTACT PERSON ================= */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="contactPerson" label="Contact Person" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="contactPhone" label="Contact Phone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="contactEmail" label="Contact Email" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* ================= DOCUMENTS ================= */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="businessLicenseFile" label="Business License" rules={[{ required: true }]}>
                <Upload beforeUpload={beforeUpload} maxCount={1}>
                  <Button icon={<UploadIcon />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="businessAddressFile" label="Business Address Proof" rules={[{ required: true }]}>
                <Upload beforeUpload={beforeUpload} maxCount={1}>
                  <Button icon={<UploadIcon />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="taxDocumentationFile" label="Tax Documentation" rules={[{ required: true }]}>
                <Upload beforeUpload={beforeUpload} maxCount={1}>
                  <Button icon={<UploadIcon />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="identityProofFile" label="Identity Proof" rules={[{ required: true }]}>
                <Upload beforeUpload={beforeUpload} maxCount={1}>
                  <Button icon={<UploadIcon />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          {/* ================= ACTIONS ================= */}
          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => router.back()}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading} icon={<Save />}>
              Create Customer
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateCustomerPage;
