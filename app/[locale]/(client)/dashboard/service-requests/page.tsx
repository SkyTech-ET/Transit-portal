"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";

import { useServiceStore } from "@/modules/mot/service/service.store";
import { useUserStore } from "@/modules/user";

import {
  IService,
  StageStatus,
  ServiceType,
} from "@/modules/mot/service/service.types";

import { getServiceStatus } from "@/modules/mot/service/serviceStatus.util";
import { ServiceStage } from "@/modules/mot/service/service.types";


/* ---------------- helpers ---------------- */

const stageOrder: ServiceStage[] = [
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


const statusLabel: Record<StageStatus, string> = {
  [StageStatus.NotStarted]: "Not Started",
  [StageStatus.Pending]: "Pending",
  [StageStatus.InProgress]: "In Progress",
  [StageStatus.Completed]: "Completed",
  [StageStatus.Blocked]: "Delayed",
  [StageStatus.NeedsReview]: "Needs Review",
};

const statusStyle: Record<StageStatus, string> = {
  [StageStatus.NotStarted]: "bg-gray-100 text-gray-600",
  [StageStatus.Pending]: "bg-yellow-100 text-yellow-600",
  [StageStatus.InProgress]: "bg-green-100 text-green-600",
  [StageStatus.Completed]: "bg-blue-100 text-blue-600",
  [StageStatus.Blocked]: "bg-red-100 text-red-600",
  [StageStatus.NeedsReview]: "bg-purple-100 text-purple-600",
};

const serviceTypeLabel: Record<ServiceType, string> = {
  [ServiceType.Multimodal]: "Multimodal",
  [ServiceType.Unimodal]: "Unimodal",
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

const getDaysLeft = (date: string) => {
  const start = new Date(date).getTime();
  const end = start + 10 * 24 * 60 * 60 * 1000;
  const days = Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
};

/* ---------------- page ---------------- */

export default function ServiceRequestsPage() {
  const router = useRouter();

  const currentUser = useUserStore((s) => s.currentUser);
  const getUser = useUserStore((s) => s.getUser);

  const getCustomerServices = useServiceStore(
    (s) => s.getCustomerServices
  );
  const getServiceStages = useServiceStore(
    (s) => s.getServiceStages
  );

  const services = useServiceStore((s) => s.services);

  const [statusMap, setStatusMap] = useState<Record<number, StageStatus>>(
    {}
  );
  const [executors, setExecutors] = useState<
    Record<number, { name: string; photo?: string }>
  >({});
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});


  useEffect(() => {
  const load = async () => {
    if (!currentUser?.id) return;

    const fetched: IService[] = await getCustomerServices(
      currentUser.id,
      2
    );

    const statusEntries: [number, StageStatus][] = [];
    const progressEntries: [number, number][] = [];

    for (const service of fetched) {
      await getServiceStages(service.id);

      const stages =
        useServiceStore.getState().currentService?.stages ?? [];

      /* ---- status pill ---- */
      const status = getServiceStatus(stages);
      statusEntries.push([service.id, status]);

      /* ---- progress percent (SAME LOGIC AS WORKFLOW PAGE) ---- */
      const completedCount = stages.filter(
        (s) => s.status === StageStatus.Completed
      ).length;

      const percent =
        stages.length === 0
          ? 0
          : Math.round(
              (completedCount / stageOrder.length) * 100
            );

      progressEntries.push([service.id, percent]);
    }

    setStatusMap(Object.fromEntries(statusEntries));
    setProgressMap(Object.fromEntries(progressEntries));

    /* ---- executors (unchanged) ---- */
    const execMap: Record<number, { name: string; photo?: string }> =
      {};

    for (const s of fetched) {
      if (!s.assignedCaseExecutorId) continue;
      if (execMap[s.assignedCaseExecutorId]) continue;

      const u = await getUser(s.assignedCaseExecutorId);
      if (u) {
        execMap[s.assignedCaseExecutorId] = {
          name: `${u.firstName} ${u.lastName}`,
          photo: u.profilePhoto,
        };
      }
    }

    setExecutors(execMap);
  };

  load();
}, [currentUser]);


  return (
    <div className="min-h-screen bg-[#F8FAFC] px-10 py-8 font-nunito">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-blue-600">
          Service Requests
        </h1>
        <p className="text-[#6B7280] text-sm mt-1">All services</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const status =
            statusMap[service.id] ?? StageStatus.NotStarted;

          const executor =
            executors[service.assignedCaseExecutorId ?? 0];

          const BASEURL =
            "https://transitportal.skytechet.com/api/v1";
          const avatar = executor?.photo
            ? `${BASEURL}/Profile_Photo/${executor.photo
                .split("\\")
                .pop()}`
            : "/images/avatar-placeholder.png";

          return (
            <div
              key={service.id}
              onClick={() =>
                router.push(
                  `/service-list/${service.id}/stage-execution`
                )
              }
              className="bg-white border border-[#E5E7EB] rounded-xl p-5
                         shadow-[0_0_0_rgba(0,0,0,0.005)]
                         cursor-pointer hover:shadow-md transition"
            >
              {/* Top */}
              <div className="flex justify-between">
                <span className="text-[12px] leading-[14px] text-[#6B7280]">
                  #{service.serviceNumber}
                </span>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${statusStyle[status]}`}
                >
                  {statusLabel[status]}
                </span>
              </div>

              {/* Service Type */}
              <h3 className="mt-2 text-[15px] leading-[12px] text-black">
                {serviceTypeLabel[service.serviceType]}
              </h3>

              {/* Executor */}
              <div className="flex items-center gap-3 mt-4">
                <img
                  src={avatar}
                  alt=""
                  className="w-8 h-8 rounded-full border border-[#E5E7EB] object-cover"
                />
                <div>
                  <p className="text-[14px] leading-[14px] text-black">
                    {executor?.name ?? "Unassigned"}
                  </p>
                  <p className="text-[12px] leading-[12px] text-[#6B7280] mt-1">
                    case executor
                  </p>
                </div>
              </div>

              {/* Date & Days */}
              <div className="flex items-center gap-4 mt-4 text-[13px] leading-[14px] text-[#4B5563]">
                <div className="flex items-center gap-1">
                  <Calendar size={12} color="#4B5563" />
                  {formatDate(service.registeredDate)}
                </div>
                {/* <span>{getDaysLeft(service.registeredDate)} days left</span> */}
              </div>

              {/* Progress */}
              <div className="mt-5">
                <div className="flex justify-between mb-1">
                  <span className="text-[14px] leading-[14px] text-black mb-3">
                    Progress
                  </span>
                  <span className="text-[14px] leading-[14px] text-[#4B5563]">
                    {progressMap[service.id] ?? 0}%
                  </span>

                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${progressMap[service.id] ?? 0}%` }}
                    />

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
