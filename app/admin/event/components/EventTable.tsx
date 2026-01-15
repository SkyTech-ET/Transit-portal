"use client";

import { Table } from "antd";
import { useRouter } from "next/navigation";
import { eventRoutes } from "@/modules/event";
import { IEvent } from "@/modules/event/event.types";
import { EventTableColumn } from "./EventTableColumn";
import { useEventStore } from "@/modules/event/event.store";
import { RecordStatus } from "@/modules/common/common.types";

interface Props {
    loading: boolean,
    canDelete: boolean
    canUpdate: boolean,
    events: IEvent[]
}

const EventTable = (props: Props) => {
    const router = useRouter()
    const { deleteEvent, getEvents } = useEventStore()

    const canDelete = props.canDelete;
    const canUpdate = props.canUpdate

    const onDelete = async (id: any) => {
        await deleteEvent(id).then((res: any) => {
            getEvents(RecordStatus.Active, '' )
        })
    }
    const onEdit = (id: number) => {
        router.push(eventRoutes.edit + id)
    }

    return (<>
        <Table
            id="id"
            size="small"
            loading={props.loading}
            dataSource={props.events}
            className="shadow-sm px-6"
            scroll={{ x: 700 }}
            columns={EventTableColumn({ canUpdate, canDelete, onDelete, onEdit })}
            pagination={{
                position: ["bottomLeft"],
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '50', '100'],
            }}
        />
    </>)
}

export default EventTable;