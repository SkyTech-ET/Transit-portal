"use client";

import { Button } from "antd";
import { useRouter } from 'next/navigation';
import VendorSubscriptionTable from "./components/vendorSubscriptionTable";
import React, { useEffect, useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { vendorSubscriptionRoutes } from '@/modules/vendorSubscription/vendorSubscription.routes';
import { useVendorSubscriptionStore } from "@/modules/vendorSubscription/vendorSubscription.store";
import { RecordStatus } from "@/modules/common/common.types";
import permission from "@/modules/utils/permission/permission";
import RecordStatusFilter from "../components/common/CommonTag";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";

const VendorSubscriptionPage = () => {
  const router = useRouter()
  const [orgId, setOrgId] = useState<any>()
  const [status, setStatus] = useState<RecordStatus>(RecordStatus.Active);
  const { checkPermission, permissions, currentUser } = usePermissionStore()
  const { listLoading: loading,filteredVendorSubscriptions, getVendorSubscriptions } = useVendorSubscriptionStore();

  useEffect(() => {
    if (currentUser?.organization?.id != null) {
      setOrgId(currentUser.organization.id)
      getVendorSubscriptions(currentUser.organization.id, RecordStatus.Active)
    }
  }, [getVendorSubscriptions, currentUser])

  const handleAdd = () => { router.push(vendorSubscriptionRoutes.create) };
  const handleFilter = (status: RecordStatus) => {
    setStatus(status)
    getVendorSubscriptions(orgId as any, status)
  }

  return (
    <div className="flex flex-col gap-4 rounded-md bg-white py-6">
      <div className="flex px-6">
        <h1 className="text-lg font-bold">Subscription</h1>
        {
          checkPermission(permissions, permission.vendorSubscription.create) &&
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            className="ml-auto"
            onClick={handleAdd}
          >
            Send request
          </Button>
        }
      </div>

      <RecordStatusFilter status={status} onFilter={handleFilter} />
      <VendorSubscriptionTable
              loading={loading}
              vendorSubscriptions={filteredVendorSubscriptions}
              orgId={orgId}
              canUpdate={checkPermission(permissions, permission.vendorSubscription.update)}
              canDelete={checkPermission(permissions, permission.vendorSubscription.delete)} canView={false} canViewOrgVendorSubscriptions={false} currentPage={0} totalPages={0} searchTerm={""} />
    </div>
  );
};

export default VendorSubscriptionPage;
