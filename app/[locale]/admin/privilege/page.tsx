"use client";
import { Button } from "antd";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import PrivilegeTable from './components/PrivilegeTable';
import { RecordStatus } from "@/modules/common/common.types";
import permission from "@/modules/utils/permission/permission";
import RecordStatusFilter from '../components/common/CommonTag';
import { privilegeRoutes } from '@/modules/privilege/privilege.routes';
import { usePrivilegeStore } from "@/modules/privilege/privilege.store";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";

const Privilege = () => {

  const [status, setStatus] = useState<RecordStatus>(RecordStatus.Active);
  const router = useRouter()
  
  const { checkPermission, permissions } = usePermissionStore()
  const { privileges, listLoading: loading, getPrivileges } = usePrivilegeStore();

  useEffect(() => { getPrivileges(RecordStatus.Active) }, [getPrivileges])

  const handleAdd = () => { router.push(privilegeRoutes.crate) };
  const handleFilter = (status: RecordStatus) => {
    setStatus(status)
    getPrivileges(status)
  }

  return (

    <div className="flex flex-col gap-4 rounded-md bg-white p-6">
      <div className="flex">
        <h1 className="text-lg font-bold">Privileges</h1>
        {
          checkPermission(permissions, permission.privilege.create) &&
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            className="ml-auto"
            onClick={handleAdd}
          >
            New Privilege
          </Button>
        }
      </div>
      <RecordStatusFilter status={status} onFilter={handleFilter} />
      <PrivilegeTable
        loading={loading}
        privileges={privileges}
        canUpdate={checkPermission(permissions, permission.privilege.update)}
        canDelete={checkPermission(permissions, permission.privilege.delete)}
      />
    </div>
  );
};

export default Privilege;
