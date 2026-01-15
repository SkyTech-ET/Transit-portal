import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@/modules/common/common.types";
import {
  IBookingStatus,
} from "@/modules/booking";
import { bookingRoutes } from "@/modules/booking/booking.routes";
import { useBookingStore } from "@/modules/booking/booking.store";
import { usePermissionStore } from "@/modules/utils";
import { PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, message, Radio, Select } from "antd";
import { FormInstance } from "antd/lib/form";
import moment from "moment";

interface BookingStatusFormProps {
  isVisible: boolean;
  handleCancel: () => void;
  payload: IBookingStatus;
}
const orderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "Pending",
  [OrderStatus.Approved]: "Approved",
  [OrderStatus.InProgress]: "InProgress",
  [OrderStatus.Completed]: "Completed",
  [OrderStatus.Cancelled]: "Cancelled",
};
const BookingOrderStatusForm = (props: BookingStatusFormProps) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const formRef = React.useRef<FormInstance>(null);
  const { loading,error, updateBookingStatus } = useBookingStore();
  const orderStatusOptions = Object.entries(orderStatusLabels).map(
    ([value, label]) => ({
      label,
      value: Number(value), // Convert key (string) to number
    })
  );

  const handleChange = (value: number) => {};

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields(); // Validate form fields
      const id = props.payload.id; // Get the booking ID
      const enhancedValues = { ...values, id };
  
      // Simulate API call
      const res = await updateBookingStatus(enhancedValues, id);
  
   
      
        props.handleCancel(); // Close the modal
        router.refresh(); // Refresh the parent data
   
    } catch (error) {
      console.error("Submission error:", error);
      // Validation or unexpected error
      message.error("An unexpected error occurred. Please try again."); // Fallback error message
    }
  };
  
  useEffect(() => {
    form.setFieldsValue({
      id: props.payload.id,
      orderStatus: props.payload.orderStatus,
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
          {/* order status */}
          <div className="flex flex-row justify-start gap-4">
           
            <Form.Item
              name="orderStatus"
              label={<span className="font-semibold">Order Status</span>}
              rules={[
                {
                  required: true,
                  message: "Please input your order Status!",
                },
              ]}
              labelCol={{ span: 24 }}
              className="w-full md:w-1/3"
            >
              <Select
                placeholder="Select order Status"
                onChange={handleChange}
                className="w-full"
                defaultValue={props.payload?.orderStatus}
              >
                {orderStatusOptions.map((option) => (
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
                  router.push(bookingRoutes.getall);
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

export default BookingOrderStatusForm;
