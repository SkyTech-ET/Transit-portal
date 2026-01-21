"use client";

import { Form, Input, InputNumber, Select, Button, Card } from "antd";
import { useRouter } from "next/navigation";
import { useServiceStore } from "@/modules/mot/service/service.store";
import { ServiceType } from "@/modules/mot/service/service.types";

export default function CreateServicePage({
  params,
}: {
  params: { id: string };
}) {
  const userId = Number(params.id); // customer userId from route
  const [form] = Form.useForm();
  const router = useRouter();
  const { createService, loading } = useServiceStore();

  const onFinish = async (values: any) => {
    const payload = {
      customerId: userId, // pass the correct verified userId
      itemDescription: values.itemDescription,
      routeCategory: values.routeCategory,
      declaredValue: values.declaredValue,
      taxCategory: values.taxCategory,
      countryOfOrigin: values.countryOfOrigin,
      serviceType: values.serviceType,
    };

    console.log("Creating service for userId:", userId);
    await createService(payload);

    form.resetFields();
    router.push("/admin/mot/customers/services"); // redirect after creation
  };

  return (
    <Card title={`Create Service`} className="max-w-2xl mx-auto mt-8">
      <Form layout="vertical" form={form} onFinish={onFinish}>
        {/* Item Description */}
        <Form.Item
          label="Item Description"
          name="itemDescription"
          rules={[{ required: true, message: "Item description is required" }]}
        >
          <Input placeholder="Enter item description" />
        </Form.Item>

        {/* Route Category */}
        <Form.Item
          label="Route Category"
          name="routeCategory"
          rules={[{ required: true, message: "Route category is required" }]}
        >
          <Select placeholder="Select route category">
            <Select.Option value="1">Route 1</Select.Option>
            <Select.Option value="2">Route 2</Select.Option>
          </Select>
        </Form.Item>

        {/* Declared Value */}
        <Form.Item
          label="Declared Value"
          name="declaredValue"
          rules={[{ required: true, message: "Declared value is required" }]}
        >
          <InputNumber className="w-full" min={1} />
        </Form.Item>

        {/* Tax Category */}
        <Form.Item
          label="Tax Category"
          name="taxCategory"
          rules={[{ required: true, message: "Tax category is required" }]}
        >
          <Select placeholder="Select tax category">
            <Select.Option value="Platinium">Platinium</Select.Option>
            <Select.Option value="Gold">Gold</Select.Option>
            <Select.Option value="Silver">Silver</Select.Option>
          </Select>
        </Form.Item>

        {/* Country of Origin */}
        <Form.Item
          label="Country of Origin"
          name="countryOfOrigin"
          rules={[{ required: true, message: "Country of origin is required" }]}
        >
          <Input placeholder="Enter country of origin" />
        </Form.Item>

        {/* Service Type */}
        <Form.Item
          label="Service Type"
          name="serviceType"
          rules={[{ required: true, message: "Service type is required" }]}
        >
          <Select placeholder="Select service type">
            <Select.Option value={ServiceType.Multimodal}>Multimodal</Select.Option>
            <Select.Option value={ServiceType.Unimodal}>Unimodal</Select.Option>
          </Select>
        </Form.Item>

        {/* Submit */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create Service
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
