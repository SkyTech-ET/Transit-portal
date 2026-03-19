"use client";

import { useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  List,
  Tag,
  Spin,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import  { useDataEncoderStore } from "@/modules/data-encoder/data-encoder.store";

const { Title, Text } = Typography;

export default function DataEncoderDashboardPage() {
  const { dashboard, loading, getDashboard } = useDataEncoderStore();

  useEffect(() => {
    getDashboard();
  }, [getDashboard]);

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* ================= HEADER ================= */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ marginBottom: 4 }}>
          Dashboard Overview
        </Title>
        <Text type="secondary">
          Welcome back, here’s what’s happening today
        </Text>
      </div>

      {/* ================= METRICS ================= */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <MetricCard
          icon={<UserOutlined />}
          label="Pending Approvals"
          value={dashboard?.pendingApprovals ?? 0}
          bg="#E6F4FF"
          color="#1677FF"
        />
        <MetricCard
          icon={<FileTextOutlined />}
          label="Draft Requests"
          value={dashboard?.draftRequests ?? 0}
          bg="#FFF7E6"
          color="#FA8C16"
        />
        <MetricCard
          icon={<CheckCircleOutlined />}
          label="Submitted Services"
          value={dashboard?.submittedServices ?? 0}
          bg="#F6FFED"
          color="#52C41A"
        />
        <MetricCard
          icon={<PieChartOutlined />}
          label="Approval Rate"
          value={`${dashboard?.approvalRate ?? 0}%`}
          bg="#F9F0FF"
          color="#722ED1"
        />
      </Row>

      {/* ================= CONTENT ================= */}
      <Row gutter={16}>
        {/* -------- Recent Activities -------- */}
        <Col span={14}>
          <Card
            title="Recent Activities"
            bordered
            style={{ borderRadius: 8 }}
          >
            <List
              dataSource={dashboard?.recentActivities ?? []}
              locale={{ emptyText: "No recent activities" }}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<Text strong>{item.title}</Text>}
                    description={
                      <Text type="secondary">{item.description}</Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* -------- Pending Tasks -------- */}
        <Col span={10}>
          <Card
            title="Pending Tasks"
            bordered
            style={{ borderRadius: 8 }}
          >
            <List
              dataSource={dashboard?.pendingTasks ?? []}
              locale={{ emptyText: "No pending tasks" }}
              renderItem={(item) => (
                <List.Item
                  extra={
                    <Tag
                      color={
                        item.status === "Urgent"
                          ? "red"
                          : item.status === "Pending"
                          ? "orange"
                          : "blue"
                      }
                    >
                      {item.status}
                    </Tag>
                  }
                >
                  <List.Item.Meta
                    title={<Text strong>{item.title}</Text>}
                    description={
                      <Text type="secondary">{item.description}</Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

/* ================= METRIC CARD COMPONENT ================= */

function MetricCard({
  icon,
  label,
  value,
  bg,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  bg: string;
  color: string;
}) {
  return (
    <Col span={6}>
      <Card bordered style={{ borderRadius: 8 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: bg,
            color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            marginBottom: 12,
          }}
        >
          {icon}
        </div>

        <Text type="secondary">{label}</Text>
        <Title level={4} style={{ marginTop: 4 }}>
          {value}
        </Title>
      </Card>
    </Col>
  );
}
