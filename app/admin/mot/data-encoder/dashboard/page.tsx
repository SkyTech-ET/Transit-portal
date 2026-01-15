"use client";

import React, { useEffect } from "react";
import { Card, Row, Col, Statistic, Progress, Table, Tag, Typography } from "antd";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Users,
  Database
} from "lucide-react";
import { useDashboardStore } from "@/modules/mot/dashboard";
import { ServiceStatus } from "@/modules/mot/service";

const DataEncoderDashboard = () => {
  const { dataEncoderDashboard, loading, getDataEncoderDashboard } = useDashboardStore();

  useEffect(() => {
    getDataEncoderDashboard();
  }, [getDataEncoderDashboard]);

  if (!dataEncoderDashboard && !loading) {
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
      title: 'Created Date',
      dataIndex: 'registeredDate',
      key: 'registeredDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
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
      title: 'Created Date',
      dataIndex: 'registeredDate',
      key: 'registeredDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Typography.Title level={2}>Data Encoder Dashboard</Typography.Title>
        <Typography.Text type="secondary">
          Overview of data entry activities and pending approvals
        </Typography.Text>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Customers Created"
              value={dataEncoderDashboard?.totalCustomersCreated || 0}
              prefix={<Users size={20} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Customer Approvals"
              value={dataEncoderDashboard?.pendingCustomerApprovals || 0}
              prefix={<AlertTriangle size={20} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Services Created"
              value={dataEncoderDashboard?.totalServicesCreated || 0}
              prefix={<FileText size={20} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Draft Services"
              value={dataEncoderDashboard?.draftServices || 0}
              prefix={<Database size={20} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Performance Indicators */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={12}>
          <Card title="Customer Creation Progress">
            <Progress
              percent={dataEncoderDashboard?.totalCustomersCreated ? 
                Math.round(((dataEncoderDashboard.totalCustomersCreated - dataEncoderDashboard.pendingCustomerApprovals) / dataEncoderDashboard.totalCustomersCreated) * 100) : 0}
              strokeColor="#52c41a"
              format={(percent) => `${percent?.toFixed(1)}% Approved`}
            />
            <div className="mt-2 text-sm text-gray-500">
              {dataEncoderDashboard?.totalCustomersCreated - (dataEncoderDashboard?.pendingCustomerApprovals || 0) || 0} of {dataEncoderDashboard?.totalCustomersCreated || 0} customers approved
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Service Creation Status">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Services:</span>
                <span className="font-bold">{dataEncoderDashboard?.totalServicesCreated || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Approvals:</span>
                <span className="font-bold text-orange-600">{dataEncoderDashboard?.pendingServiceApprovals || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Draft Services:</span>
                <span className="font-bold text-purple-600">{dataEncoderDashboard?.draftServices || 0}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Recent Customers */}
        <Col xs={24} lg={12}>
          <Card title="Recent Customers" className="h-full">
            <Table
              dataSource={dataEncoderDashboard?.recentCustomers || []}
              columns={recentCustomersColumns}
              rowKey="id"
              pagination={false}
              size="small"
              loading={loading}
            />
          </Card>
        </Col>

        {/* Recent Services */}
        <Col xs={24} lg={12}>
          <Card title="Recent Services" className="h-full">
            <Table
              dataSource={dataEncoderDashboard?.recentServices || []}
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

export default DataEncoderDashboard;
