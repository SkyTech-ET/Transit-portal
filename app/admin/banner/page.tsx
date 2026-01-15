"use client";

import { Button } from "antd";
import { useRouter } from 'next/navigation';
import BannerTable from "./components/BannerTable";
import React, { useEffect, useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { bannerRoutes } from '@/modules/banner/banner.routes';
import { useBannerStore } from "@/modules/banner/banner.store";
import { RecordStatus } from "@/modules/common/common.types";
import permission from "@/modules/utils/permission/permission";
import RecordStatusFilter from "../components/common/CommonTag";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";

const BannerPage = () => {
  const router = useRouter()
  const [status, setStatus] = useState<RecordStatus>(RecordStatus.Active);
  const { checkPermission, permissions, currentUser } = usePermissionStore()
  const { filteredBanners, listLoading: loading, getBanners } = useBannerStore();

  useEffect(() => {
    if (currentUser?.organization.id) getBanners(currentUser?.organization.id as any, RecordStatus.Active)
  }, [getBanners])

  const handleAdd = () => { router.push(bannerRoutes.create) };
  const handleFilter = (status: RecordStatus) => {
    setStatus(status)
    getBanners(currentUser?.organization.id as any, status)
  }

  return (
    <div className="flex flex-col gap-4 rounded-md bg-white py-6">
      <div className="flex px-6">
        <h1 className="text-lg font-bold">Banners</h1>
        {
          checkPermission(permissions, permission.banner.create) &&
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            className="ml-auto"
            onClick={handleAdd}
          >
            New Banner
          </Button>
        }
      </div>
      <RecordStatusFilter status={status} onFilter={handleFilter} />
      <BannerTable
        loading={loading}
        banners={filteredBanners}
        canUpdate={checkPermission(permissions, permission.banner.update)}
        canDelete={checkPermission(permissions, permission.banner.delete)}
      />
    </div>
  );
};

export default BannerPage;
