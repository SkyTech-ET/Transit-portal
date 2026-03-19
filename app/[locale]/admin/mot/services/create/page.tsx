"use client";

import React, { useState, useEffect } from "react";
import { Card, Form, Input, Select, Button, message, Row, Col } from "antd";
import { Save, ArrowLeft } from "lucide-react";
import { useServiceStore, ServiceType, RiskLevel } from "@/modules/mot/service";
import { useUserStore } from "@/modules/user";   // <-- we use user store
import { useRouter } from "next/navigation";

const { Option } = Select;
const { TextArea } = Input;

const CreateServicePage = () => {
  const router = useRouter();
  const { createService, loading } = useServiceStore();
  const { users, getUsers } = useUserStore();
  const [form] = Form.useForm();

  useEffect(() => {
    getUsers(2); // load all active users
  }, []);

  // 🔥 FILTER ONLY CUSTOMERS
  const customers = users.filter(user =>
    user.userRoles?.some(role => role.roleId === 3)
  );
  
  const handleSubmit = async (values: any) => {
    try {
      await createService(values);
      message.success("Service created successfully");
      router.push("/admin/mot/services");
    } catch (error) {
      console.log(error);
      message.error("Failed to create service");
    }
  };

  const handleCancel = () => {
    router.push("/admin/mot/services");
  };

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex items-center gap-2">
            <ArrowLeft className="cursor-pointer" onClick={handleCancel} />
            <span>Create New Service</span>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="max-w-4xl"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="serviceType"
                label="Service Type"
                rules={[{ required: true, message: "Please select service type" }]}
              >
                <Select placeholder="Select service type">
                  {Object.entries(ServiceType)
                    .filter(([_, val]) => typeof val === "number")
                    .map(([key, val]) => (
                      <Option key={val} value={val}>
                        {key}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="routeCategory"
                label="Route Category"
                rules={[{ required: true, message: "Please enter route category" }]}
              >
                <Input placeholder="Enter route category" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="countryOfOrigin"
                label="Country of Origin"
                rules={[
                  { required: true, message: "Please enter country of origin" },
                ]}
              >
                <Input placeholder="Enter country of origin" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="declaredValue"
                label="Declared Value"
                rules={[
                  { required: true, message: "Please enter declared value" },
                ]}
              >
                <Input placeholder="Enter declared value" type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="itemDescription"
                label="Item Description"
                rules={[
                  { required: true, message: "Please enter item description" },
                ]}
              >
                <TextArea rows={3} placeholder="Enter item description" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="taxCategory"
                label="Tax Category"
                rules={[
                  { required: true, message: "Please enter tax category" },
                ]}
              >
                <Input placeholder="Enter tax category" />
              </Form.Item>
            </Col>
       {/*  CUSTOMER DROPDOWN  */}
            <Col span={12}>
              <Form.Item
                name="customerId"
                label="Customer"
                rules={[{ required: true, message: "Please select customer" }]}
              >
                <Select placeholder="Select customer">
                  {customers.map((customer) => (
                    <Option key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName} ({customer.email})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

        
         

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<Save />}
            >
              Create Service
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateServicePage;
