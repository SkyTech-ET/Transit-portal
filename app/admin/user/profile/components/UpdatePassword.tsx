"use client";

import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { LockOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { IPasswordPayload } from "@/modules/auth";
import useAuthStore from "@/modules/auth/auth.store";
import SectionTitle from "../../components/SectionTitle";
import { usePermissionStore } from "@/modules/utils";
import { useRouter } from "next/navigation";
import { reportRoutes } from "@/modules/report";

const UpdatePassword = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const { currentUser } = usePermissionStore();
    const { updatePassword: changePassword, loading } = useAuthStore();

    const [messageApi, contextHolder] = message.useMessage();

    const [passwordRules, setPasswordRules] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
        noRepeat: false,
    });

    // Updates password validation rules based on user input

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        setPasswordRules({
            length: val.length >= 8,
            uppercase: /[A-Z]/.test(val),
            lowercase: /[a-z]/.test(val),
            number: /[0-9]/.test(val),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(val),
            noRepeat: !/(.)\1{2,}/.test(val),
        });
    };

    const onUpdatePassword = async (values: IPasswordPayload) => {
        
        if (!currentUser?.username) return;

        values.username = currentUser?.username;
        await changePassword(values);
        router.push(reportRoutes.dashboard);
    };

    // enable submit only when all passwor rules pass and passwords match until button is invalid
    
    const newPassword = Form.useWatch("newPassword", form);
    const confirmPassword = Form.useWatch("confirmPassword", form);
    const isPasswordValid =
    Object.values(passwordRules).every(Boolean) &&
    newPassword &&
    confirmPassword &&
    newPassword === confirmPassword;

    return (
        <>
            {contextHolder}

            <div className="flex md:flex-row flex-col justify-between">
                <div className="md:col-span-1 md:pb-0 pb-4 flex justify-between">
                    <SectionTitle
                        title="Update Password"
                        description="Ensure your account is using a long, random password to stay secure."
                    />
                </div>

                <div className="col-span-6 sm:col-span-4 w-full">
                    <Form
                        form={form}
                        autoComplete="off"
                        layout="horizontal"
                        name="changePassword"
                        onFinish={onUpdatePassword}
                    >
                        <div className="px-4 py-5 bg-white sm:p-6 sm:rounded-tl-md sm:rounded-tr-md">

                            {/* Old Password */}
                            <Form.Item
                                name="password"
                                labelCol={{ span: 24 }}
                                label={<span className="font-semibold">Old Password</span>}
                                rules={[{ required: true, message: "Please input your old password!" }]}
                            >
                                <Input.Password
                                    variant="filled"
                                    prefix={<LockOutlined />}
                                    placeholder="Old Password"
                                    className="bg-gray-100 focus:bg-slate-300"
                                />
                            </Form.Item>

                            {/* New Password */}
                            <Form.Item
                                name="newPassword"
                                labelCol={{ span: 24 }}
                                label={<span className="font-semibold">New Password</span>}
                                rules={[
  { required: true, message: "Please input your new password!" },
  {
    validator: (_, value) => {
      if (!value) return Promise.resolve();

      const isValid = Object.values(passwordRules).every(Boolean);

      return isValid
        ? Promise.resolve()
        : Promise.reject(
            new Error("")
          );
    },
  },
]}
                            >
                                <Input.Password
                                    variant="filled"
                                    prefix={<LockOutlined />}
                                    placeholder="New Password"
                                    onChange={handlePasswordChange}
                                    className="bg-gray-100 focus:bg-slate-300"
                                />
                            </Form.Item>

                            {/* Live Checklist password validation */}
                            <div className="mb-4 m-auto text-sm">
                                {[
                                    { label: "At least 8 characters", valid: passwordRules.length },
                                    { label: "At least one uppercase letter", valid: passwordRules.uppercase },
                                    { label: "At least one lowercase letter", valid: passwordRules.lowercase },
                                    { label: "At least one number", valid: passwordRules.number },
                                    { label: "At least one special character", valid: passwordRules.special },
                                    { label: "No character repeated 3+ times consecutively", valid: passwordRules.noRepeat },
                                ].map((rule, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-2 transition-all duration-200 ${
                                            rule.valid ? "text-green-600" : "text-red-500"
                                        }`}
                                    >
                                        {rule.valid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                                        <span>{rule.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Confirm Password */}
                            <Form.Item
                                name="confirmPassword"
                                labelCol={{ span: 24 }}
                                label={<span className="font-semibold">Confirm Password</span>}
                                dependencies={["newPassword"]}
                                rules={[
                                    { required: true, message: "Please confirm your password!" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue("newPassword") === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error("The passwords do not match!")
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    placeholder="Confirm Password"
                                    variant="filled"
                                />
                            </Form.Item>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-end px-4 py-3 bg-white border-t border-gray-100 sm:px-6 sm:rounded-bl-md sm:rounded-br-md">
                            <Form.Item wrapperCol={{ span: 24 }}>
                                <Button
    block
    type="primary"
    htmlType="submit"
    loading={loading}
    disabled={!isPasswordValid} // disables until valid
    style={{ width: "100%", height: "2.4rem" }}
>
    Save changes
</Button>
                                    
                                
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default UpdatePassword;