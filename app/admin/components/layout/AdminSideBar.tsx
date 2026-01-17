"use client";

import { Menu } from "antd";
import {
  DashboardOutlined,
  UnorderedListOutlined,
  FolderOutlined,
  FileTextOutlined,
  MessageOutlined,
  BellOutlined,
  SafetyOutlined,
  UserOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

interface AdminSideBarProps {
  onLinkClick?: () => void; // <- add this
}

export default function AdminSideBar({ onLinkClick }: AdminSideBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      onClick={({ key }) => {
        router.push(key);
        if (onLinkClick) onLinkClick(); // <- call on mobile link click
      }}
      style={{
        height: "100vh",
        borderRight: 0,
        paddingTop: 8,
      }}
      items={[
        {
          key: "/admin/dashboard",
          icon: <DashboardOutlined />,
          label: "Dashboard",
        },
        {
          key: "/admin/dashboard/stage-overview",
          icon: <DashboardOutlined />,
          label: "Stage Overview",
        },
        {
          type: "group",
          label: "Management",
          children: [
            {
              key: "/admin/employees",
              icon: <UnorderedListOutlined />,
              label: "Staff Management",
            },
            {
              key: "/admin/mot/customers",
              icon: <FolderOutlined />,
              label: "Customer Management",
            },
            {
              key: "/admin/caseExecutor/service-list",
              icon: <UnorderedListOutlined />,
              label: "Communication",
            },
            {
              key: "/admin/user/profile/id",
              icon: <FolderOutlined />,
              label: "Profile Settings",
            },
            {
              key: "/admin/document",
              icon: <FolderOutlined />,
              label: "Documents",
            },
          ],
        },
        {
          type: "group",
          label: "Notifications",
          children: [
            {
              key: "/admin/dashboard/notification",
              icon: <DashboardOutlined />,
              label: "Notifications",
            },
          ],
        },
        {
          type: "group",
          label: "Analytics",
          children: [
            {
              key: "/case-executor/documents",
              icon: <FileTextOutlined />,
              label: "Reports and Analytics",
            },
            {
              key: "/case-executor/documents",
              icon: <FileTextOutlined />,
              label: "Activity Log",
            },
          ],
        },
      ]}
    />
  );
}
