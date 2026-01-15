"use client";

import { Button } from "antd";
import { useRouter } from 'next/navigation';
import RoleTable from "./components/RoleTable";
import React, { useEffect, useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { roleRoutes } from '@/modules/role/role.routes';
import { useRoleStore } from "@/modules/role/role.store";
import { RecordStatus } from "@/modules/common/common.types";
import permission from "@/modules/utils/permission/permission";
import RecordStatusFilter from "../components/common/CommonTag";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";

const RolePage = () => {
  const [status, setStatus] = useState<RecordStatus>(RecordStatus.Active);
  const router = useRouter()

  const { checkPermission, permissions } = usePermissionStore()
  const { roles, listLoading: loading, getRoles } = useRoleStore();

  useEffect(() => { getRoles(RecordStatus.Active) }, [getRoles])

  const handleAdd = () => { router.push(roleRoutes.create) };
  const handleFilter = (status: RecordStatus) => {
    setStatus(status)
    getRoles(status)
  }

  return (
    <div className="flex flex-col gap-4 rounded-md bg-white py-6">
      <div className="flex px-6">
        <h1 className="text-lg font-bold">Roles</h1>
        {
          checkPermission(permissions, permission.role.create) &&
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            className="ml-auto"
            onClick={handleAdd}
          >
            New Role
          </Button>
        }
      </div>
      <RecordStatusFilter status={status} onFilter={handleFilter} />
      <RoleTable
        loading={loading}
        roles={roles}
        canUpdate={checkPermission(permissions, permission.role.update)}
        canDelete={checkPermission(permissions, permission.role.delete)}
      />
    </div>
  );
};

export default RolePage;
