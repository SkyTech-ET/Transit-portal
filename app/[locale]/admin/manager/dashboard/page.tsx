"use client";

import React, { useEffect } from "react";
import { Card, Row, Col, Statistic, Button, Space } from "antd";
import { 
  SolutionOutlined, 
  TeamOutlined, 
  FileTextOutlined, 
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useServiceStore } from "@/modules/mot/service";
import { useUserStore } from "@/modules/user";
import { useCustomerStore } from "@/modules/mot/customer";
import { useDocumentStore } from "@/modules/mot/document";
import { useMessagingStore } from "@/modules/mot/messaging";

const ManagerDashboard = () => {
  const router = useRouter();
  const { services, getAllServices } = useServiceStore();
  const { users, getUsers } = useUserStore();
  const { customers, getAllCustomers } = useCustomerStore();
  const { documents, getAllDocuments } = useDocumentStore();
  const { messages, getAllMessages } = useMessagingStore();

  useEffect(() => {
    // Fetch all data for manager dashboard
    getAllServices();
    getUsers(2); // Active users
    getAllCustomers();
    getAllDocuments();
    getAllMessages();
  }, [getAllServices, getUsers, getAllCustomers, getAllDocuments, getAllMessages]);

  // Calculate statistics
  const totalServices = services?.length || 0;
  const totalCustomers = customers?.length || 0;
  const totalDocuments = documents?.length || 0;
  const totalMessages = messages?.length || 0;
  const totalUsers = users?.length || 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>
        <p className="text-gray-600">Oversight and management capabilities</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Services"
              value={totalServices}
              prefix={<SolutionOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={totalCustomers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Documents"
              value={totalDocuments}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Messages"
              value={totalMessages}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#fa8c16' }}
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
            Manage Services
          </Button>
          <Button 
            icon={<TeamOutlined />}
            onClick={() => router.push('/admin/mot/customers')}
          >
            View Customers
          </Button>
          <Button 
            icon={<FileTextOutlined />}
            onClick={() => router.push('/admin/mot/documents')}
          >
            Manage Documents
          </Button>
          <Button 
            icon={<MessageOutlined />}
            onClick={() => router.push('/admin/mot/messaging')}
          >
            View Messages
          </Button>
          <Button 
            icon={<TeamOutlined />}
            onClick={() => router.push('/admin/user')}
          >
            Manage Users
          </Button>
        </Space>
      </Card>

      {/* Recent Activity */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Recent Services" size="small">
            <div className="space-y-2">
              {services?.slice(0, 5).map((service: any) => (
                <div key={service.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{service.serviceNumber}</span>
                  <span className="text-sm text-gray-600">{service.status}</span>
                </div>
              ))}
              {(!services || services.length === 0) && (
                <p className="text-gray-500 text-center py-4">No services found</p>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="System Overview" size="small">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Users:</span>
                <span className="font-medium">{totalUsers}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Services:</span>
                <span className="font-medium">{totalServices}</span>
              </div>
              <div className="flex justify-between">
                <span>Registered Customers:</span>
                <span className="font-medium">{totalCustomers}</span>
              </div>
              <div className="flex justify-between">
                <span>Documents:</span>
                <span className="font-medium">{totalDocuments}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManagerDashboard;



