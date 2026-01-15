"use client";

import { Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  UnorderedListOutlined,
  MessageOutlined,
  FileSearchOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";

const items = [
  { key: "/assessor/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/assessor/customer-approval", icon: <UserOutlined />, label: "Customer Approval" },
  { key: "/assessor/service-requests", icon: <FileSearchOutlined />, label: "Service Requests" },
  { key: "/assessor/service-list", icon: <UnorderedListOutlined />, label: "Service List" },
  { key: "/assessor/messages", icon: <MessageOutlined />, label: "Messages" },
  { key: "/assessor/document-viewer", icon: <FileTextOutlined />, label: "Document Viewer" },
  { key: "/assessor/assessment-logs", icon: <BellOutlined />, label: "Assessment Logs" },
];

export default function AssessorSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className="assessor-sidebar"
      style={{
    width: 240,
    height: "100vh",
    background: "#fffff",
    borderRight: "1px solid #E5E7EB",
    paddingTop: 16,
  }}
    >
      <Menu
        mode="inline"
        className="assessor-menu"
        selectedKeys={[pathname]}
        items={items}
        onClick={({ key }) => router.push(key)}
        style={{ borderRight: 0 }}
      />

     
    </div>
  );
}
