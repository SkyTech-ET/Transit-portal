"use client";

import { useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  List,
  Avatar,
} from "antd";
import {
  UserOutlined,
  FileSearchOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useAssessorStore } from "@/modules/assessor/assessor.store";

const { Title, Text } = Typography;

export default function AssessorDashboard() {
  const { dashboard, getDashboard } = useAssessorStore();

  useEffect(() => {
    getDashboard();
  }, []);

  const data = dashboard;

  return (
    <>
      {/* PAGE TITLE */}
      <Title level={4} style={{ marginBottom: 16 }}>
        Dashboard Overview
      </Title>

      {/* STATS */}
      <Row gutter={16}>
        <StatCard
          title="Pending Approvals"
          value={data?.pendingCustomerApprovals}
          icon={<UserOutlined />}
          bg="#EFF6FF"
        />
        <StatCard
          title="Service Requests"
          value={data?.pendingServiceReviews}
          icon={<FileSearchOutlined />}
          bg="#ECFDF5"
        />
        <StatCard
          title="Compliance Issues"
          value={data?.servicesUnderOversight}
          icon={<WarningOutlined />}
          bg="#FEF2F2"
        />
        <StatCard
          title="Today's Reviews"
          value={data?.completedReviewsToday}
          icon={<CheckCircleOutlined />}
          bg="#F5F3FF"
        />
      </Row>

      {/* LOWER SECTION */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        {/* PENDING TASKS */}
        <Col span={12}>
          <Card title="Pending Tasks" bordered={false}>
            <TaskItem
              title="New Customer Review"
              description="Documentation Review"
              count={data?.pendingCustomerApprovals}
              action="Review"
            />
            <TaskItem
              title="Service Request Assessment"
              description="Service Evaluation"
              count={data?.pendingServiceReviews}
              action="Assess"
            />
            <TaskItem
              title="Compliance Issue"
              description="Oversight Required"
              count={data?.servicesUnderOversight}
              action="Review"
            />
          </Card>
        </Col>

        {/* RECENT ACTIVITIES */}
        <Col span={12}>
          <Card title="Recent Activities" bordered={false}>
            <List
              itemLayout="horizontal"
              dataSource={data?.recentServiceReviews || []}
              locale={{ emptyText: "No recent activities" }}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: "#E6F4FF" }}>
                        <FileSearchOutlined />
                      </Avatar>
                    }
                    title={item.serviceNumber}
                    description={
                      <>
                        <Text>{item.itemDescription}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {new Date(item.lastUpdateDate).toLocaleString()}
                        </Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ title, value, icon, bg }: any) {
  return (
    <Col span={6}>
      <Card style={{ borderRadius: 12 }} bordered={false}>
        <Row justify="space-between" align="middle">
          <div>
            <Text type="secondary">{title}</Text>
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {value ?? 0}
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </div>
        </Row>
      </Card>
    </Col>
  );
}

function TaskItem({
  title,
  description,
  count,
  action,
}: {
  title: string;
  description: string;
  count?: number;
  action: string;
}) {
  if (!count) return null;

  return (
    <Card
      style={{ marginBottom: 12 }}
      bodyStyle={{ padding: 12 }}
      bordered={false}
    >
      <Row justify="space-between" align="middle">
        <div>
          <Text strong>{title}</Text>
          <br />
          <Text type="secondary">{description}</Text>
        </div>
        <Button type="link">{action}</Button>
      </Row>
    </Card>
  );
}
