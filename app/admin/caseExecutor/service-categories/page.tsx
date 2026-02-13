"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useServiceStore } from "@/modules/mot/service/service.store";
import { IService, ServiceType, ServiceStatus } from "@/modules/mot/service/service.types";
import useAuthStore from "@/modules/auth/auth.store";

export default function ServiceCategoriesPage() {
  const router = useRouter();
  const { services, getAllServices, getAssignedServices, loading } =
    useServiceStore();

  const { user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<ServiceType>(ServiceType.Multimodal);

  const SERVICE_TYPE_MAP: Record<ServiceType, string> = {
    [ServiceType.Multimodal]: "Multimodal",
    [ServiceType.Unimodal]: "Unimodal",
  };

  /* ----------------------------
   * Hydration
   * ---------------------------- */
  useEffect(() => {
    setHydrated(true);
  }, []);

  /* ----------------------------
   * Fetch services
   * ---------------------------- */
  useEffect(() => {
    if (!hydrated || !user?.id) return;

    const role = user.roles?.[0]?.roleName?.toLowerCase();

    if (role === "caseexecutor") {
      getAssignedServices(user.id, 2);
    } else {
      getAllServices();
    }
  }, [hydrated, user?.id]);

  /* ----------------------------
   * Navigation
   * ---------------------------- */
  const goToStageExecution = (serviceId: number) => {
    router.push(
      `/admin/caseExecutor/service-categories/${serviceId}/stage-execution`
    );
  };
/* const goToStageExecution = (serviceId: number) => {
    router.push(
      `/admin/caseExecutor/service-categories/${serviceId}/stage-execution`
    );
  }; */


  const filtered = services.filter((s) => s.serviceType === mode);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6">
      {/* Header */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
        Service Categories
      </h1>

      <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
        Browse and explore multimodal and unimodal service categories.
      </p>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={() => setMode(ServiceType.Multimodal)}
          className={`
            flex items-center gap-2
            px-4 sm:px-5 py-2
            text-xs sm:text-sm lg:text-base
            rounded-xl font-medium
            whitespace-normal break-words
            transition
            ${
              mode === ServiceType.Multimodal
                ? "bg-blue-600 text-white shadow"
                : "bg-white border text-gray-600"
            }
          `}
        >
          📦 Multimodal Service
        </button>

        <button
          onClick={() => setMode(ServiceType.Unimodal)}
          className={`
            flex items-center gap-2
            px-4 sm:px-5 py-2
            text-xs sm:text-sm lg:text-base
            rounded-xl font-medium
            whitespace-normal break-words
            transition
            ${
              mode === ServiceType.Unimodal
                ? "bg-blue-600 text-white shadow"
                : "bg-white border text-gray-700"
            }
          `}
        >
          🔗 Unimodal Service
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="mt-8 text-gray-500 text-sm sm:text-base">
          Loading services...
        </p>
      )}

      {/* Responsive Grid */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-4
          sm:gap-6
          mt-6
          sm:mt-10
        "
      >
        {filtered.map((service: IService) => (
          <div
            key={service.id}
            onClick={() => goToStageExecution(service.id)}
            className="
              bg-white
              rounded-xl
              border
              shadow-sm
              hover:shadow-md
              transition
              cursor-pointer
              p-4
              sm:p-6
              flex
              flex-col
            "
          >
            {/* Icon */}
            {/* <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-lg" /> */}

            {/* Service Number */}
            <h2 className="mt-4 font-semibold text-base sm:text-lg break-words">
              {service.serviceNumber}
            </h2>

            {/* Type */}
            <p className="text-gray-500 text-xs sm:text-sm">
              #{SERVICE_TYPE_MAP[service.serviceType]}
            </p>

            {/* Description */}
            <p className="text-gray-600 text-xs sm:text-sm mt-3 break-words line-clamp-3">
              {service.itemDescription}
            </p>

            {/* Status + Review */}
            <div className="flex flex-wrap items-center gap-2 mt-6 text-xs sm:text-sm">
              {service.status === ServiceStatus.Completed && (
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full">
                  ● Completed
                </span>
              )}

              {service.status === ServiceStatus.Pending && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full">
                  ● Pending
                </span>
              )}

              {[ServiceStatus.Draft, ServiceStatus.Submitted, ServiceStatus.UnderReview].includes(
                service.status
              ) && (
                <span className="px-3 py-1 bg-gray-200 text-gray-500 rounded-full">
                  ● Not Started
                </span>
              )}

              <button
                onClick={(e) => e.stopPropagation()}
                className="
                  px-3 py-1
                  bg-blue-100
                  text-blue-600
                  rounded-full
                  flex
                  items-center
                  gap-1
                  whitespace-nowrap
                "
              >
                👁 Review
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <p className="mt-10 text-gray-500 text-sm sm:text-base">
          No {mode === ServiceType.Multimodal ? "Multimodal" : "Unimodal"} services
          found.
        </p>
      )}
      
    </div>
  );
}
