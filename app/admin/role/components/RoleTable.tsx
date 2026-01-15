"use client";

import { Table } from "antd";
import { useRouter } from "next/navigation";
import { roleRoutes } from "@/modules/role";
import { IRole } from "@/modules/role/role.types";
import { RoleTableColumn } from "./RoleTableColumn";
import { useRoleStore } from "@/modules/role/role.store";
import { RecordStatus } from "@/modules/common/common.types";

interface Props {
    loading: boolean,
    canDelete: boolean
    canUpdate: boolean,
    roles: IRole[]
}

const RoleTable = (props: Props) => {
    const router = useRouter()
    const { deleteRole, getRoles } = useRoleStore()

    const canDelete = props.canDelete;
    const canUpdate = props.canUpdate

    const onDelete = async (id: any) => {
        await deleteRole(id).then((res: any) => {
            getRoles(RecordStatus.Active)
        })
    }
    const onEdit = (id: number) => {
        router.push(roleRoutes.edit + id)
    }

    return (<>
        <Table
            id="id"
            size="small"
            loading={props.loading}
            dataSource={props.roles}
            className="shadow-sm px-6"
            scroll={{ x: 700 }}
            columns={RoleTableColumn({ canUpdate, canDelete, onDelete, onEdit })}
            pagination={{
                position: ["bottomLeft"],
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '50', '100'],
            }}
        />
    </>)
}

export default RoleTable;