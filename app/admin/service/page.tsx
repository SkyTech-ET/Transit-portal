"use client";

import { Button } from "antd";
import { useRouter } from 'next/navigation';
import ServiceTable from "./components/ServiceTable";
import React, { useEffect, useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { serviceRoutes } from '@/modules/service/service.routes';
import { useServiceStore } from "@/modules/service/service.store";
import { RecordStatus } from "@/modules/common/common.types";
import permission from "@/modules/utils/permission/permission";
import RecordStatusFilter from "../components/common/CommonTag";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";

const ServicePage = () => {
  const router = useRouter()
  const [orgId, setOrgId] = useState<any>()
  const [status, setStatus] = useState<RecordStatus>(RecordStatus.Active);
  const { checkPermission, permissions, currentUser } = usePermissionStore()
  const { filteredServices, listLoading: loading, getServices } = useServiceStore();

  useEffect(() => {
    if (currentUser?.organization?.id != null) {
      setOrgId(currentUser.organization.id)
      getServices(currentUser.organization.id, RecordStatus.Active)
    }
  }, [getServices, currentUser])

  const handleAdd = () => { router.push(serviceRoutes.create) };
  const handleFilter = (status: RecordStatus) => {
    setStatus(status)
    getServices(orgId as any, status)
  }

  return (
    <div className="flex flex-col gap-4 rounded-md bg-white py-6">
      <div className="flex px-6">
        <h1 className="text-lg font-bold">Menu</h1>
        {
          checkPermission(permissions, permission.service.create) &&
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            className="ml-auto"
            onClick={handleAdd}
          >
            New Item
          </Button>
        }
      </div>



      
      <RecordStatusFilter status={status} onFilter={handleFilter} />
      <ServiceTable
        loading={loading}
        services={filteredServices}
        orgId={orgId}
        canUpdate={checkPermission(permissions, permission.service.update)}
        canDelete={checkPermission(permissions, permission.service.delete)} />
    </div>
  );
};

export default ServicePage;
