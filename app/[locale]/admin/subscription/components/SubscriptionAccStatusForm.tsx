import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AccountStatus } from "@/modules/common/common.types";
import { IAccountStatus } from "@/modules/common/common.types";
import { subscriptionRoutes } from "@/modules/subscription/subscription.routes";
import { useSubscriptionStore } from "@/modules/subscription/subscription.store";
import { usePermissionStore } from "@/modules/utils";
import { PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Radio, Select } from "antd";
import { FormInstance } from "antd/lib/form";
import moment from "moment";

interface SubscriptionStatusFormProps {
  isVisible: boolean;
  handleCancel: () => void;
  payload: IAccountStatus;
}
const accountStatusLabels: Record<AccountStatus, string> = {
  [AccountStatus.InActive]: "Inactive",
  [AccountStatus.Active]: "Active",
  [AccountStatus.Pending]: "Pending",
  [AccountStatus.Suspended]: "Suspended",
};
const SubscriptionAccStatusForm = (props: SubscriptionStatusFormProps) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const formRef = React.useRef<FormInstance>(null);
  const { loading, updateAccStatus } = useSubscriptionStore();
  const accountStatusOptions = Object.entries(accountStatusLabels).map(
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
      await updateAccStatus(enhancedValues, id).then((res) => {
        router.push(subscriptionRoutes.getall);
        props.handleCancel();
      });
    } catch (errorInfo) {
    }
  };
  useEffect(() => {
    form.setFieldsValue({
      id: props.payload.id,
      accountStatus: props.payload.accountStatus,
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
              name="accountStatus"
              label={<span className="font-semibold">Account Status</span>}
              rules={[
                {
                  required: true,
                  message: "Please input your Account Status!",
                },
              ]}
              labelCol={{ span: 24 }}
              className="w-full md:w-1/3"
            >
              <Select
                placeholder="Select Account Status"
                onChange={handleChange}
                className="w-full"
                defaultValue={props.payload?.accountStatus}
              >
                {accountStatusOptions.map((option) => (
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

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                block
                style={{ width: "100%", height: "2.4rem" }}
                onClick={() => {
                  props.handleCancel();
                  router.push(subscriptionRoutes.getall);
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

export default SubscriptionAccStatusForm;
