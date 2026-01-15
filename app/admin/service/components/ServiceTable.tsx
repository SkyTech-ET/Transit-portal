"use client";

import { Table } from "antd";
import { useRouter } from "next/navigation";
import { serviceRoutes } from "@/modules/service";
import { IService } from "@/modules/service/service.types";
import { ServiceTableColumn } from "./ServiceTableColumn";
import { useServiceStore } from "@/modules/service/service.store";
import { RecordStatus } from "@/modules/common/common.types";

interface Props {
    orgId: any
    loading: boolean,
    canDelete: boolean
    canUpdate: boolean,
    services: IService[]
}

const ServiceTable = (props: Props) => {
    const router = useRouter()
    const { deleteService, getServices } = useServiceStore()

    const canDelete = props.canDelete;
    const canUpdate = props.canUpdate

    const onDelete = async (id: any) => {
        await deleteService(id).then((res: any) => {
            getServices(props.orgId, RecordStatus.Active)
        })
    }
    const onEdit = (id: number) => {
        router.push(serviceRoutes.edit + id)
    }

    return (<>
        <Table
            id="id"
            size="small"
            loading={props.loading}
            dataSource={props.services}
            className="shadow-sm px-6"
            scroll={{ x: 700 }}
            columns={ServiceTableColumn({ canUpdate, canDelete, onDelete, onEdit })}
            pagination={{
                position: ["bottomLeft"],
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '50', '100'],
            }}
        />
    </>)
}

export default ServiceTable;