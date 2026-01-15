"use client";

import React, { useEffect, useState } from "react";
import { useMessagingStore } from "@/modules/mot/messaging";
import { useCustomerStore } from "@/modules/mot/customer";
import { usePermissionStore } from "@/modules/utils";
import { Card, Table, Button, Space, Tag, Typography, Empty, Modal, Form, Input, Select } from "antd";
import { MessageSquare, Send, Inbox } from "lucide-react";

const { Title } = Typography;
const { Option } = Select;

const MessagingPage = () => {
  const { messages, loading, getAllMessages } = useMessagingStore();
  const { customers, getAllCustomers } = useCustomerStore();
  const { checkPermission, permissions } = usePermissionStore();
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [messageForm] = Form.useForm();

  useEffect(() => {
    getAllMessages();
    getAllCustomers();
  }, [getAllMessages, getAllCustomers]);

  const handleNewMessageClick = () => {
    setMessageModalVisible(true);
  };

  const handleMessageSubmit = async (values: any) => {
    try {
      // Here you would implement the actual message sending logic
      // For now, just show success message
      console.log('Sending message:', values);
      setMessageModalVisible(false);
      messageForm.resetFields();
      getAllMessages(); // Refresh the messages list
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleMessageCancel = () => {
    setMessageModalVisible(false);
    messageForm.resetFields();
  };

  const columns = [
    {
      title: "Service Number",
      dataIndex: "serviceNumber",
      key: "serviceNumber",
    },
    {
      title: "From",
      dataIndex: "fromUser",
      key: "fromUser",
      render: (user: any) => user?.firstName + " " + user?.lastName,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "isRead",
      key: "isRead",
      render: (isRead: boolean) => (
        <Tag color={isRead ? "green" : "orange"}>
          {isRead ? "Read" : "Unread"}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Space>
          <Button type="link" size="small">
            View
          </Button>
          <Button type="link" size="small">
            Reply
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="text-blue-600" size={24} />
        <Title level={2} className="mb-0">
          Messages
        </Title>
      </div>

      <Card>
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Inbox size={20} />
            <span className="font-medium">Inbox</span>
          </div>
          <Button 
            type="primary" 
            icon={<Send size={16} />}
            onClick={handleNewMessageClick}
          >
            New Message
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={messages}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} messages`,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No messages found"
              />
            ),
          }}
        />
      </Card>

      {/* New Message Modal */}
      <Modal
        title="Send New Message"
        open={messageModalVisible}
        onCancel={handleMessageCancel}
        footer={null}
        width={600}
      >
        <Form
          form={messageForm}
          layout="vertical"
          onFinish={handleMessageSubmit}
        >
          <Form.Item
            name="customerId"
            label="Customer"
            rules={[{ required: true, message: "Please select customer" }]}
          >
            <Select placeholder="Select customer">
              {customers.map((customer) => (
                <Option key={customer.id} value={customer.id}>
                  {customer.contactPerson} ({customer.contactEmail})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="serviceNumber"
            label="Service Number"
            rules={[{ required: true, message: "Please enter service number" }]}
          >
            <Input placeholder="Enter service number" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true, message: "Please enter message" }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Enter your message" 
            />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleMessageCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" icon={<Send size={16} />}>
              Send Message
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default MessagingPage;

