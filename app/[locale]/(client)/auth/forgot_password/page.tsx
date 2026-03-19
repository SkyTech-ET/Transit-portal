"use client";

import { useRouter } from "next/navigation";
import { Button, Card, Form, Input } from "antd";
import useAuthStore from "@/modules/auth/auth.store";
import { CardTitle } from "../../components/card_title";
import { authRoutes, IPasswordPayload } from "@/modules/auth";
import { LockOutlined, MailOutlined } from "@ant-design/icons";


export default function ForgotPasswordPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { loading, forgotPassword } = useAuthStore();

  const onForgotPassword = async (values: IPasswordPayload) => {
    await forgotPassword(values).then(() => {
      form.resetFields()
    });
  };


  return (
    <div className="flex flex-col items-center md:pt-28 pt-8">
      <Card
        style={{ minWidth: 440, minHeight: 450, backgroundColor: "#FDFEFE" }}
        styles={{ body: { padding: 40 } }}
      >
        <div className="text-start">
          <CardTitle title={"Forgot Password"} subTitle={""} />
        </div>
        <Form
          form={form}
          name="forgotPassword"
          onFinish={onForgotPassword}
          autoComplete="off"
          labelCol={{ span: 24 }}
          requiredMark={"optional"}
        >
          <Form.Item
            name="userName"
            label={<span className="font-semibold">Username</span>}
            rules={[{ required: true, message: "Please input your username!" }]}
            labelCol={{ span: 24 }}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Username"
              style={{ padding: "10px", paddingLeft: "10px", marginTop: "1px" }}
              variant="filled"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="font-semibold">Password</span>}
            rules={[{ required: true, message: "Please input your password!" }]}
            labelCol={{ span: 24 }}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Old Password"
              style={{ padding: "10px", paddingLeft: "10px" }}
              variant="filled"
              className="bg-gray-100 focus:bg-slate-300"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label={<span className="font-semibold">New Password</span>}
            rules={[{ required: true, message: "Please input your password!" }]}
            labelCol={{ span: 24 }}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New Password"
              style={{ padding: "10px", paddingLeft: "10px" }}
              variant="filled"
              className="bg-gray-100 focus:bg-slate-300"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ width: "100%", height: "2.4rem" }}
            >
              Reset
            </Button>
          </Form.Item>
        </Form>
        <Login onLogin={() => { router.push(authRoutes.login) }} />
      </Card>
    </div>
  );
}

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => (
  <div className="py-1">
    <div className="mt-1">
      <span className="text-sm text-gray-600">Already have an account? </span>
      <button
        type="button"
        onClick={onLogin}
        className="text-blue-600 hover:text-blue-800"
      >
        Click here to Login
      </button>
    </div>
  </div>
);