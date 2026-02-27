"use client";

import React, { useEffect, useState } from "react";
import { Card, Row, Col, Descriptions, Tag, Button, Space, Timeline, Table, Tabs, Upload, message, Modal, Form, Input, Select, Typography, Divider, Badge } from "antd";
import { ArrowLeft, Eye, Download, Upload as UploadIcon, MessageSquare, CheckCircle, Clock, AlertCircle, FileText, User, Calendar } from "lucide-react";
import { useServiceStore, ServiceStatus, ServiceType, RiskLevel, ServiceStage, StageStatus } from "@/modules/mot/service";
import { useDocumentStore } from "@/modules/mot/document";
import { useRouter, useParams } from "next/navigation";
import { usePermissionStore } from "@/modules/utils";
import permission from "@/modules/utils/permission/permission";
import { useUserStore } from "@/modules/user";
import { RecordStatus } from "@/modules/common/common.types";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const ServiceDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const serviceId = Number(params.id);
  
  const { currentService, loading, getServiceById, getServiceStages, updateStageStatus, assignService } = useServiceStore();
  const { documents, uploadDocument, downloadDocument } = useDocumentStore();
  const { checkPermission, permissions, /* currentUser */ } = usePermissionStore();
  const { getUsers, users, currentUser } = useUserStore();

  const caseExecutors = users.filter((u: any) =>
  u.roles?.some((r: any) => r === 4 || r.id === 4)
    );
  
  const [activeTab, setActiveTab] = useState("overview");
  const [stageModalVisible, setStageModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedStage, setSelectedStage] = useState<any>(null);
  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();

  useEffect(() => {
    if (serviceId) {
      loadServiceData();
    }
  }, [serviceId]);

  const loadServiceData = async () => {
    await getServiceById(serviceId);
    await getServiceStages(serviceId);
  };

  useEffect(() => {
  if (assignModalVisible) {
    getUsers(RecordStatus.Active, 1);
  }
}, [assignModalVisible]);

useEffect(() => {
  if (assignModalVisible && currentUser) {
    assignForm.setFieldsValue({
      assignedAssessorId: currentUser.id,
    });
  }
}, [assignModalVisible, currentUser]);

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
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: ServiceStatus) => {
    return ServiceStatus[status] || 'Unknown';
  };

  const getStageStatusColor = (status: StageStatus) => {
    const colors = {
      [StageStatus.NotStarted]: 'default',
      [StageStatus.Pending]: 'warning',
      [StageStatus.InProgress]: 'processing',
      [StageStatus.Completed]: 'success',
      [StageStatus.Blocked]: 'error',
      [StageStatus.NeedsReview]: 'warning',
    };
    return colors[status] || 'default';
  };

  const getStageName = (stage: ServiceStage) => {
    return ServiceStage[stage] || 'Unknown';
  };

  const handleStageUpdate = async (values: any) => {
    try {
      await updateStageStatus(selectedStage.id, values.status, values.notes);
      setStageModalVisible(false);
      form.resetFields();
      await loadServiceData();
    } catch (error) {
      message.error('Failed to update stage status');
    }
  };

  const handleAssign = async (values: any) => {
  try {
    await assignService({
      serviceId,
      assignedCaseExecutorId: values.assignedCaseExecutorId,
      assignedAssessorId: values.assignedAssessorId,
      assignmentNotes: values.assignmentNotes ?? null,
    });

    message.success("Service assigned successfully");
    setAssignModalVisible(false);
    assignForm.resetFields();
    await loadServiceData();
  } catch {
    message.error("Failed to assign service");
  }
};

  const handleUpload = async (file: File) => {
    try {
      await uploadDocument(serviceId, file, 'service');
      message.success('Document uploaded successfully');
      await loadServiceData();
    } catch (error) {
      message.error('Failed to upload document');
    }
  };

  const stageColumns = [
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: ServiceStage) => getStageName(stage),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: StageStatus) => (
        <Tag color={getStageStatusColor(status)}>
          {StageStatus[status] || 'Unknown'}
        </Tag>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => date ? new Date(date).toLocaleString() : '-',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => date ? new Date(date).toLocaleString() : '-',
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedUser',
      key: 'assignedUser',
      render: (user: any) => user ? `${user.firstName} ${user.lastName}` : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          size="small"
          onClick={() => {
            setSelectedStage(record);
            form.setFieldsValue({ status: record.status, notes: record.notes });
            setStageModalVisible(true);
          }}
        >
          Update
        </Button>
      ),
    },
  ];

  const documentColumns = [
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: 'Type',
      dataIndex: 'documentType',
      key: 'documentType',
      render: (type: number) => {
        const types = ['Invoice', 'BillOfLading', 'Certificate', 'Permit', 'Photo', 'Other'];
        return types[type - 1] || 'Unknown';
      },
    },
    {
      title: 'Uploaded By',
      dataIndex: 'uploadedByUser',
      key: 'uploadedByUser',
      render: (user: any) => user ? `${user.firstName} ${user.lastName}` : '-',
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadedDate',
      key: 'uploadedDate',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            icon={<Eye />}
            onClick={() => downloadDocument(record.id)}
          >
            View
          </Button>
          <Button
            size="small"
            icon={<Download />}
            onClick={() => downloadDocument(record.id)}
          >
            Download
          </Button>
        </Space>
      ),
    },
  ];

  if (loading && !currentService) {
    return <div className="p-6">Loading...</div>;
  }

  if (!currentService) {
    return <div className="p-6">Service not found</div>;
  }

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Service Information">
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Service Number">
                  {currentService.serviceNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={getStatusColor(currentService.status)}>
                    {getStatusText(currentService.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Service Type">
                  {ServiceType[currentService.serviceType]}
                </Descriptions.Item>
                <Descriptions.Item label="Risk Level">
                  <Tag color={RiskLevel[currentService.riskLevel] === 'Red' ? 'red' : 
                              RiskLevel[currentService.riskLevel] === 'Yellow' ? 'orange' : 
                              RiskLevel[currentService.riskLevel] === 'Green' ? 'green' : 'blue'}>
                    {RiskLevel[currentService.riskLevel]}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Item Description" span={2}>
                  {currentService.itemDescription}
                </Descriptions.Item>
                <Descriptions.Item label="Route Category">
                  {currentService.routeCategory}
                </Descriptions.Item>
                <Descriptions.Item label="Country of Origin">
                  {currentService.countryOfOrigin}
                </Descriptions.Item>
                <Descriptions.Item label="Declared Value">
                  ${currentService.declaredValue?.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Tax Category">
                  {currentService.taxCategory}
                </Descriptions.Item>
                <Descriptions.Item label="Customer">
                  {currentService.customer ? 
                    `${currentService.customer.firstName} ${currentService.customer.lastName}` : 
                    'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Assigned Case Executor">
                  {currentService.assignedCaseExecutor ? 
                    `${currentService.assignedCaseExecutor.firstName} ${currentService.assignedCaseExecutor.lastName}` : 
                    'Not Assigned'}
                </Descriptions.Item>
                <Descriptions.Item label="Assigned Assessor">
                  {currentService.assignedAssessor ? 
                    `${currentService.assignedAssessor.firstName} ${currentService.assignedAssessor.lastName}` : 
                    'Not Assigned'}
                </Descriptions.Item>
                <Descriptions.Item label="Created Date">
                  {new Date(currentService.registeredDate).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  {new Date(currentService.lastUpdateDate).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'stages',
      label: 'Stages',
      children: (
        <Card
          title="Service Stages"
          extra={
            checkPermission(permissions, permission.motService.update) && (
              <Button
                type="primary"
                onClick={() => {
                  setSelectedStage(null);
                  form.resetFields();
                  setStageModalVisible(true);
                }}
              >
                Update Stage
              </Button>
            )
          }
        >
          <Table
            dataSource={currentService.stages || []}
            columns={stageColumns}
            rowKey="id"
            pagination={false}
          />
        </Card>
      ),
    },
    {
      key: 'documents',
      label: 'Documents',
      children: (
        <Card
          title="Service Documents"
          extra={
            <Upload
              beforeUpload={(file) => {
                handleUpload(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadIcon />}>Upload Document</Button>
            </Upload>
          }
        >
          <Table
            dataSource={currentService.documents || []}
            columns={documentColumns}
            rowKey="id"
            pagination={false}
          />
        </Card>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
  {/* Left Side (Title + Service Number) */}
  <div>
    <Title level={2} className="mb-0">
      Service Details
    </Title>
    <Text type="secondary">
      {currentService.serviceNumber}
    </Text>
  </div>

  {/* Right Side (Back Button) */}
  {/* <Button
    icon={<ArrowLeft />}
    onClick={() => router.back()}
  >
    Back
  </Button> */}

         <Space>
          {checkPermission(permissions, permission.motService.assign) && (
            <Button
              type="primary"
              onClick={() => setAssignModalVisible(true)}
            >
              Assign Service
            </Button>
          )}
        </Space> 
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />

      {/* Stage Update Modal */}
      <Modal
        title="Update Stage Status"
        open={stageModalVisible}
        onCancel={() => {
          setStageModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleStageUpdate}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
          >
            <Select>
              {Object.entries(StageStatus)
                .filter(([_, value]) => typeof value === 'number')
                .map(([key, value]) => (
                  <Option key={value} value={value}>
                    {key}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button onClick={() => {
                setStageModalVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Assign Service Modal */}
      <Modal
        title="Assign Service"
        open={assignModalVisible}
        onCancel={() => {
          setAssignModalVisible(false);
          assignForm.resetFields();
        }}
        footer={null}
      >
        <Form form={assignForm} layout="vertical" onFinish={handleAssign}>
  {/* <Form.Item
    name="assignedCaseExecutorId"
    label="Case Executor"
    rules={[{ required: true, message: "Please select Case Executor" }]}
  >
    <Select placeholder="Select Case Executor">
      
    </Select>
  </Form.Item> */}

  <Form.Item
  name="assignedCaseExecutorId"
  label="Case Executor"
  rules={[{ required: true, message: "Please select Case Executor" }]}
>
  <Select
    placeholder="Select Case Executor"
    loading={!caseExecutors.length}
    showSearch
    optionFilterProp="label"
  >
    {caseExecutors.map((user: any) => (
      <Select.Option
        key={user.id}
        value={user.id}
        label={`${user.firstName} ${user.lastName}`}
      >
        {user.firstName} {user.lastName}
      </Select.Option>
    ))}
  </Select>
</Form.Item>

  <Form.Item
  name="assignedAssessorId"
  label="Assessor"
  rules={[{ required: true }]}
>
  <Select disabled>
    {currentUser && (
      <Select.Option value={currentUser.id}>
        {currentUser.firstName} {currentUser.lastName}
      </Select.Option>
    )}
  </Select>
</Form.Item>

  <Form.Item name="assignmentNotes" label="Assignment Notes">
    <TextArea rows={3} placeholder="Optional notes..." />
  </Form.Item>

  <Form.Item>
    <Space>
      <Button type="primary" htmlType="submit">
        Assign Service
      </Button>
      <Button
        onClick={() => {
          setAssignModalVisible(false);
          assignForm.resetFields();
        }}
      >
        Cancel
      </Button>
    </Space>
  </Form.Item>
</Form>
      </Modal>
    </div>
  );
};

export default ServiceDetailPage;
