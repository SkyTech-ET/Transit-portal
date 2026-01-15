"use client";

import React, { useEffect, useState } from "react";

import SubscriptionTable from "./components/SubscriptionTable";
import SearchFiled from "../components/common/SearchFiled";
import SubscriptionPageHeader from "./components/SubscriptionPageHeader";
import { useSubscriptionStore } from "@/modules/subscription/subscription.store";
import { RecordStatus } from "@/modules/common/common.types";
import permission from "@/modules/utils/permission/permission";
import RecordStatusFilter from "../components/common/CommonTag";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";

const SubscriptionPage = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [status, setStatus] = useState<RecordStatus>(RecordStatus.Active);

  const { checkPermission, permissions } = usePermissionStore()
  const { listLoading,currentPage, totalPages, filteredSubscriptions,setSearchTerm,success, getSubscriptions } = useSubscriptionStore();

  useEffect(() => {
    getSubscriptions(RecordStatus.Active);
}, []);

useEffect(() => {
    if (success) {
        getSubscriptions(RecordStatus.Active);
    }
}, [success]); 

  const onFilter = (status: RecordStatus) => {
    setStatus(status)
    getSubscriptions(status)
  }
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchInput(searchTerm);
    setSearchTerm(searchTerm);
  };

  return (
    <div className="flex flex-col gap-4 rounded-md bg-white py-6">
      <SubscriptionPageHeader
        canCreate={checkPermission(permissions, permission.user.create)}
      />
      <RecordStatusFilter status={status} onFilter={onFilter} />
      <div className="border-b"></div>
      <SearchFiled searchTerm={searchInput} onSearch={onSearch} placeholder="Search subscriptions..." />
      <div className="px-5">
        <SubscriptionTable
          loading={listLoading}
          subscriptions={filteredSubscriptions}
          currentPage={currentPage}
          totalPages={totalPages}  
          canUpdateReq={checkPermission(permissions, permission.subscription.update)}
          canUpdateAcc={checkPermission(permissions, permission.subscription.update)}
          canView={checkPermission(permissions, permission.subscription.getById)}
          canViewOrgSubscriptions={checkPermission(permissions, permission.subscription.getByOrgId)}
          searchTerm={searchInput}
        />
      </div>
    </div>
  );
};

export default SubscriptionPage;
