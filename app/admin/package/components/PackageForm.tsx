"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RecordStatus } from "@/modules/common/common.types";
import { packageRoutes } from "@/modules/package/package.routes";
import { usePackageStore } from "@/modules/package/package.store";
import { IPackage } from "@/modules/package/package.types";
import { useServiceStore } from "@/modules/service";
import { useEventStore } from "@/modules/event";
import {
  formatFieldName,
  parseImage,
  usePermissionStore,
} from "@/modules/utils";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Upload,
} from "antd";
import { FormInstance } from "antd/lib/form";

interface PackageFormProps {
  isEdit: boolean;
  payload: IPackage | null;
  // services: any[]; // Update the type to match your actual service data structure
}

const PackageForm = (props: PackageFormProps) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { currentUser } = usePermissionStore();
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const { services, getServices } = useServiceStore();
  const { events, getEvents } = useEventStore();

  const formRef = React.useRef<FormInstance>(null);
  const { loading, updatePackage, addPackage } = usePackageStore();
  const orgId = currentUser?.organization?.id || 4;

  const handleSubmit = async () => {
    try {
      const values = await formRef.current?.validateFields();
      let formData = new FormData();

      formData.append("packageName", values.packageName);
      formData.append("description", values.description);
      //formData.append("packageServiceRequest", values.packageServiceRequest);
      formData.append("organizationId", currentUser?.organization?.id as any);
      formData.append("userId", currentUser?.id as any);
      formData.append("eventId", values.eventId);
      formData.append("recordStatus", values.recordStatus);
     // const pricingTiers = JSON.stringify(values.pricingTiers);
    // Dynamically add PricingTiers
      values.pricingTiers.forEach((tier: any, index: number) => {
        formData.append(`PricingTiers[${index}].MinPersons`, tier.minPersons.toString());
        formData.append(`PricingTiers[${index}].MaxPersons`, tier.maxPersons.toString());
        formData.append(`PricingTiers[${index}].PricePerPerson`, tier.pricePerPerson.toString());
      });

      // Dynamically add PackageServices
      values.packageServiceRequest.forEach((serviceId: string, index: number) => {
        formData.append(`PackageServices[${index}].ServiceId`, serviceId.toString());
      });

    
      if (values.imagePath != null && Array.isArray(values.imagePath)) {
        formData.append("imagePath", values.imagePath[0].originFileObj);
      }

      if (props.isEdit) {
        const id = props.payload?.id as any;
        formData.append("id", id);
        if (Array.isArray(values.imagePath)) {
          formData.append("imagePath", props.payload?.imagePath as any);
        }

        await updatePackage(formData, id).then((res) => {
          router.push(packageRoutes.getall);
        });
      } else {
        await addPackage(formData).then((res) => {
          router.push(packageRoutes.getall);
        });
      }
    } catch (errorInfo) {
      console.error("Failed:", errorInfo);
    }
  };
  const onFileChange = (file: any) => {
    if (file && Array.isArray(file.fileList)) {
      form.setFieldValue("imagePath", file.fileList);
    }
  };

  useEffect(() => {
    if (services.length === 0) {
      getServices(orgId, RecordStatus.Active);
    }
    if (events.length === 0) {
      getEvents(RecordStatus.Active);
    }
  }, [orgId]); // Removed `services` and `events` from dependencies
  



  useEffect(() => {
    if (props.payload && Object.keys(props.payload).length > 0) {
      form.setFieldsValue(props.payload!);
    }
  }, [props.payload, form]);

  return (
    <>
      <Form
        form={form}
        ref={formRef}
        name="Add/Edit"
        autoComplete="off"
        onFinish={handleSubmit}
        labelCol={{ span: 24 }}
        requiredMark={true}
      >
        <div className="flex w-full flex-col">
          {/* Image Uploader */}
          <div className="flex flex-row space-x-4">
            <Form.Item
              name="imagePath"
              label={<span className="font-semibold">Package Image</span>}
              labelCol={{ span: 24 }}
              className="w-full md:w-1/3"
              valuePropName="fileList"
            >
              {props.payload?.imagePath && (
                <div>
                  {/* Using the same parsing function for consistency */}
                  {props.payload?.imagePath && (
                    <img
                      src={parseImage(props.payload.imagePath)} // Use the same parsing function
                      alt="Package"
                      style={{
                        maxWidth: "200px",
                        marginTop: "10px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.currentTarget.src = "/images/default_image.png"; // Fallback if image fails to load
                      }}
                    />
                  )}
                </div>
              )}
              <Upload
                action="#"
                listType="picture-card"
                onChange={onFileChange}
              >
                <button style={{ border: 0, background: "none" }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              </Upload>
            </Form.Item>
          </div>

          <div className="flex flex-row justify-start gap-4">
            <Form.Item
              name="packageName"
              label={<span className="font-semibold">Package Name</span>}
              rules={[
                { required: true, message: "Please input your package name!" },
              ]}
              labelCol={{ span: 24 }}
              className="w-full md:w-1/3"
            >
              <Input
                placeholder="Package Name"
                style={{
                  padding: "10px",
                  paddingLeft: "10px",
                  marginTop: "1px",
                }}
                variant="filled"
              />
            </Form.Item>


          {/* Pricing Tiers */}
          <Form.Item
            label="Pricing Tiers"
            labelCol={{ span: 24 }}
            required
          >
            <Form.List
              name="pricingTiers"
              initialValue={props.payload?.pricingTiers || []}
              rules={[
                {
                  validator: async(_, pricingTiers) => {
                    if (!pricingTiers || pricingTiers.length === 0) {
                      return Promise.reject(new Error("At least one pricing tier is required"));
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Row gutter={16} key={key}>
                      <Col span={8}>
                        <Form.Item
                          name={[name, "minPersons"]}
                          label="Min Persons"
                          rules={[{ required: true, message: "Please input min persons!" }]}
                        >
                          <Input placeholder="Min Persons" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name={[name, "maxPersons"]}
                          label="Max Persons"
                          rules={[{ required: true, message: "Please input max persons!" }]}
                        >
                          <Input placeholder="Max Persons" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name={[name, "pricePerPerson"]}
                          label="Price Per Person"
                          rules={[{ required: true, message: "Please input price per person!" }]}
                        >
                          <Input placeholder="Price Per Person" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Button
                          type="link"
                          onClick={() => remove(name)}
                        >
                          Remove Tier
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add(0)} // This adds the new tier at the top
                      icon={<PlusOutlined />}
                    >
                      Add Pricing Tier
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

            </div>





           <div className="flex flex-row justify-start gap-4">
           <Form.Item
  name="packageServiceRequest"
  label={
    <span className="font-semibold">Package Service Request</span>
  }
  rules={[
    {
      required: true,
      message: "Please input your Package Service Request!",
    },
  ]}
  labelCol={{ span: 24 }}
  className="w-full md:w-1/3"
>
  <Select
    mode="multiple" // Enable multiple selection
    defaultValue={props.payload?.packageServiceRequest}
    placeholder="Select Package Service Requests"
  >
    {services.map((service: any) => {
      return (
        <Select.Option
          key={service.id} // Added key for better performance and identification
          value={service.id}
          style={{
            padding: "10px",
            paddingLeft: "10px",
            marginTop: "1px",
          }}
        >
          {service.serviceName}
        </Select.Option>
      );
    })}
  </Select>
</Form.Item>

   {/* Event Select */}
   <Form.Item
              name="eventId"
              label={<span className="font-semibold">Select Event</span>}
              rules={[{ required: true, message: "Please select an event!" }]}
              labelCol={{ span: 24 }}
              className="w-full md:w-1/3"
            >
              <Select placeholder="Select Event">
                {events.map((event) => (
                  <Select.Option key={event.id} value={event.id}>
                    {event.eventName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Description */}
          <Form.Item
            name="description"
            label={<span className="font-semibold">Description</span>}
            rules={[
              { required: true, message: "Please input your description!" },
            ]}
            labelCol={{ span: 24 }}
            className="w-full md:w-1/3"
          >
            <Input.TextArea
              placeholder="Description"
              style={{ padding: "10px", paddingLeft: "10px", marginTop: "1px" }}
              variant="filled"
            />
          </Form.Item>

          {/* Record status */}
          <div>
            <Form.Item
              name="recordStatus"
              label="Status"
              rules={[
                { required: true, message: "Please select record status!" },
              ]}
            >
              <Radio.Group optionType="button">
                <Radio value={2}>Active</Radio>
                <Radio value={1}>InActive</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          {/* Action Buttons */}
          <div className="flex w-min flex-row space-x-2">
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ width: "100%", height: "2.4rem" }}
              >
                {props.payload != null ? "Save change" : "Create"}
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                block
                style={{ width: "100%", height: "2.4rem" }}
                onClick={() => {
                  router.push(packageRoutes.getall);
                }}
              >
                Cancel
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </>
  );
};

export default PackageForm;
