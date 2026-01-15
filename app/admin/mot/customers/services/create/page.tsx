"use client";

import React, { useEffect, useState } from "react";
import { Card, Form, Input, Select, InputNumber, Button, message, Row, Col, Upload, Space } from "antd";
import { Save, ArrowLeft, Upload as UploadIcon } from "lucide-react";
import { useServiceStore, ServiceType, RiskLevel } from "@/modules/mot/service";
import { useCustomerStore } from "@/modules/mot/customer";
import { useRouter } from "next/navigation";
import { usePermissionStore } from "@/modules/utils";

const { Option } = Select;
const { TextArea } = Input;

const CreateCustomerServicePage = () => {
  const router = useRouter();
  const { createCustomerService, loading } = useServiceStore();
  const { currentCustomer, getCustomerById } = useCustomerStore();
  const { currentUser } = usePermissionStore();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    // If user is a customer, get their customer record
    if (currentUser?.id) {
      // Try to get customer by user ID
      // This assumes customer.userId matches currentUser.id
      // You may need to adjust based on your data structure
    }
  }, [currentUser]);

  const handleSubmit = async (values: any) => {
    try {
      // Generate service number if not provided
      if (!values.serviceNumber) {
        const timestamp = Date.now();
        values.serviceNumber = `SRV-${timestamp}`;
      }

      // Set customer ID from current user's customer record
      if (currentCustomer) {
        values.customerId = currentCustomer.id;
      } else if (currentUser?.id) {
        // Fallback: use user ID if customer record not found
        // You may need to adjust this based on your data structure
        values.customerId = currentUser.id;
      }

      await createCustomerService(values);
      message.success("Service request created successfully");
      router.push("/admin/mot/customers/services");
    } catch (error: any) {
      message.error(error.message || "Failed to create service request");
    }
  };

  const handleCancel = () => {
    router.push("/admin/mot/customers/services");
  };

  const handleFileChange = (info: any) => {
    setFileList(info.fileList);
  };

  const beforeUpload = (file: File) => {
    const isPDF = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');
    if (!isPDF && !isImage) {
      message.error('You can only upload PDF or image files!');
      return false;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('File must be smaller than 10MB!');
      return false;
    }
    return false; // Prevent auto upload
  };

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex items-center gap-2">
            <ArrowLeft 
              className="cursor-pointer" 
              onClick={handleCancel}
            />
            <span>Create Service Request</span>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="max-w-4xl"
          initialValues={{
            serviceType: ServiceType.Multimodal,
            riskLevel: RiskLevel.Green,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="serviceNumber"
                label="Service Number"
                tooltip="Leave empty to auto-generate"
              >
                <Input placeholder="Auto-generated if left empty" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="serviceType"
                label="Service Type"
                rules={[{ required: true, message: "Please select service type" }]}
              >
                <Select placeholder="Select service type">
                  {Object.entries(ServiceType)
                    .filter(([_, value]) => typeof value === 'number')
                    .map(([key, value]) => (
                      <Option key={value} value={value}>
                        {key}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="itemDescription"
                label="Item Description"
                rules={[{ required: true, message: "Please enter item description" }]}
              >
                <TextArea rows={4} placeholder="Enter detailed description of items to be transported" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="routeCategory"
                label="Route Category"
                rules={[{ required: true, message: "Please enter route category" }]}
              >
                <Select placeholder="Select route category">
                  <Option value="Air Freight">Air Freight</Option>
                  <Option value="Sea Freight">Sea Freight</Option>
                  <Option value="Road Transport">Road Transport</Option>
                  <Option value="Rail Transport">Rail Transport</Option>
                  <Option value="Multimodal">Multimodal</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="countryOfOrigin"
                label="Country of Origin"
                rules={[{ required: true, message: "Please enter country of origin" }]}
              >
                <Input placeholder="Enter country of origin" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="declaredValue"
                label="Declared Value (USD)"
                rules={[{ required: true, message: "Please enter declared value" }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter declared value"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="taxCategory"
                label="Tax Category"
                rules={[{ required: true, message: "Please enter tax category" }]}
              >
                <Select placeholder="Select tax category">
                  <Option value="Standard">Standard</Option>
                  <Option value="Exempt">Exempt</Option>
                  <Option value="Reduced">Reduced</Option>
                  <Option value="Zero">Zero</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="riskLevel"
                label="Risk Level"
                rules={[{ required: true, message: "Please select risk level" }]}
              >
                <Select placeholder="Select risk level">
                  {Object.entries(RiskLevel)
                    .filter(([_, value]) => typeof value === 'number')
                    .map(([key, value]) => (
                      <Option key={value} value={value}>
                        {key}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="specialInstructions"
                label="Special Instructions"
              >
                <TextArea rows={3} placeholder="Any special instructions or requirements" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Supporting Documents"
                tooltip="Upload relevant documents (invoices, certificates, etc.)"
              >
                <Upload
                  fileList={fileList}
                  onChange={handleFileChange}
                  beforeUpload={beforeUpload}
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                >
                  <Button icon={<UploadIcon />}>Select Files</Button>
                </Upload>
                <div className="text-sm text-gray-500 mt-2">
                  Accepted formats: PDF, JPG, PNG (Max 10MB per file)
                </div>
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<Save />}
            >
              Submit Service Request
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateCustomerServicePage;
