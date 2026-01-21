"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";

import { useServiceStore } from "@/modules/mot/service/service.store";
import { IService } from "@/modules/mot/service/service.types";
import useAuthStore from "@/modules/auth/auth.store";

export default function ServiceListPage() {
  const router = useRouter();

  const { services, getAllServices, getAssignedServices, loading } =
    useServiceStore();

  const { user } = useAuthStore();

  const [hydrated, setHydrated] = useState(false);

  /* ----------------------------
   * Hydration guard
   * ---------------------------- */
  useEffect(() => {
    setHydrated(true);
  }, []);

  /* ----------------------------
   * Fetch services based on role
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
      `/admin/caseExecutor/service-list/${serviceId}/stage-execution`
    );
  };

  const roleLabel =
    user?.roles?.[0]?.roleName?.toLowerCase() === "caseexecutor"
      ? "Services assigned to you"
      : "All services";

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6">
      {/* Header */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
        Service List
      </h1>

      <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
        {!hydrated ? "Loading services..." : roleLabel}
      </p>

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
        {services.map((service: IService) => (
          <div
            key={service.id}
            onClick={() => goToStageExecution(service.id)} 
            className="
              bg-white
              border
              rounded-xl
              p-4
              sm:p-6
              shadow-sm
              hover:shadow-md
              transition
              cursor-pointer
              flex
              flex-col
              justify-between
              min-h-[140px]
            "
          >
            {/* Service Number */}
            <h2
              className="
                font-semibold
                text-base
                sm:text-lg
                break-words
                leading-snug
              "
            >
              {service.serviceNumber}
            </h2>

            {/* Description */}
            <p
              className="
                text-gray-500
                mt-2
                text-xs
                sm:text-sm
                break-words
                leading-relaxed
                line-clamp-3
              "
            >
              {service.itemDescription}
            </p>

            {/* Footer */}
            <div
              className="
                flex
                items-center
                justify-end
                mt-4
                text-gray-400
                text-xs
                sm:text-sm
                gap-1
                flex-wrap
              "
            >
              <Clock size={14} className="shrink-0" />
              <span>
                Registered:{" "}
                {new Date(service.registeredDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && services.length === 0 && hydrated && (
        <p className="mt-10 text-gray-500 text-sm sm:text-base">
          No services found.
        </p>
      )}
    </div>
  );
}
