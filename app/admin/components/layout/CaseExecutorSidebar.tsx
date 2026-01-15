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

export default function CaseExecutorSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      onClick={({ key }) => router.push(key)}
      style={{
        height: "100vh",
        borderRight: 0,
        paddingTop: 8,
      }}
      items={[
        {
          key: "/admin/caseExecutor/dashboard",
          icon: <DashboardOutlined />,
          label: "Dashboard",
        },

        {
          type: "group",
          label: "Services",
          children: [
            {
              key: "/admin/caseExecutor/service-list",
              icon: <UnorderedListOutlined />,
              label: "Service List",
            },
            {
              key: "/admin/caseExecutor/service-categories",
              icon: <FolderOutlined />,
              label: "Service Categories",
            },
          ],
        },

        {
          type: "group",
          label: "Documents",
          children: [
            {
              key: "/admin/caseExecutor/documents",
              icon: <FileTextOutlined />,
              label: "Document Center",
            },
          ],
        },

        {
          type: "group",
          label: "Communication",
          children: [
            {
              key: "/case-executor/messages",
              icon: <MessageOutlined />,
              label: "Messaging",
            },
           
          ],
        },

        /* {
          type: "group",
          label: "Compliance",
          children: [
            {
              key: "/case-executor/risk-compliance",
              icon: <SafetyOutlined />,
              label: "Risk & Compliance",
            },
          ],
        }, */

        {
          type: "group",
          label: "Account",
          children: [
            {
              key: "/admin/user/profile/id",
              icon: <UserOutlined />,
              label: "Profile",
            },
            {
              key: "/case-executor/activity-log",
              icon: <ProfileOutlined />,
              label: "My Activity Log",
            },
          ],
        },
      ]}
    />
  );
}
