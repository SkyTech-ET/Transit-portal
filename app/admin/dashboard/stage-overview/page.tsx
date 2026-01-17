"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Card,
  Space,
  Input,
  Avatar,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Eye } from "lucide-react";

import { useServiceStore } from "@/modules/mot/service/service.store";
import { useUserStore } from "@/modules/user";
import { getServiceStatus } from "@/modules/mot/service/serviceStatus.util";
import { StageStatus, ServiceType, IService } from "@/modules/mot/service/service.types";

const BASEURL = "https://transitportal.skytechet.com";

const statusLabelMap: Record<StageStatus, string> = {
  [StageStatus.NotStarted]: "Not Started",
  [StageStatus.Pending]: "Pending",
  [StageStatus.InProgress]: "In Progress",
  [StageStatus.Completed]: "Completed",
  [StageStatus.Blocked]: "Blocked",
  [StageStatus.NeedsReview]: "Needs Review",
};

const statusColorMap: Record<StageStatus, string> = {
  [StageStatus.NotStarted]: "default",
  [StageStatus.Pending]: "orange",
  [StageStatus.InProgress]: "blue",
  [StageStatus.Completed]: "green",
  [StageStatus.Blocked]: "red",
  [StageStatus.NeedsReview]: "purple",
};

const roleStyleMap: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  CaseExecutor: { bg: "#E6FFFB", color: "#08979C", border: "#87E8DE" },
  DataEncoder: { bg: "#FFFBE6", color: "#D48806", border: "#FFE58F" },
  Assessor: { bg: "#F0F5FF", color: "#2F54EB", border: "#ADC6FF" },
  SuperAdmin: { bg: "#F6FFED", color: "#389E0D", border: "#B7EB8F" },
};

const stageLabelMap: Record<number, string> = {
  1: "PrepaymentInvoice",
  2: "TransitPermission",
  3: "Amendment",
  4: "DropRisk",
  5: "DeliveryOrder",
  6: "WarehouseStatus",
  7: "Inspection",
  8: "AssessmentandTaxPayment",
  9: "Emergency",
  10: "ExitandStoragePayment",
  11: "Transportation",
  12: "LocalPermission",
  13: "Arrival",
  14: "Clearance",
};

interface CustomerInfo {
  name: string;
  photo?: string;
}

interface ExecutorInfo {
  name: string;
  photo?: string;
}

export default function ServiceRequestsPage() {
  const { services, loading, getAllServices, getServiceStages } = useServiceStore();
  const { users, getUsers } = useUserStore();

  const [search, setSearch] = useState("");
  const [staffSearch, setStaffSearch] = useState("");
  const [serviceStatusMap, setServiceStatusMap] = useState<Record<number, StageStatus>>({});
  const [customerMap, setCustomerMap] = useState<Record<number, CustomerInfo>>({});
  const [serviceExecutorsMap, setServiceExecutorsMap] = useState<Record<number, ExecutorInfo[]>>({});
  const [employeeStageMap, setEmployeeStageMap] = useState<Record<number, { stageName: string; lastUpdated?: string }>>({});
  const [currentStageMap, setCurrentStageMap] = useState<Record<number, { stageName: string; lastUpdated?: string }>>({});
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [usersWithPhoto, setUsersWithPhoto] = useState<any[]>([]);


  // ---------------- LOAD DATA ---------------- //
  useEffect(() => {
  const loadAllData = async () => {
    try {
      // ---------------- FETCH SERVICES & USERS ---------------- //
      const [servicesData, allUsers] = await Promise.all([
        getAllServices({ recordStatus: 2 }), // active services
        getUsers(2), // fetch users, populates the store
      ]);

      // ---------------- BUILD USER MAP ---------------- //
      const userMap: Record<number, any> = {};
      for (const user of useUserStore.getState().users) {
        const fullUser = await useUserStore.getState().getUser(user.id);
        if (fullUser) userMap[user.id] = fullUser;
      }

      // ---------------- FETCH SERVICE STAGES ---------------- //
      const stagePromises = servicesData.map(async (service: any) => {
        await getServiceStages(service.id);
        const currentService = useServiceStore.getState().currentService;
        return { service, stages: currentService?.stages ?? [] };
      });

      const serviceStagesResults = await Promise.all(stagePromises);

      // ---------------- BUILD MAPS ---------------- //
      const customerMapLocal: Record<number, CustomerInfo> = {};
      const executorsMapLocal: Record<number, ExecutorInfo[]> = {};
      const employeeStageMapLocal: Record<number, { stageName: string; lastUpdated?: string }> = {};
      const currentStageMapLocal: Record<number, { stageName: string; lastUpdated?: string }> = {};
      const serviceStatusMapLocal: Record<number, StageStatus> = {};

      for (const { service, stages } of serviceStagesResults) {
        // Current stage
        const currentStage = stages.find(s => !s.completedAt) || stages[stages.length - 1];
        if (currentStage) {
          currentStageMapLocal[service.id] = {
            stageName: stageLabelMap[currentStage.stage] || `Stage ${currentStage.stage}`,
            lastUpdated: currentStage.completedAt || "—",
          };
        }

        // Status
        serviceStatusMapLocal[service.id] = getServiceStatus(stages);

        // Customer
        if (service.customerId && userMap[service.customerId]) {
          const customer = userMap[service.customerId];
          customerMapLocal[service.customerId] = {
            name: `${customer.firstName} ${customer.lastName}`,
            photo: customer.profilePhoto,
          };
        }

        // Case Executor
        if (service.assignedCaseExecutorId && userMap[service.assignedCaseExecutorId]) {
          const executor = userMap[service.assignedCaseExecutorId];
          executorsMapLocal[service.id] = [
            { name: `${executor.firstName} ${executor.lastName}`, photo: executor.profilePhoto }
          ];

          const latestStage = [...stages].filter(s => s.completedAt).pop();
          if (latestStage) {
            employeeStageMapLocal[service.assignedCaseExecutorId] = {
              stageName: stageLabelMap[latestStage.stage] || `Stage ${latestStage.stage}`,
              lastUpdated: latestStage.completedAt,
            };
          }
        }
      }

      // ---------------- UPDATE STATE ---------------- //
      setCustomerMap(customerMapLocal);
      setServiceExecutorsMap(executorsMapLocal);
      setEmployeeStageMap(employeeStageMapLocal);
      setCurrentStageMap(currentStageMapLocal);
      setServiceStatusMap(serviceStatusMapLocal);

    } catch (err) {
      console.error("Error loading stage-overview page data:", err);
    }
  };

  loadAllData();
}, [getAllServices, getServiceStages, getUsers]);


  const handleView = async (record: any) => {
  setSelectedEmployee(record);
  }

  // ---------------- FILTER SERVICES ---------------- //
  const filteredServices = services.filter((service) => {
    const keyword = search.toLowerCase();
    return (
      service.serviceNumber?.toLowerCase().includes(keyword) ||
      service.itemDescription?.toLowerCase().includes(keyword) ||
      customerMap[service.customerId]?.name.toLowerCase().includes(keyword)
    );
  });

  // ---------------- FILTER STAFF ---------------- //
 const employeeUsers = users.filter((user: any) => {
  const roleNames =
    user.userRoles?.map((r: any) => r.roleName) ??
    user.roles?.map((r: any) => r.name) ??
    [];
  // Exclude Customer and SuperAdmin
  return roleNames.length > 0 && !roleNames.includes("Customer") && !roleNames.includes("SuperAdmin");
});

const filteredStaff = employeeUsers.filter((staff: any) => {
  const keyword = staffSearch.toLowerCase();
  return (
    staff.firstName?.toLowerCase().includes(keyword) ||
    staff.lastName?.toLowerCase().includes(keyword) ||
    staff.username?.toLowerCase().includes(keyword)
  );
});

  const getStaffRoles = (user: any) => {
    if (user.userRoles) return user.userRoles.map((r: any) => ({ roleName: r.roleName }));
    if (user.roles) return user.roles.map((r: any) => ({ roleName: r.name }));
    return [];
  };

  const getFullName = (user: any) => `${user.firstName || ""} ${user.lastName || ""}`.trim();

  const getProfilePhotoUrl = (employee: any) => {
  const photo = employee?.profilePhoto;

  if (!photo || photo === "null") {
    return "/images/avatar-placeholder.png";
  }

  // Remove Windows backslashes safely
  const fileName = photo.replace(/\\/g, "/").split("/").pop();

  return `${BASEURL}/Profile_Photo/${fileName}`;
};


  // ---------------- SERVICE TABLE ---------------- //
  const serviceColumns = [
    { title: "Service Number", dataIndex: "serviceNumber", key: "serviceNumber" },
    {
      title: "Customer",
      key: "customer",
      render: (_: any, record: IService) => {
        const customer = customerMap[record.customerId];
        if (!customer) return <Tag color="default">Unknown</Tag>;
        const profileUrl = customer.photo
          ? `${BASEURL}/${customer.photo.split("\\").pop()}`
          : "/images/avatar-placeholder.png";
        return (
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <img src={profileUrl} alt={customer.name} className="w-6 h-6 rounded-full object-cover" />
            <span>{customer.name}</span>
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "serviceType",
      key: "serviceType",
      render: (t: number) => <Tag color={t === 1 ? "cyan" : "purple"}>{t === 1 ? "Multimodal" : "Unimodal"}</Tag>,
    },
    {
      title: "Registered On",
      dataIndex: "registeredDate",
      key: "registeredDate",
      responsive: ['md'],
      render: (d: string) => new Date(d).toLocaleString(),
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: IService) => {
        const status = serviceStatusMap[record.id] ?? StageStatus.NotStarted;
        return <Tag color={statusColorMap[status]}>{statusLabelMap[status]}</Tag>;
      },
    },
    {
      title: "Case Executor",
      key: "assignedCaseExecutor",
      render: (_: any, record: IService) => {
        const executors = serviceExecutorsMap[record.id] || [];
        if (!record.assignedCaseExecutorId || executors.length === 0)
          return <Tag color="default">Unassigned</Tag>;

        const executor = executors[0];
        const profileUrl = executor.photo
          ? `${BASEURL}/${executor.photo.split("\\").pop()}`
          : "/images/avatar-placeholder.png";

        return (
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <img src={profileUrl} alt={executor.name} className="w-6 h-6 rounded-full object-cover" />
            <span>{executor.name}</span>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Button
          type="link"
          icon={<Eye size={16} />}
          href={`/admin/mot/manager/services/${record.id}`}
        >
          View
        </Button>
      ),
    },
  ];

  // ---------------- STAFF TABLE ---------------- //
  const stageColumns = [
  {
    title: "Staff",
    render: (staff: any) => {
      if (!staff) return <Tag color="default">—</Tag>;

      const fullName = `${staff.firstName || ""} ${staff.lastName || ""}`.trim();

      const profileUrl =getProfilePhotoUrl(staff);

      return (
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Avatar
            size={32}
            src={profileUrl}
            icon={<UserOutlined />}
          />
          <span>{fullName}</span>
        </div>
      );
    },
  },
  {
    title: "Roles",
    render: (staff: any) => {
      const roles = getStaffRoles(staff);
      return (
        <Space wrap>
          {roles.map((r: any) => {
            const style = roleStyleMap[r.roleName];
            return (
              <Tag
                key={r.roleId || r.roleName}
                style={{
                  backgroundColor: style?.bg || "#f5f5f5",
                  color: style?.color || "#595959",
                  border: `1px solid ${style?.border || "#d9d9d9"}`,
                  fontWeight: 400,
                }}
              >
                {r.roleName}
              </Tag>
            );
          })}
        </Space>
      );
    },
  },
  {
    title: "Current Stage",
    render: (staff: any) => {
      const info = employeeStageMap[staff.id];
      return info?.stageName ? <Tag color="blue">{info.stageName}</Tag> : <Tag color="default">—</Tag>;
    },
  },
  {
    title: "Last Updated",
    render: (staff: any) => {
      const info = employeeStageMap[staff.id];
      return info?.lastUpdated ? new Date(info.lastUpdated).toLocaleString() : "—";
    },
  },
  { title: "Email", dataIndex: "email" },
];


  return (
    <div className="flex w-full min-h-screen overflow-x-hidden flex-col gap-6">
      <Card
        title="All Services"
        extra={<Input placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', maxWidth: 240 }} allowClear />}
      >
        <div className="overflow-x-auto">
          <Table rowKey="id" columns={serviceColumns} dataSource={filteredServices} loading={loading} pagination={{ pageSize: 10 }} scroll={{ x: 1000 }} />
        </div>
      </Card>

      <Card
        title="STAGE OVERVIEW (Employees)"
        extra={<Input placeholder="Search staff..." value={staffSearch} onChange={e => setStaffSearch(e.target.value)} style={{ width: '100%', maxWidth: 200 }} allowClear />}
      >
        <div className="overflow-x-auto">
          <Table rowKey="id" columns={stageColumns} dataSource={filteredStaff} pagination={{ pageSize: 10 }} scroll={{ x: 900 }} />
        </div>
      </Card>
    </div>
  );
}
