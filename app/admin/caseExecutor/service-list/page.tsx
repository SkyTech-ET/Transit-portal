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
    if (!hydrated) return;
    if (!user?.id) return;

    const role = user.roles?.[0]?.roleName?.toLowerCase();

    console.log("🔍 Fetching services for role:", role);

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
    <div className="p-10">
      <h1 className="text-3xl font-bold">Service List</h1>

      <p className="text-gray-500 mt-2">
        {!hydrated ? "Loading services..." : roleLabel}
      </p>

      {loading && (
        <p className="mt-10 text-gray-500">Loading services...</p>
      )}

      <div className="grid grid-cols-3 gap-6 mt-10">
        {services.map((service: IService) => (
          <div
            key={service.id}
            className="bg-white shadow rounded-xl p-6 border hover:shadow-md transition cursor-pointer"
            onClick={() => goToStageExecution(service.id)} 
          >
            <h2 className="font-semibold text-lg">
              {service.serviceNumber}
            </h2>

            <p className="text-gray-500 mt-2 text-sm">
              {service.itemDescription}
            </p>

            <div className="flex items-center justify-end mt-4 text-gray-400 text-sm">
              <Clock size={14} className="mr-1" />
              Registered:{" "}
              {new Date(service.registeredDate).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {!loading && services.length === 0 && hydrated && (
        <p className="mt-10 text-gray-500">No services found.</p>
      )}
    </div>
  );
}
