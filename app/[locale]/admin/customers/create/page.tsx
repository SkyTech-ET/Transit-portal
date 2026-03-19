"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, DatePicker, Select, Button, Card, Row, Col, message } from "antd";
import { useCustomerStore } from "@/modules/customers/customer.store";

const { Option } = Select;

export default function AddCustomerPage() {
  const router = useRouter();
  const { createCustomer, loading } = useCustomerStore();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setSaving(true);
      await createCustomer(values);
      message.success("Customer added successfully!");
      router.push("/admin/customers");
    } catch (err) {
      console.error(err);
      message.error("Failed to add customer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="max-w-5xl mx-auto shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">New Customer Details</h2>
            <p className="text-gray-500 text-sm">
              Fill out the form below to add a new customer to your database.
            </p>
          </div>
          <Button type="link" onClick={() => router.push("/admin/customers")}>
            ← Back to Customers
          </Button>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          className="space-y-4"
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <h3 className="font-semibold text-gray-700 mb-3">Personal Information</h3>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "Please enter first name" }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: "Please enter last name" }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
              <Form.Item label="Date of Birth" name="dob">
                <DatePicker className="w-full" placeholder="mm/dd/yyyy" />
              </Form.Item>
              <Form.Item label="Gender" name="gender">
                <Select placeholder="Select gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <h3 className="font-semibold text-gray-700 mb-3">Contact Information</h3>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please enter email" }]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[{ required: true, message: "Please enter phone number" }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
              <Form.Item label="Address" name="address">
                <Input placeholder="Enter street address" />
              </Form.Item>
              <Form.Item label="City" name="city">
                <Input placeholder="Enter city" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="State" name="state">
                    <Input placeholder="State" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Zip Code" name="zip">
                    <Input placeholder="Zip" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={() => router.push("/admin/customers")}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving || loading}
            >
              Add Customer
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
