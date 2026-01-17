  "use client";

  import { useEffect } from "react";
  import { useReportStore } from "@/modules/report";
  import permission from "@/modules/utils/permission/permission";
  import DashboardPageHeader from "./components/DashboardPageHeader";
  import { CalendarCheck, Package, CreditCard, Building, File, Folders, Users } from 'lucide-react';
  import ReportPerOrganizationTable from "./components/ReportPerOrganizationTable";
  import ReportPerOrderTable from "./components/ReportPerOrderTable";
  import { formatAmount, getDefaultFilter, usePermissionStore } from "@/modules/utils";
  import React, { useState } from "react";
  import { RecordStatus } from "@/modules/common/common.types";
  import { ShopOutlined, ShoppingCartOutlined,GiftOutlined,TableOutlined, BoxPlotOutlined,OrderedListOutlined,SolutionOutlined, MenuOutlined, ReconciliationOutlined, UnorderedListOutlined } from '@ant-design/icons';
  import RoleBasedDashboard from "./components/RoleBasedDashboard";
  import AdminStatsRow from "./components/AdminStatsRow"; 
  import AdminChartsRow from "./components/AdminChartsRow";
  import WeeklyStaffChart from "./components/WeeklyStaffChart";
  import { useServiceStore } from "@/modules/mot/service/service.store";
  import { getUser, getUsers } from "@/modules/user/user.endpoint";
  import { getAllServices, getServiceStages  } from "@/modules/mot/service/service.endpoints";
  import { IService, StageStatus, ServiceType, ServiceStage } from "@/modules/mot/service/service.types";
  import { getServiceStatus } from "@/modules/mot/service/serviceStatus.util";
  import KpiCard from "./components/KpiCard";
  import ServiceRequestPieChart from "./components/ServiceRequestPieChart";
  import { 
    Truck, 
    FileText, 
    MessageSquare, 
    AlertCircle, 
    CheckCircle, 
    Clock,
    TrendingUp,
    TrendingDown
  } from "lucide-react";
  import { useMemo } from "react";
  import { useUserStore } from "@/modules/user/user.store";




  type ApiResponse<T> = {
    payload: T;
    message?: string;
    isError?: boolean;
  };


  export const stageOrder: ServiceStage[] = [
    ServiceStage.PrepaymentInvoice,
    ServiceStage.DropRisk,
    ServiceStage.DeliveryOrder,
    ServiceStage.WarehouseStatus,
    ServiceStage.Inspection,
    ServiceStage.Emergency,
    ServiceStage.ExitandStoragePayment,
    ServiceStage.Transportation,
    ServiceStage.LocalPermission,
    ServiceStage.Arrival,
    ServiceStage.Clearance,
  ];


  const DashboardPage = () => {
    const { isAdmin, currentUser, checkPermission, permissions } = usePermissionStore()
    const { listLoading, report, reportPerVendor, dashboard,reportPerOrderSort, reportPerOrganizationSort,reportPerOrganization, getAllReportSort, getReportsByOrgSort,getAllReport, getReportsByOrg } = useReportStore()
    const [orgIdSort, setOrgId] = useState<any>()
    const [status, setStatus] = useState<RecordStatus>(RecordStatus.Active);
    const filterPayload = getDefaultFilter()
    const services = useServiceStore((s) => s.services);
    const getCustomerServices = useServiceStore((s) => s.getCustomerServices);
    const {  loading, getAllServices, getServiceStages } = useServiceStore();
    const { users, getUsers } = useUserStore();
    const [progressMap, setProgressMap] = useState<Record<number, number>>({});
    const [executors, setExecutors] = useState<
    Record<number, { name: string }>
  >({});


    useEffect(() => {
  const loadDashboardData = async () => {
    if (!currentUser?.id) return;

    // 1️⃣ Load services and users
    await getCustomerServices(currentUser.id, 2);
    await getAllServices({ recordStatus: 2 });
    await getUsers(2);

    // 2️⃣ Load reports based on role
    if (isAdmin) {
      await getAllReport(filterPayload);
      await getAllReportSort(filterPayload);
    } else if (currentUser?.organization?.id != null) {
      const orgId = currentUser.organization.id;
      setOrgId(orgId);
      await getReportsByOrg(orgId);
      await getReportsByOrgSort(orgId);
    }

    
    // ===== PROGRESS CALCULATION =====
const progressEntries: [number, number][] = [];
const execMap: Record<number, { name: string }> = {};

const allServices = useServiceStore.getState().services;

await Promise.all(
  allServices.map(async (service) => {
    const stages = (await getServiceStages(service.id)) ?? [];

    const completedCount = stages.filter(
      (s) => s.status === StageStatus.Completed
    ).length;

    const percent =
      stages.length === 0
        ? 0
        : Math.round((completedCount / stageOrder.length) * 100);

    progressEntries.push([service.id, percent]);

    if (service.assignedCaseExecutorId) {
      const res = (await getUser(service.assignedCaseExecutorId)) as any;
      if (res.payload) {
        execMap[service.assignedCaseExecutorId] = {
          name: `${res.payload.firstName} ${res.payload.lastName}`,
        };
      }
    }
  })
);

setProgressMap(Object.fromEntries(progressEntries));
setExecutors(execMap);

  };

  loadDashboardData();
}, [isAdmin, currentUser, getAllServices]);




    interface WeeklyChartItem {
    serviceName: string;
    progress: number;
  }

  const weeklyStaffChartData: WeeklyChartItem[] = services.map(
    /* (service) => {
      const executor =
        executors[service.assignedCaseExecutorId ?? 0];

      return {
        serviceName: `${executor?.name ?? "Unassigned"} (#${service.serviceNumber})`,
        progress: progressMap[service.id] ?? 0,
      }; */

      (service) => ({
      serviceName: service.serviceNumber,
      progress: progressMap[service.id] ?? 0,
    })
  );

  console.log("Weekly chart data:", weeklyStaffChartData);



    return (
      <>
        <RoleBasedDashboard />
        <div className="flex flex-col gap-4 rounded-m py-3">
          <DashboardPageHeader isAdmin={isAdmin} defaultValue={filterPayload} />

          {/* <div className="flex md:flex-row md:px-6 flex-col gap-6">
            {isAdmin && <ReportCardItem title="Total Services" value={report?.services ?? 0} prefix={<SolutionOutlined />} bgColor="blue" />}
            {isAdmin && <ReportCardItem title="Active Customers" value={report?.customers ?? 0} prefix={<Users />} bgColor="green" />}
            {isAdmin && <ReportCardItem title="Pending Approvals" value={report?.pendingApprovals ?? 0} prefix={<CalendarCheck />} bgColor="orange" />}
            {isAdmin && <ReportCardItem title="Total Documents" value={report?.documents ?? 0} prefix={<File />} bgColor="purple" />}
            {isAdmin && <ReportCardItem title="System Users" value={report?.users ?? 0} prefix={<Users />} bgColor="green" />}
            {!isAdmin && <ReportCardItem title="My Services" value={reportPerVendor?.services ?? 0} prefix={<SolutionOutlined />} bgColor="blue" />}
            {!isAdmin && <ReportCardItem title="My Documents" value={reportPerVendor?.documents ?? 0} prefix={<File />} bgColor="purple" />}
            {!isAdmin && <ReportCardItem title="My Customers" value={reportPerVendor?.customers ?? 0} prefix={<Users />} bgColor="green" />}
            {!isAdmin && <ReportCardItem title="Notifications" value={report?.notifications ?? 0} prefix={<CalendarCheck />} bgColor="orange" />}
            {isAdmin && (
    <>
      <AdminStatsRow dashboard={dashboard} />
      <AdminChartsRow
        barData={weeklyStaffChartData}
        dashboard={dashboard}
      />
    </>
  )}

          </div> */}

          {/* ===== SECTION 1: KPI CARDS ===== */}
  <div className="grid grid-cols-5 gap-6 px-6">
    <KpiCard title="Total Services" value={report?.services ?? 0} icon={<Truck size={40} />} valueStyle={{ color: '#1890ff' }} />
    <KpiCard title="Active Customers" value={report?.customers ?? 0} />
    <KpiCard title="Pending Approvals" value={report?.pendingApprovals ?? 0} />
    <KpiCard title="Total Documents" value={report?.documents ?? 0} />
    <KpiCard title="System Users" value={report?.users ?? 0} />
  </div>

  {/* ===== SECTION 2: CHARTS ===== */}
  <div className="grid grid-cols-2 gap-6 px-6 mt-8">
    <WeeklyStaffChart data={weeklyStaffChartData} />
    <ServiceRequestPieChart
      total={report?.services ?? 0}
      pending={report?.pendingApprovals ?? 0}
      
    />
  </div>


          {
            isAdmin && <div className="px-6 py-4"><ReportPerOrganizationTable reports={reportPerOrganizationSort} loading={listLoading}
              canView={checkPermission(permissions, permission.dashboard.getAllSort)} /></div>
          } 


          {
      !isAdmin && (
          <div>
              <div className="p-6">
                  <h1 className="text-lg font-bold">Recent Services Summary</h1>
              </div>
              <ReportPerOrderTable
                  loading={listLoading}
                  reports={reportPerOrderSort}
                  canView={true}
              />
          </div>
      )
  }
        </div>
      </>
    );
  };

  export default DashboardPage;
