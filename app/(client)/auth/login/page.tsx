"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authRoutes } from "@/modules/auth";
import { reportRoutes } from "@/modules/report";
import { Button, Form, Input } from "antd";
import useAuthStore from "@/modules/auth/auth.store";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import Logo from "../../components/logo";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { login, loading, user, loaded } = useAuthStore(); // <- add loaded flag if possible

  // Redirect logged-in users after store is fully loaded
  useEffect(() => {
    if (!loaded) return; // wait until auth store finishes loading from localStorage

    if (user) {
      const roleName = user.roles?.[0]?.roleName?.toLowerCase();
      switch (roleName) {
        case "customer":
          router.push(reportRoutes.ClientDashboard);
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
          router.push(reportRoutes.dashboard);
          break;
        default:
          router.push("/unauthorized");
          break;
      }
    }
  }, [user, loaded, router]);

  const onLogin = async (values: { username: string; password: string }) => {
    await login(values);
  };

  // Always render the login form; no blank screen
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="flex w-[1100px] h-[620px] rounded-2xl overflow-hidden bg-white shadow-2xl">
        {/* LEFT SIDE IMAGE */}
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

        {/* RIGHT SIDE FORM */}
        <div className="flex w-full lg:w-1/2 items-center justify-center bg-[#0b3442]">
          <div className="w-full max-w-md px-10">
            <div className="flex justify-center mb-8"><Logo /></div>
            <h2 className="text-3xl font-bold text-white mb-8">Sign in</h2>

            <Form form={form} name="login" onFinish={onLogin} autoComplete="off" layout="vertical">
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

              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={() => router.push(authRoutes.forgot_password)}
                  className="text-white/80 hover:text-white text-sm"
                >
                  Forgot Password
                </button>
              </div>

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