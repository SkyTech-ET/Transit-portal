"use client";

import { Menu } from "antd";
import {
  DashboardOutlined,
  UserAddOutlined,
  UnorderedListOutlined,
  FileAddOutlined,
  FolderOutlined,
  MessageOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

export default function DataEncoderSidebar() {
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
          key: "/admin/data-encoder/dashboard",
          icon: <DashboardOutlined />,
          label: "Dashboard",
        },
        {
          type: "group",
          label: "Customers",
          children: [
            {
              key: "/admin/data-encoder/customers/create",
              icon: <UserAddOutlined />,
              label: "New Customer",
            },
            {
              key: "/admin/data-encoder/customers/customerList",
              icon: <UnorderedListOutlined />,
              label: "Customer List",
            },
          ],
        },
        {
          type: "group",
          label: "Services",
          children: [
            {
              key: "/admin/mot/services/create",
              icon: <FileAddOutlined />,
              label: "New Service",
            },
            {
              key: "/admin/mot/services/drafts",
              icon: <FolderOutlined />,
              label: "Drafts",
            },
            {
              key: "/admin/mot/services",
              icon: <FolderOutlined />,
              label: "Submitted",
            },
          ],
        },
        {
          type: "group",
          label: "Communication",
          children: [
            {
              key: "/admin/chat/group",
              icon: <MessageOutlined />,
              label: "Group Chat",
            },
            {
              key: "/admin/chat/direct",
              icon: <MessageOutlined />,
              label: "Direct Messages",
            },
          ],
        },
        {
          type: "group",
          label: "Tools",
          children: [
            {
              key: "/admin/mot/bulk-upload",
              icon: <UploadOutlined />,
              label: "Bulk Upload",
            },
          ],
        },
      ]}
    />
  );
}