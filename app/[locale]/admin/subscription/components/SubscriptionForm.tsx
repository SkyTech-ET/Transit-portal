import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined } from '@ant-design/icons';
import { ISubscriptionPayload } from '@/modules/subscription/subscription.types';
import { usePermissionStore } from '@/modules/utils';
import { DatePicker, Button, Form, Input, Radio } from "antd";
import { subscriptionRoutes } from '@/modules/subscription/subscription.routes';
import { useSubscriptionStore } from '@/modules/subscription/subscription.store';
import moment from 'moment';

interface SubscriptionFormProps {
    isEdit: boolean;
    payload: ISubscriptionPayload | null;
}

const SubscriptionForm = (props: SubscriptionFormProps) => {
    const router = useRouter();
    const [form] = Form.useForm();
    const { currentUser } = usePermissionStore();
    const formRef = React.useRef<FormInstance>(null);
    const { loading, updateSubscription, addSubscription } = useSubscriptionStore();

    const handleSubmit = async () => {
        try {
            const values = await formRef.current?.validateFields();

            if (props.isEdit) {
                const id = props.payload?.id as any;
                await updateSubscription(values, id).then((res) => {
                    router.push(subscriptionRoutes.getall);
                });
            } else {
                // Create operation: include organizationId
                const enhancedValues = {
                    ...values,
                    organizationId: currentUser?.organization?.id as any // Add organizationId only for create
                };
                await addSubscription(enhancedValues); // Use enhanced values
                // Redirect after successful operation
                router.push(subscriptionRoutes.getall);
            }

        } catch (errorInfo) {
            console.error('Failed:', errorInfo);
        }
    };

    useEffect(() => {
        if (props.payload && Object.keys(props.payload).length > 0) {
            const { effectiveDateFrom, effectiveDateTo } = props.payload;
            // Set the form fields, including date fields
            form.setFieldsValue({
                ...props.payload,
                effectiveDateFrom: effectiveDateFrom ? moment(effectiveDateFrom) : null,
                effectiveDateTo: effectiveDateTo ? moment(effectiveDateTo) : null,
            });
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
                <div className="flex flex-col w-full">
                    {/* Name and Location */}
                    <div className='flex flex-row justify-start gap-4'>
                        <Form.Item
                            name="planName"
                            label={<span className="font-semibold">Plan</span>}
                            rules={[{ required: true, message: "Please input your plan name!" }]}
                            labelCol={{ span: 24 }}
                            className='md:w-1/3 w-full'
                        >
                            <Input
                                placeholder="Plan Name"
                                style={{ padding: "10px", paddingLeft: "10px", marginTop: "1px" }}
                            />
                        </Form.Item>
                    </div>

                    <div className='flex flex-row justify-start gap-4'>
                        {/* Price */}
                        <Form.Item
                            name="price"
                            label={<span className="font-semibold">Price</span>}
                            rules={[{ required: true, message: "Please input Package price!" }]}
                            labelCol={{ span: 24 }}
                            className='md:w-1/3 w-full'
                        >
                            <Input.TextArea
                                placeholder="Price"
                                style={{ padding: "10px", paddingLeft: "10px", marginTop: "1px" }}
                            />
                        </Form.Item>

                        {/* Date Pickers */}
                        <Form.Item
                            name="effectiveDateFrom"
                            label={<span className="font-semibold">Effective Date From</span>}
                            rules={[{ required: true, message: "Please input Package start Date!" }]}
                            labelCol={{ span: 24 }}
                            className="md:w-1/3 w-full"
                        >
                            <DatePicker
                                placeholder="Select Start Date and Time"
                                style={{ width: "100%", padding: "10px", marginTop: "1px" }}
                                format="YYYY-MM-DD HH:mm"
                                showTime={{ format: 'HH:mm' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="effectiveDateTo"
                            label={<span className="font-semibold">Effective Date To</span>}
                            rules={[{ required: true, message: "Please input Package end Date!" }]}
                            labelCol={{ span: 24 }}
                            className="md:w-1/3 w-full"
                        >
                            <DatePicker
                                placeholder="Select End Date and Time"
                                style={{ width: "100%", padding: "10px", marginTop: "1px" }}
                                format="YYYY-MM-DD HH:mm"
                                showTime={{ format: 'HH:mm' }}
                            />
                        </Form.Item>
                    </div>

                    {/* Record status */}
                    <div>
                        <Form.Item
                            name="recordStatus"
                            label="Status"
                            rules={[{ required: true, message: "Please select record status!" }]}
                        >
                            <Radio.Group optionType="button">
                                <Radio value={2}>Active</Radio>
                                <Radio value={1}>Inactive</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-row space-x-2 w-min'>
                        <Form.Item wrapperCol={{ span: 24 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                style={{ width: "100%", height: "2.4rem" }}
                            >
                                {props.payload != null ? 'Save Changes' : 'Create'}
                            </Button>
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 24 }}>
                            <Button
                                block
                                style={{ width: "100%", height: "2.4rem" }}
                                onClick={() => { router.push(subscriptionRoutes.getall) }}
                            >
                                Cancel
                            </Button>
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </>
    );
}

export default SubscriptionForm;
