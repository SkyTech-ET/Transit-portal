"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authRoutes } from "@/modules/auth";
import { reportRoutes } from "@/modules/report";
import { Button, Card, Form, Input } from "antd";
import useAuthStore from "@/modules/auth/auth.store";
import { CardTitle } from "../../components/card_title";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";

export default function LoginPage() {

  const router = useRouter();
  const [form] = Form.useForm();
  const { login, loading, user } = useAuthStore();

  const onLogin = async (values: { username: string; password: string }) => {
    await login(values).then(() => { })
  };

  useEffect(() => {
    if (user) {
      const roleName = user.roles?.[0]?.roleName?.toLowerCase();

    switch (roleName) {
      case "customer":
        router.push(reportRoutes.ClientDashboard); // /dashboard
        break;
      case "manager":
        router.push("/admin/manager/dashboard");
        break;
      case "assessor":
        router.push("/admin/assessor/dashboard");
        break;
      case "caseexecutor":
        router.push("/admin/caseExecutor/dashboard");
        break;
      case "dataencoder":
        router.push("/admin/data-encoder/dashboard");
        break;
      case "superadmin":
      case "admin":
        router.push(reportRoutes.dashboard); // /admin/dashboard
        break;
      default:
        router.push("/unauthorized");
        break;
    }
  }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center md:pt-28 pt-8">
      <div className="md:px-0 px-16">
        <Card
          style={{ minWidth: 440, minHeight: 450, backgroundColor: "#FDFEFE" }}
          styles={{ body: { padding: 40 } }}
        >
          <div className="text-start">
            <CardTitle
              title={"Sign In"}
              subTitle={
                "To access your account, please enter your login credentials."
              }
            />
          </div>
          <Form
            form={form}
            name="login"
            onFinish={onLogin}
            autoComplete="off"
            labelCol={{ span: 24 }}
            requiredMark={"optional"}
          >
            <Form.Item
              name="username"
              label={<span className="font-semibold">Username</span>}
              rules={[{ required: true, message: "Please input your username!" }]}
              labelCol={{ span: 24 }}
            >
              <Input
                prefix={<UserOutlined />}
                suffix={<MailOutlined />}
                placeholder="Email/Username"
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
                placeholder="Password"
                style={{ padding: "10px", paddingLeft: "10px" }}
                variant="filled"
                className="bg-gray-100 focus:bg-slate-300"
              />
            </Form.Item>
            <div className="flex justify-end pb-2">
              <ForgotPassword onForgotPassword={() => router.push(authRoutes.forgot_password)} />
            </div>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
                block
                style={{ width: "100%", height: "2.4rem" }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
          {/* <SignUp onSignUp={() => { router.push(authRoutes.signup) }} /> */}
        </Card>
      </div>
    </div>
  );
}

interface ForgotPasswordProps {
  onForgotPassword: () => void;
}

interface SignUpProps {
  onSignUp: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onForgotPassword }) => (
  <div className="py-1">
    <button
      type="button"
      onClick={onForgotPassword}
      className="text-blue-600 hover:text-blue-800"
    >
      Forgot Password
    </button>
  </div>
);

const SignUp: React.FC<SignUpProps> = ({ onSignUp }) => (
  <div className="py-1">
    <div className="mt-1">
      <span className="text-sm text-gray-600">Don't have an account? </span>
      <button
        onClick={onSignUp}
        className="text-blue-600 hover:text-blue-800"
      >
        Sign Up
      </button>
    </div>
  </div>
);
