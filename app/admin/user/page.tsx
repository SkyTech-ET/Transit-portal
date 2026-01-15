"use client";

import React, { useEffect, useState } from "react";

import UserTable from "./components/UserTable";
import SearchFiled from "../components/common/SearchFiled";
import UserPageHeader from "./components/UserPageHeader";
import { useUserStore } from "@/modules/user/user.store";
import { RecordStatus } from "@/modules/common/common.types";
import permission from "@/modules/utils/permission/permission";
import RecordStatusFilter from "../components/common/CommonTag";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";

const UserPage = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [status, setStatus] = useState<RecordStatus>(RecordStatus.Active);

  const { checkPermission, permissions } = usePermissionStore()
  const { listLoading: loading, currentPage, totalPages, filteredUsers, setSearchTerm, getUsers } = useUserStore();

  useEffect(() => { 
    getUsers(RecordStatus.Active) 
  }, [])

  const onFilter = (status: RecordStatus) => {
    setStatus(status)
    getUsers(status)
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
    <RecordStatusFilter status={status} onFilter={onFilter} />
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
