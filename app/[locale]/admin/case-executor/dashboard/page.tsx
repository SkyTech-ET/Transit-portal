"use client";

import React, { useEffect } from "react";
import { Card, Row, Col, Statistic, Button, Space, Table, Tag, Progress } from "antd";
import { 
  SolutionOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlayCircleOutlined,
  EyeOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useServiceStore, ServiceStatus } from "@/modules/mot/service";

const CaseExecutorDashboard = () => {
  const router = useRouter();
  const { services, getAllServices } = useServiceStore();

  useEffect(() => {
    getAllServices();
  }, [getAllServices]);

  // Calculate statistics
  const totalServices = services?.length || 0;
  const inProgressServices = services?.filter(service => service.status === ServiceStatus.InProgress).length || 0;
  const completedServices = services?.filter(service => service.status === ServiceStatus.Completed).length || 0;
  const pendingServices = services?.filter(service => service.status === ServiceStatus.Submitted).length || 0;

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case ServiceStatus.Completed: return 'green';
      case ServiceStatus.InProgress: return 'blue';
      case ServiceStatus.Submitted: return 'orange';
      case ServiceStatus.Rejected: return 'red';
      default: return 'default';
    }
  };

  const columns = [
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
      title: 'Service Type',
      dataIndex: 'serviceType',
      key: 'serviceType',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ServiceStatus) => (
        <Tag color={getStatusColor(status)}>
          {ServiceStatus[status]}
        </Tag>
      ),
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_: any, record: any) => {
        const progress = record.status === ServiceStatus.Completed ? 100 :
                        record.status === ServiceStatus.InProgress ? 50 : 0;
        return <Progress percent={progress} size="small" />;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => router.push(`/admin/mot/services/${record.id}`)}
          >
            View
          </Button>
          {record.status === 'Pending' && (
            <Button 
              type="link" 
              icon={<PlayCircleOutlined />}
              onClick={() => router.push(`/admin/mot/services/${record.id}/execute`)}
            >
              Execute
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Case Executor Dashboard</h1>
        <p className="text-gray-600">Service execution and management</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Services"
              value={totalServices}
              prefix={<SolutionOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="In Progress"
              value={inProgressServices}
              prefix={<PlayCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Pending"
              value={pendingServices}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Completed"
              value={completedServices}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card title="Quick Actions" className="mb-6">
        <Space wrap>
          <Button 
            type="primary" 
            icon={<SolutionOutlined />}
            onClick={() => router.push('/admin/mot/services')}
          >
            View All Services
          </Button>
          <Button 
            icon={<ClockCircleOutlined />}
            onClick={() => router.push('/admin/mot/services?status=Pending')}
          >
            Pending Services
          </Button>
          <Button 
            icon={<PlayCircleOutlined />}
            onClick={() => router.push('/admin/mot/services?status=InProgress')}
          >
            In Progress
          </Button>
          <Button 
            icon={<CheckCircleOutlined />}
            onClick={() => router.push('/admin/mot/services?status=Completed')}
          >
            Completed
          </Button>
        </Space>
      </Card>

      {/* Service Execution Table */}
      <Card title="Service Execution Queue">
        <Table
          columns={columns}
          dataSource={services?.slice(0, 10)}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
          locale={{
            emptyText: 'No services assigned'
          }}
        />
      </Card>
    </div>
  );
};

export default CaseExecutorDashboard;



