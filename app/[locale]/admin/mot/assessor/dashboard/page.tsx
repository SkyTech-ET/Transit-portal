"use client";

import React, { useEffect } from "react";
import { Card, Row, Col, Statistic, Progress, Table, Tag, Typography } from "antd";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Users
} from "lucide-react";
import { useDashboardStore } from "@/modules/mot/dashboard";
import { ServiceStatus } from "@/modules/mot/service";

const AssessorDashboard = () => {
  const { assessorDashboard, loading, getAssessorDashboard } = useDashboardStore();

  useEffect(() => {
    getAssessorDashboard();
  }, [getAssessorDashboard]);

  if (!assessorDashboard && !loading) {
    return <div className="p-6">No data available</div>;
  }

  const recentCustomersColumns = [
    {
      title: 'Business Name',
      dataIndex: 'businessName',
      key: 'businessName',
    },
    {
      title: 'Contact Person',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: 'Status',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (isVerified: boolean) => (
        <Tag color={isVerified ? 'green' : 'orange'}>
          {isVerified ? 'Verified' : 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Verified Date',
      dataIndex: 'verifiedAt',
      key: 'verifiedAt',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-',
    },
  ];

  const recentServicesColumns = [
    {
      title: 'Service Number',
      dataIndex: 'serviceNumber',
      key: 'serviceNumber',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer: any) => customer ? `${customer.firstName} ${customer.lastName}` : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ServiceStatus) => (
        <Tag color={status === ServiceStatus.Completed ? 'green' : status === ServiceStatus.InProgress ? 'blue' : 'orange'}>
          {ServiceStatus[status]}
        </Tag>
      ),
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdateDate',
      key: 'lastUpdateDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Typography.Title level={2}>Assessor Dashboard</Typography.Title>
        <Typography.Text type="secondary">
          Overview of customer approvals and service reviews
        </Typography.Text>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Customer Approvals"
              value={assessorDashboard?.pendingCustomerApprovals || 0}
              prefix={<Users size={20} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Service Reviews"
              value={assessorDashboard?.pendingServiceReviews || 0}
              prefix={<FileText size={20} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Services Under Oversight"
              value={assessorDashboard?.servicesUnderOversight || 0}
              prefix={<CheckCircle size={20} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completed Reviews Today"
              value={assessorDashboard?.completedReviewsToday || 0}
              prefix={<Clock size={20} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Performance Indicators */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={12}>
          <Card title="Review Completion Rate">
            <Progress
              percent={assessorDashboard?.pendingServiceReviews ? 
                Math.round((assessorDashboard.completedReviewsToday / (assessorDashboard.pendingServiceReviews + assessorDashboard.completedReviewsToday)) * 100) : 0}
              strokeColor="#52c41a"
              format={(percent) => `${percent?.toFixed(1)}%`}
            />
            <div className="mt-2 text-sm text-gray-500">
              {assessorDashboard?.completedReviewsToday || 0} reviews completed today
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Customer Approval Rate">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {assessorDashboard?.pendingCustomerApprovals ? 
                  Math.round((assessorDashboard.completedReviewsToday / assessorDashboard.pendingCustomerApprovals) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-500">
                Approval efficiency
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Recent Customer Approvals */}
        <Col xs={24} lg={12}>
          <Card title="Recent Customer Approvals" className="h-full">
            <Table
              dataSource={assessorDashboard?.recentCustomerApprovals || []}
              columns={recentCustomersColumns}
              rowKey="id"
              pagination={false}
              size="small"
              loading={loading}
            />
          </Card>
        </Col>

        {/* Recent Service Reviews */}
        <Col xs={24} lg={12}>
          <Card title="Recent Service Reviews" className="h-full">
            <Table
              dataSource={assessorDashboard?.recentServiceReviews || []}
              columns={recentServicesColumns}
              rowKey="id"
              pagination={false}
              size="small"
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AssessorDashboard;
