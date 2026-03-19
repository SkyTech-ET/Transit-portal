"use client";

import React, { useEffect, useState } from "react";

import TagTable from "./components/tagTable";
import SearchFiled from "../components/common/SearchFiled";
import TagPageHeader from "./components/tagPageHeader";
import { useTagStore } from "@/modules/tag/tag.store";
import { RecordStatus } from "@/modules/common/common.types";
import permission from "@/modules/utils/permission/permission";
import RecordStatusFilter from "../components/common/CommonTag";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";

const TagPage = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [status, setStatus] = useState<RecordStatus>(RecordStatus.Active);

  const { checkPermission, permissions } = usePermissionStore()
  const { listLoading: loading, filteredTags, getTags } = useTagStore();

  useEffect(() => { getTags(RecordStatus.Active) }, [])

  const onFilter = (status: RecordStatus) => {
    setStatus(status)
    getTags(status)
  }
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchInput(searchTerm);
  };

  return (
    <div className="flex flex-col gap-4 rounded-md bg-white py-6">
      <TagPageHeader
        canCreate={checkPermission(permissions, permission.user.create)}
      />
      <RecordStatusFilter status={status} onFilter={onFilter} />
      <div className="border-b"></div>
      <SearchFiled searchTerm={searchInput} onSearch={onSearch} placeholder="Search users..." />
      <div className="px-5">
        <TagTable
          loading={loading}
          tags={filteredTags}
          canUpdate={checkPermission(permissions, permission.tag.update)}
          canDelete={checkPermission(permissions, permission.tag.delete)}
          canView={checkPermission(permissions, permission.tag.getById)}
        />
      </div>
    </div>
  );
};

export default TagPage;
