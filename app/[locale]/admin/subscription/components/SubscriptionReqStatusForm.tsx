import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RequestStatus } from "@/modules/common/common.types";
import { subscriptionRoutes } from "@/modules/subscription/subscription.routes";
import { useSubscriptionStore } from "@/modules/subscription/subscription.store";
import { usePermissionStore } from "@/modules/utils";
import { PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Radio, Select } from "antd";
import { FormInstance } from "antd/lib/form";
import moment from "moment";
import { Link } from "lucide-react";

interface SubscriptionStatusFormProps {
  isVisible: boolean;
  handleCancel: () => void;
  payload: any;
}
const requestStatusLabels: Record<RequestStatus, string> = {
  [RequestStatus.Approved]: "Approved",
  [RequestStatus.Rejected]: "Rejected",
  [RequestStatus.Pending]: "Pending",
};
const SubscriptionReqStatusForm = (props: SubscriptionStatusFormProps) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const formRef = React.useRef<FormInstance>(null);
  const { loading,success, updateReqStatus } = useSubscriptionStore();
  const requestStatusOptions = Object.entries(requestStatusLabels).map(
    ([value, label]) => ({
      label,
      value: Number(value), // Convert key (string) to number
    })
  );

  const handleChange = (value: number) => {};

  const handleSubmit = async () => {
    try {
      const values = await formRef.current?.validateFields();
      const id = props.payload.id; // Use payload's id dynamically
      const enhancedValues = {
        ...values,
        id,
      };
      
      await updateReqStatus(enhancedValues, id).then((res) => {
        props.handleCancel();
      });
    } catch (errorInfo) {
    }
  };
  useEffect(() => {
    form.setFieldsValue({
      id: props.payload.id,
      requestStatus: props.payload.requestStatus,
    });
  }, [props.payload, form]);

  return (
    <>
      <Form
        form={form}
        ref={formRef}
        autoComplete="off"
        onFinish={handleSubmit}
        labelCol={{ span: 24 }}
        requiredMark={true}
      >
        <div className="flex w-full flex-col">
          {/* Name and Location */}
          <div className="flex flex-row justify-start gap-4">
           
            <Form.Item
              name="requestStatus"
              label={<span className="font-semibold">Subscription Status</span>}
              rules={[
                {
                  required: true,
                  message: "Please input your request Status!",
                },
              ]}
              labelCol={{ span: 24 }}
              className="w-full md:w-1/3"
            >
              <Select
                placeholder="Select request Status"
                onChange={handleChange}
                className="w-full"
                defaultValue={props.payload?.requestStatus}
              >
                {requestStatusOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
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
                {"Save Changes"}
              </Button>
            </Form.Item>
          
          </div>
        </div>
      </Form>
    </>
  );
};

export default SubscriptionReqStatusForm;
