"use client";

import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Progress, Timeline, Table, Tag, Button, Space } from "antd";
import { 
  Truck, 
  Users, 
  FileText, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useServiceStore, ServiceStatus, ServiceType } from "@/modules/mot/service";
import { useCustomerStore } from "@/modules/mot/customer";
import { useDocumentStore } from "@/modules/mot/document";
import { useMessagingStore } from "@/modules/mot/messaging";

const MOTDashboard = () => {
  const { services, getAllServices } = useServiceStore();
  const { customers, getAllCustomers } = useCustomerStore();
  const { documents } = useDocumentStore();
  const { unreadCount, getUnreadCount } = useMessagingStore();

  const [dashboardData, setDashboardData] = useState({
    totalServices: 0,
    pendingServices: 0,
    inProgressServices: 0,
    completedServices: 0,
    totalCustomers: 0,
    verifiedCustomers: 0,
    pendingApprovals: 0,
    totalDocuments: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      await Promise.all([
        getAllServices(),
        getAllCustomers(),
        getUnreadCount(1), // Assuming current user ID is 1
      ]);

      // Calculate dashboard metrics
      const totalServices = services.length;
      const pendingServices = services.filter(s => s.status === ServiceStatus.Submitted).length;
      const inProgressServices = services.filter(s => s.status === ServiceStatus.InProgress).length;
      const completedServices = services.filter(s => s.status === ServiceStatus.Completed).length;
      const totalCustomers = customers.length;
      const verifiedCustomers = customers.filter(c => c.isVerified).length;
      const pendingApprovals = customers.filter(c => !c.isVerified).length;

      setDashboardData({
        totalServices,
        pendingServices,
        inProgressServices,
        completedServices,
        totalCustomers,
        verifiedCustomers,
        pendingApprovals,
        totalDocuments: documents.length,
        unreadMessages: unreadCount,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  const getStatusColor = (status: ServiceStatus) => {
    const colors = {
      [ServiceStatus.Draft]: 'default',
      [ServiceStatus.Submitted]: 'processing',
      [ServiceStatus.UnderReview]: 'warning',
      [ServiceStatus.Approved]: 'success',
      [ServiceStatus.InProgress]: 'processing',
      [ServiceStatus.Completed]: 'success',
      [ServiceStatus.Rejected]: 'error',
      [ServiceStatus.Cancelled]: 'default',
      [ServiceStatus.Pending]: 'pending',
    };
    return colors[status] || 'default';
  };

  const recentServices = services.slice(0, 5).map(service => ({
    key: service.id,
    serviceNumber: service.serviceNumber,
    itemDescription: service.itemDescription,
    status: service.status,
    customer: `${service.customer?.firstName} ${service.customer?.lastName}`,
    createdDate: new Date(service.registeredDate).toLocaleDateString(),
  }));

  const serviceColumns = [
    {
      title: "Service Number",
      dataIndex: "serviceNumber",
      key: "serviceNumber",
    },
    {
      title: "Item Description",
      dataIndex: "itemDescription",
      key: "itemDescription",
      ellipsis: true,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: ServiceStatus) => (
        <Tag color={getStatusColor(status)}>
          {Object.keys(ServiceStatus)[Object.values(ServiceStatus).indexOf(status)]}
        </Tag>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
    },
  ];

  const workflowStages = [
    { title: "Prepayment Invoice", status: "completed", color: "green" },
    { title: "Drop Risk", status: "completed", color: "green" },
    { title: "Delivery Order", status: "completed", color: "green" },
    { title: "Inspection", status: "process", color: "blue" },
    { title: "Transportation", status: "wait", color: "gray" },
    { title: "Clearance", status: "wait", color: "gray" },
    { title: "Store Settlement", status: "wait", color: "gray" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">MOT System Dashboard</h1>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Services"
              value={dashboardData.totalServices}
              prefix={<Truck size={20} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Services"
              value={dashboardData.pendingServices}
              prefix={<Clock size={20} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="In Progress"
              value={dashboardData.inProgressServices}
              prefix={<TrendingUp size={20} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed"
              value={dashboardData.completedServices}
              prefix={<CheckCircle size={20} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={dashboardData.totalCustomers}
              prefix={<Users size={20} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Verified Customers"
              value={dashboardData.verifiedCustomers}
              prefix={<CheckCircle size={20} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Approvals"
              value={dashboardData.pendingApprovals}
              prefix={<AlertCircle size={20} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Unread Messages"
              value={dashboardData.unreadMessages}
              prefix={<MessageSquare size={20} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Service Workflow */}
        <Col xs={24} lg={12}>
          <Card title="Service Workflow" className="h-full">
            <Timeline
              items={workflowStages.map((stage, index) => ({
                color: stage.color,
                children: (
                  <div>
                    <div className="font-medium">{stage.title}</div>
                    <div className="text-sm text-gray-500">
                      {stage.status === 'completed' && 'Completed'}
                      {stage.status === 'process' && 'In Progress'}
                      {stage.status === 'wait' && 'Pending'}
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>

        {/* Service Status Distribution */}
        <Col xs={24} lg={12}>
          <Card title="Service Status Distribution" className="h-full">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Draft</span>
                  <span>{services.filter(s => s.status === ServiceStatus.Draft).length}</span>
                </div>
                <Progress 
                  percent={(services.filter(s => s.status === ServiceStatus.Draft).length / services.length) * 100} 
                  strokeColor="#d9d9d9"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Submitted</span>
                  <span>{services.filter(s => s.status === ServiceStatus.Submitted).length}</span>
                </div>
                <Progress 
                  percent={(services.filter(s => s.status === ServiceStatus.Submitted).length / services.length) * 100} 
                  strokeColor="#1890ff"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>In Progress</span>
                  <span>{services.filter(s => s.status === ServiceStatus.InProgress).length}</span>
                </div>
                <Progress 
                  percent={(services.filter(s => s.status === ServiceStatus.InProgress).length / services.length) * 100} 
                  strokeColor="#52c41a"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Completed</span>
                  <span>{services.filter(s => s.status === ServiceStatus.Completed).length}</span>
                </div>
                <Progress 
                  percent={(services.filter(s => s.status === ServiceStatus.Completed).length / services.length) * 100} 
                  strokeColor="#52c41a"
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Services */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col span={24}>
          <Card 
            title="Recent Services" 
            extra={
              <Button type="link" href="/admin/mot/services">
                View All
              </Button>
            }
          >
            <Table
              columns={serviceColumns}
              dataSource={recentServices}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MOTDashboard;












