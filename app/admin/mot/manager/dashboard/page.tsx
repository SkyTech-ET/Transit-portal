"use client";

import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Progress, Table, Tag, Button, Space, Typography, List, Avatar } from "antd";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  Calendar,
  MessageSquare
} from "lucide-react";

interface DashboardStats {
  totalServices: number;
  completedServices: number;
  pendingServices: number;
  rejectedServices: number;
  totalCustomers: number;
  activeStaff: number;
  averageProcessingTime: number;
  customerSatisfaction: number;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  user: string;
  status: string;
}

interface TeamPerformance {
  id: number;
  name: string;
  role: string;
  completedTasks: number;
  pendingTasks: number;
  efficiency: number;
  status: 'active' | 'busy' | 'available';
}

const ManagerDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 0,
    completedServices: 0,
    pendingServices: 0,
    rejectedServices: 0,
    totalCustomers: 0,
    activeStaff: 0,
    averageProcessingTime: 0,
    customerSatisfaction: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [teamPerformance, setTeamPerformance] = useState<TeamPerformance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalServices: 150,
        completedServices: 120,
        pendingServices: 20,
        rejectedServices: 10,
        totalCustomers: 85,
        activeStaff: 12,
        averageProcessingTime: 3.5,
        customerSatisfaction: 4.2
      });

      setRecentActivities([
        {
          id: 1,
          type: 'service_completed',
          description: 'Vehicle registration completed for John Doe',
          timestamp: '2024-01-15T10:30:00Z',
          user: 'Assessor A',
          status: 'completed'
        },
        {
          id: 2,
          type: 'document_uploaded',
          description: 'New documents uploaded for Service #12346',
          timestamp: '2024-01-15T09:15:00Z',
          user: 'Data Encoder B',
          status: 'pending'
        },
        {
          id: 3,
          type: 'approval_required',
          description: 'Approval required for Service #12347',
          timestamp: '2024-01-15T08:45:00Z',
          user: 'Case Executor C',
          status: 'pending'
        },
        {
          id: 4,
          type: 'customer_feedback',
          description: 'Customer feedback received - 5 stars',
          timestamp: '2024-01-14T16:20:00Z',
          user: 'System',
          status: 'completed'
        }
      ]);

      setTeamPerformance([
        {
          id: 1,
          name: 'Assessor A',
          role: 'Service Assessor',
          completedTasks: 25,
          pendingTasks: 3,
          efficiency: 95,
          status: 'active'
        },
        {
          id: 2,
          name: 'Data Encoder B',
          role: 'Data Encoder',
          completedTasks: 18,
          pendingTasks: 5,
          efficiency: 88,
          status: 'busy'
        },
        {
          id: 3,
          name: 'Case Executor C',
          role: 'Case Executor',
          completedTasks: 22,
          pendingTasks: 2,
          efficiency: 92,
          status: 'available'
        },
        {
          id: 4,
          name: 'Assessor D',
          role: 'Service Assessor',
          completedTasks: 20,
          pendingTasks: 4,
          efficiency: 85,
          status: 'active'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'active': return 'blue';
      case 'busy': return 'red';
      case 'available': return 'green';
      default: return 'default';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'service_completed': return <CheckCircle className="text-green-600" />;
      case 'document_uploaded': return <FileText className="text-blue-600" />;
      case 'approval_required': return <AlertTriangle className="text-orange-600" />;
      case 'customer_feedback': return <MessageSquare className="text-purple-600" />;
      default: return <Clock className="text-gray-600" />;
    }
  };

  const teamColumns = [
    {
      title: 'Team Member',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: TeamPerformance) => (
        <div className="flex items-center gap-2">
          <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
            {name.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-500">{record.role}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Completed Tasks',
      dataIndex: 'completedTasks',
      key: 'completedTasks',
      render: (value: number) => (
        <Statistic value={value} valueStyle={{ fontSize: '16px' }} />
      ),
    },
    {
      title: 'Pending Tasks',
      dataIndex: 'pendingTasks',
      key: 'pendingTasks',
      render: (value: number) => (
        <Statistic value={value} valueStyle={{ fontSize: '16px', color: '#faad14' }} />
      ),
    },
    {
      title: 'Efficiency',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <Progress 
            percent={value} 
            size="small" 
            showInfo={false}
            strokeColor={value >= 90 ? '#52c41a' : value >= 80 ? '#faad14' : '#ff4d4f'}
          />
          <span>{value}%</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* <div className="mb-6">
        <Typography.Title level={2}>Manager Dashboard</Typography.Title>
        <Typography.Text type="secondary">
          Overview of MOT system performance and team activities
        </Typography.Text>
      </div> */}

      {/* Key Metrics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Services"
              value={stats.totalServices}
              prefix={<FileText size={20} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completed Services"
              value={stats.completedServices}
              prefix={<CheckCircle size={20} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Services"
              value={stats.pendingServices}
              prefix={<Clock size={20} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Staff"
              value={stats.activeStaff}
              prefix={<Users size={20} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Performance Indicators */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={12}>
          <Card title="Service Completion Rate">
            <Progress
              percent={(stats.completedServices / stats.totalServices) * 100}
              strokeColor="#52c41a"
              format={(percent) => `${percent?.toFixed(1)}%`}
            />
            <div className="mt-2 text-sm text-gray-500">
              {stats.completedServices} of {stats.totalServices} services completed
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Customer Satisfaction">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.customerSatisfaction}/5
              </div>
              <Progress
                percent={(stats.customerSatisfaction / 5) * 100}
                strokeColor="#52c41a"
                showInfo={false}
              />
              <div className="mt-2 text-sm text-gray-500">
                Average rating from customer feedback
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        
        <Col xs={24} lg={16}>
          <Card title="Team Performance" className="h-full">
            <Table
              dataSource={teamPerformance}
              columns={teamColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Recent Activities" className="h-full">
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getActivityIcon(item.type)}
                    title={
                      <div className="flex justify-between items-start">
                        <span className="text-sm">{item.description}</span>
                        <Tag color={getStatusColor(item.status)}>
                          {item.status}
                        </Tag>
                      </div>
                    }
                    description={
                      <div className="text-xs text-gray-500">
                        <div>{item.user}</div>
                        <div>{new Date(item.timestamp).toLocaleString()}</div>
                      </div>
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
};

export default ManagerDashboard;