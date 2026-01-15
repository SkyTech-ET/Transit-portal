"use client";
import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Input,
  Space,
  Popconfirm,
  Drawer,
  Descriptions,
} from "antd";
import { Eye, PencilLine, Trash2, Users, Plus } from "lucide-react";
import { useUserStore } from "@/modules/user";
import { useRouter } from "next/navigation";

const EmployeeListPage = () => {
  const router = useRouter();
  const { users, loading, getUsers, deleteUser } = useUserStore();

  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Employee role IDs
  const employeeRoles = [2, 4, 5];

  // Role name map
  const roleMap: Record<number, string> = {
    2: "Data Encoder",
    5: "Assessor",
    4: "Case Executor",
  };

  // Role color map
  const roleColorMap: Record<number, string> = {
    2: "purple",
    5: "blue",
    4: "green",
  };

  useEffect(() => {
    getUsers(2); // fetch active users
  }, []);

  // Open drawer with selected employee
  const handleView = (record: any) => {
    setSelectedEmployee(record);
    setIsDrawerOpen(true);
  };

  // ---------------------------------------------------------
  // 🔥 FIX: Consistent role checking and phone number display
  // ---------------------------------------------------------
  
  // Filter employees + search
  const employees = users.filter((user) => {
    // Check both possible role structures
    const hasEmployeeRole = user.userRoles?.some((r: any) =>
      employeeRoles.includes(r.roleId)
    ) || user.roles?.some((role: any) =>
      employeeRoles.includes(role.id)
    );

    if (!hasEmployeeRole) return false;

    const keyword = search.toLowerCase();
    return (
      !search ||
      user.username?.toLowerCase().includes(keyword) ||
      user.firstName?.toLowerCase().includes(keyword) ||
      user.lastName?.toLowerCase().includes(keyword) ||
      user.email?.toLowerCase().includes(keyword)
    );
  });

  // ---------------------------------------------------------
  // 🔥 FIX: Phone number display with fallback
  // ---------------------------------------------------------
  const getPhoneNumber = (record: any) => {
    return record.phone || record.phoneNumber || record.mobile || record.telephone || "N/A";
  };

  // ---------------------------------------------------------
  // 🔥 FIX: Get roles for display (handle both data structures)
  // ---------------------------------------------------------
  const getEmployeeRoles = (user: any) => {
    // Check userRoles first (original structure)
    if (user.userRoles) {
      return user.userRoles
        .filter((r: any) => employeeRoles.includes(r.roleId))
        .map((r: any) => ({
          roleId: r.roleId,
          roleName: roleMap[r.roleId] || `Role ${r.roleId}`
        }));
    }
    
    // Check roles as fallback (newer structure)
    if (user.roles) {
      return user.roles
        .filter((role: any) => employeeRoles.includes(role.id))
        .map((role: any) => ({
          roleId: role.id,
          roleName: roleMap[role.id] || role.name || `Role ${role.id}`
        }));
    }
    
    return [];
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "firstName",
      render: (_: any, record: any) => (
        <div>
          <p className="font-medium">
            {record.firstName} {record.lastName}
          </p>
          <span className="text-xs text-gray-500">{record.username}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      key: "phone",
      render: (_: any, record: any) => getPhoneNumber(record),
    },
    {
      title: "Role",
      key: "roles",
      render: (_: any, record: any) => {
        const roles = getEmployeeRoles(record);
        return roles.map((role: any, index: number) => (
          <Tag color={roleColorMap[role.roleId]} key={index}>
            {role.roleName}
          </Tag>
        ));
      },
    },
    {
      title: "Status",
      dataIndex: "recordStatus",
      render: (status: number) => (
        <Tag color={status === 2 ? "green" : "red"}>
          {status === 2 ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <Space>
          <Button 
            icon={<Eye size={16} />} 
            onClick={() => handleView(record)}
            title="View Details"
          />

          <Button
            icon={<PencilLine size={16} />}
            onClick={() => router.push(`/admin/user/edit/${record.id}`)}
            title="Edit Employee"
          />

          <Popconfirm
            title="Delete employee?"
            description="Are you sure you want to delete this employee?"
            onConfirm={() => deleteUser(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<Trash2 size={16} />} 
              title="Delete Employee"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ---------------------------------------------------------
  // 🔥 FIX: Safe date formatting
  // ---------------------------------------------------------
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  // ---------------------------------------------------------
  // 🔥 FIX: Safe profile photo URL
  // ---------------------------------------------------------
  const getProfilePhotoUrl = (employee: any) => {
    if (!employee?.profilePhoto) {
      return "/default-avatar.png"; // Fallback image
    }
    
    if (employee.profilePhoto.startsWith('http')) {
      return employee.profilePhoto;
    }
    
    return `${process.env.NEXT_PUBLIC_API_URL}/${employee.profilePhoto}`;
  };

  return (
    <div className="p-6">
      <Card>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users size={20} /> Employee Management
          </h2>

          <Space>
            <Input
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />

            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => router.push("/admin/user/create")}
            >
              Add Employee
            </Button>
          </Space>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={employees}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} employees`,
          }}
          locale={{
            emptyText: (
              <div className="text-center py-8">
                <Users size={48} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No employees found</p>
                <p className="text-gray-400 text-sm">
                  {loading ? "Loading employees..." : "No employees match your search criteria"}
                </p>
              </div>
            ),
          }}
        />

        {/* Employee Detail Drawer */}
        <Drawer
          title="Employee Details"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          width={420}
          destroyOnClose
        >
          {selectedEmployee && (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4">
                <img
                  src={getProfilePhotoUrl(selectedEmployee)}
                  alt="profile"
                  className="w-16 h-16 rounded-full object-cover border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-avatar.png';
                  }}
                />
                <div>
                  <p className="text-lg font-semibold">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {selectedEmployee.username}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {selectedEmployee.email}
                  </p>
                </div>
              </div>

              {/* Info Section */}
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Email" span={1}>
                  {selectedEmployee.email || "N/A"}
                </Descriptions.Item>

                <Descriptions.Item label="Phone" span={1}>
                  {getPhoneNumber(selectedEmployee)}
                </Descriptions.Item>

                <Descriptions.Item label="Role" span={1}>
                  {getEmployeeRoles(selectedEmployee).map((role: any, i: number) => (
                    <Tag color={roleColorMap[role.roleId]} key={i} className="mb-1">
                      {role.roleName}
                    </Tag>
                  ))}
                </Descriptions.Item>

                <Descriptions.Item label="Status" span={1}>
                  <Tag
                    color={
                      selectedEmployee.recordStatus === 2 ? "green" : "red"
                    }
                  >
                    {selectedEmployee.recordStatus === 2
                      ? "Active"
                      : "Inactive"}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Registered" span={1}>
                  {formatDate(selectedEmployee.registeredDate)}
                </Descriptions.Item>

                <Descriptions.Item label="Last Updated" span={1}>
                  {formatDate(selectedEmployee.lastUpdateDate)}
                </Descriptions.Item>
              </Descriptions>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="primary"
                  icon={<PencilLine size={16} />}
                  onClick={() =>
                    router.push(`/admin/user/edit/${selectedEmployee.id}`)
                  }
                >
                  Edit Employee
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

export default EmployeeListPage;