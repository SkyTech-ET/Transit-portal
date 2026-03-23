"use client";

import { useEffect, useState } from "react"; // ✅ added
import { usePathname, useRouter } from "next/navigation";
import {
  AppstoreOutlined,
  BellOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  FileTextOutlined,
  FolderOutlined,
  HistoryOutlined,
  MessageOutlined,
  ProfileOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useTranslations } from "next-intl";

import Logo from "@/app/[locale]/(client)/components/logo";

interface AdminSideBarProps {
  onLinkClick?: () => void;
}

export default function AdminSideBar({ onLinkClick }: AdminSideBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("AdminSidebar");

  const [mounted, setMounted] = useState(false); // ✅ FIX

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 100,
        width: 240,
        background: "#fff",
        zIndex: 1000,
      }}
    >
      <div className="ml-4 mt-4 flex">
        <Logo />
      </div>

      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        onClick={({ key }) => {
          router.push(key);
          if (onLinkClick) onLinkClick();
        }}
        style={{
          height: "100vh",
          borderRight: 0,
          paddingTop: 40,
        }}
        items={[
          {
            key: "/admin/dashboard",
            icon: <DashboardOutlined />,
            label: t("dashboard"),
          },
          {
            key: "/admin/dashboard/stage-overview",
            icon: <AppstoreOutlined />,
            label: t("stageoverview"),
          },
          {
            type: "group",
            label: t("managmentgroup"),
            children: [
              {
                key: "/admin/employees",
                icon: <TeamOutlined />,
                label: t("staffmanagment"),
              },
              {
                key: "/admin/mot/customers",
                icon: <UserOutlined />,
                label: t("customermanagment"),
              },
              {
                key: "/admin/user",
                icon: <TeamOutlined />,
                label: t("systemusers"),
              },
            ],
          },
          {
            key: "/admin/user/profile/id",
            icon: <SettingOutlined />,
            label: t("profilesetting"),
          },
          {
            key: "/admin/document",
            icon: <FolderOutlined />,
            label: t("documents"),
          },
          {
            type: "group",
            label: t("notificationsgroup"),
            children: [
              {
                key: "/admin/dashboard/notification",
                icon: <BellOutlined />,
                label: t("notifications"),
              },
            ],
          },
        ]}
      />
    </div>
  );
}
