"use client";

import { useEffect } from "react";
import { Button, Form, Input } from "antd";
import { useUserStore } from "@/modules/user";
import { LockOutlined } from "@ant-design/icons";
import { IPasswordPayload } from "@/modules/auth";
import useAuthStore from "@/modules/auth/auth.store";
import SectionTitle from "../../components/SectionTitle";


const ResetPassword = () => {
    const [form] = Form.useForm();
    const { user } = useUserStore();
    const { resetPassword, loading } = useAuthStore();

    const onResetPassword = async (values: IPasswordPayload) => {
        if (!user?.username) return;
        values.username = user?.username
        await resetPassword(values);
    };

    useEffect(() => {
        if (user?.username) {
            let username = user.username
            form.setFieldsValue({
                username: username,
                password: null,
                newPassword: null
            });
        }
    }, [user]);

    return (<>
        <div className="flex md:flex-row flex-col justify-between">
            <div className="md:col-span-1 flex justify-between">
                <SectionTitle
                    title="Reset Password"
                    description="Ensure the account is using a long, random password to stay secure.">
                </SectionTitle>
            </div>
            <div className="col-span-6 sm:col-span-4 w-full">
                <Form
                    form={form}
                    autoComplete="off"
                    layout="horizontal"
                    name="changePassword"
                    onFinish={onResetPassword}
                >
                    <div className={`px-4 py-5 bg-white sm:p-6 sm:rounded-tl-md sm:rounded-tr-md`}>
                        <Form.Item
                            name="username"
                            label={<span className="font-semibold">Username</span>}
                            rules={[
                                { required: true, message: "Please input your username!" },
                            ]}
                            labelCol={{ span: 24 }}
                            className="col-span-2 md:col-span-1"
                        >
                            <Input
                                disabled
                                variant="filled"
                                placeholder="Username"
                                style={{
                                    padding: "10px",

                                    marginTop: "1px",
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            labelCol={{ span: 24 }}
                            label={<span className="font-semibold">New Password</span>}
                            rules={[
                                { required: true, message: "Please input your new password!" },
                                { min: 8, message: 'Password must be at least 8 characters!' },
                            ]}
                        >
                            <Input.Password
                                variant="filled"
                                prefix={<LockOutlined />}
                                placeholder="New Password"
                                style={{ padding: "10px", paddingLeft: "10px" }}
                                className="bg-gray-100 focus:bg-slate-300"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            labelCol={{ span: 24 }}
                            className="col-span-2 md:col-span-1"
                            label={<span className="font-semibold">Confirm Password</span>}
                            rules={[
                                {
                                    required: true,
                                    message: "Please confirm your password!",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("newPassword") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("The password do not match!")
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                placeholder="Confirm Password"
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
                                Reset
                            </Button>
                        </Form.Item>
                    </div>

                </Form>
            </div>
        </div>
    </>)
}


export default ResetPassword;