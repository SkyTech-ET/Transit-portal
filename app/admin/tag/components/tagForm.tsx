import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined } from '@ant-design/icons';
import { ITag } from '@/modules/tag/tag.types';
import { usePermissionStore } from '@/modules/utils';
import { DatePicker, Button, Form, Input, Radio } from "antd";
import { tagRoutes } from '@/modules/tag/tag.routes';
import { useTagStore } from '@/modules/tag/tag.store';
import moment from 'moment';

interface TagFormProps {
    isEdit: boolean;
    payload: ITag | null;
}

const TagForm = (props: TagFormProps) => {
    const router = useRouter();
    const [form] = Form.useForm();
    const { currentUser } = usePermissionStore();
    const formRef = React.useRef<FormInstance>(null);
    const { loading, updateTag, addTag} = useTagStore();

    const handleSubmit = async () => {
        try {
            const values = await formRef.current?.validateFields();

            if (props.isEdit) {
                const id = props.payload?.id as any;
                await updateTag(values, id).then((res) => {
                    router.push(tagRoutes.getall);
                });
            } else {
                // Create operation: include organizationId
                const enhancedValues = {
                    ...values,
                    organizationId: currentUser?.organization?.id as any // Add organizationId only for create
                };
                await addTag(enhancedValues); // Use enhanced values
                // Redirect after successful operation
                router.push(tagRoutes.getall);
            }

        } catch (errorInfo) {
            console.error('Failed:', errorInfo);
        }
    };

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
                            name="name"
                            label={<span className="font-semibold">Name</span>}
                            rules={[{ required: true, message: "Please input your tag name!" }]}
                            labelCol={{ span: 24 }}
                            className='md:w-1/3 w-full'
                        >
                            <Input
                                placeholder="Tag Name"
                                style={{ padding: "10px", paddingLeft: "10px", marginTop: "1px" }}
                            />
                        </Form.Item>
                    </div>

                    <div className='flex flex-row justify-start gap-4'>
                        {/* Price */}
                        <Form.Item
                            name="description"
                            label={<span className="font-semibold">description</span>}
                            rules={[{ required: true, message: "Please input tag description!" }]}
                            labelCol={{ span: 24 }}
                            className='md:w-1/3 w-full'
                        >
                            <Input.TextArea
                                placeholder="Description"
                                style={{ padding: "10px", paddingLeft: "10px", marginTop: "1px" }}
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
                                onClick={() => { router.push(tagRoutes.getall) }}
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

export default TagForm;
