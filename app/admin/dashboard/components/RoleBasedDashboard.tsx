"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePermissionStore } from "@/modules/utils";
import permission from "@/modules/utils/permission/permission";
import { reportRoutes } from "@/modules/report/report.routes";

const RoleBasedDashboard = () => {
  const router = useRouter();
  const { checkPermission, permissions, currentUser } = usePermissionStore();

  useEffect(() => {
    // Check user role and redirect to appropriate dashboard
    if (currentUser?.roles?.[0]?.roleName) {
      const roleName = currentUser.roles[0].roleName.toLowerCase();
      
      switch (roleName) {
        case 'manager':
          if (checkPermission(permissions, permission.motDashboard.manager)) {
            router.push('/admin/manager/dashboard');
            return;
          }
          break;
        case 'assessor':
          if (checkPermission(permissions, permission.motDashboard.assessor)) {
            router.push('/admin/assessor/dashboard');
            return;
          }
          break;
        case 'caseexecutor':
          if (checkPermission(permissions, permission.motDashboard.caseExecutor)) {
            router.push('/admin/case-executor/dashboard');
            return;
          }
          break;
        case 'dataencoder':
          if (checkPermission(permissions, permission.motDashboard.dataEncoder)) {
            router.push('/admin/data-encoder/dashboard');
            return;
          }
          break;
        case 'customer':
          if (checkPermission(permissions, permission.motDashboard.customers)) {
            router.push(reportRoutes.ClientDashboard);
            return;
          }
          break;
        case 'superadmin':
        case 'admin':
          // SuperAdmin and Admin stay on main dashboard
          break;
        default:
          // Default to main dashboard
          break;
      }
    }
  }, [currentUser, permissions, router]);

  return null; // This component only handles routing
};

export default RoleBasedDashboard;


