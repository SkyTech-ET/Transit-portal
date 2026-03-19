"use client";

import React, { useEffect, useState } from "react";
import { Card, Table, Button, Space, Tag, Typography, Empty, Badge, Tooltip, Modal, Input } from "antd";
import { Bell, Eye, Check, X, Filter, Search } from "lucide-react";
import { usePermissionStore } from "@/modules/utils";
import permission from "@/modules/utils/permission/permission";

const { TextArea } = Input;

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: string;
  fromUser?: string;
  relatedService?: string;
}

const NotificationsPage = () => {
  const { checkPermission, permissions } = usePermissionStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Mock data - replace with actual API call
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          title: "New Service Request",
          message: "A new service request has been submitted for review.",
          type: 'info',
          isRead: false,
          createdAt: '2024-01-15T10:30:00Z',
          fromUser: 'John Doe',
          relatedService: 'Service #12345'
        },
        {
          id: 2,
          title: "Document Verification Required",
          message: "Please verify the uploaded documents for Service #12346.",
          type: 'warning',
          isRead: false,
          createdAt: '2024-01-15T09:15:00Z',
          fromUser: 'Jane Smith',
          relatedService: 'Service #12346'
        },
        {
          id: 3,
          title: "Approval Completed",
          message: "Service request #12344 has been approved and is ready for processing.",
          type: 'success',
          isRead: true,
          createdAt: '2024-01-14T16:45:00Z',
          fromUser: 'System',
          relatedService: 'Service #12344'
        },
        {
          id: 4,
          title: "Payment Failed",
          message: "Payment processing failed for Service #12343. Please contact the customer.",
          type: 'error',
          isRead: true,
          createdAt: '2024-01-14T14:20:00Z',
          fromUser: 'Payment System',
          relatedService: 'Service #12343'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleViewNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'green';
      case 'warning': return 'orange';
      case 'error': return 'red';
      default: return 'blue';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const columns = [
    {
      title: "Status",
      dataIndex: "isRead",
      key: "isRead",
      width: 80,
      render: (isRead: boolean) => (
        <Badge 
          status={isRead ? "default" : "processing"} 
          text={isRead ? "Read" : "Unread"}
        />
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: string) => (
        <Tag color={getTypeColor(type)}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "From",
      dataIndex: "fromUser",
      key: "fromUser",
      width: 120,
    },
    {
      title: "Related Service",
      dataIndex: "relatedService",
      key: "relatedService",
      width: 130,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: Notification) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button
              icon={<Eye size={16} />}
              onClick={() => handleViewNotification(record)}
            />
          </Tooltip>
          {!record.isRead && (
            <Tooltip title="Mark as Read">
              <Button
                icon={<Check size={16} />}
                onClick={() => handleMarkAsRead(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell size={24} className="text-blue-600" />
        <Typography.Title level={2} className="mb-0">
          Notifications
          {unreadCount > 0 && (
            <Badge count={unreadCount} style={{ marginLeft: 8 }} />
          )}
        </Typography.Title>
      </div>

      <Card bordered>
        <div className="mb-4 flex justify-between items-center">
          <Space>
            <Button.Group>
              <Button 
                type={filter === 'all' ? 'primary' : 'default'}
                onClick={() => setFilter('all')}
              >
                All ({notifications.length})
              </Button>
              <Button 
                type={filter === 'unread' ? 'primary' : 'default'}
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </Button>
              <Button 
                type={filter === 'read' ? 'primary' : 'default'}
                onClick={() => setFilter('read')}
              >
                Read ({notifications.length - unreadCount})
              </Button>
            </Button.Group>
          </Space>
          <Space>
            <Button
              icon={<Check size={16} />}
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All as Read
            </Button>
          </Space>
        </div>

        <Table
          dataSource={filteredNotifications}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No notifications found"
              />
            ),
          }}
        />
      </Card>

      <Modal
        title="Notification Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedNotification && (
          <div className="space-y-4">
            <div>
              <strong>Title:</strong> {selectedNotification.title}
            </div>
            <div>
              <strong>Type:</strong> 
              <Tag color={getTypeColor(selectedNotification.type)} className="ml-2">
                {selectedNotification.type.toUpperCase()}
              </Tag>
            </div>
            <div>
              <strong>From:</strong> {selectedNotification.fromUser}
            </div>
            <div>
              <strong>Related Service:</strong> {selectedNotification.relatedService}
            </div>
            <div>
              <strong>Date:</strong> {new Date(selectedNotification.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>Message:</strong>
              <div className="mt-2 p-3 bg-gray-50 rounded">
                {selectedNotification.message}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NotificationsPage;