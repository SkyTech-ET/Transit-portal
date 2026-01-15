"use client";

import React, { useEffect, useState } from "react";

import SubscriptionPackageTable from "./components/SubscriptionPackageTable";
import SearchFiled from "../components/common/SearchFiled";
import SubscriptionPackagePageHeader from "./components/SubscriptionPackagePageHeader";
import { useSubscriptionPackagesStore } from "@/modules/subscriptionPackages/subscriptionPackages.store";
import { RecordStatus } from "@/modules/common/common.types";
import permission from "@/modules/utils/permission/permission";
import RecordStatusFilter from "../components/common/CommonTag";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";

const SubscriptionPackagePage = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [status, setStatus] = useState<RecordStatus>(RecordStatus.Active);

  const { checkPermission, permissions } = usePermissionStore()
  const { listLoading: loading, getSubscriptionPackages, filteredSubscriptionPackages } = useSubscriptionPackagesStore();

  useEffect(() => { getSubscriptionPackages(RecordStatus.Active) }, [])

  const onFilter = (status: RecordStatus) => {
    setStatus(status)
    getSubscriptionPackages(status)
  }
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchInput(searchTerm);
  };

  return (
    <div className="flex flex-col gap-4 rounded-md bg-white py-6">
      <SubscriptionPackagePageHeader
        canCreate={checkPermission(permissions, permission.user.create)}
      />
      <RecordStatusFilter status={status} onFilter={onFilter} />
      <div className="border-b"></div>
      <SearchFiled searchTerm={searchInput} onSearch={onSearch} placeholder="Search users..." />
      <div className="px-5">
        <SubscriptionPackageTable
          loading={loading}
          subscriptionPackages={filteredSubscriptionPackages}
          canUpdate={checkPermission(permissions, permission.subscriptionPackage.update)}
          canDelete={checkPermission(permissions, permission.subscriptionPackage.delete)}
          canView={checkPermission(permissions, permission.subscriptionPackage.getById)}
        />
      </div>
    </div>
  );
};

export default SubscriptionPackagePage;
