"use client";

import { Table } from "antd";
import { RecordStatus } from "@/modules/common/common.types";
import { PrivilegeTableColumn } from "./PrivilegeTableColumn";
import { IPrivilege } from "@/modules/privilege/privilege.types";
import { usePrivilegeStore } from "@/modules/privilege/privilege.store";
import { privilegeRoutes } from "@/modules/privilege/privilege.routes";
import { useRouter } from "next/navigation";

interface Props {
    loading: boolean,
    canDelete: boolean
    canUpdate: boolean,
    privileges: IPrivilege[]
}

const PrivilegeTable = (props: Props) => {
    const router = useRouter()
    const { deletePrivilege, getPrivileges } = usePrivilegeStore()

    const canDelete = props.canDelete;
    const canUpdate = props.canUpdate

    const onDelete = async (id: any) => {
        await deletePrivilege(id).then((res) => {
            getPrivileges(RecordStatus.Active)
        })
    }
    const onEdit = (id: number) => {
        router.push(privilegeRoutes.edit + id)
    }

    return (<>
        <Table
            id="id"
            size="small"
            className="shadow-sm"
            loading={props.loading}
            scroll={{ x: 700 }}
            dataSource={props.privileges}
            columns={PrivilegeTableColumn({ canDelete, canUpdate, onDelete, onEdit })}
            pagination={{
                position: ["bottomLeft"],
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '50', '100'],
            }}
        />
    </>)
}

export default PrivilegeTable;