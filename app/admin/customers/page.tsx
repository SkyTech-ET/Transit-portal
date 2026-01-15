"use client";

import React, { useEffect, useState } from "react";
import { Card, Table, Button, Space, Tag, Modal, Input, Popconfirm } from "antd";
import { Plus, Trash2, Eye, Edit, Users, Truck, PencilLine, Trash } from "lucide-react";
import { useUserStore } from "@/modules/user";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";
import { useRouter } from "next/navigation";
import { customerRoutes } from "@/modules/mot/customer";

const CustomersPage = () => {
  const router = useRouter();
  const { 
    users, 
    loading, 
    getUsers, 
    deleteUser
  } = useUserStore();
  const { currentUser } = usePermissionStore();
  
  const [filters, setFilters] = useState({
    search: "",
  });

  // Check if current user is a customer (declare this first)
  const isCurrentUserCustomer = currentUser?.roles?.some(role => 
    role.roleName?.toLowerCase() === 'customer' || role.id === 6 || role.id === 8
  );

  // Filter users to show only those with Customer role and apply search
  const customerUsers = users.filter(user => {
    // Check if user has Customer role (roleId 6 based on seeder, but let's check for roleId 8 from the logs)
    const hasCustomerRole = user.roles && user.roles.some(role =>
      role.id === 6 || role.id === 8 // Customer role ID (adjust as needed)
    );
    
    // If current user is a customer, only show their own data
    if (isCurrentUserCustomer) {
      const isOwnData = user.id === currentUser?.id;
      return hasCustomerRole && isOwnData;
    }
    
    // For admin users, show all customers with search filter
    const matchesSearch = !filters.search || 
      user.username?.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email?.toLowerCase().includes(filters.search.toLowerCase());
    
    return hasCustomerRole && matchesSearch;
  });

  useEffect(() => {
    getUsers(2); // Get active users (RecordStatus.Active = 2)
  }, []);

  const handleDelete = (id: number) => {
    deleteUser(id);
  };


  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Roles",
      dataIndex: "userRoles",
      key: "userRoles",
      render: (userRoles: any[]) => (
        <Space>
          {userRoles?.map((userRole, index) => (
            <Tag key={index} color="blue">
              Role ID: {userRole.roleId}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "recordStatus",
      key: "recordStatus",
      render: (status: number) => (
        <Tag color={status === 2 ? 'green' : 'red'}>
          {status === 2 ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: "Options",
      key: "options",
      render: (_: any, record: any) => (
        <span className="flex gap-2">
          {!isCurrentUserCustomer && (
            <>
              <Button
                type="primary"
                className="bg-red"
                icon={<PencilLine size={18} />}
                onClick={() => router.push(`/admin/user/edit/${record.id}`)}
              />
              <Popconfirm 
                title="Sure to delete?" 
                onConfirm={() => handleDelete(record.id)}
              >
                <Button
                  className="bg-red"
                  icon={<Trash size={18} color="red" />}
                />
              </Popconfirm>
            </>
          )}
          {isCurrentUserCustomer && (
            <Button
              type="primary"
              className="bg-red"
              icon={<PencilLine size={18} />}
              onClick={() => router.push(`/admin/user/edit/${record.id}`)}
            />
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
        <Card
          title={
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span>
                {isCurrentUserCustomer ? "My Customer Dashboard" : "Customer Management"}
              </span>
            </div>
          }
          extra={
            <Space>
              {isCurrentUserCustomer && (
                <Button
                  type="primary"
                  icon={<Truck size={16} />}
                  onClick={() => router.push(customerRoutes.createService)}
                >
                  Create Service Request
                </Button>
              )}
              {!isCurrentUserCustomer && (
                <Button
                  type="primary"
                  icon={<Plus size={16} />}
                  onClick={() => router.push('/admin/user/create')}
                >
                  Create Customer User
                </Button>
              )}
            </Space>
          }
        >
        {/* Filters */}
        {!isCurrentUserCustomer && (
          <div className="mb-4 flex gap-4">
            <Input
              placeholder="Search customer users..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={{ width: 200 }}
            />
          </div>
        )}

        <Table
          columns={columns}
          dataSource={customerUsers}
          loading={loading}
          rowKey="id"
          pagination={{
            total: customerUsers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          locale={{
            emptyText: (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <div style={{ fontSize: '16px', color: '#999', marginBottom: '8px' }}>
                  No customer users found
                </div>
                <div style={{ fontSize: '14px', color: '#ccc' }}>
                  {loading ? 'Loading customer users...' : 'No users with Customer role have been created yet.'}
                </div>
              </div>
            )
          }}
        />
      </Card>

    </div>
  );
};

export default CustomersPage;

