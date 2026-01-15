"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authRoutes } from "@/modules/auth/auth.routes";
import useAuthStore from "@/modules/auth/auth.store";
import { Alert, Button, Card, Form, Input } from "antd";
import PhoneInput from "react-phone-input-2";

import 'react-phone-input-2/lib/style.css';


export default function SignUpPage() {
  const [form] = Form.useForm();
  const { loading, error } = useAuthStore();
  const router = useRouter();
  const [buttonLoading, setButtonLoading] = useState(false);

  const onSignUp = async (values: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    phoneNumber: number;
    email: string;
  }) => {
    setButtonLoading(true);
  };

  return (
    <div className="flex py-8 items-center justify-center">
      <Card
        style={{ minWidth: 440, minHeight: 350, backgroundColor: "#FDFEFE" }}
      >
        <div className="text-start">
          <CardTitle />
        </div>
        <Form
          form={form}
          name="signup"
          initialValues={{ remember: true }}
          onFinish={onSignUp}
          autoComplete="off"
          labelCol={{ span: 24 }}
          requiredMark={"optional"}
        >
          <div className="grid grid-cols-1 gap-4  md:grid-cols-2 lg:grid-cols-2">
            <Form.Item
              name="firstName"
              label={<span className="font-semibold">FirstName</span>}
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
              labelCol={{ span: 24 }}
              className="col-span-2 md:col-span-1"
            >
              <Input
                placeholder="First Name"
                style={{
                  padding: "10px",

                  marginTop: "1px",
                }}
                variant="filled"
              />
            </Form.Item>
            <Form.Item
              name="lastName"
              label={<span className="font-semibold">LastName</span>}
              rules={[
                { required: true, message: "Please input your lastname!" },
              ]}
              labelCol={{ span: 24 }}
              className="col-span-2 md:col-span-1"
            >
              <Input
                placeholder="Last Name"
                style={{
                  padding: "10px",

                  marginTop: "1px",
                }}
                variant="filled"
              />
            </Form.Item>
            <Form.Item
              name="email"
              label={<span className="font-semibold">Email</span>}
              rules={[
                { required: true, message: "Please input your email!" },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
              className="col-span-2"
              labelCol={{ span: 24 }}
              validateTrigger="onBlur"
            >
              <Input
                placeholder="Email"
                style={{
                  padding: "10px",
                  marginTop: "1px",
                }}
                variant="filled"
              />
            </Form.Item>
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
                placeholder="Username"
                style={{
                  padding: "10px",

                  marginTop: "1px",
                }}
                variant="filled"
              />
            </Form.Item>
            <Form.Item
              name="phonenumber"
              label={<span className="font-semibold">PhoneNumber</span>}
              rules={[
                { required: true, message: "Please input your phonenumber!" },
              ]}
              labelCol={{ span: 24 }}
              className="col-span-2 md:col-span-1"
            >
              <PhoneInput
                placeholder="Phonenumber"
                country={"et"}
                inputStyle={{
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  paddingLeft: "45px",
                  width: "100%",
                  marginTop: "1px",
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="font-semibold">Password</span>}
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
              labelCol={{ span: 24 }}
              className="col-span-2 md:col-span-1"
            >
              <Input.Password
                placeholder="Password"
                style={{ padding: "10px", paddingLeft: "10px" }}
                variant="filled"
              />
            </Form.Item>
            <Form.Item
              name="confirmpassword"
              label={<span className="font-semibold">Confirm Password</span>}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The  password do not match!")
                    );
                  },
                }),
              ]}
              labelCol={{ span: 24 }}
              className="col-span-2 md:col-span-1"
            >
              <Input.Password
                placeholder="Confirm Password"
                style={{ padding: "10px", paddingLeft: "10px" }}
                variant="filled"
              />
            </Form.Item>

            {error && <Alert message={error} type="error" showIcon closable />}

            <Form.Item wrapperCol={{ span: 24 }} className="col-span-2">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading || buttonLoading}
                block
                style={{ width: "100%", height: "2.4rem", marginTop: 20 }}
              >
                SignUp
              </Button>
            </Form.Item>
          </div>
          <div className="flex justify-center">
            <span className="text-sm text-gray-600">
              Already have an account? <span className="separator">|</span>{" "}
              <a
                className="text-brand-700 b"
                onClick={() => router.push(authRoutes.login)}
              >
                Login
              </a>
            </span>
          </div>
        </Form>
      </Card>
    </div>
  );
}

const CardTitle = () => (
  <div className="py-4">
    <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Sign Up</h1>
    <span className="text-sm text-gray-600">
      Enter your details to create your account and get started.
    </span>
  </div>
);
