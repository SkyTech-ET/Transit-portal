"use client";

import React, { useEffect, useState } from "react";
import { Card, Table, Button, Space, Typography, Empty, Select, DatePicker, Row, Col, Statistic, Progress, message, Tabs } from "antd";
import { BarChart3, Download, Filter, Calendar, TrendingUp, Users, FileText, CheckCircle, Clock } from "lucide-react";
import { usePermissionStore } from "@/modules/utils";
import { useReportStore } from "@/modules/mot/report";
import permission from "@/modules/utils/permission/permission";

const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportsPage = () => {
  const { checkPermission, permissions } = usePermissionStore();
  const { 
    serviceStatistics, 
    monthlyReports, 
    customerStatistics, 
    systemReport,
    loading,
    getServiceStatistics,
    getMonthlyReport,
    getCustomerStatistics,
    getSystemReport
  } = useReportStore();
  
  const [dateRange, setDateRange] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('service');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const filters = dateRange ? {
      startDate: dateRange[0].toISOString(),
      endDate: dateRange[1].toISOString(),
    } : undefined;

    await Promise.all([
      getServiceStatistics(filters),
      getMonthlyReport(new Date().getFullYear()),
      getCustomerStatistics(filters),
      getSystemReport(filters),
    ]);
  };

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
    if (dates) {
      loadReports();
    }
  };

  const getCompletionRate = () => {
    return serviceStatistics?.totalServices ? 
      (serviceStatistics.completedServices / serviceStatistics.totalServices) * 100 : 0;
  };

  const getPendingRate = () => {
    return serviceStatistics?.totalServices ? 
      (serviceStatistics.pendingServices / serviceStatistics.totalServices) * 100 : 0;
  };

  const monthlyColumns = [
    {
      title: "Month",
      key: "month",
      render: (_: any, record: any) => 
        new Date(record.year, record.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' }),
    },
    {
      title: "Total Services",
      dataIndex: "totalServices",
      key: "totalServices",
    },
    {
      title: "Completed",
      dataIndex: "completedServices",
      key: "completedServices",
      render: (value: number) => (
        <Statistic value={value} valueStyle={{ fontSize: '16px', color: '#52c41a' }} />
      ),
    },
    {
      title: "Pending",
      dataIndex: "pendingServices",
      key: "pendingServices",
      render: (value: number) => (
        <Statistic value={value} valueStyle={{ fontSize: '16px', color: '#faad14' }} />
      ),
    },
    {
      title: "Completion Rate",
      dataIndex: "completionRate",
      key: "completionRate",
      render: (rate: number) => (
        <Progress percent={rate} size="small" format={(percent) => `${percent?.toFixed(1)}%`} />
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 size={24} className="text-blue-600" />
        <Typography.Title level={2} className="mb-0">Reports & Analytics</Typography.Title>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <span>Date Range:</span>
          </div>
          <RangePicker
            placeholder={['Start Date', 'End Date']}
            value={dateRange}
            onChange={handleDateRangeChange}
          />
          <Button
            type="primary"
            icon={<BarChart3 size={16} />}
            onClick={loadReports}
            loading={loading}
          >
            Refresh Reports
          </Button>
        </div>
      </Card>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
        {
          key: 'service',
          label: 'Service Statistics',
          children: (
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Services"
                  value={serviceStatistics?.totalServices || 0}
                  prefix={<FileText size={20} />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Completed"
                  value={serviceStatistics?.completedServices || 0}
                  prefix={<CheckCircle size={20} />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Pending"
                  value={serviceStatistics?.pendingServices || 0}
                  prefix={<Clock size={20} />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Avg. Processing Time"
                  value={serviceStatistics?.averageProcessingTime || 0}
                  suffix="days"
                  prefix={<TrendingUp size={20} />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Service Completion Progress">
                <Progress
                  percent={getCompletionRate()}
                  strokeColor="#52c41a"
                  format={(percent) => `${percent?.toFixed(1)}% Completed`}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Completion Rate">
                <Statistic
                  value={serviceStatistics?.completionRate || 0}
                  suffix="%"
                  valueStyle={{ fontSize: '32px', color: '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>
          )
        },
        {
          key: 'monthly',
          label: 'Monthly Reports',
          children: (
          <Card>
            <Table
              dataSource={monthlyReports}
              columns={monthlyColumns}
              rowKey={(record) => `${record.year}-${record.month}`}
              loading={loading}
              pagination={{ pageSize: 12 }}
            />
          </Card>
          )
        },
        {
          key: 'customer',
          label: 'Customer Statistics',
          children: (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Customers"
                  value={customerStatistics?.totalCustomers || 0}
                  prefix={<Users size={20} />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Verified"
                  value={customerStatistics?.verifiedCustomers || 0}
                  prefix={<CheckCircle size={20} />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Pending"
                  value={customerStatistics?.pendingCustomers || 0}
                  prefix={<Clock size={20} />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Verification Rate"
                  value={customerStatistics?.verificationRate || 0}
                  suffix="%"
                  prefix={<TrendingUp size={20} />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>
          )
        },
        {
          key: 'system',
          label: 'System Report',
          children: (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Services"
                  value={systemReport?.totalServices || 0}
                  prefix={<FileText size={20} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Customers"
                  value={systemReport?.totalCustomers || 0}
                  prefix={<Users size={20} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Documents"
                  value={systemReport?.totalDocuments || 0}
                  prefix={<FileText size={20} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Messages"
                  value={systemReport?.totalMessages || 0}
                  prefix={<FileText size={20} />}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-4">
            <Col xs={24} md={12}>
              <Card title="Service Completion Rate">
                <Progress
                  percent={systemReport?.serviceCompletionRate || 0}
                  strokeColor="#52c41a"
                  format={(percent) => `${percent?.toFixed(1)}%`}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Customer Verification Rate">
                <Progress
                  percent={systemReport?.customerVerificationRate || 0}
                  strokeColor="#1890ff"
                  format={(percent) => `${percent?.toFixed(1)}%`}
                />
              </Card>
            </Col>
          </Row>
          )
        }
      ]} />
    </div>
  );
};

export default ReportsPage;