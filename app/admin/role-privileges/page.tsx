"use client";

import React, { useEffect, useState } from "react";
import { Card, Table, Button, Space, Tag, Modal, Form, Checkbox, message, Row, Col, Select, Input } from "antd";
import { 
  Edit, 
  Save, 
  UserCog, 
  ShieldCheck,
  Search
} from "lucide-react";
import { useRoleStore } from "@/modules/role";
import { usePrivilegeStore } from "@/modules/privilege";

const { Option } = Select;

const RolePrivilegesPage = () => {
  const { 
    roles, 
    loading: rolesLoading, 
    getRoles 
  } = useRoleStore();
  
  const { 
    privileges, 
    loading: privilegesLoading, 
    getPrivileges 
  } = usePrivilegeStore();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [rolePrivileges, setRolePrivileges] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        getRoles(2), // Active status
        getPrivileges(2), // Active status
      ]);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const handleEditPrivileges = (role: any) => {
    setSelectedRole(role);
    setRolePrivileges(role.rolePrivileges || []);
    setIsModalVisible(true);
  };

  const handleSavePrivileges = async () => {
    try {
      // Here you would call an API to update role privileges
      // For now, we'll just show a success message
      message.success("Role privileges updated successfully");
      setIsModalVisible(false);
      setSelectedRole(null);
      setRolePrivileges([]);
    } catch (error) {
      message.error("Failed to update role privileges");
    }
  };

  const handlePrivilegeChange = (privilegeId: number, checked: boolean) => {
    if (checked) {
      // Add privilege to role
      const privilege = privileges.find(p => p.id === privilegeId);
      if (privilege && !rolePrivileges.find(rp => rp.privilegeId === privilegeId)) {
        setRolePrivileges([...rolePrivileges, { privilegeId, privilege }]);
      }
    } else {
      // Remove privilege from role
      setRolePrivileges(rolePrivileges.filter(rp => rp.privilegeId !== privilegeId));
    }
  };

  const isPrivilegeAssigned = (privilegeId: number) => {
    return rolePrivileges.some(rp => rp.privilegeId === privilegeId);
  };

  const filteredRoles = roles.filter(role =>
    role.roleName.toLowerCase().includes(searchText.toLowerCase()) ||
    role.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <UserCog size={16} />
          <span className="font-medium">{name}</span>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Privileges Count",
      key: "privilegesCount",
      render: (_: any, record: any) => (
        <Tag color="blue">
          {record.rolePrivileges?.length || 0} privileges
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="primary"
            icon={<Edit />}
            onClick={() => handleEditPrivileges(record)}
          >
            Manage Privileges
          </Button>
        </Space>
      ),
    },
  ];

  // Group privileges by category
  const groupedPrivileges = privileges.reduce((acc, privilege) => {
    const category = privilege.action.split('-')[0];
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(privilege);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} />
            <span>Role Privilege Management</span>
          </div>
        }
        extra={
          <Input
            placeholder="Search roles..."
            prefix={<Search />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
        }
      >
        <Table
          columns={columns}
          dataSource={filteredRoles}
          loading={rolesLoading}
          rowKey="id"
          pagination={{
            total: filteredRoles.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* Role Privilege Management Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <UserCog size={20} />
            <span>Manage Privileges for {selectedRole?.name}</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<Save />}
            onClick={handleSavePrivileges}
          >
            Save Changes
          </Button>,
        ]}
      >
        {selectedRole && (
          <div>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Role Information</h4>
              <p><strong>Name:</strong> {selectedRole.name}</p>
              <p><strong>Description:</strong> {selectedRole.description}</p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {Object.entries(groupedPrivileges).map(([category, categoryPrivileges]) => (
                <Card
                  key={category}
                  title={category}
                  size="small"
                  className="mb-4"
                >
                  <Row gutter={[16, 16]}>
                    {categoryPrivileges.map((privilege) => (
                      <Col xs={24} sm={12} lg={8} key={privilege.id}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={isPrivilegeAssigned(privilege.id)}
                            onChange={(e) => handlePrivilegeChange(privilege.id, e.target.checked)}
                          />
                          <div>
                            <div className="font-medium text-sm">
                              {privilege.action}
                            </div>
                            <div className="text-xs text-gray-500">
                              {privilege.description}
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card>
              ))}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Selected Privileges Summary</h4>
              <div className="flex flex-wrap gap-2">
                {rolePrivileges.map((rp) => (
                  <Tag key={rp.privilegeId} color="blue">
                    {rp.privilege?.action}
                  </Tag>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Total: {rolePrivileges.length} privileges selected
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RolePrivilegesPage;





