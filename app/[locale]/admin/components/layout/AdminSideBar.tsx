"use client";

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

import Logo from "@/app/[locale]/(client)/components/logo";

interface AdminSideBarProps {
  onLinkClick?: () => void; // <- add this
}

export default function AdminSideBar({ onLinkClick }: AdminSideBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 100,
        width: 240, // important: fixed width
        //overflowY: "auto", // scroll sidebar if menu is long
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
          if (onLinkClick) onLinkClick(); // <- call on mobile link click
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
            label: "Dashboard",
          },
          {
            key: "/admin/dashboard/stage-overview",
            icon: <AppstoreOutlined />,
            label: "Stage Overview",
          },
          {
            type: "group",
            label: "Management",
            children: [
              {
                key: "/admin/employees",
                icon: <TeamOutlined />,
                label: "Staff Management",
              },
              {
                key: "/admin/mot/customers",
                icon: <UserOutlined />,
                label: "Customer Management",
              },
              {
                key: "/admin/user",
                icon: <TeamOutlined />,
                label: "System Users",
              },
            ],
          },
          /* {
              key: "/admin/caseExecutor/service-list",
              icon: <MessageOutlined />,
              label: "Communication",
            }, */
          {
            key: "/admin/user/profile/id",
            icon: <SettingOutlined />,
            label: "Profile Settings",
          },
          {
            key: "/admin/document",
            icon: <FolderOutlined />,
            label: "Documents",
          },

          {
            type: "group",
            label: "Notifications",
            children: [
              {
                key: "/admin/dashboard/notification",
                icon: <BellOutlined />,
                label: "Notifications",
              },
            ],
          },
          /* {
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
              icon: <HistoryOutlined />,
              label: "Activity Log",
            },
          ],
        }, */
        ]}
      />
    </div>
  );
}
