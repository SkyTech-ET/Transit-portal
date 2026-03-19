"use client";

import React, { useEffect, useState } from "react";

import UserTable from "../components/UserTable";
import UserPageHeader from "../components/UserPageHeader";
import { useUserStore } from "@/modules/user/user.store";
import { RecordStatus } from "@/modules/common/common.types";
import permission from "@/modules/utils/permission/permission";
import SearchFiled from "../../components/common/SearchFiled";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";
import FilterByRecordStatus from "../../components/common/CommonTag";

const UserPage = () => {
  const [orgId, setOrgId] = useState<any>()
  const [searchInput, setSearchInput] = useState<string>('');
  const [status, setStatus] = useState<RecordStatus>(RecordStatus.Active);

  const { currentUser, checkPermission, permissions } = usePermissionStore()
  const { listLoading: loading,currentPage, totalPages, filteredUsers, setSearchTerm, getUsersByOrg } = useUserStore();

  useEffect(() => {
    let orgID = currentUser?.organization.id;
    if (orgID != null) {
      setOrgId(orgID)
      getUsersByOrg(orgID, RecordStatus.Active)
    }
  }, [currentUser, getUsersByOrg])

  const onFilter = (status: RecordStatus) => {
    setStatus(status)
    getUsersByOrg(orgId, status)
  }
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchInput(searchTerm);
    setSearchTerm(searchTerm);
  };

  return (
    <div className="flex flex-col gap-4 rounded-md bg-white py-6">
      <UserPageHeader
        canCreate={checkPermission(permissions, permission.user.create)}
      />
      <FilterByRecordStatus status={status} onFilter={onFilter} />
      <div className="border-b"></div>
      <SearchFiled searchTerm={searchInput} onSearch={onSearch} placeholder="Search users..." />
      <div className="px-5">
        <UserTable
          loading={loading}
          users={filteredUsers}
          currentPage={currentPage}
          totalPages={totalPages}  
          canUpdate={checkPermission(permissions, permission.user.update)}
          canDelete={checkPermission(permissions, permission.user.delete)}
          canReset={checkPermission(permissions, permission.password.resetPassword)}
          searchTerm={searchInput}
        />
      </div>
    </div>
  );
};

export default UserPage;
