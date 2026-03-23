"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authRoutes } from "@/modules/auth";
import useAuthStore from "@/modules/auth/auth.store";
import { reportRoutes } from "@/modules/report";
import { LanguageSwitcher } from "@/providers/LanguageSwitcher";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";
import { useTranslations } from "next-intl";

import Logo from "../../components/logo";

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { login, loading, user } = useAuthStore();

  const t = useTranslations("auth");

  const onLogin = async (values: { username: string; password: string }) => {
    await login(values).then(() => {});
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
    <>
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        {/* MAIN WRAPPER (ONE CONTAINER) */}
        <div className="flex h-[620px] w-[1100px] overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* LEFT SIDE – IMAGE */}
          <div className="hidden w-1/2 items-center justify-center bg-white lg:flex">
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
          <div className="flex w-full items-center justify-center bg-[#0b3442] lg:w-1/2">
            <div className="w-full max-w-md px-10">
              {/* Logo */}
              <div className="mb-8 flex justify-center">
                <Logo />
              </div>

              {/* Title */}
              <h2 className="mb-8 text-3xl font-bold text-white">
                {t("loginTitle")}
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
                  label={<span className="text-white/80">{t("email")}</span>}
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-white/40" />}
                    placeholder="Enter your email"
                    className="h-11 rounded-md border border-white/40 bg-transparent text-white placeholder:text-white/40 hover:border-white/40 focus:border-white/40 focus:shadow-none"
                  />
                </Form.Item>

                {/* Password */}
                <Form.Item
                  name="password"
                  label={<span className="text-white/80">{t("password")}</span>}
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-white/40" />}
                    placeholder="Enter your password"
                    className="h-11 rounded-lg border-none bg-[#124a5d] text-white placeholder:text-white/40"
                  />
                </Form.Item>

                {/* Forgot password */}
                <div className="mb-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => router.push(authRoutes.forgot_password)}
                    className="text-sm text-white/80 hover:text-white"
                  >
                    {t("forgetpassword")}
                  </button>
                </div>

                {/* Submit */}
                <Button
                  htmlType="submit"
                  loading={loading}
                  disabled={loading}
                  block
                  className="h-11 rounded-lg border-none bg-[#2b7da3] font-medium text-white hover:bg-[#256c8d]"
                >
                  {t("login")}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface ForgotPasswordProps {
  onForgotPassword: () => void;
}

interface SignUpProps {
  onSignUp: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onForgotPassword,
}) => (
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
      <button onClick={onSignUp} className="text-blue-600 hover:text-blue-800">
        Sign Up
      </button>
    </div>
  </div>
);
