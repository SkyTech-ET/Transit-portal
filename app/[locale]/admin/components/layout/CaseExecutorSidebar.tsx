"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  BellOutlined,
  DashboardOutlined,
  FileTextOutlined,
  FolderOutlined,
  MessageOutlined,
  ProfileOutlined,
  SafetyOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useTranslations } from "next-intl";

export default function CaseExecutorSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("CaseExecuterSidebar");

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
          label: t("dashboard"),
        },

        {
          type: "group",
          label: t("groups.services"),
          children: [
            {
              key: "/admin/caseExecutor/service-list",
              icon: <UnorderedListOutlined />,
              label: t("items.serviceList"),
            },
            {
              key: "/admin/caseExecutor/service-categories",
              icon: <FolderOutlined />,
              label: t("items.serviceCategories"),
            },
          ],
        },

        {
          type: "group",
          label: t("groups.documents"),
          children: [
            {
              key: "/admin/caseExecutor/document",
              icon: <FileTextOutlined />,
              label: t("items.documentCenter"),
            },
          ],
        },

        {
          type: "group",
          label: t("groups.communication"),
          children: [
            {
              key: "/case-executor/messages",
              icon: <MessageOutlined />,
              label: t("items.messaging"),
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
          label: t("groups.account"),
          children: [
            {
              key: "/admin/user/profile/id",
              icon: <UserOutlined />,
              label: t("items.profile"),
            },
            /* {
              key: "/case-executor/activity-log",
              icon: <ProfileOutlined />,
              label: "My Activity Log",
            }, */
          ],
        },
      ]}
    />
  );
}
