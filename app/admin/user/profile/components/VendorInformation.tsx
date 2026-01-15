"use client";
import React, { useEffect } from 'react';
import { Button, Form, Input } from "antd";
import { FormInstance } from 'antd/lib/form';
import { IUser } from '@/modules/user/user.types';
import SectionTitle from "../../components/SectionTitle";
import { useUserStore } from '@/modules/user/user.store';
import { IVendor } from '@/modules/vendor/vendor.types';

const VendorInformation = (props: { payload: IVendor }) => {
    
    const formRef = React.useRef<FormInstance>(null);
    const [form] = Form.useForm();
    const { loading, updateUser } = useUserStore();
    const handleSubmit = async () => {
        try {
            const values = await formRef.current?.validateFields();
            const id = props.payload?.id as any;
            const updatedValues = {
                ...values,
                // phoneNumber: props.payload?.phoneNumber,
                // roles: [props.payload?.roles[0]],
              };
            // values.role = props.payload?.roles
            await updateUser(updatedValues, id);
        } catch (errorInfo) {
            console.error('Failed:', errorInfo);
        }
    };

    useEffect(() => {
        if (props.payload && Object.keys(props.payload).length > 0) {
            form.setFieldsValue(props.payload!);
        }
    }, [props.payload!, form]);

    return (<>
        <div className="flex md:flex-row flex-col justify-between">
            <div className="md:col-span-1 md:pb-0 pb-4 flex justify-between">
                <SectionTitle
                    title="Vendor Information"
                    description=" Update your account's Vendor information and email address">
                </SectionTitle>
            </div>
            <div className="col-span-6 sm:col-span-4 w-full">
                <Form
                    form={form}
                    ref={formRef}
                    name="Add/Edit"
                    autoComplete="off"
                    layout="horizontal"
                    onFinish={handleSubmit}
                >
                    <div className={`md:ml-8 px-4 py-5 bg-white sm:p-6 sm:rounded-tl-md sm:rounded-tr-md`}>

                        {/* Name */}
                        <div className="flex flex-row gap-4">
                            <Form.Item
                                name="firstName"
                                label={<span className="font-semibold">First Name</span>}
                                rules={[{ required: true, message: "Please input your company name!" }]}
                                labelCol={{ span: 24 }}
                                className='w-full'
                            >
                                <Input
                                    placeholder="First Name"
                                    style={{ padding: "10px", paddingLeft: "10px" }}
                                    variant="filled"
                                />
                            </Form.Item>

                            <Form.Item
                                name="lastName"
                                label={<span className="font-semibold">Last Name</span>}
                                rules={[{ required: true, message: "Please input your company name!" }]}
                                labelCol={{ span: 24 }}
                                className='w-full'
                            >
                                <Input
                                    placeholder="Last Name"
                                    style={{ padding: "10px", paddingLeft: "10px" }}
                                    variant="filled"
                                />
                            </Form.Item>
                        </div>

                        {/* Username and Email */}
                        <div className="flex flex-row gap-4">
                            <Form.Item
                                name="username"
                                label={<span className="font-semibold">Username</span>}
                                rules={[{ required: true, message: "Please input your username!" }]}
                                labelCol={{ span: 24 }}
                                className='w-full'
                            >
                                <Input
                                    placeholder="Username"
                                    style={{ padding: "10px", paddingLeft: "10px" }}
                                    variant="filled"
                                />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label={<span className="font-semibold">Email</span>}
                                rules={[{ required: true, message: "Please input your email!" }]}
                                labelCol={{ span: 24 }}
                                className='w-full'
                            >
                                <Input
                                    placeholder="Email"
                                    style={{ padding: "10px", paddingLeft: "10px" }}
                                    variant="filled"
                                />
                            </Form.Item>

                        </div>

                        <div className="flex items-center justify-end px-4 py-3 bg-white border-t border-gray-100 sm:px-6 sm:rounded-bl-md sm:rounded-br-md">
                            <Form.Item wrapperCol={{ span: 24 }}>
                                <Button
                                    block
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    style={{ width: "100%", height: "2.4rem" }}
                                >
                                    Save change
                                </Button>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    </>)
}

export default VendorInformation;