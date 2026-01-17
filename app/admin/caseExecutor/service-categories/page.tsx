"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useServiceStore } from "@/modules/mot/service/service.store";
import { IService, ServiceType } from "@/modules/mot/service/service.types";
import { ServiceStatus } from "@/modules/mot/service/service.types";
import useAuthStore from "@/modules/auth/auth.store";



export default function ServiceCategoriesPage() {
  const router = useRouter();
  const { services, getAllServices, getAssignedServices, loading } = useServiceStore();
  const [mode, setMode] = useState<ServiceType>(1); // 1 = Multimodal
  const { user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

const SERVICE_TYPE_MAP: Record<ServiceType, string> = {
  [ServiceType.Multimodal]: "Multimodal",
  [ServiceType.Unimodal]: "Unimodal",
};



useEffect(() => {
  setHydrated(true);
}, []);

useEffect(() => {
  if (!hydrated) return;
  if (!user?.id) return;

  const role = user.roles?.[0]?.roleName?.toLowerCase();


  if (role === "caseexecutor") {
    getAssignedServices(user.id, 2); // only assigned services
  } else {
    getAllServices(); // admin / manager / others
  }
}, [hydrated, user?.id]);

const goToStageExecution = (serviceId: number) => {
    router.push(
      `/admin/caseExecutor/service-categories/${serviceId}/stage-execution`
    );
  };


  const filtered = services.filter((s) => s.serviceType === mode);

  return (
    <div className="p-10">

      {/* Page Header */}
      <h1 className="text-3xl font-bold">Service Categories</h1>
      <p className="text-gray-500 mt-2">
        Browse and explore multimodal and unimodal service categories.
      </p>

      {/* Filter Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setMode(1)}
          className={`px-5 py-2 rounded-xl font-medium ${
            mode === 1
              ? "bg-blue-600 text-white shadow"
              : "bg-white border text-gray-600"
          }`} 
        >
          📦 Multimodal
        </button>

        <button
          onClick={() => setMode(2)}
         className={`px-5 py-2 rounded-xl font-medium ${
            mode === 2
              ? "bg-black text-white shadow"
              : "bg-white border text-gray-700"
          }`} 
        >
          📄 Unimodal
        </button>
      </div>

      {/* Loading State (if no backend data yet) */}
      {loading && (
        <p className="mt-10 text-gray-500">Loading services...</p>
      )}

      {/* Service Cards */}
      <div className="grid grid-cols-3 gap-6 mt-10">
        {filtered.map((service: IService) => (
          <div
            key={service.id}
            className="bg-white rounded-xl shadow p-6 border hover:shadow-md transition cursor-pointer"
            onClick={() => goToStageExecution(service.id)} 
          >
            {/* Placeholder image */}
            <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>

            {/* Service Number */}
            <h2 className="mt-4 font-bold text-lg">
              {service.serviceNumber}
            </h2>

            {/* Mode */}
            <p className="text-gray-500 text-sm">
              #{SERVICE_TYPE_MAP[service.serviceType]}
            </p>


            {/* Description */}
            <p className="text-gray-600 text-sm mt-3">
              {service.itemDescription}
            </p>

            {/* Status + Review */}
            <div className="flex items-center gap-3 mt-6 text-sm">

  {/* Completed */}
  {service.status === ServiceStatus.Completed && (
    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full">
      ● Completed
    </span>
  )}

  {/* Pending */}
  {service.status === ServiceStatus.Pending && (
    <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full">
      ● Pending
    </span>
  )}

  {/* Draft/Submitted/UnderReview etc = Not Started */}
  {[ServiceStatus.Draft, ServiceStatus.Submitted, ServiceStatus.UnderReview].includes(
    service.status
  ) && (
    <span className="px-3 py-1 bg-gray-200 text-gray-500 rounded-full">
      ● Not Started
    </span>
  )}

  <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full flex items-center gap-1">
    👁 review
  </button>
</div>

          </div>
        ))}
      </div>

      {/* No Data State */}
      {!loading && filtered.length === 0 && (
        <p className="mt-10 text-gray-500">No {(mode === 2 ? "Multimodal" : "Unimodal")} services found.</p>
      )}
    </div>
  );
}
