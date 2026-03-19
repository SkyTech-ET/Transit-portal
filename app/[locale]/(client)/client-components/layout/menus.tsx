"use client";

import { Avatar, Menu } from "antd";
import {
  PieChartOutlined,
  FileTextOutlined,
  MessageOutlined,
  NotificationOutlined,
  PhoneOutlined,
  ProfileFilled,
  ProfileOutlined,
  CustomerServiceOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { PersonStanding } from "lucide-react";

export default function CustomerSidebar() {
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
          key: "/dashboard",
          icon: <PieChartOutlined />,
          label: "Dashboard",
        },
        {
          key: "/dashboard/service-requests",
          icon: <FileAddOutlined />,
          label: "Service",
        },
        /* {
          key: "/dashboard/tax-information",
          icon: <PieChartOutlined />,
          label: "Tax Information",
        }, */
        {
          key: "/document",
          icon: <FileTextOutlined />,
          label: "Documents",
        },
        {
          key: "/notification",
          icon: <NotificationOutlined />,
          label: "Notification",
        },
        {
          key: "/admin/customer/messages",
          icon: <MessageOutlined />,
          label: "Message Center",
        },
        {
          key: "/dashboard/contact-us",
          icon: <PhoneOutlined />,
          label: "Contact Us",
        },
        {
          key: "/admin/user/profile/id",
          icon: <ProfileOutlined />,
          label: "Profile Settings",
        },
      ]}
    />
  );
}