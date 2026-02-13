"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, Table, Button, Space, Tag, Input, Popconfirm } from "antd";
import { Drawer, Descriptions, Avatar, Skeleton } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Plus, Trash, PencilLine, Users, Truck, Eye } from "lucide-react";
import { useUserStore } from "@/modules/user";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";
import { useRouter } from "next/navigation";
import { customerRoutes } from "@/modules/mot/customer";

const CUSTOMER_ROLE_ID = 3;
const BASEURL = "https://transitportal.skytechet.com";


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

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const customerCache = useRef<Record<number, any>>({});


  //  Detect if current logged in user is customer
  
  const isCurrentUserCustomer = currentUser?.roles?.some(role =>
    role.id === CUSTOMER_ROLE_ID ||
    role.name?.toLowerCase() === "customer"
  );

    // Filter customer role users correctly

  const customerUsers = Array.isArray(users)
    ? users.filter((user) => {
        const isCustomer = user.roles?.some(
          (role) => role.id === CUSTOMER_ROLE_ID
        );

        if (!isCustomer) return false;

        if (isCurrentUserCustomer) {
          return user.id === currentUser?.id;
        }

        const q = filters.search.toLowerCase();

        return (
          !filters.search ||
          user.username?.toLowerCase().includes(q) ||
          user.firstName?.toLowerCase().includes(q) ||
          user.lastName?.toLowerCase().includes(q) ||
          user.email?.toLowerCase().includes(q)
        );
      })
    : [];

    const getCustomerProfilePhotoUrl = (customer: any) => {
  if (!customer?.profilePhoto) return undefined;

  const fileName = customer.profilePhoto
    .replace(/\\/g, "/")
    .split("/")
    .pop();

  return `${BASEURL}/Profile_Photo/${fileName}`;
};

const getCustomerPhone = (record: any) => {
  return (
    record.phone ||
    record.phoneNumber ||
    record.mobile ||
    record.telephone ||
    "N/A"
  );
};



  
  //  Load users properly — WITHOUT params mismatch
  
  useEffect(() => {
    getUsers(2); 
  }, []);

  const handleDelete = (id: number) => {
    deleteUser(id);
  };

  const handleViewCustomer = async (record: any) => {
  setSelectedCustomer(record);
  setIsDrawerOpen(true);

  if (customerCache.current[record.id]) {
    setSelectedCustomer(customerCache.current[record.id]);
    return;
  }

  setDrawerLoading(true);
  const fullUser = await useUserStore.getState().getUser(record.id);

  if (fullUser) {
    customerCache.current[record.id] = fullUser;
    setSelectedCustomer(fullUser);
  }

  setDrawerLoading(false);
};


  // ---------------------------------------------------------
  // TABLE COLUMNS
  // ---------------------------------------------------------
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
      key: "phone",
      render: (_: any, record: any) => getCustomerPhone(record),
},

    {
      title: "Status",
      dataIndex: "recordStatus",
      key: "recordStatus",
      render: (status: number) => (
        <Tag color={status === 2 ? "green" : "red"}>
          {status === 2 ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
  title: "Options",
  key: "options",
  render: (_: any, record: any) => (
    <Space>
      <Button
        icon={<Eye size={16} />}
        onClick={() => handleViewCustomer(record)}
        title="View Customer"
      />

      <Button
        type="primary"
        icon={<PencilLine size={18} />}
        onClick={() => router.push(`/admin/user/edit/${record.id}`)}
      />

      {!isCurrentUserCustomer && (
        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
          <Button icon={<Trash size={18} color="red" />} />
        </Popconfirm>
      )}
    </Space>
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

            {/* {!isCurrentUserCustomer && (
              <Button
                type="primary"
                icon={<Plus size={16} />}
                onClick={() => router.push("/admin/user/create")}
              >
                Create Customer User
              </Button>
            )} */}
          </Space>
        }
      >
        {!isCurrentUserCustomer && (
          <div className="mb-4 flex gap-4">
            <Input
              placeholder="Search customer users..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
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
        />
        <Drawer
  title="Customer Details"
  open={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  width={420}
  destroyOnClose
>
  {selectedCustomer && (
    <div className="space-y-6">
      {/* Profile */}
      <div className="flex items-center gap-4">
  {drawerLoading ? (
    <Skeleton.Avatar active size={64} shape="circle" />
  ) : (
    <Avatar
      size={64}
      src={getCustomerProfilePhotoUrl(selectedCustomer)}
      icon={<UserOutlined />}
    />
  )}

  <div>
    <p className="text-lg font-semibold">
      {selectedCustomer.firstName} {selectedCustomer.lastName}
    </p>
    <p className="text-gray-500 text-sm">
      {selectedCustomer.username}
    </p>
    <p className="text-gray-500 text-sm">
      {selectedCustomer.email}
    </p>
  </div>
</div>


      {/* Info */}
      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="Email">
          {selectedCustomer.email || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Phone">
          {selectedCustomer.phone ||
            selectedCustomer.phoneNumber ||
            selectedCustomer.mobile ||
            "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Tag color={selectedCustomer.recordStatus === 2 ? "green" : "red"}>
            {selectedCustomer.recordStatus === 2 ? "Active" : "Inactive"}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Registered">
          {selectedCustomer.registeredDate
            ? new Date(selectedCustomer.registeredDate).toLocaleString()
            : "N/A"}
        </Descriptions.Item>
      </Descriptions>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="primary"
          icon={<PencilLine size={16} />}
          onClick={() =>
            router.push(`/admin/user/edit/${selectedCustomer.id}`)
          }
        >
          Edit Customer
        </Button>

        <Button onClick={() => setIsDrawerOpen(false)}>Close</Button>
      </div>
    </div>
  )}
</Drawer>

      </Card>
    </div>
  );
};

export default CustomersPage;
