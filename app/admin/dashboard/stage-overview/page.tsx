"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Avatar,
  Button,
  Card,
  Space,
  Input,
} from "antd";
import { Eye } from "lucide-react";

import { useServiceStore } from "@/modules/mot/service/service.store";
import { useUserStore } from "@/modules/user";
import { getServiceStatus } from "@/modules/mot/service/serviceStatus.util";
import { StageStatus, ServiceType, IService } from "@/modules/mot/service/service.types";


//const employeeRoles = [2, 4, 5];


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
  CaseExecutor: {
    bg: "#E6FFFB",      // teal pastel
    color: "#08979C",
    border: "#87E8DE",
  },
  DataEncoder: {
    bg: "#FFFBE6",      // soft yellow
    color: "#D48806",
    border: "#FFE58F",
  },
  Assessor: {
    bg: "#F0F5FF",      // soft blue
    color: "#2F54EB",
    border: "#ADC6FF",
  },
  SuperAdmin: {
    bg: "#F6FFED",      // soft green
    color: "#389E0D",
    border: "#B7EB8F",
  },
};




const serviceTypeLabelMap: Record<ServiceType, string> = {
  [ServiceType.Multimodal]: "Multimodal",
  [ServiceType.Unimodal]: "Unimodal",
};

interface ExecutorInfo {
  name: string;
  photo?: string;
}


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

export enum ServiceStage {
  PrepaymentInvoice = 1,
  TransitPermission=2,
  Amendment=3,
  DropRisk = 4,
  DeliveryOrder = 5,
  WarehouseStatus=6,
  Inspection = 7,
  AssessmentandTaxPayment=8,
  Emergency = 9,
  ExitandStoragePayment = 10,
  Transportation = 11,
  LocalPermission = 12, // Unimodal only
  Arrival = 13, // Unimodal only
  Clearance = 14,
}



export default function ServiceRequestsPage() {
  const { services, loading, getAllServices, getServiceStages } = useServiceStore();
  const { users, getUsers } = useUserStore();

  const [search, setSearch] = useState("");
  const [staffSearch, setStaffSearch] = useState("");
  const [serviceStatusMap, setServiceStatusMap] = useState<Record<number, StageStatus>>({});
  const [customerMap, setCustomerMap] = useState<Record<number, { name: string; avatar?: string }>>({});
  const [serviceExecutorsMap, setServiceExecutorsMap] = useState<Record<number, { name: string; avatar?: string, photo?: string }[]>>({});
  const [executorMap, setExecutorMap] = useState<Record<number, ExecutorInfo>>({}); 
  const [employeeStageMap, setEmployeeStageMap] = useState<
  Record<number, { stageName: string; lastUpdated?: string }>
>({});


  const [currentStageMap, setCurrentStageMap] = useState<Record<number, { stageName: string; lastUpdated?: string }>>({});

  //const [customerMap, setCustomerMap] = useState<Record<number, string>>({});

  // ---------------- LOAD DATA ---------------- //
  useEffect(() => {
    const loadData = async () => {
      
      await getAllServices({ recordStatus: 2 }); // fetch all services
      await getUsers(2); // fetch all users
    }
    loadData();
  }, [getAllServices, getUsers]);

   useEffect(() => {
    const fetchData = async () => {
    const customerMapLocal: Record<number, { name: string; avatar?: string }> = {};
    const statusMapLocal: Record<number, StageStatus> = {};
    const executorsMapLocal: Record<number, { name: string; avatar?: string }[]> = {};
    const currentStageMapLocal: Record<number, { stageName: string; lastUpdated: string }> = {};
    const employeeStageMapLocal: Record<number, { stageName: string; lastUpdated: string }> = {};

    for (const service of services) {
      // 1️⃣ Fetch stages
      await getServiceStages(service.id);
      const currentService = useServiceStore.getState().currentService;
      const stages = currentService?.stages ?? [];

      // 2️⃣ Map CaseExecutor stage
      if (service.assignedCaseExecutorId) {
        const latestStage = [...stages].filter((s) => s.completedAt).pop();
        if (latestStage) {
          employeeStageMapLocal[service.assignedCaseExecutorId] = {
            stageName: stageLabelMap[latestStage.stage] || `Stage ${latestStage.stage}`,
            lastUpdated: latestStage.completedAt,
          };
        }
      }

      // 3️⃣ Map Assessor stage
      /* if (service.assignedAssessorId) {
        const latestStage = [...stages].filter((s) => s.completedAt).pop();
        if (latestStage) {
          employeeStageMapLocal[service.assignedAssessorId] = {
            stageName: stageLabelMap[latestStage.stage] || `Stage ${latestStage.stage}`,
            lastUpdated: latestStage.completedAt,
          };
        }
      } */

      // 4️⃣ Map DataEncoder stage
      if (service.createdByDataEncoderId) {
        const latestStage = [...stages].filter((s) => s.completedAt).pop();
        if (latestStage) {
          employeeStageMapLocal[service.createdByDataEncoderId] = {
            stageName: stageLabelMap[latestStage.stage] || `Stage ${latestStage.stage}`,
            lastUpdated: latestStage.completedAt,
          };
        }
      }

      // 5️⃣ Current stage for service
      const currentStage = stages.find((s) => !s.completedAt) || stages[stages.length - 1];
      if (currentStage) {
        currentStageMapLocal[service.id] = {
          stageName: stageLabelMap[currentStage.stage] || `Stage ${currentStage.stage}`,
          lastUpdated: currentStage.completedAt || "—",
        };
      }

      // 6️⃣ Status
      statusMapLocal[service.id] = getServiceStatus(stages);

      // 7️⃣ Customer
      if (service.customerId) {
        const customer = await useUserStore.getState().getUser(service.customerId);
        customerMapLocal[service.customerId] = customer
          ? { name: `${customer.firstName} ${customer.lastName}`, avatar: customer.avatarUrl }
          : { name: "Unknown" };
      }

      // 8️⃣ Case Executors for table
      if (service.assignedCaseExecutorId) {
        const executor = await useUserStore.getState().getUser(service.assignedCaseExecutorId);
        executorsMapLocal[service.id] = executor
          ? [{ name: `${executor.firstName} ${executor.lastName}`, avatar: executor.avatarUrl }]
          : [];
      } else {
        executorsMapLocal[service.id] = [];
      }
    }

    // 9️⃣ Update state once
    setCustomerMap(customerMapLocal);
    setServiceStatusMap(statusMapLocal);
    setServiceExecutorsMap(executorsMapLocal);
    setCurrentStageMap(currentStageMapLocal);
    setEmployeeStageMap(employeeStageMapLocal);

    console.log("employeeStageMapLocal", employeeStageMapLocal);
    console.log("currentStageMapLocal", currentStageMapLocal);
  };

  if (services.length) fetchData();
}, [services, getServiceStages, getUsers]);






  // ---------------- FILTER SERVICES ---------------- //
  
  const filteredServices = services.filter((service) => {
    const keyword = search.toLowerCase();
    return (
      service.serviceNumber?.toLowerCase().includes(keyword) ||
      service.itemDescription?.toLowerCase().includes(keyword) ||
      customerMap[service.customerId]?.name.toLowerCase().includes(keyword)
    );
  });
  

  // ---------------- FILTER EMPLOYEES ---------------- //
  const employeeUsers = users.filter((user: any) => {
  const roleNames =
    user.userRoles?.map((r: any) => r.roleName) ??
    user.roles?.map((r: any) => r.name) ??
    [];

  // Exclude customers
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
  if (user.userRoles) {
    return user.userRoles.map((r: any) => ({
      roleName: r.roleName,
    }));
  }

  if (user.roles) {
    return user.roles.map((r: any) => ({
      roleName: r.name,
    }));
  }

  return [];
};


  const getStatusTag = (serviceId: number) => {
    const numericStatus = serviceStatusMap[serviceId]
    const status = serviceStatusMap[serviceId] || "NotStarted";
    const statusColorMap: Record<string, string> = {
      NotStarted: "default",
      Pending: "orange",
      InProgress: "blue",
      Completed: "green",
      Blocked: "red",
      NeedsReview: "purple",
    };
    return <Tag color={statusColorMap[status]}>{status}</Tag>;
  };

  const getAvatarInitial = (user: any) =>
    user.firstName?.[0] || user.username?.[0] || "U";

  const getFullName = (user: any) =>
    `${user.firstName || ""} ${user.lastName || ""}`.trim();

  // ---------------- SERVICE TABLE ---------------- //
  const serviceColumns = [
    {
      title: "Service Number",
      dataIndex: "serviceNumber",
      key: "serviceNumber",
    },
       {
      title: "Customer",
      key: "customer",
      render: (_: any, record: IService) => {
        const customer = customerMap[record.customerId];
        return (
          <Space>
            <Avatar
              size={32}
              src={customer?.avatar}
              style={{ backgroundColor: customer?.avatar ? undefined : "#87d068" }}
            >
              {!customer?.avatar && customer?.name?.[0]?.toUpperCase()}
            </Avatar>
            <span>{customer?.name || "Unknown"}</span>
          </Space>
        );
      },
    },
    /* {
      title: "Description",
      dataIndex: "itemDescription",
      key: "itemDescription",
    }, */
    {
      title: "Type",
      dataIndex: "serviceType",
      key: "serviceType",
      render: (t: number) => (
        <Tag color={t === 1 ? "cyan" : "purple"}>
          {t === 1 ? "Multimodal" : "Unimodal"}
        </Tag>
      ),
    },
    {
      title: "Registered On",
      dataIndex: "registeredDate",
      key: "registeredDate",
      render: (d: string) => new Date(d).toLocaleString(),
    },
    { title: "Status", key: "status", render: (_: any, record: IService) => {
      const status = serviceStatusMap[record.id] ?? StageStatus.NotStarted;
      return <Tag color={statusColorMap[status]}>{statusLabelMap[status]}</Tag>;
    }},
   
  {
  title: "Case Executor",
  key: "assignedCaseExecutor",
  render: (_: any, record: IService) => {
    const executors = serviceExecutorsMap[record.id] || [];

    if (!record.assignedCaseExecutorId || executors.length === 0)
      return <Tag color="default">Unassigned</Tag>;

    const executor = executors[0];
    const BASEURL = "https://transitportal.skytechet.com";

    return (
      <div className="flex items-center gap-2">
        {executor.avatar ? (
          <img
            src={`${BASEURL}/${executor.avatar.replace(/\\/g, "/")}`}
            alt={executor.name}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-white">
            {executor.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
        )}
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
      render: (staff: any) => (
        <Space>
          <Avatar>{getAvatarInitial(staff)}</Avatar>
          {getFullName(staff)}
        </Space>
      ),
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
              key={r.roleId}
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
    return info?.stageName ? (
      <Tag color="blue">{info.stageName}</Tag>
    ) : (
      <Tag color="default">—</Tag>
    );
  },
},
{
  title: "Last Updated",
  render: (staff: any) => {
    const info = employeeStageMap[staff.id];
    return info?.lastUpdated
      ? new Date(info.lastUpdated).toLocaleString()
      : "—";
  },
},



    {
      title: "Email",
      dataIndex: "email",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* ---------------- SERVICE REQUESTS ---------------- */}
      <Card
        title="All Services"
        extra={
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
        }
      >
        <Table
          rowKey="id"
          columns={serviceColumns}
          dataSource={filteredServices}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* ---------------- STAFF TABLE ---------------- */}
      <Card
        title="STAGE OVERVIEW (Employees)"
        extra={
          <Input
            placeholder="Search staff..."
            value={staffSearch}
            onChange={(e) => setStaffSearch(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
        }
      >
        <Table
          rowKey="id"
          columns={stageColumns}
          dataSource={filteredStaff}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
