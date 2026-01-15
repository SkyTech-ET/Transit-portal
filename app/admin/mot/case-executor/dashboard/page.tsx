"use client";

import React, { useEffect } from "react";
import { Card, Row, Col, Statistic, Progress, Table, Tag, Typography, Timeline } from "antd";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  MessageSquare
} from "lucide-react";
import { useDashboardStore } from "@/modules/mot/dashboard";
import { ServiceStatus, StageStatus } from "@/modules/mot/service";

const CaseExecutorDashboard = () => {
  const { caseExecutorDashboard, loading, getCaseExecutorDashboard } = useDashboardStore();

  useEffect(() => {
    getCaseExecutorDashboard();
  }, [getCaseExecutorDashboard]);

  if (!caseExecutorDashboard && !loading) {
    return <div className="p-6">No data available</div>;
  }

  const tasksColumns = [
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: number) => `Stage ${stage}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: StageStatus) => (
        <Tag color={status === StageStatus.Completed ? 'green' : status === StageStatus.InProgress ? 'blue' : 'orange'}>
          {StageStatus[status]}
        </Tag>
      ),
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      render: (service: any) => service?.serviceNumber || 'N/A',
    },
    {
      title: 'Start Date',
      dataIndex: 'registeredDate',
      key: 'registeredDate',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Typography.Title level={2}>Case Executor Dashboard</Typography.Title>
        <Typography.Text type="secondary">
          Manage case execution and customer communications
        </Typography.Text>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Assigned Services"
              value={caseExecutorDashboard?.assignedServices || 0}
              prefix={<FileText size={20} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completed Services"
              value={caseExecutorDashboard?.completedServices || 0}
              prefix={<CheckCircle size={20} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Services"
              value={caseExecutorDashboard?.pendingServices || 0}
              prefix={<Clock size={20} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Blocked Stages"
              value={caseExecutorDashboard?.blockedStages || 0}
              prefix={<AlertTriangle size={20} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Performance Indicators */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={12}>
          <Card title="Service Completion Rate">
            <Progress
              percent={caseExecutorDashboard?.assignedServices ? 
                Math.round((caseExecutorDashboard.completedServices / caseExecutorDashboard.assignedServices) * 100) : 0}
              strokeColor="#52c41a"
              format={(percent) => `${percent?.toFixed(1)}%`}
            />
            <div className="mt-2 text-sm text-gray-500">
              {caseExecutorDashboard?.completedServices || 0} of {caseExecutorDashboard?.assignedServices || 0} services completed
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Urgent Notifications">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {caseExecutorDashboard?.urgentNotifications?.length || 0}
              </div>
              <div className="text-sm text-gray-500">
                Urgent notifications requiring attention
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Today's Tasks */}
        <Col xs={24} lg={16}>
          <Card title="Today's Tasks" className="h-full">
            <Table
              dataSource={caseExecutorDashboard?.todaysTasks || []}
              columns={tasksColumns}
              rowKey="id"
              pagination={false}
              size="small"
              loading={loading}
            />
          </Card>
        </Col>

        {/* Urgent Notifications */}
        <Col xs={24} lg={8}>
          <Card title="Urgent Notifications" className="h-full">
            {caseExecutorDashboard?.urgentNotifications && caseExecutorDashboard.urgentNotifications.length > 0 ? (
              <div className="space-y-2">
                {caseExecutorDashboard.urgentNotifications.slice(0, 5).map((notification: any, index: number) => (
                  <div key={index} className="p-2 bg-red-50 rounded">
                    <div className="font-medium text-sm">{notification.title || 'Urgent Notification'}</div>
                    <div className="text-xs text-gray-500">
                      {notification.service?.serviceNumber || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">No urgent notifications</div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CaseExecutorDashboard;