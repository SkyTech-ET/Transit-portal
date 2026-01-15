"use client";

import { useEffect, useState } from "react";
import { useServiceStore } from "@/modules/mot/service/service.store";
import { IService } from "@/modules/mot/service/service.types";
import { useRouter } from "next/navigation";
import { Table, Tag, Spin } from "antd";
import { useUserStore } from "@/modules/user";
import { getServiceStatus } from "@/modules/mot/service/serviceStatus.util";
import { StageStatus, ServiceType } from "@/modules/mot/service/service.types";
import { IServiceDocument } from "@/modules/mot/service/service.document.types";



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

const serviceTypeLabelMap: Record<ServiceType, string> = {
  [ServiceType.Multimodal]: "Multimodal",
  [ServiceType.Unimodal]: "Unimodal",
};

interface ExecutorInfo {
  name: string;
  photo?: string;
}


export default function ServiceListPage() {
  const router = useRouter();

  const [serviceStatusMap, setServiceStatusMap] = useState<Record<number, StageStatus>>({});
  const [executorMap, setExecutorMap] = useState<Record<number, ExecutorInfo>>({}); 
  const [recentDocuments, setRecentDocuments] = useState<IServiceDocument[]>([]);
  const [latestNotifications, setLatestNotifications] = useState<
    { id: number; title: string; description: string; createdDate: string }[]
    >([]);
  

  // Get logged-in customer
  const currentUser = useUserStore((state) => state.currentUser);

  // Service store
  const getCustomerServices = useServiceStore((state) => state.getCustomerServices);
  const getServiceStages = useServiceStore((state) => state.getServiceStages);

  const services = useServiceStore((state) => state.services);
  const loading = useServiceStore((state) => state.loading);

  const [dashboardData, setDashboardData] = useState({
    totalServices: 0,
    pendingServices: 0,
    inProgressServices: 0,
    completedServices: 0,
  });


  useEffect(() => {
  const loadServices = async () => {
    if (!currentUser?.id) return;

    const fetchedServices: IService[] =
      await getCustomerServices(currentUser.id, 2);

    console.log(fetchedServices);

    console.log(
  "🧪 Services + documents check:",
  fetchedServices.map(s => ({
    serviceId: s.id,
    hasDocuments: !!s.documents,
    documentsCount: s.documents?.length ?? 0
  }))
);

    
    //  fetch stages per service and compute status
    const statusEntries = await Promise.all(
      fetchedServices.map(async (service) => {

        await getServiceStages(service.id);

        const stages = useServiceStore.getState().currentService?.stages ?? [];
        const derivedStatus = getServiceStatus(stages);
        return [service.id, derivedStatus] as const;
      })
    );

    setServiceStatusMap(Object.fromEntries(statusEntries));

    const derivedStatuses = statusEntries.map(([, status]) => status);
    const pending = derivedStatuses.filter((s) => s === StageStatus.Pending).length;
    const inProgress = derivedStatuses.filter((s) => s === StageStatus.InProgress).length;
    const completed = derivedStatuses.filter((s) => s === StageStatus.Completed).length;

setDashboardData({
  totalServices: fetchedServices.length,
  pendingServices: pending,
  inProgressServices: inProgress,
  completedServices: completed,
});

//type ExecutorInfo = { name: string; photo?: string };
const map: Record<number, ExecutorInfo> = {};

for (const service of fetchedServices) {
  const executorId = service.assignedCaseExecutorId;
  if (!executorId || map[executorId]) continue;

  const user = await useUserStore.getState().getUser(executorId);
  if (user) {
    map[executorId] = {
      name: `${user.firstName} ${user.lastName}`,
      photo: user.profilePhoto // keep the relative path, will fix in render
    };
  }
}

setExecutorMap(map);




/* const map: Record<number, string> = {};
    for (const service of fetchedServices) {
      const executorId = service.assignedCaseExecutorId;
      if (executorId && !map[executorId]) {
        const user = await useUserStore.getState().getUser(executorId);
        if (user) {
          map[executorId] = `${user.firstName} ${user.lastName}`;
        }
      }
    }
    setExecutorMap(map); */

     const recentDocs: IServiceDocument[] = [];

for (const service of fetchedServices) {
  await getServiceStages(service.id);
  const stages = useServiceStore.getState().currentService?.stages ?? [];

  stages.forEach(stage => {
    stage.documents?.forEach(doc => {
      recentDocs.push(doc as unknown as IServiceDocument);
    });
  });
}


    const recent = recentDocs
      .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
      .slice(0, 5);

    console.log("📄 Recent docs found:", recent);
    setRecentDocuments(recent);

    await fetchNotifications();
    };


    // Example: mock notifications fetch
  const fetchNotifications = async () => {
  // Replace this with your API call
  const mockNotifications = [
    {
      id: 1,
      title: "Document Approved",
      description: "Your Pledge form document was approved.",
      createdDate: "2026-01-07T15:30:00",
    },
    {
      id: 2,
      title: "Stage Completed",
      description: "Stage 2 of service SRV-20260105-62E9F7BF is completed.",
      createdDate: "2026-01-07T14:00:00",
    },
    {
      id: 3,
      title: "New Document Uploaded",
      description: "A new invoice document was uploaded for your service.",
      createdDate: "2026-01-06T10:20:00",
    },
  ];

  // Sort by createdDate descending and take the latest 5
  const latest = mockNotifications
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, 5);

  setLatestNotifications(latest);
};


  loadServices();
}, [currentUser, getCustomerServices, getServiceStages]);


  // Table columns
  const columns = [
    { title: "Service Number", dataIndex: "serviceNumber", key: "serviceNumber" },
    {
    title: "Service Type",
    dataIndex: "serviceType",
    key: "serviceType",
    render: (type: ServiceType) => (
      <Tag color={type === ServiceType.Multimodal ? "cyan" : "purple"}>
        {serviceTypeLabelMap[type] ?? "Unknown"}
      </Tag>
    ),
  },
    /* { title: "Description", dataIndex: "itemDescription", key: "itemDescription" }, */
    {
  title: "Status",
  key: "status",
  render: (_: any, record: IService) => {
    const serviceStatus =
      serviceStatusMap[record.id] ?? StageStatus.NotStarted;

    return (
      <Tag color={statusColorMap[serviceStatus]}>
        {statusLabelMap[serviceStatus]}
      </Tag>
    );
  },
},

{
  title: "Case Executor",
  key: "assignedCaseExecutor",
  render: (_: any, record: IService) => {
    const executorId = record.assignedCaseExecutorId;
    if (!executorId) return <Tag color="default">Unassigned</Tag>;

    const executor = executorMap[executorId];
    if (!executor) return <Tag color="default">Loading...</Tag>;

    const BASEURL = "https://transitportal.skytechet.com";
    const profileUrl = executor.photo
      ? `${BASEURL}/${executor.photo.split("\\").pop()}`
      : "/images/avatar-placeholder.png";

    return (
      <div className="flex items-center gap-2">
        <img
          src={profileUrl}
          alt={executor.name}
          className="w-6 h-6 rounded-full object-cover"
        />
        <span>{executor.name}</span>
      </div>
    );
  },
},




    {
      title: "Registered Date",
      dataIndex: "registeredDate",
      key: "registeredDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const goToStageExecution = (serviceId: number) => {
    router.push(`/service-list/${serviceId}/stage-execution`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-500 mt-1">
        {services.length > 0
          ? "Services visible to your account"
          : "No services found"}
      </p>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white shadow rounded-xl p-4 text-center">
          <p className="text-gray-500">Pending</p>
          <p className="text-xl font-bold">{dashboardData.pendingServices}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 text-center">
          <p className="text-gray-500">In Progress</p>
          <p className="text-xl font-bold">{dashboardData.inProgressServices}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 text-center">
          <p className="text-gray-500">Completed</p>
          <p className="text-xl font-bold">{dashboardData.completedServices}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 text-center">
          <p className="text-gray-500">Total Services</p>
          <p className="text-xl font-bold">{dashboardData.totalServices}</p>
        </div>
      </div>

      {/* Services Table */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={services}
        pagination={{ pageSize: 5 }}
        onRow={(record: IService) => ({
          onClick: () => goToStageExecution(record.id),
        })}
        rowClassName="cursor-pointer"
      />


      {/* Latest Notifications */}
{/* <div className="mt-10">
  <h2 className="text-2xl font-bold mb-4">Latest Notifications</h2>
  {latestNotifications.length > 0 ? (
    <div className="space-y-2">
      {latestNotifications.map((notif) => (
        <div
          key={notif.id}
          className="bg-white shadow rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
        >
          <div>
            <p className="font-semibold">{notif.title}</p>
            <p className="text-gray-500 text-sm">{notif.description}</p>
          </div>
          <p className="text-gray-400 text-xs mt-2 md:mt-0">
            {new Date(notif.createdDate).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">No notifications found.</p>
  )}
</div> */}



     <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Latest Notifications */}
  <div className="bg-white shadow rounded-xl p-4">
    <h2 className="text-2xl font-bold mb-4">Latest Notifications</h2>
    {latestNotifications.length > 0 ? (
      <div className="space-y-2">
        {latestNotifications.map((notif) => (
          <div
            key={notif.id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 p-2 rounded-lg"
          >
            <div>
              <p className="font-semibold">{notif.title}</p>
              <p className="text-gray-500 text-sm">{notif.description}</p>
            </div>
            <p className="text-gray-400 text-xs mt-1 md:mt-0">
              {new Date(notif.createdDate).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No notifications found.</p>
    )}
  </div>
  
  {/* Recent Documents */}
  <div className="bg-white shadow rounded-xl p-4">
    <h2 className="text-2xl font-bold mb-4">Recent Documents</h2>
    {recentDocuments.length > 0 ? (
      <div className="space-y-2">
        {recentDocuments.map((doc) => (
          <div key={doc.id} className=" flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 p-2 rounded-lg">
            {/* Document icon */}
            <span className="text-gray-400">
              {doc.fileExtension === ".pdf" ? "📄" : "📑"}
            </span>
            <span>{doc.originalFileName}</span>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No recent documents uploaded.</p>
    )}
  </div>
</div>
    </div>
  );
}
