"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authRoutes } from "@/modules/auth";
import { reportRoutes } from "@/modules/report";
import { Button, Card, Form, Input } from "antd";
import useAuthStore from "@/modules/auth/auth.store";
import { CardTitle } from "../../components/card_title";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "../../components/logo";
import Image from "next/image";


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
  <div className="flex min-h-screen items-center justify-center bg-slate-100">

    {/* MAIN WRAPPER (ONE CONTAINER) */}
    <div className="flex w-[1100px] h-[620px] rounded-2xl overflow-hidden bg-white shadow-2xl">

      {/* LEFT SIDE – IMAGE */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-white">
        <Image
          src="/login_image.png"
          alt="Import Export Illustration"
          width={700}
          height={500}
          priority
          className="object-contain"
        />
      </div>

      {/* RIGHT SIDE – LOGIN FORM */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-[#0b3442]">

        <div className="w-full max-w-md px-10">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-8">
            Sign in
          </h2>

          {/* FORM */}
          <Form
            form={form}
            name="login"
            onFinish={onLogin}
            autoComplete="off"
            layout="vertical"
          >
            {/* Username */}
            <Form.Item
              name="username"
              label={<span className="text-white/80">Email</span>}
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input
                prefix={<MailOutlined className="text-white/40" />}
                placeholder="Enter your email"
                className="h-11 rounded-md bg-transparent text-white placeholder:text-white/40 border border-white/40 focus:border-white/40 focus:shadow-none hover:border-white/40"
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              label={<span className="text-white/80">Password</span>}
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-white/40" />}
                placeholder="Enter your password"
                className="h-11 rounded-lg bg-[#124a5d] text-white placeholder:text-white/40 border-none"
              />
            </Form.Item>

            {/* Forgot password */}
            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={() => router.push(authRoutes.forgot_password)}
                className="text-white/80 hover:text-white text-sm"
              >
                Forgot Password
              </button>
            </div>

            {/* Submit */}
            <Button
              htmlType="submit"
              loading={loading}
              disabled={loading}
              block
              className="h-11 rounded-lg bg-[#2b7da3] border-none text-white font-medium hover:bg-[#256c8d]"
            >
              Sign in
            </Button>
          </Form>
        </div>
      </div>
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
