"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RecordStatus } from "@/modules/common/common.types";
import { useSubscriptionPackagesStore } from "@/modules/subscriptionPackages/subscriptionPackages.store";
import { useTagStore } from "@/modules/tag/tag.store";
import { parseImage, usePermissionStore } from "@/modules/utils";
import { vendorRoutes } from "@/modules/vendor/vendor.routes";
import { useVendorStore } from "@/modules/vendor/vendor.store";
import { IVendor } from "@/modules/vendor/vendor.types";
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
import { reportRoutes } from "@/modules/report";
interface VendorFormProps {
  isEdit: boolean;
  payload: IVendor | null | undefined;
}
const VendorForm = (props: VendorFormProps) => {
  const formRef = React.useRef<FormInstance>(null);
  const router = useRouter();
  const [form] = Form.useForm();

    const { loading, vendors,  updateVendor, addVendor } = useVendorStore();
    const { subscriptionPackages, getSubscriptionPackages,loading: loadingPackages } = useSubscriptionPackagesStore();
    const { tags, getTags } = useTagStore();
    const { currentUser, isAdmin } = usePermissionStore();


  const handleSubmit = async () => {
    try {
      const values = await formRef.current?.validateFields();
      let formData = new FormData();
      formData.append("name", values.name);
      formData.append("city", values.city);
      formData.append("state", values.state);
      formData.append("description", values.description);
      formData.append("address", values.address);
      formData.append("recordStatus", values.recordStatus);
      formData.append("managerialEmailAddress", values.managerialEmailAddress);

      // Handle Logo Image
      if (values.logoPath != null && Array.isArray(values.logoPath)) {
        formData.append("logoPath", values.logoPath[0].originFileObj);
      }

      // Handle Tags
      if (values.tags && values.tags.length > 0) {
        values.tags.forEach((tagId: string) => {
          formData.append("TagId", tagId); // Use `TagId` as expected by the backend
        });
      } else {
        formData.append("TagId", ""); // Handle empty tags if required
      }

      // Handle Subscription Package
      if (values.subscriptionPackages) {
        formData.append("SubscriptionPackageId", values.subscriptionPackages); // Use `SubscriptionId` as expected by the backend
      } else {
        formData.append("SubscriptionPackageId", ""); // Handle empty subscription package if needed
      }

      if (props.isEdit) {
        const id = props.payload?.id as any;
        formData.append("id", id);
        if (Array.isArray(values.logoPath)) {
          formData.append("logoPath", props.payload?.logoPath as any);
        }

        await updateVendor(formData, id).then((res) => {
            if(isAdmin)
          router.push(vendorRoutes.getall);
        else 
          router.push(reportRoutes.dashboard);
        });
      } else {
        await addVendor(formData).then((res) => {
          router.push(vendorRoutes.getall);
        });
      }
    } catch (errorInfo) {
      console.error("Failed:", errorInfo);
    }
  };

  const onFileChange = (info: any) => {
    if (info.fileList && Array.isArray(info.fileList)) {
      form.setFieldValue("logoPath", info.fileList);
    } else {
      console.error("fileList is not an array:", info.fileList);
    }
  };

  useEffect(() => {
    if (subscriptionPackages.length === 0) {
      getSubscriptionPackages(RecordStatus.Active); // Fetch subscription packages if not already loaded
    }
  }, [isAdmin]);

  useEffect(() => {
    if (tags.length === 0) {
      getTags(RecordStatus.Active); // Fetch tags if not already loaded
    }
  }, [isAdmin]);

    useEffect(() => {
        if (props.payload && Object.keys(props.payload).length > 0) {
            form.setFieldsValue(props.payload!);
        }
        if (props.payload?.subscriptionPackages) {
            form.setFieldsValue({ subscriptionPackages: props.payload.subscriptionPackages.map((item:any)=>item.id) });
        }
        if (props.payload?.tags) {
            form.setFieldsValue({ tags: props.payload.tags.map((item:any)=>item.id) });
        }
    }, [props.payload, form]);

    
    return (<>
        <Form
            form={form}
            ref={formRef}
            name="Add/Edit"
            autoComplete="off"
            onFinish={handleSubmit}
            labelCol={{ span: 24 }}
            requiredMark={true}
        >
            <div className="flex flex-col w-full ">
            <div className="flex flex-row space-x-4">
                <Form.Item
                    name="logoPath"
                    label={<span className="font-semibold">Logo Image</span>}
                    labelCol={{ span: 24 }}
                    className='md:w-1/3 w-full'
                    valuePropName="fileList"  // This should work with Ant Design
                >
                    {props.payload?.logoPath && (
                        <div>
                            <img
                                src={parseImage(props.payload.logoPath)} // Use the same parsing function
                                alt="Logo"
                                style={{ maxWidth: '200px', marginTop: '10px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.currentTarget.src = '/images/default_image.png'; // Fallback if image fails to load
                                }}
                            />
                        </div>
                    )}

              <Upload
                action="#" // This should be the API endpoint if you want to handle the upload directly
                listType="picture-card"
                onChange={onFileChange} // Ensure this points to the modified function
                beforeUpload={() => false} // Prevent automatic upload
              >
                <button style={{ border: 0, background: "none" }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              </Upload>
            </Form.Item>
          </div>

          <div className="flex flex-row space-x-4">
            <Form.Item
              name="name"
              label={<span className="font-semibold">Company name</span>}
              rules={[
                { required: true, message: "Please input your company name!" },
              ]}
              labelCol={{ span: 24 }}
              className="w-full md:w-1/3"
            >
              <Input
                placeholder="Company name"
                style={{
                  padding: "10px",
                  paddingLeft: "10px",
                  marginTop: "1px",
                }}
                variant="filled"
              />
            </Form.Item>

            <Form.Item
              name="address"
              label={<span className="font-semibold">Address</span>}
              rules={[
                { required: true, message: "Please input your address!" },
              ]}
              labelCol={{ span: 24 }}
              className="w-full md:w-1/3"
            >
              <Input
                placeholder="Address"
                style={{
                  padding: "10px",
                  paddingLeft: "10px",
                  marginTop: "1px",
                }}
                variant="filled"
              />
            </Form.Item>
          </div>

          <div className="flex flex-row space-x-4">
            <Form.Item
              name="city"
              label={<span className="font-semibold">City</span>}
              rules={[{ required: true, message: "Please input your city!" }]}
              labelCol={{ span: 24 }}
              className="w-full md:w-1/3"
            >
              <Input
                placeholder="City"
                style={{
                  padding: "10px",
                  paddingLeft: "10px",
                  marginTop: "1px",
                }}
                variant="filled"
              />
            </Form.Item>

            <Form.Item
              name="state"
              label={<span className="font-semibold">State</span>}
              rules={[{ required: true, message: "Please input your state!" }]}
              labelCol={{ span: 24 }}
              className="w-full md:w-1/3"
            >
              <Input
                placeholder="State"
                style={{
                  padding: "10px",
                  paddingLeft: "10px",
                  marginTop: "1px",
                }}
                variant="filled"
              />
            </Form.Item>
          </div>

          <div className="flex flex-row space-x-4">
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
                placeholder="Organization description"
                style={{
                  padding: "10px",
                  paddingLeft: "10px",
                  marginTop: "1px",
                }}
                variant="filled"
              />
            </Form.Item>
           
            <Form.Item
              name="managerialEmailAddress"
              label={
                <span className="font-semibold">
                  Organization Email(optional)
                </span>
              }
              rules={[{ required: false }]}
              labelCol={{ span: 24 }}
              className="w-full md:w-1/3"
            >
              <Input
                placeholder="Organization Email address"
                style={{
                  padding: "10px",
                  paddingLeft: "10px",
                  marginTop: "1px",
                }}
                variant="filled"
              />
            </Form.Item>
          </div>

          <div className="flex flex-row space-x-4">
            {/* Subscription Package */}
            <Form.Item
              name="subscriptionPackages"
              label={
                <span className="font-semibold">Subscription Package</span>
              }
              rules={[
                {
                  required: true,
                  message: "Please select a Subscription Package!",
                },
              ]}
              labelCol={{ span: 24 }}
              className="w-full md:w-1/3"
            >
              <Select
                loading={loadingPackages} // Add loading state
                placeholder="Select Subscription Package"
              >
                {subscriptionPackages.map((subscriptionPackage: any) => (
                  <Select.Option
                    key={subscriptionPackage.id}
                    value={subscriptionPackage.id}
                    style={{
                      padding: "10px",
                      paddingLeft: "10px",
                      marginTop: "1px",
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{subscriptionPackage.planName}</span>
                      <span>{`$${subscriptionPackage.price}`}</span>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Tags (Multi-Select) */}
            <Form.Item
              name="tags"
              label={<span className="font-semibold">Tags</span>}
              rules={[
                { required: true, message: "Please select at least one tag!" },
              ]}
              labelCol={{ span: 24 }}
              className="w-full md:w-1/3"
            >
              <Select
                mode="multiple" // Enable multi-select
                placeholder="Select Tags"
                allowClear // Allow clearing selected tags
              >
                {tags.map((tag: any) => (
                  <Select.Option
                    key={tag.id} // Ensure unique key
                    value={tag.id} // Send an array of `id`s to the server
                    style={{
                      padding: "10px",
                      paddingLeft: "10px",
                      marginTop: "1px",
                    }}
                  >
                    {tag.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

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
                  router.push(vendorRoutes.getall);
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

export default VendorForm;
