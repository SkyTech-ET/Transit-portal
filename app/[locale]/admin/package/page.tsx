"use client";

import { Button } from "antd";
import { useRouter } from 'next/navigation';
import PackageTable from "./components/PackageTable";
import React, { useEffect, useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { packageRoutes } from '@/modules/package/package.routes';
import { usePackageStore } from "@/modules/package/package.store";
import { RecordStatus } from "@/modules/common/common.types";
import permission from "@/modules/utils/permission/permission";
import RecordStatusFilter from "../components/common/CommonTag";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";

const PackagePage = () => {
  const router = useRouter()
  const [status, setStatus] = useState<RecordStatus>(RecordStatus.Active);
  const { checkPermission, permissions, currentUser } = usePermissionStore()
  const { filteredPackages, listLoading: loading, getPackages } = usePackageStore();

  useEffect(() => {
    if (currentUser?.organization.id) getPackages(currentUser?.organization.id as any, RecordStatus.Active)
  }, [getPackages])

  const handleAdd = () => { router.push(packageRoutes.create) };
  const handleFilter = (status: RecordStatus) => {
    setStatus(status)
    getPackages(currentUser?.organization.id as any, status)
  }

  return (
    <div className="flex flex-col gap-4 rounded-md bg-white py-6">
      <div className="flex px-6">
        <h1 className="text-lg font-bold">Packages</h1>
        {
          checkPermission(permissions, permission.package.create) &&
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            className="ml-auto"
            onClick={handleAdd}
          >
            New Package
          </Button>
        }
      </div>
      <RecordStatusFilter status={status} onFilter={handleFilter} />
      <PackageTable
        loading={loading}
        packages={filteredPackages}
        canUpdate={checkPermission(permissions, permission.package.update)}
        canDelete={checkPermission(permissions, permission.package.delete)}
      />
    </div>
  );
};

export default PackagePage;
